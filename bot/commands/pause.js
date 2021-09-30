const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pause the current music.'),
	async execute(interaction) {
		await interaction.reply('Music paused.');
	},
};