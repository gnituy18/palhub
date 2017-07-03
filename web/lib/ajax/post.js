export default function post (url, data) {
  return new Promise(resolve => {
    const xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
      if (this.readyState === XMLHttpRequest.DONE) {
        resolve({
          'status': this.status,
          'data': xhttp.response
        })
      }
    }
    xhttp.open('POST', url, true)
    xhttp.setRequestHeader('Content-type', 'application/json')
    xhttp.send(JSON.stringify(data || {}))
  })
}
