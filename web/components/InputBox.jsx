import {socket} from '../lib/webrtc'

export default class InputBox extends React.Component {
  constructor (props) {
    super(props)
    this.state = {'inputValue': ''}
    this.handleChange = this.handleChange.bind(this)
    this.sendMsg = this.sendMsg.bind(this)
  }

  render () {
    return (
      <div>
        <input value={this.state.inputValue} onChange={this.handleChange} type='text'></input>
        <button onClick={this.sendMsg}>submit</button>
      </div>
    )
  }

  handleChange (evt) {
    this.setState({'inputValue': evt.target.value})
  }

  sendMsg () {
    socket.emit('send msg', {'value': this.state.inputValue})
    this.setState({'inputValue': ''})
  }
}
