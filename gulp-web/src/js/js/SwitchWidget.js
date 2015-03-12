var SwitchWidget = function(el, defaultStatus, dotTrigger) {
  this.el = $(el);
  this.switchStatus = defaultStatus || 'on';
  this.duration = 100;

  this.init(dotTrigger);
};

SwitchWidget.prototype.get = function() {
  return this.switchStatus;
};

SwitchWidget.prototype.getBool = function() {
  return this.switchStatus == 'on';
};

SwitchWidget.prototype.init = function(dotTrigger) {
  var tmpl = '<div class="switch-bg">' +
  '<div class="inline-block left">ON</div>' +
  '<div class="inline-block right">OFF</div>' +
  '<div class="switch"></div>' +
  '</div>';
  this.el.empty().append(tmpl);
  this.switchBg = this.el.find('.switch-bg');
  this.switchBtn = this.el.find('.switch');
  this.switchBg.addClass(this.switchStatus);

  if (this.switchStatus == 'on') {
    this.on(dotTrigger);
  } else {
    this.off(dotTrigger);
  }

  var self = this;
  this.el.click(function() {
    if (self.switchStatus == 'on') {
      self.off();
    } else {
      self.on();
    }
  });
};

SwitchWidget.prototype.on = function(dotTrigger) {
  this.switchStatus = 'on';
  this.switchBg.addClass('on');
  this.switchBg.removeClass('off');
  this.switchBtn.animate({
    'left': '29px'
  }, this.duration, 'swing');
  if (dotTrigger) return;
  this.el.trigger('on');
};

SwitchWidget.prototype.off = function(dotTrigger) {
  this.switchStatus = 'off';
  this.switchBg.addClass('off');
  this.switchBg.removeClass('on');
  this.switchBtn.animate({
    'left': '2px'
  }, this.duration, 'swing');
  if (dotTrigger) return;
  this.el.trigger('off');
};

SwitchWidget.prototype.set = function(bool, dotTrigger) {
  if (bool) {
    this.on(dotTrigger);
  } else {
    this.off(dotTrigger);
  }
};