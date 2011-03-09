var rest = require('reston');

var Meetup = function(options) {
	var self = this;
	self.options = options;
};

Meetup.prototype.memberList = function( group, callback ) {
	var self = this;
	var req = rest.get('http://api.meetup.com/members?key=' + self.options.key + '&sign=true&group_urlname=' + group );
	var data = '';
	req.on('data', function(chunk){
		data += chunk.toString();
	});
	req.on('success', function() {
		var response = JSON.parse( data );
		callback( response.results );
	});
	req.send();
};

module.exports = Meetup;