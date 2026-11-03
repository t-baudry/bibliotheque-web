var WA_Processor;

if (!WA_Processor) {
  WA_Processor = function () {
    this.account = "";
    this.cv = "";
    this.parameters = new Array();
    this.imageURL = "";
    this.imageObj = new Image(1, 1);
    this.imageObj.isSet = false;
    this.imageObj.isComplete = false;
    this.ignorePv = false;

    this.cookieEnabled = function () {
      return navigator.cookieEnabled ? 1 : 0;
    };

    this.referrer = function () {
      if (document.referrer)
        if (
          WA_Processor.isFrameReachable === true &&
          document.referrer === WA_Processor.parentLocation.split("#")[0]
        )
          return WA_Processor.topReferrer;
        else return document.referrer;
      else return "";
    };

    this.url = function () {
      return WA_Processor.isFrameReachable === true &&
        document.referrer === WA_Processor.parentLocation.split("#")[0]
        ? WA_Processor.topLocation.href
        : document.location.href;
    };

    this.pageTitle = function () {
      if (document.title) return document.title;
      return "";
    };

    this.screenWidth = function () {
      if (window.screen.width) return window.screen.width;
      return 0;
    };

    this.screenHeight = function () {
      if (window.screen.height) return window.screen.height;
      return 0;
    };

    this.colorDepth = function () {
      if (window.screen.colorDepth) return window.screen.colorDepth;
      return 0;
    };

    this.windowWidth = function () {
      if (window.innerWidth) return window.innerWidth;
      if (document.documentElement.clientWidth)
        return document.documentElement.clientWidth;
      return 0;
    };

    this.windowHeight = function () {
      if (window.innerHeight) return window.innerHeight;
      if (document.documentElement.clientHeight)
        return document.documentElement.clientHeight;
      return 0;
    };

    this.javaEnabled = function () {
      return navigator.javaEnabled() ? 1 : 0;
    };

    this.flashVersion = function () {
      var mVersion = "";
      var mNavigator = navigator;
      if (mNavigator.plugins && mNavigator.plugins.length) {
        for (var i = 0; i < mNavigator.plugins.length; i++) {
          if (mNavigator.plugins[i].name.indexOf("Shockwave Flash") != -1) {
            mVersion =
              mNavigator.plugins[i].description.split("Shockwave Flash ")[1];
            break;
          }
        }
      } else if (window.ActiveXObject) {
        for (var i = 10; i >= 2; i--) {
          try {
            var mFlash = eval(
              "new ActiveXObject('ShockwaveFlash.ShockwaveFlash." + i + "');"
            );
            if (mFlash) {
              mVersion = i + ".0";
              break;
            }
          } catch (e) {}
        }
      }
      return mVersion;
    };

    this.makeImageURL = function () {
      var mProtocol = document.location.protocol;
      if (!(mProtocol == "http:" || mProtocol == "https:")) return;

      var url = this.url(),
        referrer = this.referrer();

      if (referrer && referrer !== "")
        referrer = WA_Processor.processReferrerForGoogleContentExperiment(
          referrer,
          url
        );
      url = WA_Processor.processUrl(url, this.parameters, this.ignorePv);

      var query =
        "?ga=" +
        this.account +
        (WA_Processor.siteCookie ? "&sc=" + WA_Processor.siteCookie : "") +
        (this.cv ? "&cv=" + WA_Processor.encodeURL(this.cv) : "") +
        "&r=" +
        WA_Processor.encodeURL(referrer) +
        "&u=" +
        WA_Processor.encodeURL(url) +
        "&jse=" +
        "1" +
        "&ce=" +
        this.cookieEnabled() +
        "&pt=" +
        WA_Processor.encodeURL(this.pageTitle()) +
        "&je=" +
        this.javaEnabled() +
        "&fv=" +
        WA_Processor.encodeURL(this.flashVersion()) +
        "&w=" +
        this.screenWidth() +
        "&h=" +
        this.screenHeight() +
        "&cd=" +
        this.colorDepth() +
        "&ww=" +
        this.windowWidth() +
        "&wh=" +
        this.windowHeight() +
        (WA_Processor.errorList.length != 0
          ? "&e=" +
            WA_Processor.encodeURL(WA_Processor.errorList.join(".")).substring(
              0,
              100
            )
          : "");

      return "https://tr.webantenna.info/_webantenna.png" + query;
    };

    this.link = function (url) {
      return WA_Processor.makeCrossDomainLink(url);
    };
  };

  WA_Processor.encodeURL = function (s, u) {
    if (typeof encodeURIComponent == "function") {
      if (u) return encodeURI(s);
      else return encodeURIComponent(s);
    } else {
      return escape(s);
    }
  };

  WA_Processor.decodeURL = function (s) {
    if (typeof decodeURIComponent == "function") {
      return decodeURIComponent(s);
    } else {
      return unescape(s);
    }
  };

  WA_Processor.setParentsProperty = function () {
    try {
      WA_Processor.parentLocation = parent.location.href;
      WA_Processor.topReferrer = top.document.referrer;
      WA_Processor.topLocation = top.document.location;
      WA_Processor.isFrameReachable = true;
    } catch (e) {
      WA_Processor.isFrameReachable = false;
    }
  };

  WA_Processor.makeCrossDomainLink = function (url) {
    if (
      !WA_Processor.siteCookie ||
      Object.prototype.toString.call(url) !== "[object String]"
    )
      return url;
    var urlObj = WA_Processor.parseURL(url);
    urlObj.query.push(
      "waxc=" +
        WA_Processor.siteCookie +
        "." +
        parseInt(new Date().getTime() / 100).toString(36)
    );
    return WA_Processor.unparseURL(urlObj);
  };

  WA_Processor.extractHostname = function (url) {
    var index;
    index = url.indexOf(":");
    if (index === -1) return null;
    url = url.substring(index + 3);
    index = url.indexOf("/");
    if (index === -1) index = url.length;
    url = url.substring(0, index) || null;
    return url;
  };

  WA_Processor.parseURL = function (url) {
    var fragment = "";
    var query = "";
    var queryArray = [];
    var index = url.indexOf("#");
    if (index != -1) {
      fragment = url.substring(index + 1);
      url = url.substring(0, index);
    }
    index = url.indexOf("?");
    if (index != -1) {
      query = url.substring(index + 1);
      url = url.substring(0, index);
    }
    if (query != "") {
      queryArray = query.split("&");
    }
    return {
      url: url,
      hostname: WA_Processor.extractHostname(url),
      query: queryArray,
      fragment: fragment,
    };
  };

  WA_Processor.unparseURL = function (urlObject) {
    var query = "";
    var separator = "?";
    for (var i = 0; i < urlObject.query.length; i++) {
      query += separator + urlObject.query[i];
      separator = "&";
    }
    return (
      urlObject.url +
      query +
      (urlObject.fragment ? "#" + urlObject.fragment : "")
    );
  };

  WA_Processor.getCookie = function (key) {
    var cookies = document.cookie.split("; ");
    var values = new Array();
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].split("=");
      if (cookie[0] == key) {
        values.push(cookie[1]);
      }
    }
    return values;
  };

  WA_Processor.getLocalStorage = function (key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {}
    return null;
  };

  WA_Processor.selectCookie = function (cookies) {
    var hasCorrectCookie = false;
    var index = 0,
      label,
      minlabel = Infinity;
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].split(".");
      if (
        cookie.length >= 2 &&
        cookie[0].length == 16 &&
        cookie[1].length == 1
      ) {
        hasCorrectCookie = true;
        label = parseInt(cookie[1]);
        label = label > 0 ? label : Infinity;
        if (minlabel > label) {
          index = i;
          minlabel = label;
        }
      }
    }
    if (!hasCorrectCookie) return undefined;
    return cookies[index];
  };

  WA_Processor.setCookie = function (key, val, path, lifetime, domain) {
    if (lifetime) {
      var expires = new Date(new Date().getTime() + lifetime).toUTCString();
    }
    document.cookie =
      key +
      "=" +
      val +
      (path ? "; path=" + path : "") +
      (expires ? "; expires=" + expires : "") +
      (domain ? "; domain=" + domain : "");
  };

  WA_Processor.setLocalStorage = function (key, val) {
    try {
      localStorage.setItem(key, val);
    } catch (e) {}
  };

  WA_Processor.getDomainArray = function () {
    var domainArray = new Array();
    var domain = document.domain;
    for (var i = Infinity; i != -1; ) {
      i = domain.lastIndexOf(".", i - 1);
      domainArray.push(domain.substring(i + 1));
    }
    return domainArray;
  };

  WA_Processor.getRadixTime = function () {
    var time = new Date().getTime();
    var rtime = "";
    for (var i = 0; i < 7; i++) {
      rtime = WA_Processor.RADIX.charAt(time % 62) + rtime;
      time = Math.floor(time / 62);
    }
    return rtime;
  };

  WA_Processor.makeSiteCookie = function () {
    var siteCookie = WA_Processor.getRadixTime();
    for (var i = 0; i < 9; i++) {
      siteCookie += WA_Processor.RADIX.charAt(Math.floor(Math.random() * 62));
    }
    return siteCookie;
  };

  WA_Processor.updateSiteCookie = function () {
    var key = "_wasc";
    var values = WA_Processor.getCookie(key);
    var ls_value = WA_Processor.getLocalStorage(key);
    if (ls_value && ls_value.substring(ls_value.length - 2) != ".1") {
      values.push(ls_value);
    }
    var path = "/",
      lifetime = 63072000000,
      delim = ".";
    var domainArray = WA_Processor.getDomainArray();
    var value;
    if (values.length == 0) {
      var siteCookie = WA_Processor.makeSiteCookie();
      if (ls_value && ls_value.split(delim)[0].length == 16) {
        siteCookie = ls_value.split(delim)[0];
      }
      for (var i = 0; i < domainArray.length + 1; i++) {
        value = siteCookie + delim + (i == domainArray.length ? 0 : i + 1);
        WA_Processor.setCookie(key, value, path, lifetime, domainArray[i]);
        values = WA_Processor.getCookie(key);
        if (values.length != 0) {
          value = values[0];
          WA_Processor.setLocalStorage(key, value);
          WA_Processor.siteCookie = value.split(delim)[0];
          return;
        }
      }
      WA_Processor.siteCookie = "";
      return;
    }
    value = WA_Processor.selectCookie(values);
    if (value == undefined) {
      WA_Processor.siteCookie = "";
      return;
    }
    var label = parseInt(value.split(delim)[1]);
    var domain = label == 0 ? undefined : domainArray[label - 1];
    WA_Processor.setCookie(key, value, path, lifetime, domain);
    WA_Processor.setLocalStorage(key, value);
    WA_Processor.siteCookie = value.split(delim)[0];
  };

  WA_Processor.processReferrerForGoogleContentExperiment = function (
    referrerStr,
    urlStr
  ) {
    var urlObj = WA_Processor.parseURL(urlStr),
      referrerObj = WA_Processor.parseURL(referrerStr),
      newReferrerStr = null,
      hasUtmExpId = false;
    for (var i = 0; i < urlObj.query.length; i++) {
      var parameter = urlObj.query[i];
      if (parameter.indexOf("utm_expid=") !== -1) {
        hasUtmExpId = true;
      }
      if (parameter.indexOf("utm_referrer") !== -1) {
        newReferrerStr = WA_Processor.decodeURL(parameter.split("=")[1]);
      }
    }
    if (hasUtmExpId && urlObj["hostname"] === referrerObj["hostname"]) {
      if (newReferrerStr === null) newReferrerStr = "";
      return newReferrerStr;
    }
    return referrerStr;
  };

  WA_Processor.processUrl = function (urlStr, parameters, ignorePv) {
    var urlObj = WA_Processor.parseURL(urlStr),
      newQuery = [];
    for (var i = 0; i < urlObj.query.length; i++) {
      var parameter = urlObj.query[i];
      if (WA_Processor.crossDomainFilter(parameter)) continue;
      newQuery.push(parameter);
    }
    urlObj.query = newQuery;
    for (var key in parameters) {
      if (!WA_Processor.ignoreList[key]) {
        urlObj.query.push(
          WA_Processor.encodeURL(key) +
            "=" +
            WA_Processor.encodeURL(parameters[key])
        );
      }
    }
    if (ignorePv) urlObj.query.push("waet=0");
    urlStr = WA_Processor.unparseURL(urlObj);
    return urlStr;
  };

  WA_Processor.crossDomainFilter = function (parameter) {
    if (parameter.indexOf("waxc=") == -1) return false;
    try {
      var time = parseInt(
        parameter.split("=")[1].split(".")[1].substring(0, 7),
        36
      );
    } catch (e) {
      return true;
    }
    if (!time) return true;
    var dt = parseInt(new Date().getTime() / 100) - time;
    return dt < 0 || dt > 1200;
  };

  WA_Processor.register = function (processor) {
    WA_Processor.prepareQueue(processor.account);
    WA_Processor.registerToQueue(processor);
  };

  WA_Processor.send = function (account) {
    var queue = WA_Processor.findQueue(account);
    WA_Processor.processQueue(queue);
  };

  WA_Processor.registerToQueue = function (processor) {
    var queue = WA_Processor.findQueue(processor.account);
    queue.push(processor);
  };

  WA_Processor.findQueue = function (account) {
    return WA_Processor.queues[account];
  };

  WA_Processor.processQueue = function (queue) {
    var uncompletedProcessors = queue.filter(function (processor) {
      return processor.imageObj.isComplete === false;
    });
    if (uncompletedProcessors.length === 0) {
      return;
    }
    var oldestUncompletedProcessor = uncompletedProcessors[0];
    if (oldestUncompletedProcessor.imageObj.isSet === false) {
      WA_Processor.processImage(oldestUncompletedProcessor);
    }
  };

  WA_Processor.processImage = function (processor) {
    processor.imageObj.onload = function () {
      WA_Processor.onLoadFunc(processor.imageObj, processor.account);
    };
    processor.imageObj.onerror = function () {
      WA_Processor.onLoadFunc(processor.imageObj, processor.account);
    };

    processor.imageObj.src = processor.makeImageURL();
    processor.imageObj.isSet = true;
  };

  WA_Processor.onLoadFunc = function (imageObj, account) {
    imageObj.isComplete = true;
    WA_Processor.send(account);
  };

  WA_Processor.prepareQueue = function (account) {
    if (WA_Processor.hasQueue(account)) {
      return;
    }
    WA_Processor.queues[account] = [];
  };

  WA_Processor.hasQueue = function (account) {
    return WA_Processor.queues.hasOwnProperty(account);
  };

  WA_Processor.webantenna = function (ignorePv) {
    _wa.ignorePv = ignorePv;

    WA_Processor.register(_wa);
    WA_Processor.send(_wa.account);
  };

  WA_Processor.queues = {};
  WA_Processor.isFrameReachable = true;
  WA_Processor.setParentsProperty();
  WA_Processor.useSiteCookie = true;
  WA_Processor.siteCookie = "";
  WA_Processor.ignoreList = new Array();
  WA_Processor.errorList = new Array();
  WA_Processor.RADIX =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  try {
    WA_Processor.updateSiteCookie();
  } catch (e) {
    WA_Processor.errorList.unshift(e);
  }
}

var _wa = new WA_Processor();

function webantenna(ignorePv) {
  WA_Processor.webantenna(ignorePv);
}
