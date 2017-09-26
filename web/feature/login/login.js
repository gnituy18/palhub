import * as fb from '../../lib/facebook'
import "babel-polyfill"

const fbBtn = document.getElementsByClassName('fb-login-button')[0]

fb.init()
.then(fb.auth)
.then(response => {
  statusChangeCallback(response)
  const div = window.document.createElement('div');
  div.innerHTML = parseAccessToken(window.location.href)
  window.document.getElementsByClassName('center')[0].appendChild(div);
})

window.testFunc = function(){
  alert('test')
}

window.checkLoginState = function () {
  FB.getLoginStatus(function (response) {
    statusChangeCallback(response)
  })
}

function parseAccessToken(url){
  const tokenString = url.match(/access_token=\w*/)
  if(tokenString !== null){
    alert(tokenString)
    document.getElementById('loginbtn').innerHTML = 'haha'
    return tokenString[0].split('=')[1]
  } else {
    document.getElementById('loginbtn').innerHTML = 'no'
    return 'nothing'
  }
}

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
