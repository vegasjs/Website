var app = require('express').createServer();

// Configuration

// View engine wrapper for Handlebars ( https://github.com/donpark/hbs )

app.set('view engine', 'hbs');

// Routes 

app.get('/', function(req, res){
    var options = {
        locals: {
            title: "VegasJS - Las Vegas Area JavaScript User Group",
            members: ["Jimmy", "Pawel", "Alex", "Dylan", "Daniel", "RayMorgan"],
        }
    };
    res.render('index', options);
});


app.listen(8080);
