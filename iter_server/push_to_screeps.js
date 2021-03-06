var walk = require('walk');
var fs = require('fs');

var args = {}
process.argv.forEach(function(val, index, array) {
    if(val.indexOf('=') >= 0) {
        args[val.split('=')[0]] = val.split('=')[1];
    }
})

req_args = ['p', 'l'];
default_args = {
    b: 'tmp',
};

for(var i in req_args) {
    if(args[req_args[i]] == undefined) {
        console.log('Required arg ' + req_args[i] + ' missing.');
    }
}


for(var i in default_args) {
    if(args[i] == undefined) {
        args[i] = default_args[i];
    }
}



var files = {};
var walker = walk.walk('/home/odoo/scripts/modules', { followLinks: false });

walker.on('file', function(root, stat, next) {
    if(stat.name.slice(-3) == '.js')
        files[stat.name.slice(0,-3)] = fs.readFileSync(root + '/' + stat.name, 'utf-8');
    next();
});

walker.on('end', function() {
    var https = require('https');

    var email = args['l'],
        password = args['p'],
        data = {
            branch: args['b'],
            modules: files,
        };

    var req = https.request({
        hostname: 'screeps.com',
        port: 443,
        path: '/api/user/code',
        method: 'POST',
        auth: email + ':' + password,
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    });

    req.write(JSON.stringify(data));
    req.end();

    req.on('response', function (response) {
      console.log('STATUS: ' + response.statusCode);
      console.log('HEADERS: ' + JSON.stringify(response.headers));
      response.setEncoding('utf8');
      response.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
      });
    });
});



