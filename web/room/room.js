import * as fb from '../lib/facebook'
import {checkMultiTabs} from '../lib/tab'
import Room from './component/Room.jsx'
import ErrorPage from '../component/ErrorPage.jsx'

const user = {
  'id': document.getElementById('FBID').innerHTML,
  'name': document.getElementById('name').innerHTML
}
const room = {
  'id': document.getElementById('room-id').innerHTML,
  'name': document.getElementById('room-name').innerHTML
}

checkMultiTabs()
.then(isMultiTab => {
  if (isMultiTab) {
    ReactDOM.render(
      <ErrorPage msg='你已經有分頁已經開啟' />,
      document.getElementById('react-root'))
    throw new Error('Tab exist.')
  }
})
.then(fb.init)
.then(fb.auth)
.then(response => {
  switch (response.status) {
    case 'connected':
      FB.api('/me/picture?type=normal', function (response) {
        user.picture = response.data.url
        ReactDOM.render(
          <Room user={user} room={room}/>,
          document.getElementById('react-root')
        )
      })
      break
    case 'not_authorized':
    case 'unknown':
      window.location.replace('/login')
      break
  }
})
.catch(error => {
  console.log(error)
})
