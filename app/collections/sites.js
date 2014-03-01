var ObjectID = require('mongoskin').ObjectID;

module.exports = function (db) {

    db.bind('sites', {
    	getById: function(id, cb){
    		this.findOne({_id:ObjectId.createFromHexString(id)}, cb);
    	}

    });

};