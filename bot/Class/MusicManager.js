const ytdl = require('ytdl-core');
const {
	AudioPlayerStatus,
	StreamType,
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
} = require('@discordjs/voice');

class MusicManager {

	/**
	 * search music from string
	 */
	static async connectToVoiceChannel(channelId, guildId, adapterCreator) {
		joinVoiceChannel({
			channelId: channelId,
			guildId: guildId,
			adapterCreator: adapterCreator,
		});
	}

	/**
	 * search music from string
	 */
	static searchMusic() {

	}

	/**
	 * play music with url
	 */
	static playMusic() {
		
	}

	/**
	 * pause the current music
	 */
	static pauseMusic() {
		
	}

	/**
	 * stop the current music
	 */
	static stopMusic() {
		
	}

	/**
	 * loop all music of the queue
	 */
	static loopMusic() {
		
	}

}

module.exports = { MusicManager };