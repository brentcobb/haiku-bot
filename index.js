/*
  A Haiku bot, it makes haikus from discord chatter.
*/
if(process.env.ENVIRONMENT === 'local') {
  require('dotenv').config()
}

var http = require('http');

// Import the discord.js module
const Discord = require('discord.js');
const _ = require('lodash');

// Create an instance of a Discord client
const client = new Discord.Client();
var syllable = require('syllable');

var Hypher = require('hypher'),
    english = require('hyphenation.en-us'),
    h = new Hypher(english);

/////////////// DATA BASE CRAP
var MongoClient = require('mongodb').MongoClient;

const token = process.env.DISCORD_TOKEN;

////////////////////////////////////
var wordArray = [];

function formattedWordArray(x) {
  if( x.length <= 1 ) {
    return [{word: x, sylbs: 1}]
  } else {
    return [{word: [x.join().replace(',', '')], sylbs: x.length}]
  }
}


function writeHaiku(msg){
  var fiveSyl1 = [];
  var fiveSyl1Count = 0;
  var sevenSylCount = 0;
  var fiveSyl2Count = 0;
  var sevenSyl = [];
  var fiveSyl2 = [];
  // create an array of words
  wordArray = msg.split(' ')
  
  _.chain(wordArray)
    .map((word) => {
      var not51 = true;
      var not7 = true;
      var not52 = true;
      formattedWord = h.hyphenate(word)
      z = formattedWordArray(formattedWord)

      if(fiveSyl1Count <= 4 && sevenSylCount === 0 && fiveSyl2Count === 0) {
        fiveSyl1.push(z[0].word[0])
        fiveSyl1Count = z[0].sylbs + fiveSyl1Count
        if(fiveSyl1Count === 5 ) {
          not51 = false
        }
      }

      if (not51 && fiveSyl1Count === 5 && sevenSylCount <= 6 && fiveSyl2Count === 0) {
        sevenSyl.push(z[0].word[0])
        sevenSylCount = sevenSylCount + z[0].sylbs
        if(sevenSylCount === 7 ) {
          not7 = false
        }
      } 

      if(not51 && not7 && fiveSyl1Count === 5 && sevenSylCount === 7 && !sevenSylCount <= 6) {
        fiveSyl2.push(z[0].word[0])
        fiveSyl2Count = fiveSyl2Count + z[0].sylbs
      }
    })
    .tap((c) => {
      console.log("_____________________________________________:")

      console.log("fiveSyl1:", fiveSyl1)
      console.log("sevenSyl1:", sevenSyl)
      console.log("fiveSyl2:", fiveSyl2)
      console.log("fiveSyl1:", fiveSyl1Count)
      console.log("sevenSyl1:", sevenSylCount)
      console.log("fiveSyl2:", fiveSyl2Count)

      // RESET
      fiveSyl1Count = 0
      sevenSylCount = 0
      fiveSyl2Count = 0
        
      return {fiveSyl1: fiveSyl1, sevenSyl: sevenSyl, fiveSyl2: fiveSyl2 }
    })

    .value()
    
  return {msg: fiveSyl1.join(' ') + '\n' + sevenSyl.join(' ') + '\n' + fiveSyl2.join(' '), arrays: {fiveSyl1: fiveSyl1, sevenSyl:sevenSyl, fiveSyl2:fiveSyl2}}
}

// ------------------------------

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', () => {
  console.log('I am ready!');


});

// Create an event listener for messages
client.on('message', message => {

  console.log('--SYLLABLE COUNT--', syllable(message.content))
  if (syllable(message.content) == '17' && message.author.bot != true) {
    
    haiku = writeHaiku(message.content)
  
    message.channel.send(haiku.msg, {code: true, split: { char:'\n' } })

    var haikuToSave = {
      _id: message.id,
      author: message.author.username,
      initialMessage:   message.content,
      generatedArrays: haiku.arrays,
      generatedHaiku: haiku.msg,
      date: { type: Date, default: Date.now }
    };
    
    MongoClient.connect(process.env.DB_URI, function(err, db) {

      if(err) {console.log('err db connection', err)}

      var collection = db.collection('haikus');

      collection.insert(haikuToSave, {w: 1}, (err, results) => {
        (err) ? console.log("err:", err) : console.log("Record added as ", message.id);
      });
      
    });

    

  }
});

// Log our bot in
client.login(token);
http.createServer().listen(process.env.PORT)