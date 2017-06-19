export default function auth () {
  return new Promise(resolve => {
    FB.getLoginStatus(response => {
      resolve(response)
    })
  })
}
