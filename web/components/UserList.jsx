export default class UserList extends React.Component {
  render () {
    const list = this.props.users.map(user => <p key={user.id}>{user.name}</p>)
    return (
      <div>
        {list}
      </div>
    )
  }
}

UserList.propTypes = {'users': PropTypes.array}
