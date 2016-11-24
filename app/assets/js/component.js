var sideNav = document.getElementsByClassName('side-nav')[0]
var sideNavNeighbor = document.getElementsByClassName('side-nav-neighbor')[0]
var sideNavControl = document.getElementsByClassName('side-nav-control')[0]

if (sideNav) {
  sideNav.style.width = '400px'
  sideNavNeighbor.style.marginLeft = '400px'
  sideNavControl.onclick = function() {
    if (sideNav.style.width == '0px') {
      sideNav.style.width = '400px'
      sideNavNeighbor.style.marginLeft = '400px'
    } else {
      sideNav.style.width = '0'
      sideNavNeighbor.style.marginLeft = '0'
      console.log(sideNav.style)
    }
  }
}
