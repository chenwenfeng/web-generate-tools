var InputSelectWidget = function(el, placeholder, default_arr, custom, defaultv) {
  this.el = $(el);
  this.placeholder = placeholder;
  this.el.addClass('select-wrapper');
  this.default_arr = default_arr;
  this.custom = custom;
  this.v = defaultv || '';
  this.show = false;

  this.init();
};

InputSelectWidget.prototype.get = function() {
  var r = {
    'v': this.v,
    'custom': this.custom
  };
  return r;
};

InputSelectWidget.prototype.init = function() {
  var tmpl = '<div class="display-value-box">' +
  '<input class="inline-block display-value" value="' + this.v + '" placeholder="' + this.placeholder + '">' +
  '<div class="inline-block icon"></div>' +
  '</div>' +
  '<div class="select-list" style="display:none;"></div>';

  this.el.empty().append(tmpl);

  this.bind();

  this.renderList();
};

InputSelectWidget.prototype.bind = function() {
  this.selectContainer = this.el.find('.select-list');
  this.displayIcon = this.el.find('.display-value-box .icon');
  this.displayValue = this.el.find('.display-value');
  this.displayValue.placeholder();

  var self = this;

  this.displayIcon.click(function() {
    if (self.show) {
      self.show = false;
      self.el.removeClass('select-wrapper-focus');
      self.selectContainer.hide();
    } else {
      self.el.addClass('select-wrapper-focus');
      self.show = true;
      self.selectContainer.show();
    }
  });

  $(document).click(function(e) {
    if (self.el.has($(e.target)).length == 0) {
      self.show = false;
      self.el.removeClass('select-wrapper-focus');
      self.selectContainer.hide();
    }
  });

  this.displayValue.focus(function() {
    self.el.addClass('select-wrapper-input-focus');
  });
  this.displayValue.blur(function() {
    var v = self.displayValue.val();
    if (v && !self.checkExist(v)) {
      self.custom = v;
      self.renderList();
    }
    self.v = v;
    self.el.removeClass('select-wrapper-input-focus');
  });
  this.displayValue.keypress(function(e) {
    var v = self.displayValue.val();
    if (e.witch == 13 && v && !self.checkExist(v)) {
      self.custom = v;
      self.displayValue[0].blur();
      self.renderList();
    }
    self.v = v;
  });
};

InputSelectWidget.prototype.renderList = function() {
  var tmpl = '';
  if (this.custom) {
    tmpl += '<div class="select-item">' + this.custom + '</div>';
  }
  $(this.default_arr).each(function(index, item) {
    tmpl += '<div class="select-item">' + item + '</div>';
  });
  this.selectContainer.empty().append(tmpl);

  this.bindList();
};

InputSelectWidget.prototype.bindList = function() {
  var self = this;
  this.selects = this.el.find('.select-item');
  this.selects.click(function() {
    self.v = $(this).html();
    self.displayValue.val($(this).html());
    self.selectContainer.hide();
    self.show = false;
    self.el.removeClass('select-wrapper-focus');
    self.el.trigger('selected');
    self.selects.removeClass('select-item-active');
    $(this).addClass('select-item-active');
  });
};

InputSelectWidget.prototype.checkExist = function(v) {
  return this.default_arr.indexOf(v) >= 0 || this.custom == v;
};

InputSelectWidget.prototype.set = function(v) {
  var self = this;
  $(this.custom_arr).each(function(index, s) {
    if (s == v) {
      self.v = v;
      self.displayValue.val(v);
    }
  });
  $(this.default_arr).each(function(index, s) {
    if (s == v) {
      self.v = v;
      self.displayValue.val(v);
    }
  });
  this.selects.each(function(i, s) {
    if ($(s).html() == v) {
      $(s).addClass('select-item-active');
    } else {
      $(s).removeClass('select-item-active');
    }
  });
};