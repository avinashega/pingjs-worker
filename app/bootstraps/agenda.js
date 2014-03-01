var config = require('getconfig');
var Agenda = require('agenda');
    url = "mongodb://"+config.mongo.username+":"+config.mongo.password+"@"+config.mongo.host+":"+config.mongo.port+"/"+config.mongo.db+"/?auto_reconnect=true",
    agenda = new Agenda({
        db: {
            address: url,
            collection: 'agendaJobs'
        },
        processEvery: '5 seconds'
    });

module.exports = agenda;