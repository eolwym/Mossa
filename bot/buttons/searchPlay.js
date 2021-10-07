const ytdl = require('ytdl-core')
const join = require('../commands/join')

const { subscriptions } = require('../GuildMusicManagerMap')
const { userIdSearchPaginationMap } = require('../UserIdSearchMessageMap')

module.exports = {
	name: 'search',
	async execute(interaction) {
		const buttonId = interaction.customId
		const searchMessageManager = userIdSearchPaginationMap.get(interaction.member.id)

		if (buttonId !== 'previous' && buttonId !== 'next') {

			if (ytdl.validateURL(buttonId)) {
	
				await join.execute(interaction)
				let musicManager = subscriptions.get(interaction.guildId);
	
				musicManager.enqueue(buttonId)
				// Récupérer le titre de la musique et la mettre dans le message
				await interaction.update({ content: 'J\'ai ajouté la musique !', components: []});

			} else {
				await interaction.reply({ content: 'Cette URL n\'est pas valide :p', ephemeral: true });
			}
		} else if (buttonId === 'previous') {

			searchMessageManager.pagination--
			const message = searchMessageManager.createMessage()

			await interaction.update({ content: message.content, components: [message.rowButtonsPagination, message.rowButtonsMusicChoosed]});

		} else if (buttonId === 'next') {

			searchMessageManager.pagination++
			const message = searchMessageManager.createMessage()

			await interaction.update({ content: message.content, components: [message.rowButtonsPagination, message.rowButtonsMusicChoosed]});
			
		}
	},
};