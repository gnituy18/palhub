const socket = io()

import UserList from './UserList.jsx'
import InputBox from './InputBox.jsx'
import NavBar from './NavBar.jsx'
import MessageBox from './MessageBox.jsx'
//import {pair} from '../lib/webrtc'

export default class Room extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      'msg': [],
      'users': []
    }
    this.appendMsg = this.appendMsg.bind(this)
    this.setupUsers = this.setupUsers.bind(this)
    this.addNewUser = this.addNewUser.bind(this)
    this.init = this.init.bind(this)
  }

  async componentDidMount () {
    await this.init()
    socket.emit('join room', {'user': this.props.user})
  }

  render () {
    return (
      <div className='siimple-grid'>
        <div className='siimple-grid-row'>
          <NavBar user={this.props.user}/>
        </div>
        <div className='siimple-grid-row'>
          <div className='siimple-grid-col siimple-grid-col--2'>
            <UserList users={this.state.users}/>
          </div>
          <div className='siimple-grid-col siimple-grid-col--10'>
            <MessageBox msg={this.state.msg}/>
            <InputBox/>
          </div>
        </div>
      </div>
    )
  }

  init () {
    return Promise.resolve().then(() => {
      socket.on('get msg', this.appendMsg)
      socket.on('get users', this.setupUsers)
      socket.on('get new user', this.addNewUser)
    })
  }

  appendMsg (data) {
    this.setState(prevState => {
      return {'msg': prevState.msg.concat(data.value)}
    })
  }

  setupUsers (data) {
    this.setState({'users': data.users})
  }

  addNewUser (data) {
    this.setState(prevState => {
      return {'users': prevState.users.concat(data.user)}
    })
  }
}

Room.propTypes = {'user': PropTypes.object}
