var app    = require('express').createServer(),
	config = require('./config'),
	Meetup = require('./lib/meetup');

// Configuration

var meetup = new Meetup({
	key: config.meetup.key
});

// View engine wrapper for Handlebars ( https://github.com/donpark/hbs )

app.set('view engine', 'hbs');

// Routes 

app.get('/', function(req, res){
    var options = {
        locals: {
            title: "VegasJS - Las Vegas Area JavaScript User Group"
        }
    };
    res.render('index', options);
});

app.get('/members', function(req, res){
    var options = {
		locals: {
			title: 'VegasJS Member List (via the Meetup.com API)'
		}
    };
	meetup.memberList( config.meetup.group, function(members) {
		options.locals.members = members;
		res.render('members', options);
	});
});

// app.get('/member/:id'), function(req,res) {
// 	console.log( req.params.id );
// });


app.listen(8080);
