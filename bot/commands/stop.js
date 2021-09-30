const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stop the bot and clear the queue.'),
	async execute(interaction) {
		await interaction.reply('Music stopped and Queue cleared.');
	},
};