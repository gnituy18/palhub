import Lobby from '../components/Lobby.jsx'

window.fbAsyncInit = function () {
  FB.init({
    'appId': '435861663458019',
    'xfbml': true,
    'version': 'v2.9'
  })
  FB.AppEvents.logPageView()
  FB.getLoginStatus(function () {
    ReactDOM.render(
      <Lobby />,
      document.getElementById('root')
    )
  })
}
