export default class NavBar extends React.Component {
  constructor () {
    super()
    this.triggerMicSwitch = this.triggerMicSwitch.bind(this)
  }

  render () {
    return (
      <div className='nav-container'>
        <div className='nav'>
          <a className='nav-brand' href='/login'>PalHub</a>
          <div className='nav-content'>
            <div className='nav-element'>{ 'Hello, ' + this.props.user.name + ', 歡迎來到Palhub'}</div>
            <div onClick={this.triggerMicSwitch} className='nav-button mic'>
              {this.props.micSwitch === false && <div className='nav-button-disable'></div>}
            </div>
            <div className='nav-button door'></div>
          </div>
        </div>
      </div>
    )
  }

  triggerMicSwitch () {
    this.props.onMicSwitchChange()
  }
}

NavBar.propTypes = {
  'user': PropTypes.object,
  'onMicSwitchChange': PropTypes.func,
  'micSwitch': PropTypes.bool
}
