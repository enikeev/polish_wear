(function(){
	var app = {
		func: function(){

		},
		init: function(){
			app.func()
		}
	};

	var appLoad = function(){
		jQuery.app = app;
		app.init();
	};
	var appInt = setInterval(function(){
		if (typeof jQuery !== 'function') return;
		clearInterval(appInt);
		setTimeout(appLoad, 0);
	}, 50);

})();


$(function(){
	$('.carousel_category').owlCarousel({
		loop:true,
		margin:4,
		nav:true,
		dots:false,
		responsive:{
			0:{
				items:1
			},
			800:{
				items:3
			},
			1100:{
				items:4
			},
			1300:{
				items:5
			}
		}
	});

	$('.carousel_goods').owlCarousel({
		loop:false,
		margin:10,
		nav:true,
		dots:false,
		merge: true,
		responsive:{
			800:{
				items:2
			},
			1100:{
				items:3
			},
			1300:{
				items:4
			}
		}
	});

	$('.carousel_brands').owlCarousel({
		loop:true,
		margin:10,
		nav:true,
		dots:false,
		merge: true,
		responsive:{
			800:{
				items:4
			},
			1100:{
				items:6
			},
			1300:{
				items:7
			}
		}
	});


	$('.carousel-type__link').click(function(e){
		e.preventDefault();
		var url = $(this).attr('href');
		var $img = $(this).closest('.carousel-item').find('.img-main');

		$img.attr('src', url);
	});

	$('[data-navmenuitem]').mouseover(function(){
		var $this = $(this);
		var $wrap = $this.closest('.subnav');
		var ind = $this.data('navmenuitem');

		if ( !$this.hasClass('active') ){
			$wrap.find('[data-navmenuitem]').filter('.active').removeClass('active');
			$wrap.find('[data-navmenutarget]').filter('.active').removeClass('active');

			$this.addClass('active');
			$wrap.find('[data-navmenutarget=' + ind + ']').addClass('active');
		}
	});

	$('.nav-item').mouseenter(function(){
		var $this = $(this);
		var $box = $this.find('.subnav');

		var lp = $this.position().left;
		var wp = $this.closest('.inner').width();
		var wb = $box.outerWidth();

		if ( ( lp + wb ) > wp ){
			$box.css('left', - ( lp + wb - wp ) + 'px');
		} else {
			$box.css('left', '0');
		}

		console.log(lp + ' ' + wp + ' ' + wb)

	});


});

