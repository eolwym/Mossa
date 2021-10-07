const { SlashCommandBuilder } = require('@discordjs/builders');
const { SearchMessageManager } =  require('../Class/SearchMessageManager')

const ytsr = require('ytsr')
const { userIdSearchPaginationMap } = require('../UserIdSearchMessageMap')
const { RESULT_LIMIT } = require('../constants.json')

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

		const searchMessageManager = new SearchMessageManager(searchResults.items)
		const message = searchMessageManager.createMessage()
		
		const searchPagination = userIdSearchPaginationMap.get(interaction.user.id);
		
		if (searchPagination) {
			userIdSearchPaginationMap.delete(interaction.member.id)
		}
		
		userIdSearchPaginationMap.set(interaction.member.id, searchMessageManager)

		await interaction.reply({ephemeral: true, content: message.content, components: [message.rowButtonsPagination, message.rowButtonsMusicChoosed]})			

	}
}