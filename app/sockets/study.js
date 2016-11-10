var studyGuard = require('../guards/study')
var userGuard = require('../guards/user')

module.exports = function(io) {

  var study = io.of('/study')

  study.on('connection', function(socket) {

    socket.on('tables', function() {
      studyGuard.getTables().then(reply => {
        socket.emit('tables', reply)
      })
    })

    socket.on('disconnect', function() {
      var tableId
      userGuard.getUserTable(socket.id)
        .then(reply => {
          if (!reply)
            throw 'Not in room'
          tableId = reply
          return Promise.all([
            studyGuard.leaveTable(tableId, socket.id),
            userGuard.leaveTable(socket.id)
          ])
        })
        .then(values => {
          return studyGuard.tableEmpty(tableId)
        })
        .then(empty => {
          if (empty)
            return studyGuard.removeTable(tableId)
        })
        .then(r => {
          return studyGuard.getTables()
        })
        .then(reply => {
          study.emit('tables', reply)
        })
        .catch(e => {
          console.log(e)
        })

    })

    socket.on('join table', function(tableId) {
      Promise.all([
          studyGuard.joinTable(tableId, socket.id),
          userGuard.joinTable(tableId, socket.id)
        ])
        .then(values => {
          console.log('join table: ' + values)
          return studyGuard.getTables()
        }).then(reply => {
          study.emit('tables', reply)
        })

    })
  })

}
