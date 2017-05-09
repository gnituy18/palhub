export default class Audios extends React.Component {
  render () {
    const audioList = this.props.streams.map((stream, index) => <audio ref={audio => {
      audio.srcObject = stream
    }} key={index} autoPlay></audio>
    )
    return (
      <div>
        {audioList}
      </div>
    )
  }
}
Audios.propTypes = {'streams': PropTypes.array}
