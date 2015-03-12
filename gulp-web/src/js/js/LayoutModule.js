var LayoutModule = function() {
  this.fixCache();
};

LayoutModule.prototype.fixCache = function() {
  $('a').each(function(i, a) {
    var o = $(a).attr('href');
    if(o && (o.indexOf('javascript') == -1) && (!$(a).hasClass('nofix-cache')) && (0 != '#')) {
      var n = '';
      if(o.indexOf('?') == -1) {
        n = o + '?r=' + Date.parse(new Date());
      } else {
        n = o + '&r=' + Date.parse(new Date());
      }
      $(a).attr('href', n);
    }
  });
};

