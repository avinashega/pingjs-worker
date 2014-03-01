module.exports = function (db) {
	var ObjectID = require('mongoskin').ObjectID;
    db.bind('agendaJobs', {
    	getById: function(id, cb){
    		this.findOne({_id: ObjectID.createFromHexString(id)}, cb);
    	}
    });

};