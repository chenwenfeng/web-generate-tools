var IpInputWidget = function(el, defaultv, option, readonlyArr) {
  this.el = $(el);
  this.v = defaultv;
  this.isOption = option || false;
  this.readonlyArr = readonlyArr || [false, false, false, false];

  this.verify = 'info';
  this.init();
};


IpInputWidget.prototype.init = function() {
  var readonly1 = this.readonlyArr[0] ? 'readonly' : '';
  var readonly2 = this.readonlyArr[1] ? 'readonly' : '';
  var readonly3 = this.readonlyArr[2] ? 'readonly' : '';
  var readonly4 = this.readonlyArr[3] ? 'readonly' : '';
  var tmpl = '<div class="ip-input-box">' +
  '<input type="text" class="ip-input ip-input1" ' + readonly1 + ' maxlength="3">' +
  '.' +
  '<input type="text" class="ip-input ip-input2" ' + readonly2 + ' maxlength="3">' +
  '.' +
  '<input type="text" class="ip-input ip-input3" ' + readonly3 + ' maxlength="3">' +
  '.' +
  '<input type="text" class="ip-input ip-input4" ' + readonly4 + ' maxlength="3">' +
  '<div class="fack"></div>' +
  '</div>';

  this.el.empty().append(tmpl);

  this.bind();

  if (this.v) {
    this.set(this.v);
  }
};

IpInputWidget.prototype.bind = function() {
  this.inputBox = this.el.find('.ip-input-box');
  this.ip1 = this.el.find('.ip-input1');
  this.ip2 = this.el.find('.ip-input2');
  this.ip3 = this.el.find('.ip-input3');
  this.ip4 = this.el.find('.ip-input4');

  this.ip1.blur(function() {
    self.checkVerify();
    self.inputBox.removeClass('ip-input-box-focus');
  });
  this.ip2.blur(function() {
    self.checkVerify();
    self.inputBox.removeClass('ip-input-box-focus');
  });
  this.ip3.blur(function() {
    self.checkVerify();
    self.inputBox.removeClass('ip-input-box-focus');
  });
  this.ip4.blur(function() {
    self.checkVerify();
    self.inputBox.removeClass('ip-input-box-focus');
  });

  this.ip1.focus(function() {
    self.inputBox.removeClass('ip-input-box-valid');
    self.inputBox.removeClass('ip-input-box-invalid');
    self.inputBox.addClass('ip-input-box-focus');
  });
  this.ip2.focus(function() {
    self.inputBox.addClass('ip-input-box-focus');
    self.inputBox.removeClass('ip-input-box-valid');
    self.inputBox.removeClass('ip-input-box-invalid');
  });
  this.ip3.focus(function() {
    self.inputBox.addClass('ip-input-box-focus');
    self.inputBox.removeClass('ip-input-box-valid');
    self.inputBox.removeClass('ip-input-box-invalid');
  });
  this.ip4.focus(function() {
    self.inputBox.addClass('ip-input-box-focus');
    self.inputBox.removeClass('ip-input-box-valid');
    self.inputBox.removeClass('ip-input-box-invalid');
  });
  var self = this;
  this.inputBox.find('.ip-input').bind('keydown', function(e) {
    if (!self.isValidKey(e)) return false;

    var next_octet = $(this).next('input.ip-input');
    var prev_octet = $(this).prev('input.ip-input');

    // jump to next octet on period if this octet has a value
    if (e.keyCode == 110 || e.keyCode == 190) {
      if ($(this).val().length) {
        if (next_octet.length) {
          next_octet.focus();
          next_octet.select();
        }
      }
      return false;
    }

    if (($(this).caret()[1] - $(this).caret()[0]) && self.isNumeric(e)) {
      return true;
    }

    // jump to next octet if maxlength is reached and number key or right arrow is pressed
    if ((this.value.length == this.getAttribute('maxlength') && $(this).caret()[0] == this.getAttribute('maxlength') && (self.isNumeric(e) || e.keyCode == 39)) || (e.keyCode == 39 && $(this).caret()[0] == this.value.length)) {
      if (next_octet.length) {
        $(this).trigger('blur');
        next_octet.focus().caret(0);
        return true;
      }
    }

    // jump to previous octet if left arrow is pressed and caret is at the 0 position
    if (e.keyCode == 37 && $(this).caret()[0] == 0) {
      if (prev_octet.length) {
        $(this).trigger('blur');
        prev_octet.caret(prev_octet.val().length);
        return false;
      }
    }

    // jump to previous octet on backspace
    if (e.keyCode == 8 && $(this).caret()[0] == 0 && $(this).caret()[0] == $(this).caret()[1]) {
      if (prev_octet.length) {
        $(this).trigger('blur');
        prev_octet.focus().caret(prev_octet.val().length);
        return false;
      }
    }
  }).bind('keyup', function(e) {
    // save value to original input if all octets have been entered
    if ($('input.ip-input', $(this).parent()).filter(function() {
        return this.value.length;
      }).length == 4) {
      var ip_value = [];
      $('input.ip-input', $(this).parent()).each(function() {
        ip_value.push(this.value);
      });
    }
  }).bind('blur', function() {
    if (this.value > 255) {
      this.value = 255;
    }
  });
};

