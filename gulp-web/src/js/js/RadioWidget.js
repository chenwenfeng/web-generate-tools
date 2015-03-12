var RadioWidget = function(el, arr, defaultv) {
  this.el = $(el);
  this.arr = arr;
  this.v = defaultv || arr[0].value;

  this.init();
};

RadioWidget.prototype.init = function() {
  var tmpl = '';
  $(this.arr).each(function(index, item) {
    tmpl += '<a href="javascript:void(0)" class="inline-block radio ' + item.value + ' mock-link" data="' + item.value + '">' +
    '<div class="inline-block icon"></div>' +
    '<div class="inline-block">' + item.name + '</div>' +
    '</a>';
  });

  this.el.empty().append(tmpl);

  this.bind();

  this.set(this.v);
};

RadioWidget.prototype.bind = function() {
  this.radios = this.el.find('.radio');
  var self = this;

  this.radios.click(function() {
    var target = null;
    if ($(this).hasClass('radio')) {
      target = $(this);
    } else {
      target = $(this).parent();
    }
    self.radios.removeClass('radio-active');
    target.addClass('radio-active');
    if (self.v != target.attr('data')) {
      self.v = target.attr('data');
      self.el.trigger('checked');
    }
  });
};

RadioWidget.prototype.get = function(v) {
  return this.v;
};

RadioWidget.prototype.set = function(v, dotTrigger) {
  this.v = v;
  this.radios.each(function(index, r) {
    if ($(r).attr('data') == v) {
      $(r).addClass('radio-active');
    } else {
      $(r).removeClass('radio-active');
    }
  });
  if (dotTrigger) return;
  this.el.trigger('checked');
};