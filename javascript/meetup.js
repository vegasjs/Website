$(function() {

  /*
    This is a URL signed with an API key. Changing any parameters will cause it
    to break. More info: http://www.meetup.com/meetup_api/auth/#keysign
  */
  var signedUrl = "http://api.meetup.com/2/events?status=upcoming&order=time&limited_events=False&group_urlname=vegasjs&desc=false&offset=0&format=json&page=200&fields=&sig_id=7287936&sig=397330670d88fc0bc63f94e6124c30c2ed1f9830";

  var meetupTemplate = document.getElementById("next-meetup-template").innerHTML;

  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  /*
    This is not mustache, but we should look into using a better templating system
    if there is need to do more of this or if we need advance features.
  */
  function notMustache( template, data ) {
    var templateCopy = template + "";
    $.each(data, function(name,value) {
      templateCopy = templateCopy.split("{{ " + name + " }}").join(value);
    });
    return templateCopy;
  }

  $.getJSON(signedUrl + "&callback=?", function(data) {
    var meetup = data.results[0];
    if ( meetup ) {
      var date = new Date(meetup.time);
      var data = {
        month: months[ date.getMonth() ],
        day: date.getDate(),
        url: meetup.event_url,
        count: meetup.yes_rsvp_count,
        name: meetup.name
      };
      $('#next-meetup').html( notMustache( meetupTemplate, data ) ).slideDown();
    }
  });


});