IpInputWidget.prototype.clearStyle = function() {
  this.inputBox.removeClass('ip-input-box-valid');
  this.inputBox.removeClass('ip-input-box-invalid');
};

IpInputWidget.prototype.checkVerify = function() {
  var flag = 'valid';
  if (
  this.check(this.ip1[0].value) &&
    this.check(this.ip2[0].value) &&
    this.check(this.ip3[0].value) &&
    this.check(this.ip4[0].value)
  ) {
    flag = 'valid';
  } else {
    flag = 'invalid';
  }

  if (this.isOption) {
    if (
      this.ip1[0].value == '' &&
      this.ip2[0].value == '' &&
      this.ip3[0].value == '' &&
      this.ip4[0].value == ''
    ) {
      flag = 'info';
    }
  }

  if (flag == 'valid') {
    this.inputBox.addClass('ip-input-box-valid');
    this.inputBox.removeClass('ip-input-box-invalid');
  } else if (flag == 'invalid') {
    this.inputBox.removeClass('ip-input-box-valid');
    this.inputBox.addClass('ip-input-box-invalid');
  } else {
    this.inputBox.removeClass('ip-input-box-valid');
    this.inputBox.removeClass('ip-input-box-invalid');
  }
  this.verify = flag;
  this.el.trigger('verify');
};

IpInputWidget.prototype.check = function(v) {
  var flag = true;
  try {
    v = parseInt(v);
    if (v >= 0 && v <= 255) {
      flag = true;
    } else {
      flag = false;
    }
  } catch ( e ) {
    flag = false;
  }
  return flag;
};

IpInputWidget.prototype.isValidKey = function(e) {
  var valid = [
    8, // backspace
    9, // tab
    13, // enter
    27, // escape
    35, // end
    36, // home
    37, // left arrow
    39, // right arrow
    46, // delete
    48, 96, // 0
    49, 97, // 1
    50, 98, // 2
    51, 99, // 3
    52, 100, // 4
    53, 101, // 5
    54, 102, // 6
    55, 103, // 7
    56, 104, // 8
    57, 105, // 9
    110, 190 // period
  ];

  // only allow shift key with tab
  if (e.shiftKey && e.keyCode != 9) return false;

  for (var i = 0, c; c = valid[i]; i++) {
    if (e.keyCode == c) return true;
  }

  return false;
};


IpInputWidget.prototype.isNumeric = function(e) {
  if (e.shiftKey) return false;
  return (e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105);
};


IpInputWidget.prototype.get = function() {
  var arr = [
    +this.ip1[0].value,
    +this.ip2[0].value,
    +this.ip3[0].value,
    +this.ip4[0].value
  ];
  return arr.join('.');
};

IpInputWidget.prototype.set = function(ip) {
  ip = ip || '...';
  var arr = ip.split('.');
  this.ip1.val(arr[0] || '');
  this.ip2.val(arr[1] || '');
  this.ip3.val(arr[2] || '');
  this.ip4.val(arr[3] || '');
};

IpInputWidget.prototype.enable = function(bool) {
  if (bool) {
    this.inputBox.removeClass('ip-input-box-disabled');
  } else {
    this.inputBox.addClass('ip-input-box-disabled');
  }
};


/**
 * Sync other inputWidget inputs
 *
 * @param {InputWidget} iw
 * @param {Function} cb
 */

IpInputWidget.prototype.syncOtherInputWidget = function(iw /* inputWidget */ , cb) {
  var self = this;
  this.inputBox.find('.ip-input').bind('keyup', function(e) {
    var current = $(e.currentTarget);
    var index = current.index()
    cb(self, iw, current, index);
  });
};