(function() {

  var rtc = require('socket.io-client')('/webrtc')
  var $ = require('jquery')
  var audioSelf = document.getElementById('audio-self')
  var audioPal = document.getElementById('audio-pal')
  var buttonPair = document.createElement('button')
  var buttonLeave = document.createElement('button')
  var buttonCancel = document.createElement('button')
  var control = document.getElementById('control')

  var pc
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
  var constraints = {
    audio: true,
    video: false
  }
  var localStream
  var palSocketId
  var userInfo
  var multiTabFlag
  var reconnectFlag

  function init() {

    userInfo = {
      name: $('#name').text(),
      gender: $('#gender').text(),
      intro: $('#intro').text()
    }

    if (multiTabFlag)
      return
    else if (navigator.userAgent.indexOf("Safari") != -1 && navigator.userAgent.indexOf("Chrome") < 0) {
      alertMsg('Safari 目前並不支援，請改用其他瀏覽器。')
      return
    } else {
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
            clearControl()
            boardMsg('等待中...')
            setupPc()
            makeConnection()
            enableButton(buttonCancel)
          }
          buttonLeave.id = 'button-leave'
          buttonLeave.className = 'btn'
          buttonLeave.innerHTML = '離開'
          buttonLeave.onclick = function() {
            clearControl()
            breakConnection()
            closePc()
            boardMsg('按下配對開始聊天')
            enableButton(buttonPair)
          }
          buttonCancel.id = 'button-cancel'
          buttonCancel.className = 'btn'
          buttonCancel.innerHTML = '取消'
          buttonCancel.onclick = function() {
            clearControl()
            rtc.emit('cancel')
            boardMsg('按下配對開始聊天')
            enableButton(buttonPair)
          }

          rtc.on('pair', function(socketId) {
            reconnectFlag = true
            offering(socketId)
          })
          rtc.on('get offer', answering)
          rtc.on('get answer', finishing)
          rtc.on('get candidate', setCandidate)
          rtc.on('get user info', function(info) {
            displayPalInfo(info)
          })
          rtc.on('break connection', function() {
            closePc()
            clearControl()
            enableButton(buttonPair)
            boardMsg('按下配對開始聊天')
            console.log('break connection')
          })
          rtc.on('user number', function(number) {
            $('#num').text(number)
            console.log('user: ' + number)
          })
          $('.nav-element').click(function() {
            if (palSocketId)
              return confirm('現在離開會導致聊天中斷！\n你確定要離開嗎？')
          })
        })
        .then(() => {
          enableButton(buttonPair)
          rtc.emit('join')
          console.log('Done init.')
        })
        .catch(err => {
          console.log('Init failed: ' + err)
        })
    }
  }

  //Check multi-tabs
  function checkMultiTabs() {
    if (!multiTabFlag) {
      console.log('Send getTab event.')
      localStorage.setItem('getTab', Date.now())
    }
  }

  //Components
  function disableButton(btn) {
    btn.remove()
  }

  function enableButton(btn) {
    control.appendChild(btn)
  }

  function clearControl() {
    $('#control').html('')
  }

  function alertMsg(msg) {
    $('#control').html('<div class=\'alert\'><p>' + msg + '</p></div>')
  }

  function boardMsg(msg) {
    $('#pal').html('<div class=\'not-found\'>' + msg + '</div>')
  }

  //Local stream
  function setupLocalStream(stream) {
    localStream = stream
    audioSelf.src = window.URL.createObjectURL(stream)
  }

  //RTC handshaking
  function makeConnection() {
    rtc.emit('pair')
  }

  function breakConnection() {
    rtc.emit('break connection', {
      socket: palSocketId
    })
  }

  function offering(id) {
    palSocketId = id
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
    palSocketId = info.socket
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

  function finishing(info) {
    pc.setRemoteDescription(info.answer)
  }

  function setCandidate(info) {
    pc.addIceCandidate(info.candidate)
  }

  function passCandidate(e) {
    if (!e.candidate) {
      return null
    } else {
      rtc.emit('pass candidate', {
        socket: palSocketId,
        candidate: e.candidate
      })
    }
  }

  //Peer connection
  function setupPc() {
    pc = new RTCPeerConnection(peerConfig)
    pc.onicecandidate = passCandidate
    pc.onaddstream = addStream
    pc.oniceconnectionstatechange = handleStateChange
    pc.addStream(localStream)
  }

  function closePc() {
    pc.close()
    palSocketId = null
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
        clearControl()
        enableButton(buttonLeave)
        transferUserInfo()
        break
      case 'failed':
        clearControl()
        boardMsg('連線出現問題，正在重新連線...')
        setupPc()
        setTimeout(() => {
          offering(palSocketId)
        }, 1000)
        break
    }
    console.log('Ice candidate state: ' + pc.iceConnectionState)
  }

  //User information
  function transferUserInfo() {
    rtc.emit('pass user info', {
      socket: palSocketId,
      info: userInfo
    })
  }

  function displayPalInfo(info) {
    $('#pal').html('<div class=\'pal-avatar\' style=\'background-image:url(\/img\/' + escapeHtml(info.gender) + '.png);\'></div><div class=\'pal-info\'><div class=\'pal-name\'>' + escapeHtml(info.name) + '</div><div class=\'pal-intro\'>' + escapeHtml(info.intro) + '</div></div>')
  }

  //Helpers
  function escapeHtml(string) {
    var entityMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;',
      '`': '&#x60;',
      '=': '&#x3D;'
    };
    return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap(s) {
      return entityMap[s];
    });
  }

  window.onload = function() {
    checkMultiTabs()
    setTimeout(init, 300)
  }

  window.onbeforeunload = function() {
    breakConnection()
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
