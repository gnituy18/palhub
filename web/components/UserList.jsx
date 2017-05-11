export default class UserList extends React.Component {
  render () {
    let list = this.props.users.map(user => <div key={user.id}>
      <div className='side-nav-element'>{user.name}</div>
          {user.stream && <audio ref={audio => {
            if (audio !== null) {
              audio.srcObject = user.stream
            }
          }} autoPlay></audio>}
        </div>)
    return (
      <div className='side-nav-container'>
        <div className='side-nav-content'>
          <div className='side-nav-title'>
            使用者列表
          </div>
          {list}
        </div>
      </div>
    )
  }
}

UserList.propTypes = {'users': PropTypes.array}
