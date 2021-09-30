const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('search')
		.setDescription('Search Music on Youtube from Query.'),
	async execute(interaction) {
		await interaction.reply('List of music found:');
	},
};