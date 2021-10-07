const { SlashCommandBuilder } = require('@discordjs/builders');
const { subscriptions } = require('../GuildMusicManagerMap')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('loop')
		.setDescription('Loop on all music of the Queue.'),
	async execute(interaction) {

		let musicManager = subscriptions.get(interaction.guildId);

		if (musicManager) {
			const response = musicManager.loopAll(interaction.member.voice.channelId)
			await interaction.reply(response)

		} else {
			await interaction.reply({content: 'Je ne suis dans aucun salon vocal.', ephemeral: true})
		}
	},
};