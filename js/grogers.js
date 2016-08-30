(function($){
	'use strict';

	// To transform navbar on scroll
	$('body').scrollspy({ 
		target: '#navbar-fixed-top',
	});


	$('#mainNav').affix({
		offset: {
			top: 100
		}
	})
})(jQuery);