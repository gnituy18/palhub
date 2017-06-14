import socketio from './../lib/socketio'
import * as fb from './../lib/facebook'
import NavBar from './NavBar.jsx'
import RoomList from './RoomList.jsx'

const socket = socketio('/lobby')

class Lobby extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      'rooms': [],
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
          this.setState({'logged': true})
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
        <NavBar logged={this.state.logged} />
        <div className='section text-align-center'>
          <div className='lobby-title'>PalHub</div>
          <div className='lobby-annotation'>完全免費的公開文字/語音通訊系統</div>
          <div className='lobby-annotation'>找到跟你<b>正在做同一件事情</b>或<b>有同樣想法</b>的人</div>
        </div>
        <div className='section text-align-center'>
          <div className='cont'>
            <a href='/create' className='lobby-annotation'>創建房間</a>
          </div>
          <div className='cont'>
            <div className='lobby-annotation'>
              或
            </div>
          </div>
          <div className='cont'>
            <div className='lobby-annotation'>
              找到屬於自己的房間
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

ReactDOM.render(
  <Lobby />,
  document.getElementById('root')
)

