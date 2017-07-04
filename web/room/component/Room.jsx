import UserList from './UserList.jsx'
import InputBox from './InputBox.jsx'
import NavBar from './NavBar.jsx'
import MessageBox from './MessageBox.jsx'
import socketio from '../../lib/socketio'
import * as rtc from '../../lib/webrtc'

const socket = socketio('/room')

export default class Room extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      'msg': [],
      'users': [],
      'focus': true,
      'due': null,
      'unreadMsgNum': 0,
      'micAllowed': true,
      'micSwitch': false
    }
    this.localStream = {}
    this.appendMsg = this.appendMsg.bind(this)
    this.setupUsers = this.setupUsers.bind(this)
    this.setupMessages = this.setupMessages.bind(this)
    this.handleNewUser = this.handleNewUser.bind(this)
    this.handleDueTime = this.handleDueTime.bind(this)
    this.setupPc = this.setupPc.bind(this)
    this.removeUser = this.removeUser.bind(this)
    this.switchStream = this.switchStream.bind(this)
    this.getUser = this.getUser.bind(this)
    this.init = this.init.bind(this)
    this.title = window.document.title
    this.beep = new Audio('/storage/beep.wav')
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
  }

  componentDidMount () {
    this.init()
  }

  render () {
    return (
      <div>
        <NavBar time={this.state.due} micSwitch={this.state.micSwitch} onMicSwitchChange={this.switchStream} room={this.props.room} user={this.props.user}/>
        <UserList users={this.state.users}/>
        <div className='side-nav-neighbor'>
          <MessageBox msg={this.state.msg}/>
          <InputBox/>
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
      this.localStream.getAudioTracks()[0].enabled = this.state.micSwitch
    } catch (err) {
      this.setState({'micAllowed': false})
      this.localStream = new MediaStream()
      rtc.setMic(false)
    }
    await Promise.resolve().then(() => {
      socket.on('get msg', this.appendMsg)
      socket.on('get users', this.setupUsers)
      socket.on('get messages', this.setupMessages)
      socket.on('get new user', this.handleNewUser)
      socket.on('get due time', this.handleDueTime)
      socket.on('remove user', this.removeUser)
      socket.on('kick', () => {
        window.location.replace('/')
      })
      socket.on('setup pc', data => {
        this.setupPc(data.id)
        .then(() => {
          rtc.pair(data.id, data.micAllowed)
        })
      })
    })
    socket.emit('join room', {
      'user': this.props.user,
      'roomID': this.props.room.id
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
    if (!this.state.focus) {
      this.beep.play()
      this.setState(prevState => {
        return {'unreadMsgNum': prevState.unreadMsgNum + 1}
      })
      document.title = '(' + this.state.unreadMsgNum + ') ' + this.title
    }
  }

  async setupMessages (data) {
    const msgs = []
    for (let x = 0; x < data.length; x++) {
      const user = await this.getUser(data[x].fbID)
      msgs.push({
        'body': data[x].msgBody,
        'user': user
      })
    }
    this.setState({'msg': msgs})
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
        this.setState(prevState => {
          prevState.users.splice(x, 1)
          return {'users': prevState.users}
        })
        break
      }
    }
    rtc.close(data.id)
  }

  handleDueTime (dueTime) {
    let time = Math.floor((dueTime - Date.now()) / 1000)
    setInterval(() => {
      this.setState({'due': time--})
    }, 1000)
  }

  handleNewUser (data) {
    FB.api('/' + data.user.fbID + '/picture?type=normal', response => {
      data.user.picture = response.data.url
      Promise.resolve().then(() => {
        this.setState(prevState => {
          const users = prevState.users.concat(data.user)
          return {'users': users}
        })
      })
      .then(() => this.setupPc(data.user.id))
      .then(() => {
        socket.emit('setup pc', {
          'id': data.user.id,
          'micAllowed': this.state.micAllowed
        })
      })
    })
  }

  switchStream () {
    this.setState(prevState => {
      return {'micSwitch': !prevState.micSwitch}
    })
    if (this.state.micAllowed) {
      this.localStream.getAudioTracks()[0].enabled = !this.localStream.getAudioTracks()[0].enabled
    }
  }

}

Room.propTypes = {
  'user': PropTypes.object,
  'room': PropTypes.object
}
