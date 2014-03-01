var q = require('q'),
    i = require('../interface'),
    agenda = i.agenda(),
    users = i.db().users,
    crypto = require('crypto');

module.exports = {
		getByUsername: function(username){
	    	return q.nbind(users.getByUsername, users)(username);
	    }
}