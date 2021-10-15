const { SlashCommandBuilder } = require('@discordjs/builders')
const {AudioControllerMessage} = require('../Class/AudioControllerMessage')
const { musicManagers } = require('../datum')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('init')
		.setDescription('Create Mossa Channel and Audio Controller message.'),
	async execute(interaction) {

		const channels = await interaction.member.guild.channels.fetch()

		for (const channel of channels) {
			if (channel[1].name === 'mossa-audio-controller') {
				await channel[1].delete()
			}
		}

		const channel = await interaction.member.guild.channels.create('mossa-audio-controller', { 
			type: 'GUILD_TEXT',
			topic: `Vous pouvez controler la musique depuis ce salon.`,
			position: 0,
			reason: 'Mossa needs her own channel'
		})

		const mossaMessage = await channel.send(AudioControllerMessage.createMessage())
		let musicManager = musicManagers.get(interaction.guildId)

		if (musicManager) {
			musicManager.audioControllerMessage = new AudioControllerMessage(mossaMessage)
		}
		
	},
};