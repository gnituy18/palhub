var client = require('../redis')
module.exports = function(io) {

  var rtc = io.of('/webrtc')
  var hold
  rtc.on('connection', function(socket) {

    console.log(socket.id + ' had connected')

    socket.on('pair', function(info) {


      client.get('hold', function(err, reply) {
        console.log('1. reply: ' + reply)
        if (!reply)
          client.set('hold', socket.id, function() {
            console.log('2. hold is ' + socket.id)
          })
        else if (socket.id != reply) {
          rtc.to(reply).emit('pair', socket.id)
          client.del('hold', function() {
            console.log('2. hold is empty')
          })
        }
      })

    })

    socket.on('pass candidate', function(info) {
      rtc.to(info.socket).emit('get candidate', info.candidate)
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
      rtc.to(info.socket).emit('get answer', info.answer)
      console.log(socket.id + 'pass answer')
    })

    socket.on('disconnect', function() {
      client.get('hold', function(err, reply) {
        if (reply == socket.id)
          client.del('hold', function() {
            console.log('hold is empty')
          })
      })
      console.log(socket.id + ' disconnect')

    })
  })

}
