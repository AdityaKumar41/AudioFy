function checkScreenWidth() {
  var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

  if (screenWidth < 768) {
      // Redirect
      window.location.href = 'additional/screen.html';
  }
}
checkScreenWidth();
window.addEventListener('resize', checkScreenWidth);