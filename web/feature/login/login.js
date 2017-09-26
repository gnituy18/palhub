import * as fb from '../../lib/facebook'

const fbBtn = document.getElementsByClassName('fb-login-button')[0]

fb.init()
.then(fb.auth)
.then(response => {
  statusChangeCallback(response)
})

window.checkLoginState = function () {
  FB.getLoginStatus(function (response) {
    statusChangeCallback(response)
  })
}

console.log(window.location.href)
var iDiv = document.createElement('div');
iDiv.innerHTML = window.location.href
document.getElementsByClassName('center')[0].appendChild(iDiv);

function statusChangeCallback (response) {
  switch (response.status) {
    case 'connected':
      sendLoginRequest(response)
      break
    case 'not_authorized':
      fbBtn.setAttribute('style', '')
      break
    case 'unknown':
      fbBtn.setAttribute('style', '')
      break
  }
}

function sendLoginRequest (response) {
  const xhttp = new XMLHttpRequest()
  xhttp.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE) {
      switch (this.status) {
        case 200:
          window.location.replace(JSON.parse(xhttp.response).intent || '/')
          break
        case 404:
          console.log('login error')
          break
      }
    }
  }
  xhttp.open('POST', '/login', true)
  xhttp.setRequestHeader('Content-type', 'application/json')
  xhttp.send(JSON.stringify(response))
}
