var q = require('q');
var i = require('../interface');
var sites = i.db().sites;
var agendaJobs = i.db().agendaJobs;
var ObjectID = require('mongoskin').ObjectID;
var logger = require('./logger');
var request = require('request');
var activity = i.db().activity;
var checks = i.db().checks;

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
						var url = site.protocol+"://"+site.url;
						if(site.port && site.port != ""){
							url+= ":"+site.port;
						}
						var starttime = Date.now();
						request(url, function (error, response, body) { //configure timeout later
							var endtime = Date.now();
							var responsetime = endtime - starttime;
							if (!error && (response.statusCode >= 200 && response.statusCode <= 300)) {
								status = 'UP';
								q.nbind(checks.save, checks)({url: url, username: site.username, id:site._id.toString(), status: status, code: response.statusCode, time: starttime, response_time: responsetime});
								logger.info(JSON.stringify({'url': url, 'status': status, 'code': response.statusCode, 'time': endtime, 'response_time': responsetime}));
							} else {
								status = 'DOWN';
								var statusCode="";
								if(response){
									statusCode = response.statusCode;
								} else {
									console.log(error);
								}
								q.nbind(checks.save, checks)({url: url, username: site.username, id:site._id.toString(), status: status, code: statusCode, time: starttime, response_time: responsetime});
								logger.info(JSON.stringify({'url': url, 'status': status, 'code': statusCode, 'time': starttime, 'response_time': responsetime}));
						    }
							
							i.userService().getByUsername(site.username).then(function(user){
								if(status != site.last_status){
									site.last_status = status;
									q.nbind(activity.save, activity)({date:Date.now(), username:site.username, activity:'Check Performed: '+site.url+' is '+status});
									i.emailService().statusChange(user, site);
								}
								/*if(site.responsiveness && parseInt(site.responsiveness) > 0) {
									i.checkService().averageResponseTime(site._id.toString(), 100).then(function(avgResponseTime){
										console.log(avgResponseTime, parseInt(site.responsiveness));
										if(avgResponseTime > parseInt(site.responsiveness)){
											i.emailService().responseThreshold(user, site, avgResponseTime);
										}
									});	
								}*/
							});
							site.last_status_change = endtime;
							if(!site.pingCount)
								site.pingCount = 0;
							if(!site.downtimeCount)
								site.downtimeCount=0;
							var averageResponseTime = 0;
							var pingCount = site.pingCount+1;
							var downtimeCount = site.downtimeCount;
							if(status == 'DOWN')
								downtimeCount++;
							if(!site.averageResponseTime){
								averageResponseTime = responsetime;
							} else {
								averageResponseTime = ((site.averageResponseTime*site.pingCount)+responsetime)/pingCount;
							}
							var averageResponsiveTime = 
							q.nbind(sites.update, sites)({_id:site._id}, {$set:{last_status:status, last_status_change:endtime, pingCount:pingCount, averageResponseTime: averageResponseTime, downtimeCount:downtimeCount}});
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