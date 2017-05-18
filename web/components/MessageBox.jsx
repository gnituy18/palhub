export default class MessageBox extends React.Component {

  render () {
    const msgList = this.props.msg.map((msg, index) => {
      const pictureStyle = {'backgroundImage': 'url(' + msg.user.picture + ')'}
      return (
        <div key={index}>
          <div className='avatar-normal' style={pictureStyle}></div>
          <div>{msg.user.name}:{msg.body}</div>
        </div>
      )
    })

    return <div className='msg-box'>{msgList}</div>
  }
}

MessageBox.propTypes = {'msg': PropTypes.array}

