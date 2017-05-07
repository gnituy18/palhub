import Room from '../components/Room.jsx'
const user = {'name': document.getElementById('name').innerHTML}

ReactDOM.render(
  <Room user={user}/>,
  document.getElementById('root')
)
