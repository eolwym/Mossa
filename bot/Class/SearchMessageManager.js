const { MessageButton, MessageActionRow  } = require('discord.js');


class SearchMessageManager {

	constructor(results) {
		this.pagination = 0
		this.results = results
		this.videos
	}

	createMessage() {
		this.videos = this.results.slice(this.pagination*5, this.pagination*5+5)
		const messageButtons = []
		const messagePaginationButtons = []
		let content = ''

		this.videos.forEach((result, index) => {
			messageButtons.push(new MessageButton().setCustomId(result.url).setLabel((index+1).toString()).setStyle('PRIMARY'));
		})

		const previousBtn = new MessageButton().setCustomId('previous').setLabel('◄').setStyle('SUCCESS')
		const nextBtn = new MessageButton().setCustomId('next').setLabel('►').setStyle('SUCCESS')
		
		if (this.pagination === 0) {
			previousBtn.setDisabled()
		}
		if (this.pagination === 2) {
			nextBtn.setDisabled()
		}
		messagePaginationButtons.push(previousBtn)
		messagePaginationButtons.push(nextBtn)

		content += "Vous avez 15 secondes pour faire votre choix. Il vous sera ensuite impossible d'effectuer une action sur ces boutons.\n\n"
		this.videos.forEach((result, index) => {
			content += `${index+1} - ${result.duration} | ${result.title} - ${result.author.name}\n`
		})
		const rowButtonsMusicChoosed = new MessageActionRow().addComponents(...messageButtons)
		const rowButtonsPagination = new MessageActionRow().addComponents(...messagePaginationButtons)

		const message = {content, rowButtonsMusicChoosed, rowButtonsPagination}
		return message 
	}
}

exports.SearchMessageManager = SearchMessageManager