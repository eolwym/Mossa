const { SlashCommandBuilder } = require('@discordjs/builders')
const { MusicManager } =  require('../Class/MusicManager')
const { joinVoiceChannel } = require('@discordjs/voice')
const { musicManagers } = require('../datum')
const { AudioControllerMessage } = require('../Class/AudioControllerMessage')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('Join the voice channel of the user who wrote the command.'),
	async execute(interaction) {

		if (!interaction.member.voice.channelId) {
			await interaction.reply({content: 'Tè pa dans un chanel, t bète <:mossa:889972668969943111>', ephemeral: true})
			return
		}

		let musicManager = musicManagers.get(interaction.guildId)

		// Create a voice connection and add it to musicManagers
		if (!musicManager) {

			const musicManager = new MusicManager(
				joinVoiceChannel({
					channelId: interaction.member.voice.channelId,
					guildId: interaction.guild.id,
					adapterCreator: interaction.guild.voiceAdapterCreator,
				})
			)
			musicManagers.set(interaction.guildId, musicManager)
			
			let mossaChannel = false
			const channels = await interaction.guild.channels.fetch()
	
			for (const channel of channels) {
				if (channel[1].name === 'mossa-audio-controller') {
					mossaChannel = channel[1]
				}
			}
			if (mossaChannel) {
				const allMossaChannelMessages = await mossaChannel.messages.fetch()
				const message = Array.from(allMossaChannelMessages.values()).pop()
				musicManager.audioControllerMessage = new AudioControllerMessage(message)
			}
		
		// Check if the voice connection need to change channel id
		} else {

			if (interaction.member.voice.channelId != musicManager.voiceConnection.joinConfig.channelId) {

				musicManagers.delete(interaction.guildId)

				const voiceConnection = await joinVoiceChannel({
					channelId: interaction.member.voice.channelId,
					guildId: interaction.guild.id,
					adapterCreator: interaction.guild.voiceAdapterCreator,
				})

				const musicManager = new MusicManager(voiceConnection)
				musicManagers.set(interaction.guildId, musicManager)

				let mossaChannel = false
				const channels = await interaction.guild.channels.fetch()
		
				for (const channel of channels) {
					if (channel[1].name === 'mossa-audio-controller') {
						mossaChannel = channel[1]
					}
				}
				if (mossaChannel) {
					const allMossaChannelMessages = await mossaChannel.messages.fetch()
					const message = Array.from(allMossaChannelMessages.values()).pop()
					musicManager.audioControllerMessage = new AudioControllerMessage(message)
				}
		
			}
		}
		
	},
}