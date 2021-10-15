const { SlashCommandBuilder } = require('@discordjs/builders');
const { SearchMessageManager } =  require('../Class/SearchMessageManager')

const ytsr = require('ytsr')
const { searchMessageManagers } = require('../datum')
const { RESULT_LIMIT } = require('../constants.json');
const { Song } = require('../Class/Song');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('search')
		.setDescription('Search Music on Youtube from Query.')
		.addStringOption(query =>
			query.setName('query')
				.setDescription('query')
				.setRequired(true)),
	async execute(interaction) {

		const query = interaction.options.getString('query')
		const filters = await ytsr.getFilters(query);
		const filter = filters.get('Type').get('Video');
		const searchResults = await ytsr(filter.url, {limit: RESULT_LIMIT})
		const videos = []

		searchResults.items.forEach(video => {
			videos.push(new Song(video.url, video.bestThumbnail.url, video.title, video.author.name, video.duration))
		});

		const searchMessageManager = new SearchMessageManager(videos)
		const message = searchMessageManager.createMessage()
		
		const searchMessageManagerOld = searchMessageManagers.get(interaction.user.id);
		
		if (searchMessageManagerOld) {
			searchMessageManagers.delete(interaction.member.id)
		}
		
		searchMessageManagers.set(interaction.member.id, searchMessageManager)

		await interaction.reply({ephemeral: true, content: message.content, components: [message.rowButtonsPagination, message.rowButtonsMusicChoosed]})			

	}
}