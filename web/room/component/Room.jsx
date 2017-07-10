import UserList from './UserList.jsx'
import InputBox from './InputBox.jsx'
import NavBar from './NavBar.jsx'
import MessageBox from './MessageBox.jsx'
import socketio from '../../lib/socketio'
import * as rtc from '../../lib/webrtc'
import * as fb from '../../lib/facebook'

const socket = socketio('/room')

export default class Room extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      'msgs': [],
      'users': [],
      'focus': true,
      'dueTime': null,
      'unreadMsgNum': 0,
      'micPermission': null,
      'micState': false,
      'isCreator': null
    }
    this.init = this.init.bind(this)
    this.appendMsg = this.appendMsg.bind(this)
    this.setupUsers = this.setupUsers.bind(this)
    this.setupMsgs = this.setupMsgs.bind(this)
    this.handleNewUser = this.handleNewUser.bind(this)
    this.handleDueTime = this.handleDueTime.bind(this)
    this.setupPc = this.setupPc.bind(this)
    this.removeUser = this.removeUser.bind(this)
    this.switchStream = this.switchStream.bind(this)
    this.title = window.document.title
    this.beep = new Audio('/storage/beep.wav')
  }

  componentDidMount () {
    this.init()
  }

  render () {
    return (
      <div>
        <NavBar creator={this.state.creator} time={this.state.due} micState={this.state.micState} onmicStateChange={this.switchStream} room={window.room} user={window.user}/>
        <UserList users={this.state.users}/>
        <div className='side-nav-neighbor'>
          <MessageBox msgs={this.state.msgs}/>
          <InputBox />
        </div>
      </div>
    )
  }

  async init () {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        'audio': true,
        'video': false
      })
      this.setState({'micPermission': true})
      this.localStream.getAudioTracks()[0].enabled = this.state.micState
    } catch (err) {
      this.setState({'micPermission': false})
      this.localStream = new MediaStream()
      rtc.setMicPermission(false)
    }

    await Promise.resolve()
    .then(() => {
      socket.on('get users', this.setupUsers)
      socket.on('get msgs', this.setupMsgs)
      socket.on('get msg', this.appendMsg)
      socket.on('get new user', this.handleNewUser)
      socket.on('get due time', this.handleDueTime)
      socket.on('remove user', this.removeUser)
      socket.on('kick', () => {
        window.location.replace('/')
      })
      socket.on('setup pc', data => {
        this.setupPc(data.id)
        .then(() => {
          rtc.pair(data.id, data.micPermission)
        })
      })
    })
    window.onfocus = () => {
      document.title = this.title
      this.setState({
        'focus': true,
        'unreadMsgNum': 0
      })
    }
    window.onblur = () => {
      this.setState({'focus': false})
    }
    socket.emit('join room', {
      'userID': window.user.id,
      'roomID': window.room.id
    })
  }

  async appendMsg (data) {
    data.user.picture = (await fb.api('/' + data.user.facebook.id + '/picture?type=normal')).data.url
    this.setState(prevState => {
      return {
        'msgs': prevState.msgs.concat({
          'body': data.msgBody,
          'user': data.user
        })
      }
    })
    if (!this.state.focus) {
      this.beep.play()
      this.setState(prevState => {
        return {'unreadMsgNum': prevState.unreadMsgNum + 1}
      })
      document.title = '(' + this.state.unreadMsgNum + ') ' + this.title
    }
  }

  async setupMsgs (data) {
    const promises = data.msgs.map(msg => fb.api('/' + msg.user.facebook.id + '/picture?type=normal').then(response => {
      msg.user.picture = response.data.url
      return {
        'body': msg.msgBody,
        'user': msg.user
      }
    }))
    const msgs = await Promise.all(promises)
    this.setState({'msgs': msgs})
  }

  async setupUsers (data) {
    const promises = data.users.map(user => fb.api('/' + user.facebook.id + '/picture?type=normal').then(response => {
      user.picture = response.data.url
      return user
    }))

    const users = await Promise.all(promises)
    this.setState({'users': users})
  }

  setupPc (id) {
    return rtc.createNewPcTo(id)
    .then(pc => {
      pc.onaddstream = e => {
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
    for (let x = 0; x < this.state.users.length; x++) {
      if (this.state.users[x].facebook.id === data.FBID) {
        this.setState(prevState => {
          prevState.users.splice(x, 1)
          return {'users': prevState.users}
        })
        break
      }
    }
    rtc.close(data.FBID)
  }

  handleDueTime (dueTime) {
    let time = Math.floor((dueTime - Date.now()) / 1000)
    setInterval(() => {
      this.setState({'due': time--})
    }, 1000)
  }

  async handleNewUser (data) {
    const response = await fb.api('/' + data.user.facebook.id + '/picture?type=normal')
    data.user.picture = response.data.url
    this.setState(prevState => {
      const users = prevState.users.concat(data.user)
      return {'users': users}
    })
    await this.setupPc(data.user.socketID)
    socket.emit('setup pc', {
      'socketID': data.user.socketID,
      'micPermission': this.state.micPermission
    })
  }

  switchStream () {
    this.setState(prevState => {
      return {'micState': !prevState.micState}
    })
    if (this.state.micPermission) {
      this.localStream.getAudioTracks()[0].enabled = !this.localStream.getAudioTracks()[0].enabled
    }
  }
}
