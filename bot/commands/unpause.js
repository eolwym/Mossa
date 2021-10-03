const { SlashCommandBuilder } = require('@discordjs/builders');
const { subscriptions } = require('../../index')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unpause')
		.setDescription('Unpause the current music.'),
		async execute(interaction) {

			let musicManager = subscriptions.get(interaction.guildId);
			
			if (musicManager) {
				if (interaction.member.voice.channelId != musicManager.voiceConnection.joinConfig.channelId) {

					await interaction.reply({
						content: 'Tu ne peux pas UNPAUSE si tu n\'es pas dans le même salon vocal que moi.',
						ephemeral: true
					})

				} else {
					musicManager.audioPlayer.unpause();
					
					await interaction.deferReply()
					await interaction.deleteReply()
				}
			}
	
		},
};