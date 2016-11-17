var redis = require('../redis')
var logger = require('../logger')
var shortid = require('shortid')

module.exports.newTable = function(request) {
  var uniqueid = shortid.generate()
  return redis.saddAsync('tables', uniqueid)
    .then(reply => {
      return redis.hmsetAsync('table:' + uniqueid, [
        'subject',
        request.subject
      ])
    })
    .then(reply => {
      return uniqueid
    })
}

module.exports.getTables = function() {
  var tableIds = []
  return redis.smembersAsync('tables')
    .then(reply => {
      var promises = []
      tableIds = reply
      for (var x in reply) {
        promises.push(redis.hgetAsync('table:' + reply[x], 'subject'))
      }
      return Promise.all(promises)
    })
    .then(reply => {
      var tables = []
      for (var x in tableIds) {
        tables.push({
          id: tableIds[x],
          subject: reply[x]
        })
      }
      console.log(tables)
      return tables
    })
}

module.exports.getTable = function(tableId) {
  return redis.sismemberAsync('tables', tableId)
    .then(reply => {
      if (!reply)
        throw 'no table'
      return redis.hgetAsync('table:' + tableId, 'subject')
    })
}

module.exports.joinTable = function(tableId, userId) {
  return redis.saddAsync('table:' + tableId + ':users', userId)
    .then(() => {
      return redis.setAsync('user:' + userId + ':table', tableId)
    })
}

module.exports.leaveTable = function(tableId, userId) {
  return redis.sremAsync('table:' + tableId + ':users', userId)
    .then(() => {
      return redis.delAsync('user:' + userId + ':table')
    })
}

module.exports.tableEmpty = function(tableId) {
  return redis.scardAsync('table:' + tableId + ':users').then(reply => {
    console.log('te: ' + reply)
    return reply == 0 ? true : false
  })
}

module.exports.removeTable = function(tableId) {
  return redis.sremAsync('tables', tableId)
    .then(() => {
      return redis.delAsync('table:' + tableId)
    })
}
