(function() {
  var study = require('socket.io-client')('/study')
  var rtc = require('./../../libs/webrtc')
  var tab = require('./../../libs/tabs')
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
      gender: $('#user-gender').html(),
      id: ''
    }


    console.log(user)
    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        localStream = stream
        audioUser.src = window.URL.createObjectURL(stream)
      })
      .then(() => {

        $('#mic').click(function() {
          if (localStream.getTracks()[0].enabled) {
            $('#mic').removeClass('fa-microphone').addClass('fa-microphone-slash')
          } else {
            $('#mic').removeClass('fa-microphone-slash').addClass('fa-microphone')
          }
          localStream.getTracks()[0].enabled = !(localStream.getTracks()[0].enabled)
        })

        study.on('join', function(id) {
          user.id = id
          console.log('join table ' + tableId)
          study.emit('get users')
        })

        study.on('get users', function(users) {
          var id = user.id
          Promise.resolve(users)
            .then(users => {
              console.log(users)
              var ids = []
              var str = '<script>function micswitch(id){var muted = document.getElementById(id).muted;if(muted){document.getElementById("mic-"+id).className = "side-nav-user-mic";}else {document.getElementById("mic-"+id).className += " off";}document.getElementById(id).muted = !muted;}</script>'

              for (var x in users) {
                ids.push(x)
                console.log('id: ' + id)
                if (x != id)
                  str += '<div class="side-nav-user-card"><div style="background-image:url(\/img\/' + users[x].gender + '.png);" class="side-nav-user-avatar"><div onclick=\'micswitch("' + x + '")\' class="side-nav-user-mic" id="mic-' + x + '"></div></div><div class="side-nav-user-info"><div class="side-nav-user-name">' + users[x].name + '</div><div>' + users[x].intro + '</div></div></div>'
                else
                  str += '<div class="side-nav-user-card"><div style="background-image:url(\/img\/' + users[x].gender + '.png);" class="side-nav-user-avatar"></div><div class="side-nav-user-info"><div class="side-nav-user-name">' + users[x].name + '</div><div>' + users[x].intro + '</div></div></div>'
              }
              return {
                ids: ids,
                str: str
              }
            })
            .then(data => {
              $('#pals').html(data.str)
              return data.ids
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
        break
    }
  }


  window.onload = function() {
    tab.checkMultiTabs()

    setTimeout(function() {
      console.log(tab.isMultiTab())
      if (tab.isMultiTab() == null) {
        init()
      }
    }, 300)
  }

})()
