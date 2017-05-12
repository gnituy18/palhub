export default class MessageBox extends React.Component {

  render () {
    return (
      <div className='msg-box'>
        {this.props.msg.map((msg, index) => <div key={index}>{msg.user.name}:{msg.body}</div>)}
      </div>
    )
  }
}

MessageBox.propTypes = {'msg': PropTypes.array}

