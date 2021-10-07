const createMossaChannel = async (client) => {

	const guilds = await client.guilds.fetch();

	guilds.forEach(async (guild) => {

		let isMossaChannelExist = false
		const completeGuild = client.guilds.cache.get(guild.id)

		const channels = await completeGuild.channels.fetch()

		const channelValues = channels.values()

		for (const channelValue of channelValues) {
			if (channelValue.name === "mossa-audio-controller") {
				isMossaChannelExist = true
			}
		}

		if (!isMossaChannelExist) {
			completeGuild.channels.create('mossa-audio-controller', { 
				type: 'GUILD_TEXT',
				topic: `
				⏯ Pause/Resume the song.
				⏹ Stop and empty the queue.
				⏭ Skip the song.
				🔄 Switch between the loop modes.
				❌ Remove the current song from your private playlist
				`,
				position: 0,
				reason: 'Mossa needs her own channel'
			})
			.then(console.log)
			.catch(console.error);
		}

		// Une description

		// Un visuel

		// un panel de controle

		// Une fil d'attente

	})
}

module.exports = { createMossaChannel }