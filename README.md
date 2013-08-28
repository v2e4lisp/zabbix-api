# zabbix-api
Simple Zabbix API wrapper for node.js.

## Install
```bash
npm install zabbix-api
```

## Usage and API
```javascript
var Zabbix = require('zabbix-api');
var zbx = new Zabbix(user, password, api_url);

// You don't have to do login yourself. `request` method will keep you authenticated.
// `output` default is `extend`
// `res` is an JS object, `result` property from zabbix response.
zbx.request('hostgroup.get', {hostids: 1}, function (err, res) {
  if (err) {
    console.log(err.message);
  } else {
    console.log(res.hostid);
    console.log(res.name);
  }
});


// Acturally there is another api method but I don't really think you'll need that.
// In case that you may want to just test if the user/password is valid ,`login` is for this job.
zbx.request(function (err, auth_token) {
  err || console.log(auth_token);
}
```
