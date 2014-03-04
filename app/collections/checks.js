
module.exports = function (db) {

    db.bind('checks', { 
    	getChecks: function(id, count, cb){
    		this.find({id:id}).sort({$natural:-1}).limit(count, cb);
    	}
    });

};