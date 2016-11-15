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
        Promise.all([
            studyGuard.leaveTable(tableInfo.id, socket.id),
            userGuard.leaveTable(socket.id)
          ])
          .then(replies => {
            return studyGuard.tableEmpty(tableInfo.id)
          })
          .then(empty => {
            if (empty)
              return studyGuard.removeTable(tableInfo.id)
          })
          .then(reply => {
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

    socket.on('join', function(tableId) {

      socket.join(tableId)
      tableInfo.id = tableId

      Promise.all([
          studyGuard.joinTable(tableId, socket.id),
          userGuard.joinTable(tableId, socket.id)
        ])
        .then(values => {
          console.log('join table: ' + values)
          return studyGuard.getTables()
        })
        .then(reply => {
          study.emit('tables', reply)
          study.to(socket.id).emit('join')
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

  })

}
