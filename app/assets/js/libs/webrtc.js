var webrtc = require('socket.io-client')('/webrtc')
var peerConfig = {
  iceServers: [{
    urls: [
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
var pcs = {}

webrtc.on('get offer', function(info) {
  console.log(info + 'get offer')
  var pc = pcs[info.socket]
  pc.setRemoteDescription(info.offer)
    .then(() => pc.createAnswer())
    .then(answer => pc.setLocalDescription(answer))
    .then(() => {
      webrtc.emit('pass answer', {
        socket: info.socket,
        answer: pc.localDescription
      })
    })
    .catch(showError)
})

webrtc.on('get answer', function(info) {
  pcs[info.socket].setRemoteDescription(info.answer)
  console.log('get answer: ' + info)
})

webrtc.on('get candidate', function(info) {
  pcs[info.socket].addIceCandidate(info.candidate)
})

module.exports.newPc = newPc

module.exports.getPc = function(socketId) {
  return pcs[toWebrtcId(socketId)]
}

module.exports.pair = function(socketId) {
  var webrtcId = toWebrtcId(socketId)
  var pc = pcs[webrtcId]
  console.log(pc)
  pc.createOffer()
    .then(offer => pc.setLocalDescription(offer))
    .then(() => {
      webrtc.emit('pass offer', {
        socket: webrtcId,
        offer: pc.localDescription
      })
    })
    .then(() => {
      console.log(pc.localDescription)
    })
    .catch(showError)
}

function showError(err) {
  console.log(err)
}

function toWebrtcId(socketId) {
  return socketId.replace(/\/[a-z0-9]*#/, '/webrtc#')
}

function newPc(socketId) {
  return Promise.resolve(toWebrtcId(socketId))
    .then(socketId => {
      pcs[socketId] = new RTCPeerConnection(peerConfig)
      pcs[socketId].palId = socketId
      pcs[socketId].onicecandidate = passCandidate
      pcs[socketId].oniceconnectionstatechange = function(event) {
        console.log('state change: ' + this.iceConnectionState)
        switch (this.iceConnectionState) {
          case 'connected':
            console.log('connected!!')
        }
      }
    })
}

function passCandidate(e) {
  if (!e.candidate) {
    return null
  } else {
    webrtc.emit('pass candidate', {
      socket: this.palId,
      candidate: e.candidate
    })
  }
  console.log('pass candidate: ' + e.candidate)
}

function setCandidate(candidate) {
  pc.addIceCandidate(candidate)
}
