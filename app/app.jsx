const socket = io()

class Room extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      msg: ['hi']
    }
    this.appendMsg = this.appendMsg.bind(this)
  }

  componentDidMount () {
    socket.on('msg', this.appendMsg)
  }

  render () {
    return (
      <div>
        <MessageBox msg={this.state.msg}/>
        <InputBox/>
      </div>
    )
  }

  appendMsg(data){
    this.setState((prevState, props) => {
      return {
        msg: prevState.msg.concat(data.value)
      }
    })
  }
}

class MessageBox extends React.Component {
  constructor (props) {
    super(props)
    console.log(this.props.msg)
  }
  
  render () {
    return (
      <div>
        {this.props.msg.map((m, index) => {
          return (
            <p key={index}>{m}</p>
          )
        })}     
      </div>
    ) 
  }
}

class InputBox extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      inputValue: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.sendMsg = this.sendMsg.bind(this)
  }

  render () {
    return (
      <div>
        <input value={this.state.inputValue} onChange={this.handleChange} type='text'></input>
        <button onClick={this.sendMsg}>submit</button>
      </div>
    )
  }

  handleChange (evt) {
    this.setState({
      inputValue: evt.target.value
    })
  }
  
  sendMsg () {
    socket.emit('send msg', {
      value: this.state.inputValue
    })
    this.setState({
      inputValue: ''
    })
  }
}

ReactDOM.render(
  <Room/>,
  document.getElementById('root')
)
