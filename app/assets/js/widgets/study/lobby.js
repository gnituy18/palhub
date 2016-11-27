(function() {

  var study = require('socket.io-client')('/study')

  function init() {

    study.on('tables', function(tables) {
      console.log(tables)
      var str = ''
      for (var x in tables) {
        str += '<a class="study-table shadow-gray" href="/study/' + tables[x].id + '"><div >' + tables[x].subject + '</div></a><br>'
      }
      if (str == '')
        str = '<h1 class="font-gray">目前沒有人開設書桌</h1>'
      $('#tables').html(str)
    })

    study.emit('tables')
  }

  window.onload = function() {
    init()
  }

})()
