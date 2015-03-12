var SliderWidget = function(el) {
  this.el = el;
  this.init();
};

SliderWidget.prototype.init = function() {
  this.controlLeft = this.el.find('.control-left');
  this.controlRight = this.el.find('.control-right');
  this.views = this.el.find('.views');
  this.viewList = this.el.find('.view');

  this.index = 0;
  this.bind();
};

SliderWidget.prototype.bind = function() {
  var self = this;
  this.controlRight.click(function() {
    if (self.index < self.viewList.length - 2) {
      self.index++;
      self.slideTo();
    }
  });
  this.controlLeft.click(function() {
    if (self.index > 0) {
      self.index--;
      self.slideTo();
    }
  });
};

SliderWidget.prototype.slideTo = function() {
  var left = -this.viewList.width() * this.index;
  this.views.animate({
    'left': left
  }, 300, 'swing');
};
