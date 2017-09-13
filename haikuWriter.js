const Hypher = require('hypher')
const english = require('hyphenation.en-us')
const h = new Hypher(english)
const syllable = require('syllable')
const formattedWordArray = require('./formatter.js')

var wordArray = []

// once this works, it needs to become an npm module
module.exports = msg => {
  var fiveSyl1Count = 0
  var sevenSylCount = 0
  var fiveSyl2Count = 0
  var fiveSyl1 = []
  var sevenSyl = []
  var fiveSyl2 = []
  // create an array of words

  wordArray = msg.split(' ')

  wordArray.map(word => {
    var not51 = true
    var not7 = true
    var not52 = true
    formattedWord = h.hyphenate(word)
    console.log('formattedWord', formattedWord)
    z = formattedWordArray(formattedWord)
    console.log('z', z)
    if (fiveSyl1Count <= 4 && sevenSylCount === 0 && fiveSyl2Count === 0) {
      fiveSyl1.push(z.word)
      fiveSyl1Count = z.sylbs + fiveSyl1Count
      console.log('fiveSyl1Count', fiveSyl1Count)
      if (fiveSyl1Count === 5) {
        not51 = false
      }
    }

    if (
      not51 &&
      fiveSyl1Count === 5 &&
      sevenSylCount <= 6 &&
      fiveSyl2Count === 0
    ) {
      // this one is really broken
      if (sevenSylCount === 6 && h.hyphenate(z.word) < 1) {
        sevenSyl.push(formattedWord[0])
        if (formattedWord[1]) {
          fiveSyl2.push(formattedWord[1])
          fiveSyl2Count++
        }
        if (formattedWord[2]) {
          fiveSyl2.push(formattedWord[2])
          fiveSyl2Count++
        }
        if (formattedWord[3]) {
          fiveSyl2.push(formattedWord[3])
          fiveSyl2Count++
        }
        if (formattedWord[4]) {
          fiveSyl2.push(formattedWord[4])
          fiveSyl2Count++
        }
      } else {
        sevenSyl.push(z.word)
        sevenSylCount = sevenSylCount + z.sylbs
        console.log('evenSylCount', sevenSylCount)
      }
      if (sevenSylCount === 7) {
        not7 = false
      }
    }

    if (
      not51 &&
      not7 &&
      fiveSyl1Count === 5 &&
      sevenSylCount === 7 &&
      !sevenSylCount <= 6
    ) {
      fiveSyl2.push(z.word)
      fiveSyl2Count = fiveSyl2Count + z.sylbs
      console.log('fiveSyl2Count', fiveSyl2Count)
      if (fiveSyl2Count === 5) {
        fiveSyl1Count = 0
        sevenSylCount = 0
        fiveSyl2Count = 0
      }
    }
  })

  return {
    msg:
      fiveSyl1.join(' ') +
      '\n' +
      sevenSyl.join(' ') +
      '\n' +
      fiveSyl2.join(' '),
    arrays: { fiveSyl1, sevenSyl, fiveSyl2 }
  }
}
