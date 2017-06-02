module.exports = function (io) {
  const webrtc = io.of('/webrtc')
  webrtc.on('connection', function (socket) {
    socket.on('pass offer', function (data) {
      webrtc.to(data.id).emit('get offer', {
        'id': socket.id,
        'offer': data.offer
      })
    })

    socket.on('pass answer', function (data) {
      webrtc.to(data.id).emit('get answer', {
        'id': socket.id,
        'answer': data.answer
      })
    })


    socket.on('pass candidate', function (data) {
      webrtc.to(data.id).emit('get candidate', {
        'id': socket.id,
        'candidate': data.candidate
      })
    })
  })
}

