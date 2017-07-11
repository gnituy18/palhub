import * as fb from '../../lib/facebook'
import {checkMultiTabs} from '../../lib/tab'
import Room from './component/Room.jsx'
import ErrorPage from '../../component/ErrorPage.jsx'

(async function () {
  try {
    if (await checkMultiTabs()) {
      ReactDOM.render(
      <ErrorPage msg='你已經有分頁已經開啟' />,
      document.getElementById('react-root'))
      throw new Error('Tab exist.')
    }
    await fb.init()
    const response = await fb.auth()
    switch (response.status) {
      case 'connected': {
        const response = await fb.api('/me/picture?type=normal')
        window.user.picture = response.data.url
        ReactDOM.render(<Room />, document.getElementById('react-root'))
        break
      }
      case 'not_authorized':
      case 'unknown':
        window.location.replace('/login')
        break
    }
  } catch (error) {
    console.log(error)
  }
})()
