/*************
 *    BOT    *
 *************/

const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { TOKEN, PORT } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] });

/**
 * Commands handling
 */
client.commands = new Collection();

const commandFiles = fs.readdirSync('./bot/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./bot/commands/${file}`);
	client.commands.set(command.data.name, command);
}


client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.once('ready', () => {
	console.log('Bot ready!');
});

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