const mongo = require('../lib/mongodb')
const uuidv4 = require('uuid/v4')

module.exports.get = async function (userID, source) {
  const col = (await mongo.db()).collection('user')
  switch (source) {
    case undefined:
      return col.findOne({'_id': userID}).then(toClient)
    case 'facebook':
      return col.findOne({'facebook.id': userID}).then(toClient)
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

module.exports.update = async function (user) {
  const col = (await mongo.db()).collection('user')
  await col.findOneAndUpdate({'_id': user.id}, {'$set': toDB(user)})
  return col.findOne({'_id': user.id})
}

function toClient (obj) {
  if (obj === null) {
    return null
  }
  obj.id = obj._id
  delete obj._id
  return obj
}

function toDB (obj) {
  obj._id = obj.id
  delete obj.id
  return obj
}
