export default function api (url) {
  return new Promise(resolve => {
    FB.api(url, response => {
      resolve(response)
    })
  })
}
