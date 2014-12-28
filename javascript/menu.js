$(function() {

	$('#menu a').click(function(e) {
		var id = $(this).attr('href');
		$('.dialog').hide();
		$(id).show();
		e.preventDefault();
	});

});