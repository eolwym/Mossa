
const { MessageButton, MessageActionRow, MessageEmbed  } = require('discord.js')
const { musicManagers } = require('../datum')

class AudioControllerMessage {

	constructor(message) {
		this.messageContent = AudioControllerMessage.createMessage()
		this.messageObject = message
	}

	static createMessage() {
		
		const embed = new MessageEmbed()
		.setColor('#e18ba0')
		.setTitle('Aucune musique en cours de lecture')
		.setURL("https://www.youtube.com/channel/UCOvn_LNao_hjdY-A5d7RUKg")
		.setImage("https://static.wikia.nocookie.net/love-live/images/2/27/Kanda_Shrine.png/revision/latest?cb=20161230223709")

		const controllersComponents = this.#createControllersComponents()

		return {content: 'File d\'attente :', embeds: [embed], components: [controllersComponents]}
	}
	
	async updateMessageOnAdd(guildId) {

		let musicManager = musicManagers.get(guildId);
		let content = 'File d\'attente :\n\n'
		musicManager.queue.forEach(video => {
			content += video.title + '\n'
		})
		this.messageContent.content = content
		await this.messageObject.edit(this.messageContent)
	}
	
	async updateMessageOnChange(video, guildId) {
		if (video) {
			let musicManager = musicManagers.get(guildId);
	
			let content = 'File d\'attente :\n\n'
			musicManager.queue.forEach(video => {
				content += video.title + '\n'
			})
			
			this.messageContent.content = content
	
			const embed = new MessageEmbed()
			.setColor('#e18ba0')
			.setTitle(video.title)
			.setURL(video.url)
			.setImage(video.thumbnail)
	
			this.messageContent.embeds = [embed]
			console.log(this.messageObject);
	
			await this.messageObject.edit(this.messageContent)
		} else {
			const embed = new MessageEmbed()
				.setColor('#e18ba0')
				.setTitle('Aucune musique en cours de lecture')
				.setURL("https://www.youtube.com/channel/UCOvn_LNao_hjdY-A5d7RUKg")
				.setImage("https://static.wikia.nocookie.net/love-live/images/2/27/Kanda_Shrine.png/revision/latest?cb=20161230223709")
			this.messageContent.content = 'File d\'attente :'
			this.messageContent.embeds = [embed]
			await this.messageObject.edit(this.messageContent)
		}
	}

	static #createControllersComponents() {
		const pauseBtn = new MessageButton().setCustomId('pauseBtn').setLabel('⏸️').setStyle('SECONDARY')
		const playBtn = new MessageButton().setCustomId('playBtn').setLabel('▶️').setStyle('SECONDARY')
		const previousMusicBtn = new MessageButton().setCustomId('previousMusicBtn').setLabel('⏪').setStyle('SECONDARY')
		const nextMusicBtn = new MessageButton().setCustomId('nextMusicBtn').setLabel('⏩').setStyle('SECONDARY')
		const loopMusicBtn = new MessageButton().setCustomId('loopMusicBtn').setLabel('🔄️').setStyle('SECONDARY')

		
		return new MessageActionRow().addComponents(pauseBtn, playBtn, previousMusicBtn, nextMusicBtn, loopMusicBtn)
	}
}

module.exports = {AudioControllerMessage}