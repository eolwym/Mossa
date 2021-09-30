const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('loop')
		.setDescription('Loop on all music of the Queue.'),
	async execute(interaction) {
		await interaction.reply('All music will repeat.');
	},
};