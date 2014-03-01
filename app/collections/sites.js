
module.exports = function (db) {

    db.bind('sites', {
    	getById: function(id, cb){
    		this.findOne({_id:id}, cb);
    	}

    });

};