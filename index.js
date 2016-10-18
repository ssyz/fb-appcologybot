/************************************
This is the heart of your bot.

This program is coded in JavaScript and requires the installation of additional software and an established server.
BEFORE MODIFYING THIS CODE SEE CANVAS FOR SETUP INSTRUCTIONS (...)

The code has been simplified to if...else statements that you can modify to the functionalities you want.
I have provided a few examples for handling typical situations and one API integration example - more details below.
For the basics of if...else statements, please read: http://www.w3schools.com/js/js_if_else.asp

Use this code as a framework when you are working on your Project. Definitely copy and paste things you need.

If you have additional questions, contact Jay at s.m.syz@emory.edu
************************************/




/************************************
*************************************
DO NOT TOUCH THE CODE IN THIS SECTION
*************************************
************************************/

// declare requirements
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var fs = require('fs');
var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 3000));

// Server frontpage
app.get('/', function (req, res) {
    res.send('This is your bots server');
});

// Facebook Webhook
app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'verify_token') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});

// main handler receiving messages
app.post('/webhook', function (req, res) {
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
    if (event.message && event.message.text) {

/************************************
*************************************
************************************/




/*******************************************
********************************************
THIS SECTION IS WHERE YOU WILL ADD YOUR CODE
********************************************
*******************************************/


    /* EXAMPLE 1: simple thanks response */
    // Look at EXAMPLE 2 for information
    if (event.message.text.toUpperCase().indexOf('THANK') >= 0
          || event.message.text.toUpperCase().indexOf('THANKS') >= 0) { sendMessage(event.sender.id, {
            text: "No problem ;)"
      });
    }
    /* END */


    /* EXAMPLE 2: more complex introduction response */
    // between if (...) is where you can setup the condition you will check for
    // event.message.text -> the text that the user inputted
    // .toUpperCase().indexOf('HI') == 0 -> checks whether the inputted word matches a keyword your bot deals with
    // || -> is a logical OR operator, for more information on JavaScript comparison operators see here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators
		else if (event.message.text.toUpperCase().indexOf('HI') == 0
		 || event.message.text.toUpperCase().indexOf('HELLO') == 0) {

		// the intro variable includes the options for your bot's response
    // the options are placed in an array: http://www.w3schools.com/js/js_arrays.asp
		var intro = ['Hey there!', 'Hi!', 'Hello!', 'Hullo!']

    // the intro_msg variable is a randomly selected response from the intro array
    // keep Math.floor(Math.random()*intro.length) and just change the name of the array when doing this yourself, ie the beginning intro[...] part
		var intro_msg = intro[Math.floor(Math.random()*intro.length)]

    // send the response
		sendMessage(event.sender.id, {

      // to change the bot's response, modify the code after the text: label
      // intro_msg is the random response and the text in quotes is a plain string (http://www.w3schools.com/jsref/jsref_obj_string.asp)
      text: intro_msg + " insert your introduction response for your bot here"

				});
		}
    /* END */


    /* EXAMPLE 3: API Integration */
    // the below code generates a list of top 10 movies out now
    else if (event.message.text.toUpperCase().indexOf('MOVIE') >= 0) {

      // tmdb_url is the API URL the bot calls, look at your specific API documentation to determine the right API URL
	    var tmdb_url = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=7b97857087d9e02a9a3da1932781e9ac"

	    // generate list of movies from tmdb
	    request({

        // insert your API URL variable here
    		url: tmdb_url,
        //   ^^^^^^^^

    		json: true
	    }, function (error, response, body) {

   	  if (!error && response.statusCode === 200) {

			// initialize array for movie list
			elem = []

			// go through each JSON element and add the information to a new message
      /*******************************************
      MODIFY THE FOR LOOP TO GET THE DATA YOU NEED
      *******************************************/
      // http://www.w3schools.com/js/js_loop_for.asp
			for (c = 0; c < 10; c ++) {
            // the following variables are the crux of your API call, here you are accessing the JSON data from the API and storing the values you need in variables
            // recall: https://canvas.emory.edu/courses/22940/pages/api-stack-doc?module_item_id=32733
            // here is the data for this provided example (same as tmdb_url link above): https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=7b97857087d9e02a9a3da1932781e9ac
            // specifically, body.results[c].title is actually key.key[index].key -> retrieves the the titles for the top 10 movies
				    var tmdb_title = body.results[c].title
	    			var tmdb_overview = body.results[c].overview
	    			var tmdb_ImageURL = "https://image.tmdb.org/t/p/w370" + body.results[c].poster_path
				    var tmdb_webUrl = "https://www.themoviedb.org/discover/movie?language=en"

            // this is the message that will be sent to the user
            // it's formatted as key:value pairs
            // just change the variables and strings to your variables and strings
            message =
			    	{
                  "title": tmdb_title,
			    		    "subtitle": "based on reviews from tmdb",
                  "image_url": tmdb_ImageURL,
                  "buttons": [
						              {
                            "type": "web_url",
                            "url": tmdb_webUrl,
                            "title": "More from tmdb"}]
                          }

           // connect each message to each other
           // don't need to change this line
				   elem.push(message)

			}
      /*******************************************
      *******************************************/

			// create message with multiple movie elements
			message_final = {
                		"attachment": {
                    		"type": "template",
                    		"payload": {
                        		"template_type": "generic",
                        		"elements": elem
                    		}
                		}
            		};

			// send final message list with the top 10 movies
      sendMessage(recipientId, message_final);

    		}
	    })
    }
    /* END */


		// default response for unrecognized inputs
		else {
			sendMessage(event.sender.id, {text: "insert your response for inputs your bot doesn't understand here"});
		}
  }


	// postback handler
  // If you are interested in working with postbacks, do your own research or ask a TA
  // https://developers.facebook.com/docs/messenger-platform/webhook-reference/postback-received
	else if (event.postback) {
    		console.log("Postback received: " + JSON.stringify(event.postback));
	}
  }

/*******************************************
********************************************
********************************************
*******************************************/




/************************************
*************************************
DO NOT TOUCH THE CODE IN THIS SECTION
*************************************
************************************/

    res.sendStatus(200);
});

// generic function sending messages
function sendMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};

/************************************
*************************************
************************************/

// Written by: Jay Syz
