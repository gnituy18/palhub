let multiTabFlag = false

window.addEventListener('storage', function (event) {
  switch (event.key) {
    case 'getTab':
      if (!multiTabFlag) {
        console.log('getTab event')
        localStorage.setItem('tab', 'I\'m the first tab.')
        localStorage.removeItem('tab')
      }
      break
    case 'tab':
      if (!multiTabFlag) {
        multiTabFlag = true
      }
      break
  }
})

function checkMultiTabs () {
  localStorage.setItem('getTab', Date.now())
  return new Promise(resolve => {
    setTimeout(function () {
      if (multiTabFlag) {
        resolve(true)
      } else {
        resolve(false)
      }
    }, 300)
  })
}

export {checkMultiTabs}
