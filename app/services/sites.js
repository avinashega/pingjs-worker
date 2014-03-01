var q = require('q');
var i = require('../interface');
var sites = i.db().sites;
var ObjectId = require('mongoskin').ObjectID;

module.exports={	
	getSiteById: function(id){
		return q.nbind(sites.getById, sites)(ObjectId.createFromHexString(id));
	}
}