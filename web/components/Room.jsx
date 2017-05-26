import UserList from './UserList.jsx'
import InputBox from './InputBox.jsx'
import NavBar from './NavBar.jsx'
import MessageBox from './MessageBox.jsx'
import {socket} from './../lib/socketio'
import * as rtc from '../lib/webrtc'

export default class Room extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      'msg': [],
      'users': [],
      'micSwitch': false
    }
    this.localStream = {}
    this.appendMsg = this.appendMsg.bind(this)
    this.setupUsers = this.setupUsers.bind(this)
    this.setupMessages = this.setupMessages.bind(this)
    this.handelNewUser = this.handelNewUser.bind(this)
    this.setupPc = this.setupPc.bind(this)
    this.removeUser = this.removeUser.bind(this)
    this.switchStream = this.switchStream.bind(this)
    this.getUser = this.getUser.bind(this)
    this.init = this.init.bind(this)
  }

  componentDidMount () {
    this.init()
  }

  render () {
    return (
      <div>
        <NavBar micSwitch={this.state.micSwitch} onMicSwitchChange={this.switchStream} user={this.props.user}/>
          <UserList users={this.state.users}/>
        <div className='side-nav-neighbor'>
          <MessageBox msg={this.state.msg}/>
          <InputBox/>
        </div>
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
      socket.on('get messages', this.setupMessages)
      socket.on('get new user', this.handelNewUser)
      socket.on('remove user', this.removeUser)
      socket.on('setup pc', data => {
        this.setupPc(data.id)
        .then(() => {
          rtc.pair(data.id)
        })
      })
      this.localStream.getAudioTracks()[0].enabled = this.state.micSwitch
    })
    socket.emit('join room', {
      'user': this.props.user,
      'roomId': this.props.room.id
    })
  }

  async getUser (fbID) {
    let user = this.state.users.find(user => user.fbID === fbID)
    if (typeof user === 'undefined') {
      const picture = await new Promise(resolve => {
        FB.api('/' + fbID + '/picture?type=normal', function (response) {
          resolve(response.data.url)
        })
      })
      user = await new Promise(resolve => {
        FB.api('/' + fbID, function (response) {
          const user = {}
          user.fbID = response.id
          user.name = response.name
          user.picture = picture
          resolve(user)
        })
      })
    }
    return user
  }

  async appendMsg (data) {
    const user = await this.getUser(data.fbID)
    this.setState(prevState => {
      return {
        'msg': prevState.msg.concat({
          'body': data.msgBody,
          'user': user
        })
      }
    })
  }

  setupMessages (data) {
    data.map(msg => this.appendMsg(msg))
  }

  setupUsers (data) {
    const promises = data.users.map(user => new Promise(resolve => {
      FB.api('/' + user.fbID + '/picture?type=normal', function (response) {
        user.picture = response.data.url
        resolve(user)
      })
    }))
    Promise.all(promises).then(users => {
      this.setState({'users': users})
    })
  }

  setupPc (id) {
    return rtc.createNewPcTo(id)
    .then(pc => {
      pc.onaddstream = e => {
        console.log('on add stream')
        this.setState(prevState => {
          const users = prevState.users.map(user => {
            if (user.id === id) {
              user.stream = e.stream
            }
            return user
          })
          return {'users': users}
        })
      }
      pc.addStream(this.localStream)
      pc.oniceconnectionstatechange = function () {
        console.log('state change: ' + this.iceConnectionState)
      }
    })
  }

  removeUser (data) {
    console.log('remove user')
    for (let x = 0; x < this.state.users.length; x++) {
      if (this.state.users[x].id === data.id) {
        console.log('remove id: ' + data.id)
        this.setState(prevState => {
          prevState.users.splice(x, 1)
          console.log(prevState.users)
          return {'users': prevState.users}
        })
        break
      }
    }
    rtc.close(data.id)
  }

  handelNewUser (data) {
    FB.api('/' + data.user.fbID + '/picture?type=normal', response => {
      data.user.picture = response.data.url
      this.setState(prevState => {
        return {'users': prevState.users.concat(data.user)}
      })
    })
    this.setupPc(data.user.id)
    .then(() => {
      socket.emit('setup pc', {'id': data.user.id})
    })
  }

  switchStream () {
    this.setState(prevState => {
      return {'micSwitch': !prevState.micSwitch}
    })
    this.localStream.getAudioTracks()[0].enabled = !this.localStream.getAudioTracks()[0].enabled
  }

}

Room.propTypes = {
  'user': PropTypes.object,
  'room': PropTypes.object
}
