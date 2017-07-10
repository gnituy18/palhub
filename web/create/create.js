import {checkMultiTabs} from '../lib/tab'
import * as fb from '../lib/facebook'
import ErrorPage from '../component/ErrorPage.jsx'
import CreateForm from './component/CreateForm.jsx'

init()

async function init () {
  try {
    await fb.init()
    const response = await fb.auth()
    switch (response.status) {
      case 'not_authorized':
      case 'unknown':
        window.location.replace('/login')
    }
    const isMultiTab = await checkMultiTabs()
    ReactDOM.render(
      isMultiTab ? <ErrorPage msg='你已經進入房間內或開啟同一頁分頁' /> : <CreateForm />,
      document.getElementById('react-root'))
  } catch (error) {
    console.log(error)
  }
}

