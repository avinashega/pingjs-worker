var i = require('./interface');
var config = require('getconfig');
var amqp = require('amqplib').connect(config.amqp.RABBITMQ_RX_URL);

module.exports = function(){
	amqp.then(function(conn) {
  	  var ok = conn.createChannel();
      console.log('connected to rabbitMQ');
  	  ok = ok.then(function(ch) {
  	    ch.consume(config.amqp.jobs_queue, function(msg) {
  	      if (msg !== null) {
  	    	  console.log('processing job '+msg.content.toString());
  	    	  i.pingService().ping(msg.content.toString());
  	    	  ch.ack(msg);
  	      }
  	    });
  	  });
  	  return ok;
  	}).then(null, console.warn);
};