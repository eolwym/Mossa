const { SlashCommandBuilder } = require('@discordjs/builders');
const join = require('./join')
const { subscriptions } = require('../GuildMusicManagerMap')


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

		await join.execute(interaction, subscriptions)
		let musicManager = subscriptions.get(interaction.guildId);
		
		const response = musicManager.play(url)
		await interaction.reply(response)	
		
	},
};