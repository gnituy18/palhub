var multiTabFlag

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
        $('#content').html('<div class=\'alert\'><p>你有其他分頁已經與其他人建立連線，請關閉此分頁。</p></div>')
      }
      console.log('This is not the first tab.')
      break
  }
})

module.exports.isMultiTab = function() {
  return multiTabFlag
}

module.exports.checkMultiTabs = function() {
  if (!multiTabFlag) {
    console.log('Send getTab event.')
    localStorage.setItem('getTab', Date.now())
  }
}
