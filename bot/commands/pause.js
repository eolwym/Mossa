const { SlashCommandBuilder } = require('@discordjs/builders');
const { musicManagers } = require('../datum')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pause the current music.'),
		async execute(interaction) {

			let musicManager = musicManagers.get(interaction.guildId);

			if (musicManager) {
				const response = musicManager.pause(interaction.member.voice.channelId)
				await interaction.reply(response)

			} else {
				await interaction.reply({content: 'Je ne suis dans aucun salon vocal !', ephemeral: true})
			}
	
		},
};