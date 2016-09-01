(function($){
	'use strict';

	var year = new Date().getFullYear();

	// To transform navbar on scroll
	$('body').scrollspy({ 
		target: '#navbar-fixed-top',
	});

	// Will affix-top to trigger navbar transformation
	$('#mainNav').affix({
		offset: {
			top: 100
		}
	});

	// Dynamic Copyright
	$('#copyright').html("<p>Copyright &copy; " + year + "</p>");

})(jQuery);