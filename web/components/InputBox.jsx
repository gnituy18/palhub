import {socket} from '../lib/socketio'

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
        break
    }
  }

  render () {
    return (
      <div className='input-box'>
        <input value={this.state.inputValue} onKeyPress={this.handelKeyPress} onChange={this.handleChange} type='text'></input>
      </div>
    )
  }

  handleChange (evt) {
    this.setState({'inputValue': evt.target.value})
  }

  sendMsg () {
    socket.emit('send msg', {'msg': this.state.inputValue})
    this.setState({'inputValue': ''})
  }
}
