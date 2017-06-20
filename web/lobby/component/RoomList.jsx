export default class RoomList extends React.Component {
  render () {
    const list = this.props.rooms.map((room, index) =>
      <div key={index}><a onClick={handleJoinClick} className='lobby-room' href={'/room/' + room.id}>{room.name}</a></div>)
    return (
      <div className='text-align-center'>
        {list}
      </div>
    )
  }
}

RoomList.propTypes = {'rooms': PropTypes.array}

function handleJoinClick () {
  ga('send', 'event', 'lobby', 'join')
}
