$(function() {

	$('#menu a').click(function(e) {
		var id = $(this).attr('href');
		$('#menu a').removeClass('current');
		$(this).addClass('current');
		$('.dialog').hide();
		$(id).show();
		e.preventDefault();
	});

	// Prevent double click selection except for in dialog
	$(window).on('mousedown', function(e) {
		if ( !$(e.target).is('.dialog') ) {
			e.preventDefault();
			return false;
		}
	});

});
