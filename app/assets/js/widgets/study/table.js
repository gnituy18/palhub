(function() {
  var study = require('socket.io-client')('/study')
  var $ = require('jquery')
  var rtc = require('./../../libs/webrtc')
  var constraints = {
    audio: true,
    video: false
  }

  var audioUser = document.getElementById('audio-user')
  var localStream

  function init() {

    var tableId = $('#tableid').html()

    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        localStream = stream
        audioUser.src = window.URL.createObjectURL(stream)
      })
      .then(() => {

        study.on('join', function() {
          console.log('join table ' + tableId)
        })

        study.on('pal leave', function(pal) {
          console.log(pal + ' leave.')
        })

        study.on('pal join', function(palId) {
          console.log(palId + ' join.')
          newPc(palId)
            .then(() => {
              study.emit('set pc', palId)
              console.log('set pc')
            })
        })

        study.on('set pc', function(palId) {
          newPc(palId)
            .then(() => {
              rtc.pair(palId)
              console.log(palId + ' call to set pc')
            })
        })

      })
      .then(() => {
        study.emit('join', tableId)
      })
  }

  function addStream(e) {
    var audio = document.createElement('audio')
    audio.setAttribute('autoplay', '')
    audio.id = this.palId
    audio.src = window.URL.createObjectURL(e.stream)
    document.getElementById('pal-audios').appendChild(audio)
  }

  function newPc(socketId) {
    return rtc.newPc(socketId)
      .then(() => {
        rtc.getPc(socketId).onaddstream = addStream
        rtc.getPc(socketId).addStream(localStream)
        rtc.getPc(socketId).oniceconnectionstatechange = handelStateChange
      })
  }

  function handelStateChange(event) {
    console.log('state change: ' + this.iceConnectionState)
    switch (this.iceConnectionState) {
      case 'connected':
        console.log('connected!!')
    }
  }


  window.onload = function() {
    init()
  }

})()
