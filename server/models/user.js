const mongo = require('../lib/mongodb')
const uuidv4 = require('uuid/v4')

module.exports.get = async function (userID, source) {
  const col = (await mongo.db()).collection('user')
  switch (source) {
    case undefined:
      return col.findOne({'_id': userID})
    case 'facebook':
      return col.findOne({'facebook.id': userID})
  }
}

module.exports.create = async function (user, source, sourceObject) {
  const col = (await mongo.db()).collection('user')
  switch (source) {
    case 'facebook':
      return col.insertOne({
        '_id': uuidv4(),
        'name': user.name,
        'source': 'facebook',
        'facebook': sourceObject
      })
  }
}

module.exports.update = async function (userID, userObject) {
  const col = (await mongo.db()).collection('user')
  await col.findOneAndUpdate({'_id': userID}, {'$set': userObject})
  return col.findOne({'_id': userID})
}
