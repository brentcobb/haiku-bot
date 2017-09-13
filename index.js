/*
  A Haiku bot, it makes haikus from discord chatter.
*/
if (process.env.ENVIRONMENT === 'local') {
  require('dotenv').config()
}

const http = require('http')
const Discord = require('discord.js')
const client = new Discord.Client()
const syllable = require('syllable')

const writeHaiku = require('./haikuWriter.js')
const db = require('./db.js')

const token = process.env.DISCORD_TOKEN

client.on('ready', () => {
  console.log('I am ready!')
})

client.on('message', message => {
  console.log('--SYLLABLE COUNT--/s', syllable(message.content))
  if (syllable(message.content) == '17' && message.author.bot != true) {
    haiku = writeHaiku(message.content)
    console.log('haiku', haiku)

    message.channel.send(haiku.msg, { code: true, split: { char: '\n' } })

    var haikuToSave = {
      _id: message.id,
      author: message.author.username,
      initialMessage: message.content,
      generatedArrays: haiku.arrays,
      generatedHaiku: haiku.msg,
      type: 'haiku',
      date: Date.now()
    }

    db.saveHaiku(haikuToSave, message.id)
  }
})

// Haiku bot enters the arean
client.login(token)
// pay attention on this port young bot
http.createServer().listen(process.env.PORT)
