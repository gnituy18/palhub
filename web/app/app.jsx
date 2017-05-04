const socket = io()
const name = window.document.getElementById('name').innerHTML

import PropTypes from 'prop-types'

class Room extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      'msg': [],
      'users': []
    }
    this.appendMsg = this.appendMsg.bind(this)
    this.addUser = this.addUser.bind(this)
  }

  componentDidMount () {
    socket.on('msg', this.appendMsg)
    socket.on('users', this.addUser)
    socket.emit('join', {'name': name})
  }

  render () {
    return (
      <div>
        <UserList users={this.state.users}/>
        <MessageBox msg={this.state.msg}/>
        <InputBox/>
      </div>
    )
  }

  appendMsg (data) {
    this.setState(prevState => {
      return {'msg': prevState.msg.concat(data.value)}
    })
  }

  addUser (data) {
    this.setState({'users': data.users})
  }
}

class UserList extends React.Component {
  render () {
    const list = this.props.users.map(user => <p key={user.id}>{user.name}</p>)
    return (
      <div>
        {list}
      </div>
    )
  }
}

UserList.propTypes = {'users': PropTypes.array}

class MessageBox extends React.Component {

  render () {
    return (
      <div>
        {this.props.msg.map((m, index) => <p key={index}>{m}</p>)}
      </div>
    )
  }
}

MessageBox.propTypes = {'msg': PropTypes.array}

class InputBox extends React.Component {
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

ReactDOM.render(
  <Room/>,
  document.getElementById('root')
)
