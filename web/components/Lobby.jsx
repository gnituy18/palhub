import socketio from './../lib/socketio'
const socket = socketio('/lobby')

export default class Lobby extends React.Component {
  constructor (props) {
    super(props)
    this.state = {'rooms': []}
    this.getRooms = this.getRooms.bind(this)
  }
  componentDidMount () {
    socket.on('get rooms', this.getRooms)
    socket.emit('get rooms')
  }
  render () {
    const list = this.state.rooms.map((room, index) =>
      <a href={'/room/' + room.id}key={index}>{room.name}</a>)
    return (
      <div>
        <h1>Room list</h1>
        <div onClick={this.createRoom}>create room!</div>
        <form method='post' action='/create'>
          <input type='text' name='name' />
          <input type='submit' />
        </form>
        {list}
      </div>
    )
  }

  getRooms (data) {
    this.setState({'rooms': data.rooms})
  }

}
