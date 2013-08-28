# zabbix-api
Simple Zabbix API wrapper for node.js

## Usage and API
```javascript
var Zabbix = require('zabbix-api');
var zbx = new Zabbix(user, password, api_url);

# You don't have to login explicitly. `request` method will keep you authenticated.
# `output` default is `extend`
# `res` is the result is an JS object, a property from zabbix response.
zbx.request('hostgroup.get', {hostids: 1}, function (err, res) {
  if (err) {
    console.log(err.message);
  } else {
    console.log(res.name);
  }
});
```
