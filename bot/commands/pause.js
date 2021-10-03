const { SlashCommandBuilder } = require('@discordjs/builders');
const { subscriptions } = require('../GuildMusicManagerMap')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pause the current music.'),
		async execute(interaction) {

			let musicManager = subscriptions.get(interaction.guildId);

			if (musicManager) {

				if (interaction.member.voice.channelId != musicManager.voiceConnection.joinConfig.channelId) {

					await interaction.reply({
						content: 'Tu ne peux pas mettre la musique en pause si tu n\'es pas dans le même salon vocal que moi.',
						ephemeral: true
					})

				} else {
					musicManager.audioPlayer.pause();
					
					await interaction.deferReply()
					await interaction.deleteReply()
				}
			}
	
		},
};