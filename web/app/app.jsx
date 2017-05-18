import Room from '../components/Room.jsx'
//import FB from '../lib/facebook'

const user = {
  'name': document.getElementById('name').innerHTML,
  'id': document.getElementById('id').innerHTML
}

window.fbAsyncInit = function () {
  FB.init({
    'appId': '435861663458019',
    'xfbml': true,
    'version': 'v2.9'
  })
  FB.AppEvents.logPageView()
  FB.getLoginStatus(function (res) {
    console.log(res)
    ReactDOM.render(
      <Room user={user}/>,
      document.getElementById('root')
    )
  })
}
