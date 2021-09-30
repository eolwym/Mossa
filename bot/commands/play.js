const { SlashCommandBuilder } = require('@discordjs/builders');
const { MusicManager } =  require('../Class/MusicManager')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play music from youtube URL.'),
	async execute(interaction) {

		const channelId = interaction.member.voice.channelId
		const guildId = interaction.guild.id
		const adapterCreator = interaction.guild.voiceAdapterCreator

		await MusicManager.connectToVoiceChannel(channelId, guildId, adapterCreator)
		await interaction.reply('Youtube Music Launched.');
	},
};