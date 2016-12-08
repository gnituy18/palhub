(function() {
  var tab = require('./../../libs/tabs')

  function init() {
    $('#content').html('<h1>告訴大家你們這桌在做什麼吧！</h1><form method="post"><div class="cont"><span>主題 </span><input class="form-text" id="subject" type="text" name="subject"></div><input class="btn" id="new" type="submit" value="確認"></form>')
  }


  window.onload = function() {
    tab.checkMultiTabs()

    setTimeout(function() {
      if (tab.isMultiTab() == null) {
        init()
      }
    }, 300)
  }
})()
