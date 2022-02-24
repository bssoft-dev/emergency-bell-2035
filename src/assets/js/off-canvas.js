(function($) {
  'use strict';
  $(function() {
    $('[data-toggle="offcanvas"]').on("click", function() {
      $('.sidebar-offcanvas').toggleClass('active')
      $('[data-toggle="offcanvas"] .span').toggleClass('ti-arrow-right')
      $('.menu-overlay').toggleClass('active');
    });

    $('.menu-overlay').on('click', function(){
    	$('.sidebar-offcanvas').removeClass('active');
    	$(this).removeClass('active');
    	$('[data-toggle="offcanvas"] .span').removeClass('ti-arrow-right');
    });


    setTimeout(function(){ 
    	$('.site-preloader').fadeOut(200);
    	$('body').fadeIn(300);
    }, 500);


  });
})(jQuery);