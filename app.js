// This is the server-side file of our mobile remote controller app.
// It initializes socket.io and a new express instance.
// Start it by running 'node app.js' from your terminal.


// Creating an express server

var express = require('express'),
	app = express();

// This is needed if the app is run on heroku and other cloud providers:

var port = process.env.PORT || 8080;

// Initialize a new socket.io object. It is bound to 
// the express app, which allows them to coexist.

var io = require('socket.io').listen(app.listen(port));


// App Configuration

// Make the files in the public folder available to the world
app.use(express.static(__dirname + '/public'));




/*

var Mailgun = require('mailgun-js');

//Your api key, from Mailgun’s Control Panel
var api_key = 'key-2d4244fd435a3a95a35243a8157b2f80';

//Your domain, from the Mailgun Control Panel
var domain = 'sandboxb225f63b84b243a9915bd00881346b80.mailgun.org';

//Your sending email address
var from_who = 'postmaster@sandboxb225f63b84b243a9915bd00881346b80.mailgun.org';
//Your sending email address
var to_who = 'jabisheik@gmail.com';

//We pass the api_key and domain to the wrapper, or it won't be able to identify + send emails
    var mailgun = new Mailgun({apiKey: api_key, domain: domain});

    var data = {
    //Specify email data
      from: from_who,
    //The email to contact
      to: to_who,
    //Subject and text data  
      subject: 'Hello from Mailgun',
      html: 'Hello, This is not a plain-text email, I wanted to test some spicy Mailgun sauce in NodeJS!'
    }

    //Invokes the method to send emails given the above data with the helper library
    mailgun.messages().send(data, function (err, body) {
        //If there is an error, render the error page
        if (err) {
            //res.render('error', { error : err});
            console.log("got an error: ", err);
        }
        //Else we can greet    and leave
        else {
            //Here "submitted.jade" is the view file for this landing page 
            //We pass the variable "email" from the url parameter in an object rendered by Jade
           // res.render('submitted', { email : req.params.mail });
            console.log(body);
        }
    });


*/



// This is a secret key that prevents others from opening your presentation
// and controlling it. Change it to something that only you know.

var secret = 'abisheik';

// Initialize a new socket.io application

var presentation = io.on('connection', function (socket) {

	// A new client has come online. Check the secret key and 
	// emit a "granted" or "denied" message.

	socket.on('load', function(data){

		socket.emit('access', {
			access: (data.key === secret ? "granted" : "denied")
		});

	});

	// Clients send the 'slide-changed' message whenever they navigate to a new slide.

	socket.on('slide-changed', function(data){

		// Check the secret key again

		if(data.key === secret) {

			// Tell all connected clients to navigate to the new slide
			
			presentation.emit('navigate', {
				hash: data.hash
			});
		}

	});

});

console.log('Your presentation is running on http://localhost:' + port);