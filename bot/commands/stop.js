const { SlashCommandBuilder } = require('@discordjs/builders');
const { subscriptions } = require('../GuildMusicManagerMap')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stop the bot and clear the queue.'),
	async execute(interaction) {

		let musicManager = subscriptions.get(interaction.guildId);
		
		if(musicManager) {
			if (interaction.member.voice.channelId != musicManager.voiceConnection.joinConfig.channelId) {

				await interaction.reply({
					content: 'Tu ne peux pas me stopper si tu n\'es pas dans le même salon vocal que moi.',
					ephemeral: true
				})

			} else {
				musicManager.queue = [];
				musicManager.voiceConnection.destroy();
				subscriptions.delete(interaction.guildId)
				
				await interaction.deferReply()
				await interaction.deleteReply()
			}

		}
		
	},
};