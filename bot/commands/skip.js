const { SlashCommandBuilder } = require('@discordjs/builders');
const { subscriptions } = require('../../index')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Skip the current music.'),
	async execute(interaction) {
		let musicManager = subscriptions.get(interaction.guildId);

		if(musicManager) {
			if (interaction.member.voice.channelId != musicManager.voiceConnection.joinConfig.channelId) {
				await interaction.reply({content: 'Tu ne peux pas skip si tu n\'es pas dans le même salon vocal que moi.', ephemeral: true})
			} else {
				musicManager.audioPlayer.stop();
				musicManager.processQueue()
			}
		} else {
			await interaction.reply('Je ne suis connecté à aucun salon vocal')
		}
	},
};