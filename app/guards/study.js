var redis = require('../redis')
var logger = require('../logger')
var shortid = require('shortid')

module.exports.newTable = function() {
  var uniqueid = shortid.generate()
  return redis.saddAsync('tables', uniqueid)
    .then(reply => {
      return uniqueid
    })
}

module.exports.getTables = function() {
  return redis.smembersAsync('tables')
}

module.exports.getTable = function(tableId) {
  return redis.sismemberAsync('tables', tableId)
}

module.exports.joinTable = function(tableId, userId) {
  return redis.saddAsync('table:' + tableId + ':users', userId)
}

module.exports.leaveTable = function(tableId, userId) {
  return redis.sremAsync('table:' + tableId + ':users', userId)
}

module.exports.tableEmpty = function(tableId) {
  return redis.scardAsync('table:' + tableId + ':users').then(reply => {
    console.log('te: ' + reply)
    return reply == 0 ? true : false
  })
}

module.exports.removeTable = function(tableId) {
  return redis.sremAsync('tables', tableId)
}
