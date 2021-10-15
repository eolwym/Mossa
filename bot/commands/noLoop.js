const { SlashCommandBuilder } = require('@discordjs/builders');
const { musicManagers } = require('../datum')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('noloop')
		.setDescription('Don\t loop on all music of the Queue.'),
	async execute(interaction) {
		let musicManager = musicManagers.get(interaction.guildId);

		if (musicManager) {
			const response = musicManager.noloop(interaction.member.voice.channelId)
			await interaction.reply(response)

		} else {
			await interaction.reply({content: 'Je ne suis dans aucun salon vocal !', ephemeral: true})
		}
	},
};