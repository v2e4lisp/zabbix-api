var request = require('request');

/**
 * Expose `ZabbixApi`
 */

module.exports = ZabbixApi;

/**
 * Zabbix Api constructor
 *
 * @param {string} user
 * @param {string} password
 * @param {string} api_url
 * @api public
 */

function ZabbixApi (user, password, api_url) {
  this.user = user;
  this.password = password;
  this.api_url = api_url;
  this.id = 0;
};

/**
 * Send api request
 *
 * @param {string} method
 * @param {string} params
 * @param fn
 * @api public
 */

ZabbixApi.prototype.request = function (method, params, fn) {
  var self = this;
  this.auth(function(error, self) {
    if (error) {
      fn(error, null);
    } else {
      params.output = params.output || 'extend';
      var data = {
        method: method,
        params: params,
        auth: self.auth_token,
      };
      self.post(data, self.wrap(fn));
    }
  });
}

/**
 * Api `user.login` action . It's wrapper of `auth`.
 * It's public but you don't have to call this method before you send other api request.
 * We'll handle the case. Any time you send a request, we'll check if you're authenticated.
 * if not we'll first send a `user.login` request to get an `auth_token`.
 *
 * @param {function} fn
 * @api public
 */

ZabbixApi.prototype.login = function (fn) {
  this.auth (function (error, self) {
    fn(error, self.auth_token);
  });
};

/* private */

/**
 * send a http post request
 *
 * @param {object} data
 * @param {function} fn
 * @api private
 */

ZabbixApi.prototype.post = function(data, fn) {
  data.jsonrpc = '2.0';
  data.id = ++this.id;
  var option = {
    method: 'POST',
    url: this.api_url,
    headers: {'Content-Type': 'application/json-rpc'},
    body: JSON.stringify(data),
  };
  request(option, fn);
};

/**
 * Authenticate the user.
 *
 * @param {function} fn
 * @api private
 */

ZabbixApi.prototype.auth = function(fn) {
  if (this.auth_token) {
    fn(null, this);
  } else {
    var data = {
      method: "user.login",
      params: {user: this.user, password: this.password}
    };
    var self = this;
    this.post(data, function(err, res, body) {
      if (err || res.statusCode != 200) {
        fn(new Error("HTTP request error. message: " + err + ". statusCode: " + res.statusCode), self);
      }
      body = JSON.parse(body);
      self.auth_token = body.result;
      fn(body.error, self);
    });
  }
};

/**
 * wrap the `request` callback function
 *
 * @param {function} fn
 * @api private
 */

ZabbixApi.prototype.wrap = function (fn) {
  var self = this;
  return function(err, res, body) {
    if (err || res.statusCode != 200) {
      fn(new Error("HTTP request error. message: " + err + ". statusCode: " + res.statusCode), null);
    } else {
      body = JSON.parse(body);
      fn(body.error, body.result);
    }
  }
};