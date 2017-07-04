export default class NavBar extends React.Component {
  constructor () {
    super()
    this.triggerMicSwitch = this.triggerMicSwitch.bind(this)
  }

  render () {
    const hour = Math.floor(this.props.time / 21600)
    const min = Math.floor(this.props.time % 3600 / 60)
    const sec = this.props.time % 60
    const dueMsg = this.props.time && '⌛ 聊天室將在' + (hour === 0 ? '' : hour + '小時') + (hour === 0 && min === 0 ? '' : min + '分鐘') + sec + '秒後關閉'
    return (
      <div className='nav-container'>
        <div className='nav'>
          <a className='nav-brand' href='/'>PalHub</a>
          <div className='nav-content'>
            <abbr title='複製房間連結'><div onClick={handleLinkClick} className='nav-button link'></div></abbr>
            <abbr title='麥克風'><div onClick={this.triggerMicSwitch} className={this.props.micSwitch === false ? 'nav-button mic-off' : 'nav-button mic'}></div></abbr>
            <div className='nav-element'>{ decode(this.props.room.name) }</div>
            <div className='nav-element'>{dueMsg}</div>
          </div>
        </div>
      </div>
    )
  }

  triggerMicSwitch () {
    this.props.onMicSwitchChange()
    ga('send', 'event', 'room', 'mic')
  }
}

function handleLinkClick () {
  copyUrl()
  ga('send', 'event', 'room', 'link')
}

function copyUrl () {
  const textArea = document.createElement('textarea')
  textArea.style.position = 'fixed'
  textArea.style.top = 0
  textArea.style.left = 0
  textArea.style.width = '2em'
  textArea.style.height = '2em'
  textArea.style.padding = 0
  textArea.style.border = 'none'
  textArea.style.outline = 'none'
  textArea.style.boxShadow = 'none'
  textArea.style.background = 'transparent'
  textArea.value = window.location.href
  document.body.appendChild(textArea)
  textArea.select()

  try {
    const successful = document.execCommand('copy')
    const msg = successful ? 'successful' : 'unsuccessful'
    console.log('Copying text command was ' + msg)
  } catch (err) {
    console.log('Oops, unable to copy')
  }
  document.body.removeChild(textArea)
}

function decode (str) {
  const elem = document.createElement('textarea')
  elem.innerHTML = str
  return elem.value
}

NavBar.propTypes = {
  'user': PropTypes.object,
  'room': PropTypes.object,
  'onMicSwitchChange': PropTypes.func,
  'micSwitch': PropTypes.bool,
  'time': PropTypes.number
}
