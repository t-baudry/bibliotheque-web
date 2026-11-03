(function(w,d,s){
  w.IMUIDRequest = w.IMUIDRequest || [];
  IMUIDRequest.push({
    customerId: 11310,
    callback: function (r) {
      document.body.insertAdjacentHTML(
        'beforeend',
        '<img style="width: 0;height: 0;position: absolute;display: none;visibility: hidden;" loading="eager" src="https://b6.im-apps.net/11310/set/10104568/' + r.uid + '?vid=' + r.vid + '" />'
      )
    },
    callbackTimeout: 3000
  });
  var f=d.getElementsByTagName(s)[0], e=d.createElement(s); e.async=true; e.defer=true; e.src='https://dmp.im-apps.net/sdk/im-uid.js'; f.parentNode.insertBefore(e,f);
})(window,document,'script');

