
import UserList from './UserList.jsx'
import InputBox from './InputBox.jsx'
import NavBar from './NavBar.jsx'
import MessageBox from './MessageBox.jsx'
import Audios from './Audios.jsx'
import {socket} from './../lib/socketio'
import * as rtc from '../lib/webrtc'

export default class Room extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      'msg': [],
      'users': [],
      'streams': []
    }
    this.localStream = {}
    this.appendMsg = this.appendMsg.bind(this)
    this.setupUsers = this.setupUsers.bind(this)
    this.handelNewUser = this.handelNewUser.bind(this)
    this.setupPc = this.setupPc.bind(this)
    this.init = this.init.bind(this)
  }

  componentDidMount () {
    this.init()
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
        <Audios streams={this.state.streams}/>
      </div>
    )
  }

  async init () {
    this.localStream = await navigator.mediaDevices.getUserMedia({
      'audio': true,
      'video': false
    })
    await Promise.resolve().then(() => {
      socket.on('get msg', this.appendMsg)
      socket.on('get users', this.setupUsers)
      socket.on('get new user', this.handelNewUser)
      socket.on('setup pc', data => {
        this.setupPc(data.id)
        .then(() => {
          rtc.pair(data.id)
        })
      })
    })
    socket.emit('join room', {'user': this.props.user})
  }

  appendMsg (data) {
    this.setState(prevState => {
      return {'msg': prevState.msg.concat(data.value)}
    })
  }

  setupUsers (data) {
    this.setState({'users': data.users})
  }

  setupPc (id) {
    return rtc.createNewPcTo(id)
    .then(pc => {
      pc.onaddstream = e => {
        this.setState(prevState => {
          return {'streams': prevState.streams.concat(e.stream)}
        })
      }
      pc.addStream(this.localStream)
      pc.oniceconnectionstatechange = function () {
        console.log('state change: ' + this.iceConnectionState)
      }
    })
  }

  handelNewUser (data) {
    console.log('userjoin' + data.user.name)
    this.setState(prevState => {
      return {'users': prevState.users.concat(data.user)}
    })
    this.setupPc(data.user.id)
    .then(() => {
      socket.emit('setup pc', {'id': data.user.id})
      console.log('aaaa')
    })
  }
}

Room.propTypes = {'user': PropTypes.object}
