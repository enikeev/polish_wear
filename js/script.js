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
		margin:5,
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

	$('select').selectbox();



	$('[data-show-in]').click(function(){
		var $this = $(this);
		var targ = $this.data('show-in');

	//	console.log(targ);

		if ( $this.hasClass('active') ){
			$this.add('[data-show-out]').removeClass('active')
		} else {
			$('[data-show-in]').filter('.active').removeClass('active');
			$('[data-show-out]').filter('.active').removeClass('active');
			$this.add('[data-show-out = '+ targ +']').addClass('active');
		}
	});

	$('.filter-title_in').click(function(){
		$(this).closest('.filter').toggleClass('open');
	});

	$('.prodcard-type__link').click(function(e){
		e.preventDefault();
		var url = $(this).attr('href');
		var $img = $(this).closest('.prodcard-item').find('.img-main');

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

	//	console.log(lp + ' ' + wp + ' ' + wb)

	});

	$('.js-scroll-horiz').mCustomScrollbar();
	$('.js-scroll-vert').mCustomScrollbar({
		//axis:"x",
		advanced:{autoExpandHorizontalScroll:true}
	});


	$('.wear-img__preview-item').click(function(e){
		e.preventDefault();

		var $this = $(this);
		var $big = $this.closest('.wear-img').find('.wear-img__big-item img');

		if ( !$(this).hasClass('active') ){
			$('.wear-img__preview-item').filter('.active').removeClass('active');
			$this.addClass('active');
			$big.attr('src', $this.attr('href') );
		}
	});
	$('.wear-descr__color-item').click(function(e){
		e.preventDefault();
		var $this = $(this);
		$('.wear-descr__color-item').filter('.active').removeClass('active');
		$this.addClass('active');

	});


	$('.slider-line').each(function(){

		var $this = $(this);
		var $wrap = $this.closest('.filter-inner');

		var time = $this.hasClass('slider-time') ? true : false;

		var rangeMin = $this.data('range-min'),
			rangeMax = $this.data('range-max'),
			valMin = $this.data('val-min') || rangeMin,
			valMax = $this.data('val-max') || rangeMax,
			$inputFrom = $wrap.find('.i-from'),
			$inputTo = $wrap.find('.i-to'),
			$sliderFrom = $wrap.find('.slider-line__from'),
			$sliderTo = $wrap.find('.slider-line__to');

		$inputFrom.val(valMin);
		$inputTo.val(valMax);
		$sliderFrom.text(valMin);
		$sliderTo.text(valMax);

		$this.slider({
			min: rangeMin,
			max: rangeMax,
			values: [valMin, valMax],
			range: true,
			create: function(event, ui){},
			slide: function(event, ui){
				$sliderFrom.text($this.slider('values', 0));
				$sliderTo.text($this.slider('values', 1));
				$inputFrom.val($this.slider('values', 0));
				$inputTo.val($this.slider('values', 1));
			},
			stop: function(event, ui) {
				$sliderFrom.text($this.slider('values', 0));
				$sliderTo.text($this.slider('values', 1));
				$inputFrom.val($this.slider('values', 0));
				$inputTo.val($this.slider('values', 1));
			}
		});

	});


	$('.filter_price input').on('change', function(){

		var $this = $(this);

		if ( $this.val().match(/[^0-9]/g) ) {
			var _newVal = $this.val().replace(/[^0-9]/g, '');
			$this.val(_newVal);
		}

		var $wrap = $this.closest('.filter_price');
		var $slider = $wrap.find('.slider-line');

		var max = $slider.data('range-max');

		var iMin = $wrap.find('.i-from');
		var iMax = $wrap.find('.i-to');

		var val1 = iMin.val();
		var val2 = iMax.val();

		if ( $this.hasClass('i-from') ){
			if(parseInt(val1) > parseInt(val2)){
				val1 = val2;
				iMin.val(val1);
			}
			$slider.slider('values', 0, val1);
		} else if ( $this.hasClass('i-to') ){
			if (val2 > max) {
				val2 = max;
				iMax.val(max);
			}

			if(parseInt(val1) > parseInt(val2)){
				val2 = val1;
				iMax.val(val2);
			}

			$slider.slider('values', 1, val2);
		}
	});

//color

	$('.filter-inner .color-item').click(function(){
		var $this = $(this);
		var colorName = $this.data('color-name');
		var colorVal = $this.data('color-val');
		var $picker = $this.closest('.filter-inner').find('.colors-picker');

		var $pick = $('<div/>', {
			'class': 'colors-pick'
		});

		$pick.append('<span class="colors-pick__color" style="background-color: ' + colorVal + '"></span>'
		+ '<span class="colors-pick__name">' + colorName + '</span>'
		+ '<span class="colors-pick__close"></span>');

		$this.hide();
		$picker.append($pick);
	});

	$('.filter-inner').on('click', '.colors-pick__close', function(){
		var $this = $(this);
		var $wrap = $this.closest('.filter-inner');
		var $pick = $this.closest('.colors-pick');
		var name = $pick.find('.colors-pick__name').text();

		$wrap.find('.color-item').filter(function(){
			return $(this).attr('data-color-name') == name;
		}).show();
		$pick.remove();
	});


//filter clear

	$('.filter_color .filter-clear a').click(function(e){
		e.preventDefault();
		$(this).closest('.filter-inner').find('.color-item').show();
		$(this).closest('.filter-inner').find('.colors-pick').remove();
	});

	$('.filter_list .filter-clear a').click(function(e){
		e.preventDefault();
		$(this).closest('.filter-inner').find('input').prop('checked', false);
	});

	$('.filter_price .filter-clear a').click(function(e){
		e.preventDefault();
		var $wrap = $(this).closest('.filter-inner');
		var $slider = $wrap.find('.slider-line');

		$slider.slider({
			values: [$slider.data('range-min'), $slider.data('range-max')]
		});

		$wrap.find('.slider-line__from').text($slider.data('range-min'));
		$wrap.find('.slider-line__to').text($slider.data('range-max'));
		$wrap.find('.i-from').val($slider.data('range-min'));
		$wrap.find('.i-to').val($slider.data('range-max'));
	});


});

