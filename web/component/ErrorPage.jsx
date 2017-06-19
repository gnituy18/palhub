export default class ErrorPage extends React.Component {
  render () {
    return (
      <div className='wrapper'>
        <div className='center'>
          <h2>{this.props.msg}</h2>
          <h2>請關閉此分頁</h2>
        </div>
      </div>
    )
  }
}

