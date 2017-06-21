import {post} from '../../lib/ajax'

export default class Create extends React.Component {
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
          <h2>你想要討論的主題是什麼？</h2>
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
    ga('send', 'event', 'Create', 'enter', 'testing')
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
