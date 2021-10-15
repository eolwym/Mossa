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

		this.videos.forEach((video, index) => {
			messageButtons.push(new MessageButton().setCustomId(video.url).setLabel((index+1).toString()).setStyle('PRIMARY'));
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

		this.videos.forEach((video, index) => {
			content += `${index+1} - ${video.duration} | ${video.title} - ${video.author}\n`
		})
		const rowButtonsMusicChoosed = new MessageActionRow().addComponents(...messageButtons)
		const rowButtonsPagination = new MessageActionRow().addComponents(...messagePaginationButtons)

		const message = {content, rowButtonsMusicChoosed, rowButtonsPagination}
		return message 
	}
}

exports.SearchMessageManager = SearchMessageManager