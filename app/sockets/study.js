var studyGuard = require('../guards/study')
var userGuard = require('../guards/user')

module.exports = function(io) {

  var study = io.of('/study')

  study.on('connection', function(socket) {

    var tableInfo = {
      id: null,
      name: null
    }

    socket.on('tables', function() {
      studyGuard.getTables().then(reply => {
        socket.emit('tables', reply)
      })
    })

    socket.on('disconnect', function() {
      if (tableInfo.id) {
        study.to(tableInfo.id).emit('pal leave', socket.id)
        studyGuard.leaveTable(tableInfo.id, socket.id)
          .then(reply => {
            return studyGuard.removeUser(socket.id)
          })
          .then(reply => {
            return studyGuard.tableEmpty(tableInfo.id)
          })
          .then(empty => {
            if (empty)
              return studyGuard.removeTable(tableInfo.id)
                .then(() => {
                  throw 'Table empty'
                })

          })
          .then(() => {
            return studyGuard.getTableUsers(tableInfo.id)
          })
          .then(users => {
            study.to(tableInfo.id).emit('get users', users)
          })
          .catch(err => {
            console.log(err)
          })
          .then(() => {
            return studyGuard.getTables()
          })
          .then(reply => {
            study.emit('tables', reply)
          })
          .catch(error => {
            console.log(error)
          })
      }
    })

    socket.on('join', function(info) {
      var tableId = info.tableId
      var user = info.user
      socket.join(tableId)
      tableInfo.id = tableId

      studyGuard.addUser(socket.id, info.user)
        .then(reply => {
          return studyGuard.joinTable(tableId, socket.id)
        })
        .then(() => {
          return studyGuard.getTables()
        })
        .then(reply => {
          study.emit('tables', reply)
          study.to(socket.id).emit('join', socket.id)
          socket.broadcast.to(tableInfo.id).emit('pal join', socket.id)
        })
        .catch(error => {
          console.log(error)
          study.to(socket.id).emit('error', error)
        })
    })

    socket.on('set pc', function(socketId) {
      study.to(socketId).emit('set pc', socket.id)
    })

    socket.on('get users', function() {
      studyGuard.getTableUsers(tableInfo.id)
        .then(users => {
          study.to(tableInfo.id).emit('get users', users)
        })
    })

  })

}
