import {auth} from '../lib/facebook'

auth(statusChangeCallback)

window.checkLoginState = function () {
  FB.getLoginStatus(function (response) {
    statusChangeCallback(response)
  })
}

function statusChangeCallback (response) {
  const fbBtn = document.getElementsByClassName('fb-login-button')[0]
  switch (response.status) {
    case 'connected':
      fbBtn.setAttribute('style', 'display:none')
      sendLoginRequest(response)
      break
    case 'not_authorized':
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
