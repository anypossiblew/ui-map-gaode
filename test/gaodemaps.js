(function() { 
  function getScript(src) {
    document.write('<' + 'script src="' + src + '"' +
                   ' type="text/javascript"><' + '/script>');
  }
 
  getScript("http://webapi.amap.com/maps?v=1.2&key=53f7e239ddb8ea62ba552742a233ed1f");
})();