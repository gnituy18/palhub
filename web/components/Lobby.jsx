import socketio from './../lib/socketio'
import {auth} from './../lib/facebook'
const socket = socketio('/lobby')

export default class Lobby extends React.Component {
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
    auth(response => {
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
    const authBtn = this.state.logged ? <abbr title='登出'><div onClick={logout} className='nav-button logout'></div></abbr> : <abbr title='登出'><div onClick={goToLogin} className='nav-button login'></div></abbr>

    const list = this.state.rooms.map((room, index) =>
      <div key={index}><a className='lobby-room' href={'/room/' + room.id}>{room.name}</a></div>)
    const navStyle = {'textAlign': 'left'}
    return (
        <div className='lobby-container'>
        <div style={navStyle}>
      {this.state.logged && <abbr title='個人檔案'><div onClick={redirectToProfile} className='nav-button user'></div></abbr>}
          {authBtn}
        </div>
        <div className='section'>
          <div className='lobby-title'>PalHub</div>
          <div className='lobby-annotation'>完全免費的公開文字/語音通訊系統</div>
          <div className='lobby-annotation'>找到跟你<b>正在做同一件事情</b>或<b>有同樣想法</b>的人</div>
        </div>
        <div className='section'>
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
        {list}
      </div>
    )
  }

  getRooms (data) {
    this.setState({'rooms': data.rooms})
  }

}

function redirectToProfile () {
  window.location.href = '/profile'
}

function logout () {
  FB.logout(function () {
    window.location.href = '/'
  })
}

function goToLogin () {
  window.location.href = '/login'
}
