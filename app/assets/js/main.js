(function() {

  var rtc = require('socket.io-client')('/webrtc')
  var videoSelf = document.getElementById('video-self')
  var videoPal = document.getElementById('video-pal')
  var buttonPair = document.getElementById('button-pair')
  var buttonLeave = document.getElementById('button-leave')
  var pc
  var constraints = {
    audio: false,
    video: true
  }
  var localStream
  var pair

  function init() {
    //Setup components
    buttonPair.onclick = connectPeer
    buttonLeave.onclick = leavePeer

    //Local stream
    navigator.mediaDevices.getUserMedia(constraints)
      .then(setupLocalStream)
      .catch(err => {
        console.log(err)
      })
    rtc.on('pair', offering)
    rtc.on('get offer', answering)
    rtc.on('get answer', finishing)
    rtc.on('get candidate', setCandidate)
    console.log('setuped')
  }

  //Setup components
  function connectPeer() {
    setupPc()
    rtc.emit('pair')
  }

  function leavePeer() {
    pc.close()
    pc = null
    pair = null
    setupPc()
    console.log('leave')
  }

  //Local stream
  function setupLocalStream(stream) {
    localStream = stream
    videoSelf.src = window.URL.createObjectURL(stream)
  }

  // RTC
  function offering(id) {
    pair = id
    pc.createOffer()
      .then(offer => pc.setLocalDescription(offer))
      .then(() => {
        rtc.emit('pass offer', {
          socket: id,
          offer: pc.localDescription
        })
      })
  }

  function answering(info) {
    pair = info.socket
    console.log(info)
    pc.setRemoteDescription(info.offer)
      .then(() => pc.createAnswer())
      .then(answer => pc.setLocalDescription(answer))
      .then(() => {
        rtc.emit('pass answer', {
          socket: info.socket,
          answer: pc.localDescription
        })
      })
  }

  function finishing(answer) {
    pc.setRemoteDescription(answer)
    console.log(answer)
  }

  function setCandidate(candidate) {
    pc.addIceCandidate(candidate)
    console.log(candidate)
  }

  //New peer connection
  function setupPc() {
    pc = new RTCPeerConnection()
    pc.onicecandidate = passCandidate
    pc.onaddstream = addStream
    pc.oniceconnectionstatechange = handleStateChange
    pc.addStream(localStream)
  }

  function passCandidate(e) {
    if (!e.candidate) {
      return null
    } else
    rtc.emit('pass candidate', {
      socket: pair,
      candidate: e.candidate
    })
  }

  function addStream(e) {
    videoPal.src = window.URL.createObjectURL(e.stream)
  }

  function handleStateChange(event) {
    switch (pc.iceConnectionState) {
      case 'disconnected':
        leavePeer()
        console.log(pc.iceConnectionState)
        break
      default:
        console.log(pc.iceConnectionState)
    }
  }

  window.onload = function() {
    init()
  }
})()
