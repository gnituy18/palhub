const sockets = {}
export default function socketio (ns) {
  if (typeof sockets[ns] === 'undefined') {
    sockets[ns] = io(ns)
  }
  return sockets[ns]
}
