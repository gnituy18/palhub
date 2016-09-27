(function() {

  var rtc = require('socket.io-client')('/webrtc')
  var audioSelf = document.getElementById('audio-self')
  var audioPal = document.getElementById('audio-pal')
  var buttonPair = document.createElement('button')
  var buttonLeave = document.createElement('button')
  var control = document.getElementById('control')
  var $ = require('jquery')


  var pc
  var constraints = {
    audio: true,
    video: false
  }
  var localStream
  var pair
  var info

  function init() {
    info = {
      name: document.getElementById('name').innerHTML,
      gender: document.getElementById('gender').innerHTML,
      intro: document.getElementById('intro').innerHTML
    }

    console.log(info)

    //Local stream
    navigator.mediaDevices.getUserMedia(constraints)
      .then(setupLocalStream)
      .then(() => {
        buttonPair.id = 'button-pair'
        buttonPair.className = 'btn'
        buttonPair.innerHTML = 'Chat'
        buttonPair.onclick = function() {
          disableButton(buttonPair)
          setupPc()
          connectPeer()
        }
        buttonLeave.id = 'button-leave'
        buttonLeave.className = 'btn'
        buttonLeave.innerHTML = 'Leave'
        buttonLeave.onclick = function() {
          breakConnection()
          disablePeer()
          disableButton(buttonLeave)
          enableButton(buttonPair)
          removeUserInfo()
        }
        rtc.on('pair', offering)
        rtc.on('get offer', answering)
        rtc.on('get answer', finishing)
        rtc.on('get candidate', setCandidate)
        rtc.on('get user info', getUserInfo)
        rtc.on('break connection', function() {
          disablePeer()
          disableButton(buttonLeave)
          enableButton(buttonPair)
          removeUserInfo()
          console.log('break')
        })
      })
      .then(() => {
        enableButton(buttonPair)
        console.log('Done init.')
      })
      .catch(err => {
        console.log(err)
      })
  }

  //Setup components
  function disableButton(btn) {
    btn.remove()
  }

  function enableButton(btn) {
    control.appendChild(btn)
  }

  function connectPeer() {
    rtc.emit('pair')
  }

  function disablePeer() {
    pc.close()
    pair = null
    console.log('leave')
  }

  //Local stream
  function setupLocalStream(stream) {
    localStream = stream
    audioSelf.src = window.URL.createObjectURL(stream)
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
    } else {
      rtc.emit('pass candidate', {
        socket: pair,
        candidate: e.candidate
      })
    }
  }

  function addStream(e) {
    audioPal.src = window.URL.createObjectURL(e.stream)
  }

  function handleStateChange(event) {
    switch (pc.iceConnectionState) {
      case 'disconnected':
        buttonLeave.click()
        break
      case 'connected':
        enableButton(buttonLeave)
        transferUserInfo()
        break
    }
    console.log(pc.iceConnectionState)
  }

  function transferUserInfo() {
    rtc.emit('pass user info', {
      socket: pair,
      info: info
    })
  }

  function getUserInfo(info) {
    document.getElementById('pal').innerHTML = info.name
  }

  function removeUserInfo() {
    document.getElementById('pal').innerHTML = null
  }

  function breakConnection() {
    rtc.emit('break connection', {
      socket: pair
    })
  }

  window.onload = function() {
    init()
  }


})()
