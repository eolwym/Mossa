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

	loopAll(voiceChannelId) {

		if (voiceChannelId != this.voiceConnection.joinConfig.channelId) {

			return {
				content: 'Tu ne peux pas mettre la musique en mode loop si tu n\'es pas dans le même salon vocal que moi.',
				ephemeral: true
			}

		} else {
			this.loop = true

			return {content: 'Okay je vais répéter les sons de la file ', ephemeral: true}
		}
		
	}

	noloop(voiceChannelId) {
		if (voiceChannelId != this.voiceConnection.joinConfig.channelId) {

			return {
				content: 'Tu ne peux pas mettre la musique en mode noloop si tu n\'es pas dans le même salon vocal que moi.',
				ephemeral: true
			}

		} else {
			this.loop = false
			
			return {content: 'Okay les musiques ne seront plus répété', ephemeral: true}

		}
	}

	pause(voiceChannelId) {
		if (voiceChannelId != this.voiceConnection.joinConfig.channelId) {

			return{
				content: 'Tu ne peux pas mettre la musique en pause si tu n\'es pas dans le même salon vocal que moi.',
				ephemeral: true
			}

		} else {
			this.audioPlayer.pause();
			
			return {content: 'Hop je mets en pause :)', ephemeral: true}
		}
	}

	unpause(voiceChannelId) {
		if (voiceChannelId != this.voiceConnection.joinConfig.channelId) {

			return {
				content: 'Tu ne peux pas UNPAUSE si tu n\'es pas dans le même salon vocal que moi.',
				ephemeral: true
			}

		} else {
			this.audioPlayer.unpause();
			
			return {content: 'Je relance la musiqueee !', ephemeral: true}
		}
	}

	play(url) {
		if (ytdl.validateURL(url)) {

			this.enqueue(url)
			return {content: 'Boom Boom', ephemeral: true}

		} else {
			return { content: 'Cette URL n\'est pas valide :p', ephemeral: true }
		}
	}
	skip(voiceChannelId) {
		if (voiceChannelId != this.voiceConnection.joinConfig.channelId) {
			return {content: 'Tu ne peux pas skip si tu n\'es pas dans le même salon vocal que moi.', ephemeral: true}
		} else {
			this.audioPlayer.stop();
			this.processQueue()
			return {content: 'Meeeeh', ephemeral: true}
		}
	}

	stop(voiceChannelId, guildId) {
		if (voiceChannelId != this.voiceConnection.joinConfig.channelId) {

			return {
				content: 'Tu ne peux pas me stopper si tu n\'es pas dans le même salon vocal que moi.',
				ephemeral: true
			}

		} else {
			this.queue = [];
			this.voiceConnection.destroy();
			subscriptions.delete(guildId)
			
			return {content: 'Oh non pas déjà !', ephemeral: true}

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
	/**
	 * - Handle state change of the Audio Player
	 */
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