const mongodb = require('mongodb')

module.exports.db = function () {
  return mongodb.MongoClient.connect('mongodb://localhost:27017/palhub')
}
