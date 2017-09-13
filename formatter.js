const syllable = require('syllable')

function formattedWordArray(x) {
  return { word: x.join().replace(',', ''), sylbs: syllable(x) }
}

module.exports = formattedWordArray
