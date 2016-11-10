(function() {

  var study = require('socket.io-client')('/study')
  var $ = require('jquery')

  function init() {

    study.on('tables', function(tables) {
      console.log(tables)
      var str = ''
      for (var x in tables) {
        str += '<a href="/study/' + tables[x] + '">' + tables[x] + '</a><br>'
      }
      $('#tables').html(str)
    })

    study.emit('tables')
  }

  window.onload = function() {
    init()
  }

})()
