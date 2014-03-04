
module.exports = function (db) {

    db.bind('checks', { 
    	getChecks: function(id, count, cb){
    		this.find({id:id}, {limit:count, sort:[['_id',-1]]}).toArray(cb);
    	}
    });

};