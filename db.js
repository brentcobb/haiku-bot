const MongoClient = require('mongodb').MongoClient

function saveHaiku(haikuToSave, messageId) {
  MongoClient.connect(process.env.DB_URI, (err, db) => {
    if (err) {
      console.log('Error connecting to mongodb:', err)
    }

    var collection = db.collection('haikus')

    collection.insert(haikuToSave, { w: 1 }, (err, results) => {
      err
        ? console.log('err:', err)
        : console.log('Record added as ', messageId)
    })
  })
}

module.exports = { saveHaiku }
