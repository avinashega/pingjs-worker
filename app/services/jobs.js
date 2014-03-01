var q = require('q'),
    i = require('../interface'),
	jobs = i.db().agendaJobs;
module.exports = {
		getById: function(id){
			return q.nbind(jobs.getById, jobs)(id);
		}
}