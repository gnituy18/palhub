export default class MessageBox extends React.Component {

  render () {
    return (
      <div>
        {this.props.msg.map((m, index) => <p key={index}>{m}</p>)}
      </div>
    )
  }
}

MessageBox.propTypes = {'msg': PropTypes.array}

