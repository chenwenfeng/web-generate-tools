'use strict';

var Url = {};
var baseUrl = 'http://modouwifi.net/';
// var baseUrl = location.protocol + "//" + location.host + '/';

Url.build = function(path, params) {
  var url = baseUrl + path + '?timestamp=' + Date.parse(new Date());
  if(params) {
    for(k in params) {
      url += '&' + k + '=' + params[k];
    }
  }
  return url;
};
