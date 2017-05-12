export default class MessageBox extends React.Component {

  render () {
    return (
      <div className='msg-box'>
        {this.props.msg.map((m, index) => <div key={index}>{m}</div>)}
      </div>
    )
  }
}

MessageBox.propTypes = {'msg': PropTypes.array}

