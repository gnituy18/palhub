import Room from '../components/Room.jsx'
import {auth} from '../lib/facebook'

const user = {
  'name': document.getElementById('name').innerHTML,
  'id': document.getElementById('id').innerHTML
}
const room = {'id': document.getElementById('room-id').innerHTML}

auth(statusChangeCallback)

function statusChangeCallback (response) {
  switch (response.status) {
    case 'connected':
      FB.api('/me/picture?type=normal', function (response) {
        user.picture = response.data.url
        ReactDOM.render(
          <Room user={user} room={room}/>,
          document.getElementById('root')
        )
      })
      break
    case 'not_authorized':
    case 'unknown':
      window.location.replace('/login')
      break
  }
}
