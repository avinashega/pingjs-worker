var q = require('q');
var i = require('../interface');
var config = require('getconfig');
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill(config.mandrill.apikey);

module.exports = function (agenda) {
    agenda.define('email', {concurrency: 100}, function (job, done) {
        var message = job.attrs.data;
        mandrill_client.messages.send({"message": message}, function(result) {
            console.log(result);
            done();
        }, function(e) {
            console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        });
    });
};