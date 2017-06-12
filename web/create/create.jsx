import {checkMultiTabs} from '../lib/tab'
import {auth} from '../lib/facebook'
import ErrorPage from '../components/ErrorPage.jsx'

auth(response => {
  switch (response.status) {
    case 'connected':
      checkMultiTabs()
      .then(() => {
        ReactDOM.render(
    <div className='center'>
      <h2>你房間的主題是什麼？</h2>
      <form method='post' action='/create'>
        <input type='text' name='name'/>
        <input type='submit' value='確定'/>
      </form>
    </div>
  , document.getElementById('root'))
      })
      .catch(err => {
        ReactDOM.render(<ErrorPage />, document.getElementById('root'))
        console.log(err)
      })
      break
    case 'not_authorized':
    case 'unknown':
      window.location.replace('/login')
      break
  }
})
