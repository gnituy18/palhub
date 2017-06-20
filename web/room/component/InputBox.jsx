import socketio from '../../lib/socketio'

const socket = socketio('/room')

export default class InputBox extends React.Component {
  constructor (props) {
    super(props)
    this.state = {'inputValue': ''}
    this.handleChange = this.handleChange.bind(this)
    this.handelKeyPress = this.handelKeyPress.bind(this)
    this.sendMsg = this.sendMsg.bind(this)
  }

  handelKeyPress (e) {
    switch (e.key) {
      case 'Enter':
        this.sendMsg()
        ga('send', 'event', 'room', 'send msg')
        break
    }
  }

  render () {
    return (
      <div className='input-box'>
        <input placeholder='在此輸入訊息...' value={this.state.inputValue} onKeyPress={this.handelKeyPress} onChange={this.handleChange} type='text'></input>
      </div>
    )
  }

  handleChange (evt) {
    this.setState({'inputValue': evt.target.value})
  }

  sendMsg () {
    const msg = this.state.inputValue.trim()
    if (msg !== '') {
      socket.emit('send msg', {'msgBody': msg})
    }
    this.setState({'inputValue': ''})
  }
}
