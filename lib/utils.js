var utils = require('underscore');

utils.objectToQueryString = function (obj) {
  var str = [];
  for (var p in obj) {
    str.push(p + "=" + encodeURIComponent(obj[p]));
  }
  return str.join('&');
};

module.exports = utils;
