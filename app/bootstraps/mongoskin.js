var config = require('getconfig'),
    mongoskin = require('mongoskin'),
    fs = require('fs'),
    url = "mongodb://"+config.mongo.username+":"+config.mongo.password+"@"+config.mongo.host+":"+config.mongo.port+"/"+config.mongo.db+"/?auto_reconnect=true",
    db = mongoskin.db(url, {w: 1});

var collectionsDir = __dirname + '/../collections/';
 fs.readdirSync(collectionsDir).forEach(function (file) {
     require(collectionsDir + file)(db);
 });

module.exports = db;