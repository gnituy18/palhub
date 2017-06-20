export default class NavBar extends React.Component {
  render () {
    console.log(this.props.user.picture)
    const profileBtnBG = {
      'backgroundImage': 'url(' + this.props.user.picture + ')',
      'backgroundSize': 'cover',
      'backgroundPosition': 'center',
      'borderRadius': '50%'
    }
    const authBtn = this.props.logged ? <abbr title='登出'><div onClick={logout} className='nav-button logout'></div></abbr> : <abbr title='登入'><div onClick={goToLogin} className='nav-button login'></div></abbr>
    const profileBtn = this.props.logged && <abbr title='個人檔案'><div style={profileBtnBG} onClick={redirectToProfile} className='nav-button'></div></abbr>
    return (
      <div className='nav-container'>
        <div className='nav'>
          {this.props.logged !== null && authBtn}
          {this.props.logged !== null && profileBtn}
        </div>
      </div>
    )
  }
}

NavBar.propTypes = {
  'logged': PropTypes.bool,
  'user': PropTypes.object
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
