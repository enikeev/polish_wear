
function declOfNumFormat(nStr){
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ' ' + '$2');
	}
	return x1 + x2;
}

function declOfNum(number, titles){
	cases = [2, 0, 1, 1, 1, 2];
	return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
}





(function(){
	var app = {
		datepicker: function(){

			var di = $('.date-input');

			if ( di.size() ){

				if ( $('.input-daterange').size() ){

					var nowTemp = new Date();

					var valDay = nowTemp.getDate().toString().length > 1 ? nowTemp.getDate() : '0' + nowTemp.getDate();
					var valMonth = (nowTemp.getMonth()+1).toString().length > 1 ? ( nowTemp.getMonth() + 1 ) : '0' + ( nowTemp.getMonth() + 1 );
					var valYear = nowTemp.getFullYear();

					di.each(function(){
						if ( !$(this).val() ){
							$(this).val( valDay + '.' + valMonth + '.' + valYear );
						}
					});

					$('.input-daterange').each(function(){
						$(this).datepicker({startDate: "new Date()"});
					});
				}


				di.each(function(){
					$(this).datepicker();
				});


			}

		},
		order: {
			check: function(){
				var priceAllRUB = 0;
				var priceAllUSD = 0;
				var allGoods = 0;

				$('.order-group').each(function(){

					var $group = $(this);

					var priceGroupRUB = 0;
					var priceGroupUSD = 0;

					$(this).find('.order-item').each(function(){
						var $this = $(this);
						var max = $this.data('max');
						var sumItem = +$this.find('.increase-num input').val();
						var priceItemRUB = +$this.find('.price-uno .price-rub span').text().replace(' ', '');
						var priceItemUSD = +$this.find('.price-uno .price-usd span').text().replace(',', '.');
						var rub = sumItem * priceItemRUB;
						var usd = sumItem * priceItemUSD;

						$this.find('.price-sum .price-rub span').text( declOfNumFormat(rub) );
						$this.find('.price-sum .price-usd span').text( usd.toFixed(2).toString().replace('.', ',') );

						if ( sumItem > max ) { $this.addClass('order-item_few'); }
						else {
							$this.removeClass('order-item_few');
							$this.closest('.order-group').removeClass('order-group_wrong');
						}

						allGoods += sumItem;

						priceGroupRUB += rub;
						priceGroupUSD += usd;

					});

					var checkbox = $group.find('.order-item-checkbox');
					var checkboxChecked = $group.find('.order-item-checkbox').filter(':checked');

					if ( checkbox.length == checkboxChecked.length ) {
						$group.find('.order-group-checkbox').prop('checked', true);
					} else {
						$group.find('.order-group-checkbox').prop('checked', false);
					}

					$group.find('.order-choosen i').text( checkboxChecked.length );
					$group.find('.order-totalval .rub i').text( declOfNumFormat(priceGroupRUB) );
					$group.find('.order-totalval .usd i').text( priceGroupUSD.toFixed(2).toString().replace('.', ',') );


					if ( !$group.find('.order-item').size() ) { $group.remove(); }

					priceAllRUB += priceGroupRUB;
					priceAllUSD += priceGroupUSD;
				});


				$('.order-result__check .info__goods').text( allGoods + ' ' + declOfNum(allGoods,  ['товар', 'товара', 'товаров'] ) );
//				$('.order-result__check .info__val .rub').text( declOfNumFormat(priceAllRUB) );
//				$('.order-result__check .calc__item_all .rub i').text( declOfNumFormat(priceAllRUB) );
//				$('.order-result__check .calc__item_all .usd i').text( priceAllUSD.toFixed(2).toString().replace('.', ',') );
//				$('.order-result__check .calc__item_advance .rub i').text( declOfNumFormat(0.3*priceAllRUB) );
//				$('.order-result__check .calc__item_advance .usd i').text( (0.3*priceAllUSD).toFixed(2).toString().replace('.', ',') );

				$('.js-order-result-price-rub').text( declOfNumFormat(priceAllRUB) );
				$('.js-order-result-price-rub_advance').text( declOfNumFormat(0.3*priceAllRUB) );
				$('.js-order-result-price-usd').text( priceAllUSD.toFixed(2).toString().replace('.', ',') );
				$('.js-order-result-price-usd_advance').text( (0.3*priceAllUSD).toFixed(2).toString().replace('.', ',') );

				if ( $('.order-item_few').length ){
					$('.order-item_few').closest('.order-group').addClass('order-group_wrong')
				}

				return allGoods;
			}

		},

		delivery: {

			nextScreen:{
				toDelivery: function(){
					var price = +$('.js-price-check').text().replace(' ', '');

					if ( price && price !== 0 ){
						$('.section_delivery-method').fadeIn(300);
						$('html,body').animate({scrollTop:$('.section_delivery-method').offset().top}, 300);
					} else {
						alert('Вы не выбрали ни одного товара');
					}
				},
				toPlace:function(){
					var wrap = $('.section_delivery-method');
					var operator = wrap.find('input[name=delivery-operator]');
					var activeOperator = operator.filter(':checked');
					wrap.find('.error').removeClass('error');

					if ( activeOperator.size() <=0 ){
						alert('Выберите вариант доставки')
					} else {
						var placeMethod = activeOperator.closest('.field-group').find('input[name^=delivery-place]');
						if ( placeMethod.size() && placeMethod.filter(':checked').size() <= 0 ){
							alert('Выберите место доставки')
						} else if ( activeOperator.hasClass('js-order-other-deliver-radio') && !activeOperator.closest('.field-group').find('input[type=text]').val() ) {
							activeOperator.closest('.field-group').find('input[type=text]').closest('.field-item__input').addClass('error');
						} else {
							$('.section_delivery-place').fadeIn(300);
							$('html,body').animate({scrollTop:$('.section_delivery-place').offset().top}, 300);
						}
					}

				},
				toPayment: function(){
					var $box = $('.section_delivery-place');
					var req = $box.find('.required');

					req.closest('.field-item__input').removeClass('error');

					if ( req.filter(function(){ return $(this).val() == '';}).size() ){
						req.filter(function(){ return $(this).val() == '';}).closest('.field-item__input').addClass('error');
					} else {
						$('.section_delivery-payment').fadeIn(300);
						$('html,body').animate({scrollTop:$('.section_delivery-payment').offset().top}, 300);
					}
				}
			},

			init: function(){

				$('.section_delivery').find('input[type=radio]').prop('checked', false);

				$('input[name=delivery-operator]').change(function(){
					$('input[name=delivery-operator]').closest('.field-group').removeClass('active').end().filter(':checked').closest('.field-group').addClass('active');
				});


				$(document).on('click', '.js-order-goto-delivery', function(e){
					e.preventDefault();
					app.delivery.nextScreen.toDelivery();
				}).on('click', '.js-order-goto-place', function(e){
					e.preventDefault();
					app.delivery.nextScreen.toPlace();
				}).on('click', '.js-order-goto-pay', function(e){
					e.preventDefault();
					app.delivery.nextScreen.toPayment();
				}).on('click', '.js-order-pay', function(e){
					e.preventDefault();

				}).on('change', '.section_delivery-payment input[name=delivery-payment]', function(e){
					var $t = $(this);
					$('.section_delivery-payment input[name=delivery-payment]').closest('.field-group').removeClass('active');
					$t.closest('.field-group').addClass('active');

				}).on('click', '.js-order-add-phone-number', function(e){
					e.preventDefault();

					var wrap = $(this).closest('.field-item');
					var field = $('<div class="field-item">'
					+				'<div class="field-item__input w w66">'
					+					'<div class="input">'
					+						'<input type="text" placeholder="Контактный телефон">'
					+					'</div>'
					+				'<div class="message">Пожалуйста, введите контактный телефон</div>'
					+			'</div>');

					field.insertAfter(wrap);

				})

			}
		},

		brands: {

			check: function(){

				var brandsBox = $('.brands-box'),
					$group = $('.brands-words__item'),
					$class = $('.brands-btns__item'),
					activeGroup = $group.filter('.active'),
					activeClass = $class.filter('.active'),
					activeGroupMarker = activeGroup.data('group'),
					activeClassMarker = activeClass.data('class');

				$('.brands-group__item').removeClass('active');

				activeClass.each(function(){
					$('.brands-group__item').filter(function(){
						var arr = $(this).data('class').split(', ');
						return $.inArray( activeClassMarker, arr ) >= 0;
					}).addClass('active');
				});

				if ( activeGroup.size() ){ brandsBox.addClass('group-filter');
				} else { brandsBox.removeClass('group-filter'); }

				if ( activeClass.size() ){ brandsBox.addClass('class-filter');
				} else { brandsBox.removeClass('class-filter'); }


				$('.brands-group').removeClass('hide active').each(function(){
					if ( $(this).find('.brands-group__item').filter(':visible').size() <= 0 ) $(this).addClass('hide');
				}).filter(function(){return $(this).data('group') == activeGroupMarker; }).addClass('active');
			},

			init: function(){

				$('.brands-words__item').click(function(e){
					e.preventDefault();

					$('.brands-btns__item').filter('.active').removeClass('active');

					$t = $(this);
					if ( $t.hasClass('disable') ){
						return false;
					} else if( $t.hasClass('active') ){
						$t.removeClass('active');
					} else {
						$('.brands-words__item').filter('.active').removeClass('active');
						$t.addClass('active');
					}
					app.brands.check();
				});

				$('.brands-btns__item').click(function(e){
					e.preventDefault();

					$('.brands-words__item').filter('.active').removeClass('active');

					$t = $(this);

					if ( $t.hasClass('active') ){
						$t.removeClass('active');
					} else {
						$('.brands-btns__item').filter('.active').removeClass('active');
						$t.addClass('active');
					}

					app.brands.check();
				});

			}
		},

		init: function(){

			app.order.check();
			app.delivery.init();
			app.brands.init();
			app.datepicker();

			$('.order-item-checkbox').change(app.order.check);
			$('.order-group-checkbox').change(function(){
				var $t = $(this);
				if ( $t.is(':checked') ){
					$t.closest('.order-group').find('.order-item-checkbox').prop('checked', true);
				} else {
					$t.closest('.order-group').find('.order-item-checkbox').prop('checked', false);
				}
				app.order.check();
			});

			$('.order-choosendel').click(function(){
				var $t = $(this);
				$t.closest('.order-group').find('.order-item-checkbox').filter(':checked').closest('.order-item').remove();
				app.order.check();
			});

			$('.increase-btn').click(function(){
				var $p = $(this).closest('.increase-box');
				var inpt = $p.find('.increase-num input');

				if ( $(this).hasClass('increase-btn_up') ){ inpt.val(+inpt.val()+1); }
				else if ( inpt.val() > 0 ) { inpt.val(+inpt.val()-1); }

				app.order.check();
			});

			$('.increase-num input').on('click', function(){
				$(this).select();
			}).on("keyup input", function() {
				if ( $(this).val().match(/[^0-9]/g) ) {
					var _newVal = $(this).val().replace(/[^0-9]/g, '');
					$(this).val(_newVal);
				}
				app.order.check();
			}).on("change", function() {
				if ( !$(this).val() ) {
					$(this).val('0');
				}
				app.order.check();
			});

			$('.order-item .status-del').click(function(){
				$(this).closest('.order-item').remove();
				app.order.check();
			});
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

	$('select').not('.input_autocomplete__select').selectbox();



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


//cart






//lk

	$('.js-settings-change').click(function(e){
		e.preventDefault();
		$(this).closest('tr').toggleClass('change');
	});
	$('.js-settings-confirm').click(function(e){
		e.preventDefault();
		var wrap = $(this).closest('tr');
		var inpt = wrap.find('input');
		var vl = wrap.find('.val .show');

		vl.text(inpt.val());

		//after change
		wrap.removeClass('change');
	});


});







