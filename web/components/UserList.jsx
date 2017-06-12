export default class UserList extends React.Component {
  render () {
    let list = this.props.users.map((user, index) => {
      const pictureStyle = {'backgroundImage': 'url(' + user.picture + ')'}
      const navNameStyle = {
        'display': 'inline-block',
        'padding': '10px',
        'width': 'calc(15vw - 94px)',
        'verticalAlign': 'top'
      }
      return (
        <div key={index}>
          <div className='side-nav-element'>
            <div className='avatar-normal' style={pictureStyle}></div>
            <div style={navNameStyle}>{user.name}</div>
          </div>
          {user.stream && <audio ref={audio => {
            if (audio !== null) {
              audio.srcObject = user.stream
            }
          }} autoPlay></audio>}
        </div>
      )
    })
    return (
      <div className='side-nav-container'>
        <div className='side-nav-content'>
          {list}
        </div>
      </div>
    )
  }
}

UserList.propTypes = {'users': PropTypes.array}
