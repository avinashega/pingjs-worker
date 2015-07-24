var fs = require('fs'),
	jade = require('jade');
	q = require('q'),
	i = require('../interface'),
	config = require('getconfig');
	agenda = i.agenda();
var statusChange, responsiveAlert;
module.exports = {
		statusChange: function(user, site){
			if(!statusChange){
				var data = fs.readFileSync('views/email/statusChange.jade', 'utf8');
				statusChange = jade.compile(data);
			}
			var html = statusChange({user:user, site:site});
			var data = {
                    html: html,
                    text: 'Site Status Change',
                    subject: 'Pingjs: '+site.url+' is '+site.last_status,
                    from_email: config.emails.info,
                    from_name: 'Pingjs',
                    to:[{
                    	email: user.email,
                    	type: 'to'
                    }]                        
                },
                job;
            console.log('saving job');
            job = agenda.create('email', data);
            return q.nbind(job.save, job)();
		},
		responseThreshold: function(user, site, responsiveness){
			if(!responsiveAlert){
				var data = fs.readFileSync('views/email/responsiveAlert.jade', 'utf8');
				responsiveAlert = jade.compile(data);
			}
			var html = responsiveAlert({user:user, site:site, responsiveness:responsiveness});
			var data = {
                    html: html,
                    text: 'High Response Time Alert',
                    subject: 'ALERT High Response Time: '+site.url+' [pingjs.in]',
                    from_email: config.emails.info,
                    from_name: 'Pingjs Alerts',
                    to:[{
                    	email: user.email,
                    	type: 'to'
                    }]                        
                },
                job;
            console.log('saving job');
            job = agenda.create('email', data);
            return q.nbind(job.save, job)();
		}
};