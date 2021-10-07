const { SlashCommandBuilder } = require('@discordjs/builders');
const { subscriptions } = require('../GuildMusicManagerMap')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stop the bot and clear the queue.'),
	async execute(interaction) {

		let musicManager = subscriptions.get(interaction.guildId);
		
		if(musicManager) {
			const response = musicManager.stop(interaction.member.voice.channelId, interaction.guildId)
			await interaction.reply(response)
		} else {
			await interaction.reply('Je ne suis connecté à aucun salon vocal')
		}
	},
};