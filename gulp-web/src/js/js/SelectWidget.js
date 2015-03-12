var SelectWidget = function(el, arr, defaultv) {
  this.el = $(el);
  this.el.addClass('select-wrapper');

  this.refresh(arr, defaultv);
};

SelectWidget.prototype.refresh = function(arr, v) {
  this.arr = arr;
  var dv, dn;
  for (var i = 0, l = this.arr.length; i < l; i++) {
    if (v == this.arr[i].value) {
      dv = v;
      dn = this.arr[i].name;
      break;
    }
  }
  this.v = dv || this.arr[0].value;
  this.displayName = dn || this.arr[0].name;
  this.show = false;

  this.init();
};

SelectWidget.prototype.get = function() {
  return this.v;
};

SelectWidget.prototype.getItemByValue = function(v) {
  for (var i = 0, l = this.arr.length; i < l; i++) {
    if (v === this.arr[i].value) {
      return this.arr[i];
    }
  }
  return null;
};

SelectWidget.prototype.init = function() {
  var self= this;
  var tmpl = '<div class="display-value-box">' +
  '<div class="inline-block display-value">' + this.displayName + '</div>' +
  '<div class="inline-block icon"></div>' +
  '</div>' +
  '<div class="select-list" style="display:none;">';

  $(this.arr).each(function(index, item) {
    if (item.value == self.v) {
      tmpl += '<div class="select-item select-item-active" data="' + item.value + '">' + item.name + '</div>';
    } else {
      tmpl += '<div class="select-item" data="' + item.value + '">' + item.name + '</div>';
    }
  });

  tmpl += '</div>';

  this.el.empty().append(tmpl);

  this.bind();
};

SelectWidget.prototype.bind = function() {
  this.selectContainer = this.el.find('.select-list');
  this.selects = this.el.find('.select-item');
  this.displayBox = this.el.find('.display-value-box');
  this.displayValue = this.el.find('.display-value');
  var self = this;

  this.selects.click(function() {
    var index = $(this).index();
    self.v = $(this).attr('data');
    self.displayName = $(this).html();
    self.displayValue.html($(this).html());
    self.selectContainer.hide();
    self.show = false;
    self.el.removeClass('select-wrapper-focus');
    self.el.trigger('selected', [index, self.v]);
    self.selects.removeClass('select-item-active');
    $(this).addClass('select-item-active');
  });

  this.displayBox.click(function() {
    if (self.show) {
      self.show = false;
      self.el.removeClass('select-wrapper-focus');
      self.selectContainer.hide();
    } else {
      self.show = true;
      self.el.addClass('select-wrapper-focus');
      self.selectContainer.show();
    }
  });

  $(document).click(function(e) {
    if (self.el.has($(e.target)).length == 0) {
      self.el.removeClass('select-wrapper-focus');
      self.show = false;
      self.selectContainer.hide();
    }
  });
};

SelectWidget.prototype.set = function(v, opt_cb) {
  var self = this;
  var f = false;
  this.selects.each(function(i, s) {
    if ($(s).attr('data') == v) {
      f = true;
      $(this).trigger('click');
    }
  });
  if(!f && opt_cb) {
    opt_cb();
  }
};