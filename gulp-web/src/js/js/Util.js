var Util = {};

// eg: 12:01:02
Util.timeFormat = function(time_insecond) {
  var sec_num = parseInt(time_insecond, 10); // don't forget the second param
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  var time = hours + ':' + minutes + ':' + seconds;
  return time;
};

// eg: 12小时12分
Util.timeFormat2 = function(time_insecond) {
  var sec_num = parseInt(time_insecond, 10); // don't forget the second param
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  var time = hours + '小时' + minutes + '分';
  return time;
};


Util.decimal = function(num) {
  var vv = Math.pow(10, 2);
  return Math.round(num * vv) / vv;
}

Util.tokbps = function(kbps) {
  return Util.decimal(kbps) + 'Kb/s';
};

Util.toKBps = function(kbps) {
  return Util.decimal(kbps) + 'KB/s';
};

Util.toGB = function(MB) {
  return Util.decimal(MB / 1000) + 'GB';
};

Util.toMB = function(MB) {
  return Util.decimal(MB) + 'MB';
};

Util.toXB = function(KB) {
  if (KB > 1000000) {
    return Util.decimal(KB / 1000000) + 'GB';
  } else if (KB > 1000) {
    return Util.decimal(KB / 1000) + 'MB';
  } else {
    return KB + 'KB';
  }
};

Util.toXB3 = function(B) {
  if (B > 1000000000) {
    return Util.decimal(B / 1000000000) + 'GB';
  } else if (B > 1000000) {
    return Util.decimal(B / 1000000) + 'MB';
  } else if (B > 1000) {
    return Util.decimal(B / 1000) + 'KB';
  } else {
    return B + 'B';
  }

};

Util.toXB2 = function(MB) {
  if (MB > 1000) {
    return Util.decimal(MB / 1000) + 'GB';
  } else {
    return Util.decimal(MB) + 'MB';
  }
};

Util.toXbps = function(kbps) {
  if (kbps > 1000) {
    return Util.decimal(kbps / 1000) + 'Mb/s';
  } else {
    return Util.decimal(kbps) + 'Kb/s';
  }
};

Util.toPercent = function(numerator, denominator) {
  return Util.decimal((numerator / denominator) * 100) + '%';
};

Util.scrollToElement = function(el) {
  $('html, body').animate({
    scrollTop: $(el).offset().top
  }, 1000);
};


/**
 * Parse MAC address.
 *
 * @param {String} s
 * @return {Array}
 */

Util.parseMAC = function(s) {
  var m;

  // IEEE 802 MAC-48, EUI-48
  if (/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(s) ||
    /^([0-9A-Fa-f]{4}[\.]){2}([0-9A-Fa-f]{4})$/.test(s) ||

    // EUI-64
    /^([0-9A-Fa-f]{2}[:-]){7}([0-9A-Fa-f]{2})$/.test(s) ||
    /^([0-9A-Fa-f]{4}[\.]){3}([0-9A-Fa-f]{4})$/.test(s) ||

    // without ":-"
    /^[0-9A-Fa-f]{12}$/.test(s) ||

    /^[0-9A-Fa-f]{16}$/.test(s)) {
    m = s.match(/[0-9A-Fa-f]{2}/g);
  }

  return m;
};


/**
 * Count UTF-8 string size
 *
 * @param {String} s
 * @return {Number}
 */

Util.utf8length = function(s) {
  var len = s.length,
    u8len = 0,
    i = 0, c;
  for (; i < len; i++) {
    c = s.charCodeAt(i);
    if (c < 0x007f) { // ASCII
      u8len++;
    } else if (c <= 0x07ff) {
      u8len += 2;
    } else if (c <= 0xd7ff || 0xe000 <= c) {
      u8len += 3;
    } else if (c <= 0xdbff) { // high-surrogate code
      c = s.charCodeAt(++i);
      if (c < 0xdc00 || 0xdfff < c) { // Is trailing char low-surrogate code?
        throw 'Error: Invalid UTF-16 sequence. Missing low-surrogate code.';
      }
      u8len += 4;
    } else /*if (c <= 0xdfff)*/ { // low-surrogate code
      throw 'Error: Invalid UTF-16 sequence. Missing high-surrogate code.';
    }
  }
  return u8len;
};

Util.getParameterByName = function(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
  return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};
