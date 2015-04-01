$(function() {

	var links    = $('#menu a'),
	    sections = $('.dialog');

	var routes = function() {
		var obj = {};
		links.each(function() {
			obj[this.hash.substring(2)] = $(this);
		});
		return obj;
	}();

	$(window).on('hashchange', function() {
		var route = location.hash.substring(2);

		links.removeClass('current');
		sections.hide();

		if (routes[route]) {
			routes[route].addClass('current');
			$('#'+ route).show();
		} else {
			$(links[0]).addClass('current');
			$(sections[0]).show();
		}

		document.title = 'VegasJS {' + route + '}';
	});

	$(window).trigger('hashchange');

});
