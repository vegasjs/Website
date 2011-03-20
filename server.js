/* vi: set tabstop=2 shiftwidth=2 expandtab */
var app = require('express').createServer(),
    config = require('./config'),
    Meetup = require('./lib/meetup');

// Configuration
var meetup = new Meetup({
  group: config.meetup.group,
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
  meetup.memberList(function(members) {
    options.locals.members = members;
    res.render('members', options);
  });
});

app.get('/events', function(req, res){
  var options = {
    locals: {
      title: 'VegasJS Events (via the Meetup.com API)'
    }
  };
  meetup.events(function(events) {
    options.locals.events = events;
    res.render('events', options);
  });
});

// app.get('/member/:id'), function(req,res) {
// 	console.log( req.params.id );
// });

app.listen(80);
