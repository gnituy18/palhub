export default class UserList extends React.Component {
  render () {
    let list = this.props.users.map(user => <div key={user.id}><p>{user.name}</p>
          {user.stream && <audio ref={audio => {
            if (audio !== null) {
              audio.srcObject = user.stream
            }
          }} autoPlay></audio>}
        </div>)
    return (
      <div>
        {list}
      </div>
    )
  }
}

UserList.propTypes = {'users': PropTypes.array}
