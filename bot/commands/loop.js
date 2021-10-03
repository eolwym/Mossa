const { SlashCommandBuilder } = require('@discordjs/builders');
const { subscriptions } = require('../GuildMusicManagerMap')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('loop')
		.setDescription('Loop on all music of the Queue.'),
	async execute(interaction) {
		let musicManager = subscriptions.get(interaction.guildId);

		if (musicManager) {

			if (interaction.member.voice.channelId != musicManager.voiceConnection.joinConfig.channelId) {

				await interaction.reply({
					content: 'Tu ne peux pas mettre la musique en mode loop si tu n\'es pas dans le même salon vocal que moi.',
					ephemeral: true
				})

			} else {
				musicManager.loop = true
				
				// get the current audio ressource url and push it at the end of the queue
				console.log(musicManager.audioPlayer._state.resource);

				await interaction.deferReply()
				await interaction.deleteReply()
			}
		} else {
			await interaction.reply('Je ne suis dans aucun salon vocal.')
			return

		}
	},
};