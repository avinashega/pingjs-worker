var config = require('getconfig');
var Agenda = require('agenda');
url = config.mongodb.uri + '?auto_reconnect',
    agenda = new Agenda({
        db: {
            address: url,
            collection: 'agendaJobs'
        },
        processEvery: '5 seconds'
    });

module.exports = agenda;