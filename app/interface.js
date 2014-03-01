var m = require('underscore').memoize;

module.exports = {

    /**
     * @return {SkinDb}
     */
    db: m(function () {
        return require('./bootstraps/mongoskin');
    }),

    /**
     *
     * @returns {agenda}
     */
    agenda: function () {
        return require('./bootstraps/agenda');
    },

    userService: function () {
        return require('./services/users');
    },
    jobService: function () {
        return require('./services/jobs');
    },
    emailService: function(){
    	return require('./services/email');
    },
    siteService: function(){
    	return require('./services/sites');
    },
    pingService: function(){
    	return require('./services/ping');
    }
};