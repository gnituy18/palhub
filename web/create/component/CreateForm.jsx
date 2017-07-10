import {post} from '../../lib/ajax'

export default class Create extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      'inputValue': '',
      'type': 'regular',
      'typeInfo': '一般模式:房間沒有人的時候會自動消失',
      'min': 30,
      'hour': 0
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.onTypeChange = this.onTypeChange.bind(this)
    this.onMinChange = this.onMinChange.bind(this)
    this.onHourChange = this.onHourChange.bind(this)
    this.submit = this.submit.bind(this)
  }

  render () {
    return (
      <div className='wrapper'>
        <div className='center'>
          <h2>你想要討論的主題是什麼？</h2>
          <input onKeyPress={this.handleKeyPress} onChange={this.handleChange} value={this.state.inputValue} type='text' />
          <h3>{this.state.typeInfo}</h3>
          <input onChange={this.onTypeChange} checked={this.state.type === 'regular'} type='radio' name='type' value='regular' />
          <label>一般</label>
          <input onChange={this.onTypeChange} checked={this.state.type === 'hourglass'} type='radio' name='type' value='hourglass' />
          <label>限時</label>
          {this.state.type === 'hourglass' && <div>
              <input onChange={this.onHourChange} type='number' value={this.state.hour.toString()} name='hour' />
              小時
              <input onChange={this.onMinChange} type='number' value={this.state.min.toString()} name='min'/>
              分鐘
            </div>
          }
          <div>
            <button className='btn' onClick={this.submit}>確定</button>
          </div>
        </div>
      </div>
    )
  }

  onMinChange (e) {
    let min = e.currentTarget.value ? parseInt(e.currentTarget.value) : 0
    if (min > 59) {
      min = 59
    } else if (min < 0) {
      min = 0
    }
    this.setState({'min': min})
  }

  onHourChange (e) {
    let hour = e.currentTarget.value ? parseInt(e.currentTarget.value) : 0
    if (hour > 23) {
      hour = 23
    } else if (hour < 0) {
      hour = 0
    }
    this.setState({'hour': hour})
  }

  onTypeChange (e) {
    const type = e.currentTarget.value
    this.setState({'type': type})
    switch (type) {
      case 'regular':
        this.setState({'typeInfo': '一般討論:聊天室沒有人的時候會自動消失'})
        break
      case 'hourglass':
        this.setState({'typeInfo': '限時討論:聊天室會在你指定的時間後消失'})
    }
  }

  handleChange (e) {
    this.setState({'inputValue': e.target.value})
  }

  handleKeyPress (e) {
    console.log(window.userID)
    ga('send', 'event', 'Create', 'enter', 'testing')
    switch (e.key) {
      case 'Enter':
        this.submit()
        break
    }
  }

  submit () {
    if (this.state.inputValue === '') {
      return
    }
    const reqObj = {
      'name': this.state.inputValue,
      'type': this.state.type,
      'creator': window.userID
    }
    switch (this.state.type) {
      case 'hourglass':
        reqObj.min = this.state.min
        reqObj.hour = this.state.hour
    }

    post('/create', reqObj)
    .then(response => {
      console.log(response)
      window.location.replace('room/' + JSON.parse(response.data).id)
    })
    this.setState({'inputValue': ''})
  }
}
