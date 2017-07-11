const redis = require('../lib/redis')
const shortid = require('shortid')
const User = require('../models/user')
const timers = {}

module.exports.create = async function (room) {
  const roomID = shortid.generate()
  const roomInfo = [
    'name',
    room.name,
    'id',
    roomID,
    'creator',
    room.creator,
    'type',
    room.type
  ]
  switch (room.type) {
    case 'hourglass':
      roomInfo.push('dueTime', room.typeInfo.dueTime, 'active', false)
  }
  await redis.hmsetAsync('room:' + roomID, roomInfo)
  await redis.lpushAsync('rooms', roomID)
  return roomID
}

module.exports.get = function (roomID) {
  return redis.hgetallAsync('room:' + roomID)
}

module.exports.update = function (roomID, room) {
  const roomInfo = [
    'name',
    room.name,
    'id',
    roomID,
    'creator',
    room.creator,
    'type',
    room.type
  ]
  switch (room.type) {
    case 'hourglass':
      roomInfo.push('time', room.dueTime, 'active', room.active)
  }
  return redis.hmsetAsync('room:' + roomID, roomInfo)
}

module.exports.setTimer = function (roomID, timer) {
  timers[roomID] = timer
}

module.exports.getTimer = function (roomID) {
  return timers[roomID]
}

module.exports.getAll = async function () {
  const roomIDs = await redis.lrangeAsync('rooms', 0, -1)
  return Promise.all(roomIDs.map(roomID => redis.hgetallAsync('room:' + roomID)))
}

module.exports.getUserNum = function (roomID) {
  return redis.llenAsync('room:' + roomID + ':users')
}

module.exports.destroy = async function (roomID) {
  await redis.lremAsync('rooms', 0, roomID)
  await redis.delAsync('room:' + roomID + ':msgs')
  await redis.delAsync('room:' + roomID + ':msg-senders')
  await redis.delAsync('room:' + roomID + ':users')
  return redis.delAsync('room:' + roomID)
}

module.exports.exist = function (roomID) {
  return redis.existsAsync('room:' + roomID)
}

module.exports.addUser = async function (socketID, roomID, userID) {
  const userInfo = [
    'roomID',
    roomID,
    'socketID',
    socketID
  ]
  await redis.hmsetAsync('user:' + userID, userInfo)
  return redis.rpushAsync('room:' + roomID + ':users', userID)
}

module.exports.removeUser = async function (userID) {
  const roomID = await redis.hgetAsync('user:' + userID, 'roomID')
  await redis.delAsync('user:' + userID)
  await redis.lremAsync('room:' + roomID + ':users', 0, userID)
  return roomID
}

module.exports.getUsers = async function (roomID) {
  const userIDs = await redis.lrangeAsync('room:' + roomID + ':users', 0, -1)
  const users = await Promise.all(userIDs.map(userID => User.get(userID)))
  const promises = userIDs.map((userID, index) => redis.hgetAsync('user:' + userID, 'socketID').then(socketID => {
    users[index].socketID = socketID
    return users[index]
  }))

  return Promise.all(promises)
}
module.exports.addMsg = async function (userID, msgBody) {
  const roomID = (await redis.hgetallAsync('user:' + userID)).roomID
  await redis.rpushAsync('room:' + roomID + ':msgs', msgBody)
  return redis.rpushAsync('room:' + roomID + ':msg-senders', userID)
}

module.exports.getAllMsgs = async function (roomID) {
  const msgs = await redis.lrangeAsync('room:' + roomID + ':msgs', 0, -1)
  const msgSenders = await redis.lrangeAsync('room:' + roomID + ':msg-senders', 0, -1)
  const promises = msgs.map((msgBody, index) => User.get(msgSenders[index]).then(user => {
    return {
      'user': user,
      'msgBody': msgBody
    }
  }))
  return Promise.all(promises)
}
