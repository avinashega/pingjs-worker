module.exports = function (db) {

    db.bind('users', {
    	

        getByUsername: function (username, cb) {
            this.findOne({username: username}, cb);
        }
    });

};