const sockets = {}
export default function socketio (ns) {
  if (typeof sockets[ns] === 'undefined') {
    console.log(ns)
    sockets[ns] = io(ns)
  }
  return sockets[ns]
}
