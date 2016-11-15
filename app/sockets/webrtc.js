var client = require('../redis')
var guard = require('../guards/user')
var logger = require('../logger')

module.exports = function(io) {

  var rtc = io.of('/webrtc')
  rtc.on('connection', function(socket) {

    logger.info('enter: ' + socket.id)

    socket.on('join', function() {
      guard.addUser(socket.id).then(reply => {
        guard.userNum().then(reply => {
          rtc.emit('user number', reply)
        })
      })
    })

    socket.on('pair', function(info) {
      guard.pair(socket.id).then(function(hold) {
        if (hold) {
          rtc.to(hold).emit('pair', socket.id)
        }
      })
    })

    socket.on('pass candidate', function(info) {
      rtc.to(info.socket).emit('get candidate', {
        socket: socket.id,
        candidate: info.candidate
      })
      console.log(socket.id + 'pass candidate')
    })

    socket.on('pass offer', function(info) {
      rtc.to(info.socket).emit('get offer', {
        socket: socket.id,
        offer: info.offer
      })
      console.log(socket.id + 'pass offer')
    })

    socket.on('pass answer', function(info) {
      rtc.to(info.socket).emit('get answer', {
        socket: socket.id,
        answer: info.answer
      })
      console.log(socket.id + 'pass answer')
    })

    socket.on('cancel', function() {
      guard.cancel(socket.id)
    })

    socket.on('disconnect', function() {
      client.get('hold', function(err, reply) {
        if (reply == socket.id)
          client.del('hold', function() {
            console.log('hold is empty')
          })
      })

      guard.removeUser(socket.id).then(reply => {
        guard.userNum().then(reply => {
          rtc.emit('user number', reply)
        })
      })
      logger.info('leave: ' + socket.id)
    })

    socket.on('break connection', function(info) {
      rtc.to(info.socket).emit('break connection')
      logger.info('break: ' + socket.id)
    })

    socket.on('pass user info', function(data) {
      socket.to(data.socket).emit('get user info', data.info)
      console.log(data)
    })
  })

}
