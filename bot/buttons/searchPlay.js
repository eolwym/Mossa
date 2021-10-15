const ytdl = require('ytdl-core')
const join = require('../commands/join')

const { musicManagers, searchMessageManagers } = require('../datum.js')

module.exports = {
	name: 'search',
	async execute(interaction) {
		const buttonId = interaction.customId
		const searchMessageManager = searchMessageManagers.get(interaction.member.id)

		if (buttonId !== 'previous' && buttonId !== 'next') {

			if (ytdl.validateURL(buttonId)) {
				await join.execute(interaction)
				let musicManager = musicManagers.get(interaction.guildId);
	
				const video = searchMessageManager.videos.find(video => {
					if (video.url === buttonId) {
						return video
					}
				})

				musicManager.enqueue(video, interaction.guildId)

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