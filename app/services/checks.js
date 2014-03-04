var q = require('q');
var checks = require('../interface').db().checks;
module.exports={
		averageResponseTime: function(id, count){
			return q.nbind(checks.getChecks, checks)(id, count).then(function(checks){
				if(!checks || checks.length == 0){
					return 0;
				}
				var sum;
				for(var i=0;i<checks.length;i++){
					sum+=checks[i].response_time
				}
				return sum/checks.length;
			});
		}
}