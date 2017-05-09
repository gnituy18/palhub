import {socket} from './../socketio'

const peerConfig = {
  'iceServers': [{
    'urls': [
      'stun:stun.l.google.com:19302',
      'stun:stun1.l.google.com:19302',
      'stun:stun2.l.google.com:19302',
      'stun:stun3.l.google.com:19302',
      'stun:stun4.l.google.com:19302',
      'stun:stun.ekiga.net',
      'stun:stun.ideasip.com',
      'stun:stun.rixtelecom.se',
      'stun:stun.schlund.de',
      'stun:stun.stunprotocol.org:3478',
      'stun:stun.voiparound.com',
      'stun:stun.voipbuster.com',
      'stun:stun.voipstunt.com',
      'stun:stun.voxgratia.org'
    ]
  }]
}
const pcs = {}

socket.on('get offer', async function (data) {
  console.log('get offer')
  const pc = pcs[data.id]
  await pc.setRemoteDescription(data.offer)
  const answer = await pc.createAnswer()
  await pc.setLocalDescription(answer)
  socket.emit('pass answer', {
    'id': data.id,
    'answer': pc.localDescription
  })
})

socket.on('get answer', function (data) {
  console.log('get asnwer')
  pcs[data.id].setRemoteDescription(data.answer)
})

socket.on('get candidate', function (data) {
  console.log('get candidate')
  pcs[data.id].addIceCandidate(data.candidate)
  .then(function () {
    console.log('success')
  }, function () {
    console.log('fail')
  })
})

async function pair (socketId) {
  console.log('pair: ' + socketId)
  const pc = pcs[socketId]
  const offer = await pc.createOffer()
  await pc.setLocalDescription(offer)
  socket.emit('pass offer', {
    'id': socketId,
    'offer': pc.localDescription
  })
}

function createNewPcTo (socketId) {
  console.log('new pc: ' + socketId)
  return Promise.resolve(socketId).then(socketId => {
    pcs[socketId] = new RTCPeerConnection(peerConfig)
    pcs[socketId].id = socketId
    pcs[socketId].onicecandidate = passCandidate
    return pcs[socketId]
  })
}

function passCandidate (e) {
  if (!e.candidate) {
    return null
  }
  socket.emit('pass candidate', {
    'id': this.id,
    'candidate': e.candidate
  })
}

export {pair, createNewPcTo}
