import socketio from '../../../lib/socketio'
import * as fb from '../../../lib/facebook'
import NavBar from './NavBar.jsx'
import RoomList from './RoomList.jsx'

const socket = socketio('/lobby')

export default class Lobby extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      'rooms': [],
      'user': {},
      'userNum': null,
      'logged': null
    }
    this.getRooms = this.getRooms.bind(this)
  }

  componentDidMount () {
    socket.on('get rooms', this.getRooms)
    socket.on('get user num', data => {
      this.setState({'userNum': data.num})
    })
    socket.emit('get rooms')
    fb.init()
    .then(fb.auth)
    .then(response => {
      switch (response.status) {
        case 'connected':
          FB.api('/me/picture?type=normal', response => {
            this.setState({
              'user': {'picture': response.data.url},
              'logged': true
            })
          })
          FB.api('/me', response => {
            console.log(response)
            socket.emit('join lobby', {'FBID': response.id})
          })
          break
        case 'not_authorized':
        case 'unknown':
          this.setState({'logged': false})
          break
      }
    })
  }

  render () {
    return (
      <div>
        <NavBar user={this.state.user} logged={this.state.logged} />
        <div className='section text-align-center'>
          <div className='lobby-title'>PalHub</div>
          <div className='lobby-annotation'>想要找人討論某個話題嗎？</div>
          <div className='lobby-annotation'>有問題想要馬上詢問別人嗎？</div>
          <div className='lobby-annotation'>PalHub 幫你在這裡找到一群臨時的的夥伴。</div>
        </div>
        <div className='section text-align-center'>
          <div className='cont'>
            <a onClick={handleCreateClick} href='/create' className='lobby-room'>發起討論</a>
          </div>
          <div className='cont'>
            <div className='lobby-annotation'>
              看看其他人都在討論什麼
            </div>
          </div>
        </div>
        <RoomList rooms={this.state.rooms} />
      </div>
    )
  }

  getRooms (data) {
    this.setState({'rooms': data.rooms})
  }
}

function handleCreateClick () {
  ga('send', 'event', 'lobby', 'create')
}
