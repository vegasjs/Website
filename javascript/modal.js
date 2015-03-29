$(function() {

	$('.embed').on('click', function(e) {
		var modal = $('.embeddable.modal');
		modal.find('iframe').attr('src', this.href);
		$('body').append(modal);
		modal.fadeIn('800');
		e.preventDefault();
	});

	$('.modal').on('click', function(e) {
		$(this).fadeOut('800');
	});

});
