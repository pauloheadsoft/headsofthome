(function () {

	var cargo = {

		init: function () {
			this.cacheDom();
			this.bindEvents();
			this.totopButton();
			this.initSlider();
			this.enablePopupGallery();
			this.enableMailchimpForm();
			this.initContactForm();
			this.initCounterElement();
		},
		cacheDom: function(){
			this.toTop = $('.totop');
			this.topTrigger = $('.cg__topMenu-trigger');
			this.menuBurger = $('.cg__menuBurger');
			this.searchBtn = $('.cg__searchBtn');
			this.cgmenu = $('.cg__mainMenu');
			this.rezMenu = $('.cg__resMenu');
			this.pageWrapper = $('#page_wrapper');
			this.backIcon = $('.cg__resMenu-backIcon');
			this.subMenuIcon = $('.cg__subMenu-backIcon');
			this.subMenuButton = $('.cg__res-submenu-trigger');
			this.homepageSider = $('.cg__homepageSlider');
			this.logosSlider = $('.cg__Logos');
			this.testimonialSlider = $('.cg__testimonialSlider');
			this.gridGallerySlider = $('.cg__gridGallery-slider');
			this.sliderArrow = $('.slick-arrow');
			this.hasAnimation = $('.hasAnimation');
			this.counterElement = $('.cg__counterElement');
			this.mailchimpForm = $('.cg__newsletter-form');
			this.videoBox = $('.cg__playVideo');
			this.accordionTab = $('.cg__accordion-title');
		},
		bindEvents: function(){
			var self = this;
			$(window).on('load', self.enablePreloader);
			self.topTrigger.on('click', self.responsiveTopMenu);
			self.searchBtn.on('click', self.responsiveSearch);
			self.menuBurger.on('click', self.triggerMenu);
			self.rezMenu.find( 'a:not(.cg__resMenu-back)').on('click', self.CloseMenu);
			self.backIcon.on('click', self.CloseMenu);
			self.subMenuIcon.on('click', self.CloseMenu);
			self.subMenuButton.on('click', self.triggerSubMenu);
			$(window).on('scroll', self.addAnimations);
			self.videoBox.magnificPopup({type:'iframe'});
			this.accordionTab.on('click', self.toggleAccordion);
		},
		enablePreloader: function() {
			var preloader = $('#cg__page-loading');
			if ( preloader.length > 0 ) {
				preloader.fadeOut( "slow", function() {
					preloader.remove();
				});
			}
		},
		initSlider: function() {
			var self = this;
			var revapi1;

			/* homepage slider */
			if(self.homepageSider.revolution === 'undefined'){
				// revslider_showDoubleJqueryError(self.homepageSider);
			} else {
				revapi1 = $("#cg__homepageSlider").show().revolution({
					sliderType:"standard",
					sliderLayout:"fullwidth",
					dottedOverlay:"none",
					delay:9000,
					navigation: {
						keyboardNavigation:"off",
						keyboard_direction: "horizontal",
						mouseScrollNavigation:"off",
						mouseScrollReverse:"default",
						onHoverStop:"off",
						arrows: {
							style:"uranus",
							enable:true,
							hide_onmobile:false,
							hide_onleave:false,
							tmp:'',
							left: {
								h_align:"left",
								v_align:"center",
								h_offset:20,
								v_offset:0
							},
							right: {
								h_align:"right",
								v_align:"center",
								h_offset:20,
								v_offset:0
							}
						}
					},
					visibilityLevels:[1240,1024,778,480],
					gridwidth:1290,
					gridheight:780,
					lazyType:"none",
					shadow:0,
					spinner:"spinner0",
					stopLoop:"off",
					stopAfterLoops:-1,
					stopAtSlide:-1,
					shuffle:"off",
					autoHeight:"off",
					disableProgressBar:"on",
					hideThumbsOnMobile:"off",
					hideSliderAtLimit:0,
					hideCaptionAtLimit:0,
					hideAllCaptionAtLilmit:0,
					debugMode:false,
					fallbacks: {
						simplifyAll:"off",
						nextSlideOnWindowFocus:"off",
						disableFocusListener:false,
					}
				});
			}

			this.gridGallerySlider.slick({
				infinite: true,
				arrows: true,
				slidesToShow: 3,
				slidesToScroll: 3,
				responsive: [
					{
						breakpoint: 768,
						settings: {
							slidesToShow: 2,
							slidesToScroll: 2
						}
					},
					{
						breakpoint: 480,
						settings: {
							slidesToShow: 1,
							slidesToScroll: 1
						}
					}
				]
			});

			this.logosSlider.slick({
				infinite: true,
				arrows: false,
				slidesToShow: 5,
				slidesToScroll: 1,
				responsive: [
					{
						breakpoint: 992,
						settings: {
							slidesToShow: 4,
							slidesToScroll: 1
						}
					},
					{
						breakpoint: 768,
						settings: {
							slidesToShow: 3,
							slidesToScroll: 1
						}
					},
					{
						breakpoint: 480,
						settings: {
							slidesToShow: 2,
							slidesToScroll: 1
						}
					}
				]
			});
			this.testimonialSlider.slick({
				infinite: true,
				arrows: true,
				slidesToShow: 1,
				slidesToScroll: 1
			});
		},
		toggleAccordion: function() {
			var accGroup = $('.cg__accordion-group'),
					accContent = $('.cg__accordion-content'),
					isOpened = $(this).closest(accGroup).hasClass('is-opened');
			if (isOpened === true) {
				$(this).closest(accGroup).removeClass('is-opened');
				$(this).closest(accGroup).find(accContent).slideUp(300);
			} else {
				$(this).closest(accGroup).addClass('is-opened');
				$(this).closest(accGroup).find(accContent).slideDown(300);
			}
		},
		enableMailchimpForm: function(){
			this.mailchimpForm.on('submit', function(event){

				// Prevent the default
				event.preventDefault();

				var responseContainer = $(this).find('.cg__newsletter-message');

				// Clear the message container
				responseContainer.html('').removeClass('has-error is-valid');

				var data = {};
				var dataArray = $(this).serializeArray();
				$.each(dataArray, function (index, item) {
					data[item.name] = item.value;
				});

				var url = $(this).attr('action').replace('/post?', '/post-json?').concat('&c=?');

				$.ajax({
					url: url,
					data: data,
					cache: false,
					dataType: 'jsonp',
					error: function(data){
						alert('There was an error submitting your request. Please try again in a few minutes.');
					},
					success: function(data){
						if( data.result.length ){
							if( data.result === 'error' ){
								responseContainer.html( data.msg ).addClass('has-error');
							}
							else if( data.result === 'success' ){
								responseContainer.html( data.msg ).addClass('is-valid');
							}
						}
						else{
							alert('There was an error submitting your request. Please try again in a few minutes.');
						}
					}
				});
			});
		},
		initCounterElement: function() {
			var counterElement = $('.cg__counterElement'),
			itemIsReached;

			counterElement.each(function(){
				var $el = $(this);

				$(window).scroll(function(){
					itemIsReached = cargo.isScrolledIntoView($el);

					if (itemIsReached) {

						if( $el.hasClass( 'cg__didAnimation' ) ){
							return true;
						}

						$el.addClass( 'cg__didAnimation' );

						$el.data('countToOptions', {
							formatter: function (value, options) {
								return value.toFixed(options.decimals).replace(/\B(?=(?:\d{3})+(?!\d))/g, ',');
							}
						});

						var options = $.extend({}, options || {}, $el.data('countToOptions') || {});
						$el.countTo(options);

					}
				}).trigger('scroll');
			});
		},
		initContactForm: function() {
			var contactForm = $('.cg__contactForm');
			if( typeof(contactForm) === 'undefined' ){
				return;
			}
			contactForm.on('submit', function(e) {
				e.preventDefault();
				e.stopPropagation();

				var self = $(this),
				submitButton = self.find('.cg__submitBtn');

				//#! Disable repetitive clicks on the submit button. Prevents postbacks
				self.addClass('js-disable-action');
				submitButton.addClass('js-disable-action');

				//#! Redirect to the specified url on success, ONLY if a url is present in the input value
				var redirectToInput = self.find('.cg__redirect-to'),
				redirectTo = ( typeof(redirectToInput) !== 'undefined' ? redirectToInput.val() : '' ),
				//#! Holds the reference to the wrapper displaying the result message
				responseWrapper = self.find('.js-cf-message');

				//#! Clear message
				responseWrapper.empty().hide();

				//#! Execute the ajax request
				$.ajax({
					url: self.attr('action'),
					method: 'POST',
					cache: false,
					timeout: 20000,
					async: true,
					data: {
						'fields' : self.serialize()
					}
				}).done(function(response){
					responseWrapper.removeClass('js-response-success js-response-error');
					if(response && typeof(response.data) !== 'undefined' ) {
						responseWrapper.empty();
						if( ! response.success ){
							responseWrapper.addClass('js-response-error');
							$.each( response.data, function(i, err) {
								responseWrapper.append('<p>'+err+'</p>');
							});
						}
						else {
							responseWrapper
							.addClass('js-response-success')
							.append('<p>'+response.data+'</p>');
							//#! Clear the form
							self.find('.sh__input').val('');
							//#! Redirect on success (maybe to a Thank you page, whatever)
							if( redirectTo.length > 0 ){
								window.setTimeout(function(){
									window.location.href = redirectTo;
								}, 2000);
							}
						}
						responseWrapper.fadeIn();
					}
					else {
						responseWrapper.removeClass('js-response-success');
						responseWrapper.empty().addClass('js-response-error').append('<p>An error occurred. Please try again in a few seconds.</p>').fadeIn();
					}
				}).fail(function(txt, err){
					responseWrapper.empty().addClass('js-response-error').append('<p>An error occurred: '+txt+' Err:'+err+'. Please try again in a few seconds.</p>').fadeIn();
				}).always(function() {
					self.removeClass('js-disable-action');
					submitButton.removeClass('js-disable-action');
				});
			});

		},
		enablePopupGallery: function() {
			$('.cg__gridGallery').each(function() {
				$(this).magnificPopup({
					delegate: 'a',
					type: 'image',
					gallery: {
						enabled:true
					}
				});
			});
		},
		addAnimations: function() {
			cargo.hasAnimation.each(cargo.startAnimations);
		},
		startAnimations: function(index, el) {
			var itemIsReached = cargo.isScrolledIntoView(el);
			if (itemIsReached) {

				var animationType = $(this).attr("data-animationType");
				var animationDuration = $(this).attr("data-animationDuration");
				var animationDelay = $(this).attr("data-animationDelay");

				if (!$(this).hasClass('is-animating')) {

					$(this).css({"animation-duration": animationDuration,
					"animation-name":animationType,
					"animation-delay":animationDelay});
				}
				$(this).addClass('is-animating');
			}
		},
		isScrolledIntoView: function(elem) {

			var docViewTop = $(window).scrollTop();
			var docViewBottom = docViewTop + $(window).height();
			var elemTop = $(elem).offset().top;
			var elemBottom = elemTop + $(elem).height();
			var offset = 600;

			return ((elemBottom <= docViewBottom + offset) && (elemTop >= docViewTop - offset));
		},
		totopButton: function() {
			var self = this;

			/* Show totop button*/
			$(window).scroll(function(){
				var toTopOffset = self.toTop.offset().top;
				var toTopHidden = 1000;

				if (toTopOffset > toTopHidden) {
					self.toTop.addClass('totop-vissible');
				} else {
					self.toTop.removeClass('totop-vissible');
				}
			});

			/* totop button animation */
			if(self.toTop && self.toTop.length > 0){
				self.toTop.on('click',function (e){
					e.preventDefault();
					$( 'html, body').animate( {scrollTop: 0 }, 'slow' );
				});
			}
		},
		responsiveTopMenu: function() {
			if ($(this).hasClass('is-toggled')) {
				$(this).closest('.cg__topMenu-wrapper').removeClass('is-opened');
				$(this).removeClass('is-toggled');
			} else {
				$(this).closest('.cg__topMenu-wrapper').addClass('is-opened');
				$(this).addClass('is-toggled');
			}
		},
		responsiveSearch: function() {
			if ($(this).hasClass('active')) {
				$(this).removeClass('active');
				$(this).find('span').removeClass('glyphicon-remove');
				$(this).closest('.cg__search').find('.cg__search-container').removeClass('panel-opened');
			} else {
				$(this).addClass('active');
				$(this).find('span').addClass('glyphicon-remove');
				$(this).closest('.cg__search').find('.cg__search-container').addClass('panel-opened');
			}
		},
		triggerMenu: function(e) {
			e.preventDefault();
			if($(this).hasClass('is-active')){
				cargo.CloseMenu();
			}
			else {
				cargo.OpenMenu();
			}
		},
		triggerSubMenu: function(e) {
			$(this).closest('.cg__res-submenu').find('.cg__subMenu').addClass('cg__menu--visible');
		},
		OpenMenu: function() {
			cargo.rezMenu.addClass('cg__menu--visible');
			cargo.menuBurger.addClass('is-active');
			cargo.setMenuHeight();
		},
		CloseMenu: function() {
			$(this).closest('ul').removeClass('cg__menu--visible');
			cargo.menuBurger.removeClass('is-active');
			cargo.removeMenuHeight();
		},
		removeMenuHeight: function() {
			cargo.pageWrapper.css({'height':'auto'});
		},
		setMenuHeight: function() {
			var _menu = $('.cg__menu--visible').last(),
			window_height  = $(window).height(),
			height = _menu.css({window_height:'auto'});
			cargo.pageWrapper.css({'height':height});
		}
	};
	cargo.init();
})();
