var q = require('q');
var i = require('../interface');
var sites = i.db().sites;
var agendaJobs = i.db().agendaJobs;
var ObjectID = require('mongoskin').ObjectID;
var logger = require('./logger');
var request = require('request');

_setJobIsPinging = function(id, status) {
    q.nbind(agendaJobs.update, agendaJobs) (
        {
            _id: ObjectID.createFromHexString(id)
        },
        {
            $set: {isPinging: status}
        }
    );
};

module.exports={
	ping: function(id){
		i.jobService().getById(id).then(function(job){
			if(job){
				i.siteService().getSiteById(job.data._id).then(function(site){
					if(site){
						var status;
						var starttime = Date.now();
						var url = site.protocol+"://"+site.url+ site.port != ""? ":"+site.port : "";
						request.head({url: url, timeout: 30*1000}, function (error, response, body) { //configure timeout later
							var endtime = Date.now();
							var responsetime = endtime - starttime;
							if (!error && (response.statusCode >= 200 && response.statusCode <= 300)) {
								status = 'UP';
								logger.info(JSON.stringify({'url': url, 'status': status, 'code': response.statusCode, 'time': endtime, 'response_time': responsetime}));
							} else {
								status = 'DOWN';
								var statusCode="";
								if(response){
									statusCode = response.statusCode;
								}
								logger.info(JSON.stringify({'url': url, 'status': status, 'code': statusCode, 'time': Date.now(), 'response_time': responsetime}));
						    }
							if(status != site.last_status){
								site.last_status = status;
								i.userService().getByUsername(site.username).then(function(user){
									return i.emailService().statusChange(user, site);
								}).fail(function(err){
									console.log(err);
								})
								
							}
							site.last_status_change = endtime;
							if(!site.pingCount)
								site.pingCount = 0;
							pingCount = site.pingCount+1;
							q.nbind(sites.update, sites)({_id:site._id}, {$set:{last_status:status, last_status_change:endtime, pingCount:pingCount}});
							_setJobIsPinging(id, false);
						});
					} else {
						console.log('No site found');
					}
				}).fail(function(err){
					console.log(err);
				});
			} else {
				console.log('No Job Id found');
			}
		}).fail(function(err){
			console.log(err);
		});		
	}
		
}