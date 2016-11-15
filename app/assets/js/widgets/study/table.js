(function() {
  var study = require('socket.io-client')('/study')
  var $ = require('jquery')
  var rtc = require('./../../libs/webrtc')
  var constraints = {
    audio: true,
    video: false
  }

  var audioUser = document.getElementById('audio-user')
  var audioPal = document.getElementById('audio-pal')

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
          rtc.newPc(palId)
            .then(() => {
              rtc.getPc(palId).onaddstream = addStream
              rtc.getPc(palId).addStream(localStream)
            })
            .then(() => {
              study.emit('set pc', palId)
              console.log('set pc')
            })
        })

        study.on('set pc', function(palId) {
          rtc.newPc(palId)
            .then(() => {
              rtc.getPc(palId).onaddstream = addStream
              rtc.getPc(palId).addStream(localStream)
            })
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
  window.onload = function() {
    init()
  }

})()
