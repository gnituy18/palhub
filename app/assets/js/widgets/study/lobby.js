(function() {

  var study = require('socket.io-client')('/study')

  function init() {

    study.on('tables', function(tables) {
      console.log(tables)
      var str = ''
      for (var x in tables) {
        str += '<a href="/study/' + tables[x].id + '">' + tables[x].subject + '</a><br>'
      }
      $('#tables').html(str)
    })

    study.emit('tables')
  }

  window.onload = function() {
    init()
  }

})()
