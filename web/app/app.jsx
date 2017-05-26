import Room from '../components/Room.jsx'

const user = {
  'name': document.getElementById('name').innerHTML,
  'id': document.getElementById('id').innerHTML
}
const room = {'id': document.getElementById('room-id').innerHTML}

window.fbAsyncInit = function () {
  FB.init({
    'appId': '435861663458019',
    'xfbml': true,
    'version': 'v2.9'
  })
  FB.AppEvents.logPageView()
  FB.getLoginStatus(function () {
    FB.api('/me/picture?type=normal', function (response) {
      user.picture = response.data.url
      ReactDOM.render(
        <Room user={user} room={room}/>,
        document.getElementById('root')
      )
    })
  })
}
