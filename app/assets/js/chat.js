(function() {

  var rtc = require('socket.io-client')('/webrtc')
  var $ = require('jquery')
  var audioSelf = document.getElementById('audio-self')
  var audioPal = document.getElementById('audio-pal')
  var buttonPair = document.createElement('button')
  var buttonLeave = document.createElement('button')
  var control = document.getElementById('control')


  var pc
  var peerConfig = {
    iceServers: [{
      url: 'stun:stun.l.google.com:19302'
    }, {
      url: 'stun:stun1.l.google.com:19302'
    }, {
      url: 'stun:stun2.l.google.com:19302'
    }, {
      url: 'stun:stun3.l.google.com:19302'
    }, {
      url: 'stun:stun4.l.google.com:19302'
    }]
  }
  var constraints = {
    audio: true,
    video: false
  }
  var localStream
  var pair
  var info
  var multiTabFlag

  function init() {

    if (multiTabFlag)
      return

    info = {
      name: $('#name').text(),
      gender: $('#gender').text(),
      intro: $('#intro').text()
    }

    console.log(info)

    //Local stream
    navigator.mediaDevices.getUserMedia(constraints)
      .then(setupLocalStream)
      .catch(err => {
        alertMsg('你的麥克風未開啟')
        throw err
      })
      .then(() => {
        buttonPair.id = 'button-pair'
        buttonPair.className = 'btn'
        buttonPair.innerHTML = '配對'
        buttonPair.onclick = function() {
          disableButton(buttonPair)
          displayLoading()
          setupPc()
          connectPeer()
        }
        buttonLeave.id = 'button-leave'
        buttonLeave.className = 'btn'
        buttonLeave.innerHTML = '離開'
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
        rtc.on('get user info', function(info) {
          displayUserInfo(info)
        })
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

  //Check multi-tabs
  function checkMultiTabs() {
    if (!multiTabFlag) {
      console.log('Send getTab event.')
      localStorage.setItem('getTab', Date.now())
    }
  }

  //Setup components
  function disableButton(btn) {
    btn.remove()
  }

  function enableButton(btn) {
    control.appendChild(btn)
  }

  //Trigger RTC handshaking
  function connectPeer() {
    rtc.emit('pair')
  }

  //kill peer
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

  //RTC handshaking
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
    pc = new RTCPeerConnection(peerConfig)
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
        killLoading()
        break
    }
    console.log(pc.iceConnectionState)
  }

  //User information
  function transferUserInfo() {
    rtc.emit('pass user info', {
      socket: pair,
      info: info
    })
  }

  function displayUserInfo(info) {
    $('#pal').html('<div class=\'pal-avatar\' style=\'background-image:url(\/img\/' + info.gender + '.png);\'></div><div class=\'pal-info\'><div class=\'pal-name\'>' + info.name + '</div><div class=\'pal-intro\'>' + info.intro + '</div></div>')
  }

  function removeUserInfo() {
    $('#pal').html('<div class=\'not-found\'>現在這裡沒有人</div>')
  }

  //kill connection
  function breakConnection() {
    rtc.emit('break connection', {
      socket: pair
    })
  }

  function alertMsg(msg) {
    $('#control').html('<div class=\'alert\'><p>' + msg + '</p></div>')
  }

  function displayLoading() {
    $('#control').html('<div class=\'loading\' id=\'loading\'>等待中...</div>')
  }

  function killLoading() {
    $('#loading').html('')
  }

  window.onload = function() {
    checkMultiTabs()
    setTimeout(init, 300)
  }

  window.onbeforeunload = function() {
    localStorage.clear()
  }

  window.addEventListener('storage', function(event) {
    switch (event.key) {
      case 'getTab':
        if (!multiTabFlag) {
          console.log('getTab event')
          localStorage.setItem('tab', 'I\'m the first tab.')
          localStorage.removeItem('tab')
        }
        break
      case 'tab':
        console.log('tab event')
        if (!multiTabFlag) {
          multiTabFlag = true;
          alertMsg('你有一個聊天室已經開啟')
        }
        console.log('This is not the first tab.')
        break
    }
  })

})()
