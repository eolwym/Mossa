const {
	StreamType,
	createAudioPlayer,
	createAudioResource,
	AudioPlayerStatus,
	entersState,
	VoiceConnectionDisconnectReason,
	VoiceConnectionStatus,
} = require('@discordjs/voice');
const ytdl = require('ytdl-core')
const { subscriptions } = require('../GuildMusicManagerMap')

class MusicManager {

	constructor (voiceConnection) {
		this.voiceConnection = voiceConnection
		this.audioPlayer = createAudioPlayer()
		this.queue = []
		this.loop = false

		this.#configureVoiceConnection()
		this.#configureAudioPlayer()
	}

	/**
	 * Adds a new url to the queue.
	 *
	 * @param url The url to add to the queue
	 */
	enqueue(url) {
		this.queue.push(url);
		this.processQueue();
	}

	/**
	 * Attempts to create an Audio Ressource from the queue and play it
	 */
	async processQueue() {
		// if audioPlayer is already playing a music or queue is empty
		if (this.audioPlayer.state.status !== AudioPlayerStatus.Idle || this.queue.length === 0) {
			return;
		}
		
		const nextMusicURL = this.queue[0];

		try {
			const stream = ytdl(nextMusicURL, { filter: 'audioonly' });
			const resource = await createAudioResource(stream, { inputType: StreamType.Arbitrary });
			this.audioPlayer.play(resource);
		} catch (error) {
			console.log(error);
			return this.processQueue();
		}
	}

	/**
	 * - Subscribe the voice connection to an Audio Player
	 * - Handle state change of the voice connection
	 */
	#configureVoiceConnection() {

		this.voiceConnection.subscribe(this.audioPlayer)

		this.voiceConnection.on('stateChange', async (oldState, newState) => {
			// If the voice connection is disconnected
			if (newState.status === VoiceConnectionStatus.Disconnected) {
				if (newState.reason === VoiceConnectionDisconnectReason.WebSocketClose && newState.closeCode === 4014) {
					
					try {
						await entersState(this.voiceConnection, VoiceConnectionStatus.Connecting, 5_000);

					} catch {
						this.voiceConnection.destroy();
					}

				} else if (this.voiceConnection.rejoinAttempts < 5) {

					await (this.voiceConnection.rejoinAttempts + 1)
					this.voiceConnection.rejoin();

				} else {
					let guildId = this.voiceConnection.joinConfig.guildId
					this.queue = [];
					this.voiceConnection.destroy();
					subscriptions.delete(guildId)
				}
			} else if (newState.status === VoiceConnectionStatus.Destroyed) {
				let guildId = this.voiceConnection.joinConfig.guildId
				this.queue = [];
				subscriptions.delete(guildId)	
			} else if (newState.status === VoiceConnectionStatus.Connecting || newState.status === VoiceConnectionStatus.Signalling) {
				try {
					await entersState(this.voiceConnection, VoiceConnectionStatus.Ready, 20_000);
				} catch {
					if (this.voiceConnection.state.status !== VoiceConnectionStatus.Destroyed) this.voiceConnection.destroy();
				}
			}
		});
	}

	#configureAudioPlayer() {
		// ProcessQueue when finish a music
		this.audioPlayer.on('stateChange', (oldState, newState) => {
			if (newState.status === AudioPlayerStatus.Idle && oldState.status !== AudioPlayerStatus.Idle) {
				if (this.loop) {
					this.queue.push(this.queue.shift())
				} else {
					this.queue.shift()
				}
				this.processQueue();
			}
		})

		this.audioPlayer.on('error', (error) =>  {
			console.warn(error);
		})
	}

}

exports.MusicManager = MusicManager