import Room from '../components/Room.jsx'
import {auth} from '../lib/facebook'
import {checkMultiTabs} from '../lib/tab'

const user = {
  'name': document.getElementById('name').innerHTML,
  'id': document.getElementById('FBID').innerHTML
}
const room = {'id': document.getElementById('room-id').innerHTML}

checkMultiTabs()
.then(() => {
  auth(statusChangeCallback)
})
.catch(err => {
  console.log(err)
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
