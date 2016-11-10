(function() {

  var study = require('socket.io-client')('/study')
  var $ = require('jquery')

  function init() {
    var tableId = $('#tableid').html()
    study.emit('join table', tableId)
  }

  window.onload = function() {
    init()
  }

})()
