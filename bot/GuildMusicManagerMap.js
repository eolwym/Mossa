/**
 * Maps guild IDs to MusicManager, which exist if the bot has an active VoiceConnection to the guild.
 */
const subscriptions = new Map()

 // make this Map accessible everywhere
module.exports = { subscriptions }