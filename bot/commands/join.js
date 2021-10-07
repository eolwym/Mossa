const { SlashCommandBuilder } = require('@discordjs/builders')
const { MusicManager } =  require('../Class/MusicManager')
const { joinVoiceChannel } = require('@discordjs/voice')
const { subscriptions } = require('../GuildMusicManagerMap')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('Join the voice channel of the user who wrote the command.'),
	async execute(interaction) {

		if (!interaction.member.voice.channelId) {
			await interaction.reply('Tè pa dans un chanel, t bète <:mossa:889972668969943111>');
			return
		}

		let musicManager = subscriptions.get(interaction.guildId);

		// Create a voice connection and add it to subscriptions
		if (!musicManager) {

			const musicManager = new MusicManager(
				joinVoiceChannel({
					channelId: interaction.member.voice.channelId,
					guildId: interaction.guild.id,
					adapterCreator: interaction.guild.voiceAdapterCreator,
				})
			)
			
			subscriptions.set(interaction.guildId, musicManager)

		
		// Check if the voice connection need to change channel id
		} else {

			if (interaction.member.voice.channelId != musicManager.voiceConnection.joinConfig.channelId) {

				subscriptions.delete(interaction.guildId)

				const musicManager = new MusicManager(
					joinVoiceChannel({
						channelId: interaction.member.voice.channelId,
						guildId: interaction.guild.id,
						adapterCreator: interaction.guild.voiceAdapterCreator,
					})
				)
		
				subscriptions.set(interaction.guildId, musicManager)
			}
		}
		
	},
};