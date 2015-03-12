var Ajax = {};
Ajax.get = function(url, callback, handler, faildCallback) {
  var c = function(data, status, xhr) {
    if (handler) {
      callback.call(handler, data);
    } else {
      callback(data);
    }
  }

  return $.ajax({
    url: url,
    success: c,
    dataType: 'json',
    statusCode: {
      403: function() {
        location.href = 'login.html';
      },
      404: function() {
        if (faildCallback) {
          faildCallback();
        }
      },
      500: function() {
        if (faildCallback) {
          faildCallback();
        }
      }
    }
  });
};

Ajax.post = function(path, content, callback, handler, faildCallback) {
  content = $.stringifyJSON(content);
  var c = function(data, status, xhr) {
    if (handler) {
      callback.call(handler, data);
    } else {
      callback(data);
    }
  }

  return $.ajax({
    url: path,
    success: c,
    type: 'POST',
    dataType: 'json',
    data: content,
    statusCode: {
      403: function() {
        location.href = 'login.html';
      },
      404: function() {
        if (faildCallback) {
          faildCallback();
        }
      },
      500: function() {
        if (faildCallback) {
          faildCallback();
        }
      }
    }
  });
}