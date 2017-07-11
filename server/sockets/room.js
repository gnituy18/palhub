const guard = require('../guards')
const User = require('../models/user')

module.exports = function (io) {
  const room = io.of('/room')
  const lobby = io.of('/lobby')

  room.on('connection', function (socket) {
    socket.on('setup pc', function (data) {
      room.to(data.socketID).emit('setup pc', {
        'id': socket.id,
        'micPermission': data.micPermission
      })
    })

    socket.on('send msg', async function (data) {
      const userID = await guard.user.getIdBySocketId(socket.id)
      await guard.room.addMsg(userID, data.msgBody)
      const roomID = (await guard.user.get(userID)).roomID
      const user = await User.get(userID)
      room.to(roomID).emit('get msg', {
        'user': user,
        'msgBody': data.msgBody
      })
    })

    socket.on('join room', async function (data) {
      const roomObject = await guard.room.get(data.roomID)
      switch (roomObject.type) {
        case 'hourglass': {
          const dueTime = parseInt(roomObject.dueTime)
          const time = dueTime - Date.now()

          // Active timer if first user enter the room.
          if (roomObject.active === 'false') {
            roomObject.active = true
            await guard.room.update(data.roomID, roomObject)
            const timer = setTimeout(function () {
              guard.room.destroy(data.roomID)
              room.to(data.roomID).emit('kick')
            }, time)
            guard.room.setTimer(data.roomID, timer)
          }
          room.to(socket.id).emit('get due time', dueTime)
        }
      }
      await guard.user.setSocketId(data.userID, socket.id)
      await guard.room.addUser(socket.id, data.roomID, data.userID)
      const users = await guard.room.getUsers(data.roomID)
      const rooms = await guard.room.getAll()
      const msgs = await guard.room.getAllMsgs(data.roomID)
      if (data.userID === roomObject.creator) {
        room.to(socket.id).emit('is creator')
      }
      socket.join(data.roomID)
      lobby.emit('get rooms', {'rooms': rooms})
      room.to(socket.id).emit('get msgs', {'msgs': msgs})
      room.to(socket.id).emit('get users', {'users': users})
      socket.broadcast.to(data.roomID).emit('get new user', {'user': users[users.length - 1]})
    })

    socket.on('delete room', async function () {
      const userID = await guard.user.getIdBySocketId(socket.id)
      const user = await guard.user.get(userID)
      if (userID === (await guard.room.get(user.roomID)).creator) {
        console.log(userID + 'DELETE')
        guard.room.destroy(user.roomID)
        room.to(user.roomID).emit('kick')
      }
    })

    socket.on('disconnect', async function () {
      const userID = await guard.user.getIdBySocketId(socket.id)
      const roomID = await guard.room.removeUser(userID)

      setTimeout(async function () {
        if (await guard.room.getUserNum(roomID) === 0 && (await guard.room.get(roomID)).type === 'regular') {
          await guard.room.destroy(roomID)
          const rooms = await guard.room.getAll()
          lobby.emit('get rooms', {'rooms': rooms})
        }
      }, 2000)
      await guard.user.deleteSocketId(socket.id)
      room.to(roomID).emit('remove user', {'socketID': socket.id})
    })
  })
}
