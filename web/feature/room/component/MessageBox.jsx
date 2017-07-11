export default class MessageBox extends React.Component {

  constructor (props) {
    super(props)
    this.state = {'msgNum': 0}
  }

  render () {
    const msgList = this.props.msgs.map((msg, index) => {
      const pictureStyle = {'backgroundImage': 'url(' + msg.user.picture + ')'}
      const msgStyle = {'padding': '5px 0'}
      return (
        <div style={msgStyle} key={index}>
          <div className='avatar-normal' style={pictureStyle}></div>
          <div className='msg-container' >
            <div className='msg-user-name'>{msg.user.name}</div>
            <div className='msg-body'>{msg.body}</div>
          </div>
        </div>
      )
    })

    return <div ref={div => {
      if (div !== null && this.props.msgs.length > this.state.msgNum) {
        this.setState({'msgNum': this.props.msgs.length})
        div.scrollTop = div.scrollHeight
      }
    }} className='msg-box'>{msgList}</div>
  }
}

MessageBox.propTypes = {'msgs': PropTypes.array}
