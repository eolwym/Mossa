const { SlashCommandBuilder } = require('@discordjs/builders');
const ytdl = require('ytdl-core')
const join = require('./join')
const { subscriptions } = require('../../index')


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
				
		if (ytdl.validateURL(url)) {

			await join.execute(interaction, subscriptions)
			let musicManager = subscriptions.get(interaction.guildId);

			musicManager.enqueue(url)
			await interaction.deleteReply()

		} else {
			await interaction.reply({ content: 'Cette URL n\'est pas valide :p', ephemeral: true });
		}
	},
};