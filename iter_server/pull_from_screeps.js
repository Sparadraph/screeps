var args = {}
var req_args = ['p', 'l'];
var default_args = {
    b: 'tmp',
};

process.argv.forEach(function(val, index, array) {
    if(val.indexOf('=') >= 0)
        args[val.split('=')[0]] = val.split('=')[1];
})

for(var i in req_args)
    if(args[req_args[i]] == undefined)
        console.log('Required arg ' + req_args[i] + ' missing.');

for(var i in default_args)
    if(args[i] == undefined)
        args[i] = default_args[i];


function getData(login, password, branch){
    var https = require('https');
    var fs = require('fs');
    var str = '';

    var options = {
        hostname: 'screeps.com',
        port: 443,
        path: '/api/user/code?branch=' + branch,
        method: 'GET',
        auth: login + ':' + password,
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    };

    callback = function(response) {

        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end', function () {
            var modules = JSON.parse(str).modules;
            for(var file in modules) {
                console.log(file);
                fs.writeFile("/home/odoo/scripts/modules/" + file + ".js", modules[file], function(err) {
                    if(err) {
                        return console.log(err);
                    }
                });
            }
        });
    }

  var req = https.request(options, callback).end();

}

getData(args['l'], args['p'], args['b']);