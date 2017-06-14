import {checkMultiTabs} from '../lib/tab'
import * as fb from '../lib/facebook'
import {post} from '../lib/ajax'
import ErrorPage from '../components/ErrorPage.jsx'

fb.init()
.then(fb.auth)
.then(response => {
  switch (response.status) {
    case 'not_authorized':
    case 'unknown':
      window.location.replace('/login')
      throw new Error('FB login failed.')
  }
})
.then(checkMultiTabs)
.then(isMultiTab => {
  if (isMultiTab) {
    ReactDOM.render(
      <ErrorPage msg='你已經進入房間內或開啟同一頁分頁' />,
      document.getElementById('react-root'))
  } else {
    ReactDOM.render(
    <Create />,
    document.getElementById('react-root'))
  }
})
.catch(err => {
  console.log(err)
})

class Create extends React.Component {
  constructor (props) {
    super(props)
    this.state = {'inputValue': ''}
    this.handleChange = this.handleChange.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.submit = this.submit.bind(this)
  }

  render () {
    return (
      <div className='wrapper'>
        <div className='center'>
          <h2>你房間的主題是什麼？</h2>
          <input onKeyPress={this.handleKeyPress} onChange={this.handleChange} value={this.state.inputValue} type='text' />
          <button className='btn' onClick={this.submit}>確定</button>
        </div>
      </div>
    )
  }

  handleChange (e) {
    this.setState({'inputValue': e.target.value})
  }

  handleKeyPress (e) {
    switch (e.key) {
      case 'Enter':
        this.submit()
        break
    }
  }

  submit () {
    if (this.state.inputValue !== '') {
      post('/create', {'name': this.state.inputValue})
      .then(response => {
        console.log(response)
        window.location.replace('room/' + JSON.parse(response.data).id)
      })
      this.setState({'inputValue': ''})
    }
  }
}
