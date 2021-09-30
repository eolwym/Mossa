/**
 * BOT
 */

// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const { TOKEN, PORT } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Bot ready!');
});

// Login to Discord with your client's token
client.login(TOKEN);

/**
 * EXPRESSS SERVER
 */

const express = require('express')
const server = express()

server.get('/', (req, res) => {
	return res.json('test')
})

server.listen(PORT, () => {
	console.log('Server ready !');
})