const name = window.document.getElementById('name').innerHTML
const socket = io()

import UserList from './UserList.jsx'
import InputBox from './InputBox.jsx'
import MessageBox from './MessageBox.jsx'

export default class Room extends React.Component {
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
      <div className='siimple-grid'>
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

  appendMsg (data) {
    this.setState(prevState => {
      return {'msg': prevState.msg.concat(data.value)}
    })
  }

  addUser (data) {
    this.setState({'users': data.users})
  }
}

