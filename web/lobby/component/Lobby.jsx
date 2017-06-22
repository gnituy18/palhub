import socketio from '../../lib/socketio'
import * as fb from '../../lib/facebook'
import NavBar from './NavBar.jsx'
import RoomList from './RoomList.jsx'

const socket = socketio('/lobby')

export default class Lobby extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      'rooms': [],
      'user': {},
      'logged': null
    }
    this.getRooms = this.getRooms.bind(this)
  }

  componentDidMount () {
    socket.on('get rooms', this.getRooms)
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
          <div className='lobby-annotation'>如哈利波特中的萬應室，有需求時出現。</div>
          <div className='lobby-annotation'>陌生人即時性的回覆幫你解決任何疑難雜症。</div>
          <div className='lobby-annotation'>當沒人時房間則自動消失，不留下任何紀錄。</div>
          <div className='lobby-annotation'>PalHub 幫你在這裡找到一群臨時的的夥伴。</div>
        </div>
        <div className='section text-align-center'>
          <div className='cont'>
            <a onClick={handleCreateClick} href='/create' className='lobby-annotation'>發起討論- 讓陌生人參與你的話題</a>
          </div>
          <div className='cont'>
            <div className='lobby-annotation'>
              或
            </div>
          </div>
          <div className='cont'>
            <div className='lobby-annotation'>
              加入你有興趣的討論
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
