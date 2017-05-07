export default class NavBar extends React.Component {
  render () {
    return (
      <div className='nav'>
        <a className='nav-brand' href='/login'>PalHub</a>
        <div className='nav-content'>
          <div className='nav-element'>{ 'Hello, ' + this.props.user.name + ', 歡迎來到Palhub'}</div>
          <div className='nav-button mic'></div>
          <div className='nav-button door'></div>
        </div>
      </div>
    )
  }

}

NavBar.propTypes = {'user': PropTypes.object}
