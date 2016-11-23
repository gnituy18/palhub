(function() {
  var study = require('socket.io-client')('/study')
  var rtc = require('./../../libs/webrtc')
  var constraints = {
    audio: true,
    video: false
  }

  var audioUser = document.getElementById('audio-user')
  var localStream
  var palIds

  function init() {

    var tableId = $('#tableid').html()
    var user = {
      name: $('#user-name').html(),
      intro: $('#user-intro').html(),
      gender: $('#user-gender').html()
    }

    console.log(user)
    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        localStream = stream
        audioUser.src = window.URL.createObjectURL(stream)
      })
      .then(() => {

        study.on('join', function() {
          console.log('join table ' + tableId)
        })

        study.on('get users', function(users) {
          Promise.resolve(users)
            .then(users => {
              var ids = []
              for (var x in users) {
                ids.push(x)
              }
              return ids
            })
            .then(ids => {
              console.log(ids)
            })
        })

        study.on('pal leave', function(pal) {
          rtc.break(pal)
            .then(() => {
              console.log(pal)
              document.getElementById(pal).remove()
            })
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
        study.emit('join', {
          tableId: tableId,
          user: user
        })
      })
  }

  function addStream(e) {
    var audio = document.createElement('audio')
    audio.setAttribute('autoplay', '')
    audio.id = this.palId.replace(/\/[a-z0-9]*#/, '/study#')
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
