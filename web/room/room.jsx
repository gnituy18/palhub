import Room from '../components/Room.jsx'
import ErrorPage from '../components/ErrorPage.jsx'
import {auth} from '../lib/facebook'
import {checkMultiTabs} from '../lib/tab'

const user = {
  'id': document.getElementById('FBID').innerHTML,
  'name': document.getElementById('name').innerHTML
}
const room = {
  'id': document.getElementById('room-id').innerHTML,
  'name': document.getElementById('room-name').innerHTML
}

checkMultiTabs()
.then(() => {
  auth(statusChangeCallback)
})
.catch(() => {
  ReactDOM.render(<ErrorPage />, document.getElementById('root'))
})

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
