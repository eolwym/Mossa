const { SlashCommandBuilder } = require('@discordjs/builders');
const { subscriptions } = require('../GuildMusicManagerMap')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Skip the current music.'),
	async execute(interaction) {
		let musicManager = subscriptions.get(interaction.guildId);

		if(musicManager) {
			const response = musicManager.skip(interaction.member.voice.channelId)
			await interaction.reply(response)
		} else {
			await interaction.reply('Je ne suis connecté à aucun salon vocal')
		}
	},
};