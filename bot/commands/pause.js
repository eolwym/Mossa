const { SlashCommandBuilder } = require('@discordjs/builders');
const { subscriptions } = require('../GuildMusicManagerMap')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pause the current music.'),
		async execute(interaction) {

			let musicManager = subscriptions.get(interaction.guildId);

			if (musicManager) {
				const response = musicManager.pause(interaction.member.voice.channelId)
				await interaction.reply(response)

			} else {
				await interaction.reply({content: 'Je ne suis dans aucun salon vocal !', ephemeral: true})
			}
	
		},
};