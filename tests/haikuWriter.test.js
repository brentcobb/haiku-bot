var tap = require('tap')
const haikuWriter = require('../haikuWriter.js')
const mockHaikus = require('./mockHaikus.js')

mockHaikus.forEach(testHaiku => {
  var testInput = haikuWriter(testHaiku.input)
  tap.equal(testInput.msg, testHaiku.output)
})
