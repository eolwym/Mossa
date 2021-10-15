const { SlashCommandBuilder } = require('@discordjs/builders');
const join = require('./join')
const { musicManagers } = require('../datum');
const ytdl = require('ytdl-core');
const { Song } = require('../Class/Song')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play an audio ressource from Youtube URL only.')
		.addStringOption(option =>
			option.setName('url')
				.setDescription('Youtube URL')
				.setRequired(true)),
	async execute(interaction) {
		const url = interaction.options.getString('url');
		const videoInfos = await ytdl.getBasicInfo(url)
		const video = new Song(url, videoInfos.videoDetails.thumbnails.pop().url, videoInfos.videoDetails.title, videoInfos.videoDetails.author.name, videoInfos.videoDetails.lengthSeconds)

		await join.execute(interaction, musicManagers)
		let musicManager = musicManagers.get(interaction.guildId);

		const response = musicManager.play(video)
		await interaction.reply(response)	
		
	},
};