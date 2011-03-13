/* vi: set tabstop=2 shiftwidth=2 expandtab */

var rest = require('Reston');
var utils = require('./utils');

var Meetup = function(options) {

  this.options = options;

  this.defaultParams = {
    'group_urlname' : options.group,
    'key' : options.key,
    'sign' : 'true'
  };

};

var apiRequestCache = {};

/**
 * Request wrapper for simple api requests
 */
Meetup.prototype.get = function (controller, params, callback) {

  // Can skip over params, if none are needed, the second argument will then be
  // the callback function and use the default parameters
  if (typeof(params) == 'function') {
    callback = params;
    params = this.defaultParams;
  }
  else {
    params = utils.extend(this.defaultParams, params);
  }

  var queryString = utils.objectToQueryString(params);

  var requestUrl = 'http://api.meetup.com/' + controller + '?' + queryString;

  if (requestUrl in apiRequestCache) {
    var cachedRequest = apiRequestCache[requestUrl];
    var timeFetched = cachedRequest.timeFetched;
    var now = +new Date();

    console.log('diff:' , now - timeFetched);

    if ((now - timeFetched) < 1 * 60000) {
      console.log('Meetup API request, from cache:', requestUrl, 'originally fetched:', timeFetched);
      callback(cachedRequest.response);
      return;
    }
  }

  console.log('Meetup API request: ', requestUrl);

  // Use reston to get a response from the api, while serializing the params object
  // for the query string.
  var req = rest.get(requestUrl);

  // Gather up the reseponse string as its sent to us.
  var data = '';
  req.on('data', function(chunk){
    data += chunk.toString();
  });

  // On completion of the request trigger, parse the response and call the
  // provided callback
  req.on('success', function() {
    var response = JSON.parse( data );

    // Cache that S.
    apiRequestCache[requestUrl] = {};
    apiRequestCache[requestUrl].timeFetched = +new Date();
    apiRequestCache[requestUrl].response = response.results;

    callback( response.results );

  });

  req.on('error', function () {
      console.log('request could not be completed:', requestUrl);
  });

  req.send();

};

Meetup.prototype.memberList = function(callback ) {

  this.get('members',
    function (response) {
      callback(response);
    }
  );

};

Meetup.prototype.events = function(callback) {

  var self = this;

  this.get('2/events',
    {
      'status' : 'past'
    },
    function (response) {
      var events = response;

      // Per event, get the full Rsvp list
      for (var i = 0; i < events.length; i++) {

        // Ahhh yes, javascript...
        (function (meetupEvent) {

         // Since the meetup API only returns rsvp counts, we need to make a
         // seperate requests to get rsvp names
          self.get('rsvps',
            {
              'event_id': meetupEvent.id
            },
            function (rsvpResponse) {
              meetupEvent.rsvps = rsvpResponse;
            }
          );
        }(events[i]))

      }

      callback(events);

    }
  );

};

module.exports = Meetup;
