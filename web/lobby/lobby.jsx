import Lobby from '../components/Lobby.jsx'
import {auth} from '../lib/facebook'

auth(function (response) {
  switch (response.status) {
    case 'connected':
      ReactDOM.render(
        <Lobby />,
        document.getElementById('root')
      )
      break
    case 'not_authorized':
    case 'unknown':
      window.location.replace('/login')
      break
  }
})
