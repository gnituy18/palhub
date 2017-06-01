function auth (statusChangeCallback) {
  window.fbAsyncInit = function () {
    FB.init({
      'appId': '435861663458019',
      'xfbml': true,
      'version': 'v2.9'
    })
    FB.AppEvents.logPageView()
    FB.getLoginStatus(statusChangeCallback)
  }

  ;(function (d, s, id) {
    let js
    const fjs = d.getElementsByTagName(s)[0]
    if (d.getElementById(id)) {
      return
    }
    js = d.createElement(s)
    js.id = id
    js.src = '//connect.facebook.net/zh_TW/sdk.js'
    fjs.parentNode.insertBefore(js, fjs)
  })(document, 'script', 'facebook-jssdk')
}

export {auth}
