const url = new URL(window.location.href)
const access_token = url.searchParams.get('access_token')

function goHome () {
  window.location = '/admin/home?access_token=' + access_token
}
