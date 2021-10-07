/*************
 *    BOT    *
 *************/

const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { TOKEN, PORT } = require('./config.json');
const { createMossaChannel } = require('./bot/config/mossaChannelCreationConfig')

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] });

/**
 * Commands handling
 */
client.commands = new Collection();
client.buttons = new Collection();

const commandFiles = fs.readdirSync('./bot/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./bot/commands/${file}`);
	client.commands.set(command.data.name, command);
}

const buttonFiles = fs.readdirSync('./bot/buttons').filter(file => file.endsWith('.js'));

for (const file of buttonFiles) {
	const button = require(`./bot/buttons/${file}`);
	client.buttons.set(button.name, button);
}


client.on('interactionCreate', async interaction => {
	if (interaction.isCommand()) {
		const command = client.commands.get(interaction.commandName);
	
		if (!command) return;
	
		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	} else if (interaction.isButton()) {
		const button = client.buttons.get(interaction?.message.interaction.commandName);

		if (!button) return;

		try {
			await button.execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	} else {
		return
	}
});

client.once('ready', async () => {
	// Configure Channel Audio Player Controller
	createMossaChannel(client)
	console.log('Mossa is Ready !');
})

client.on('error', console.warn);
client.login(TOKEN);

/************************
 *    EXPRESS SERVER    *
 ************************/

const express = require('express')
const server = express()

server.get('/', (req, res) => {
	return res.json('test')
})

server.listen(PORT, () => {
	console.log('Server ready !');
})