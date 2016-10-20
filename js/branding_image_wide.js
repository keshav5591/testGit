//
// branding_image.js
//
// 2012.02.29
//


//
// Definition
//

// Controller

var
	CONTROL_POS_RIGHT_TOP = 'rt',		// right-top
	CONTROL_POS_LEFT_BOTTOM = 'lb',		// left-bottom
	CONTROL_POS_RIGHT_BOTTOM = 'rb';	// right-bottom

//
// Initialization
//
var
	// Slide image
	slideID = 'BrandingImgStyle1',
	// Controller visible (true:visible?^false:hidden)
	showControl = true,
	// Controller position
	controlPos = CONTROL_POS_RIGHT_BOTTOM,
	// Controller image oath
	controlImagePath = 'assets/images/',
	// interval(sec)
	interval = 7,
	// duration(sec)
	duration = 0.5,
	// slideWidth(px)
	slideWidth = 965,
	// slideHeight(px)
	slideHeight = 300,
	// list?iimage, text, link, traking?j
	slides = new Array();	


// run
$(function(){

	//
	// Initialization
	//
	
	//
	// Configuration file
	//
	var
		CONTROL_IMAGE_FILE = 'btn_ctl',				//
		CONTROL_IMAGE_FILE_PLAY = 'play-new',	//
		CONTROL_IMAGE_FILE_STOP = 'pause-new',	// 
		CONTROL_IMAGE_EXT = '.png',						// 
		CONTROL_IMAGE_WIDTH = 28,							// 
		CONTROL_IMAGE_HEIGHT = 28,						// 
		CONTROL_IMAGE_ACTIVE_SUFFIX = '_cr',	// 
		CONTROL_IMAGE_HOVER_SUFFIX = '_on';		// 

	// 
	var
		CLASS_IMAGE_BOX = 'branding-image',	// 
		CLASS_SLIDE = 'slide',							// 
		CLASS_CONTROLLER = 'controller',		// 
		CLASS_ACTIVE = 'active',						// 
		CLASS_FOCUS = 'focus',							// 
		CLASS_PAUSE = 'pause';							// 
		

	// 
	var
		TEXT_PAUSE = 'stop',	// 
		TEXT_PLAY = 'play';				// 

	// 
	var
		DATA_INDEX = 'index';			// 


	//
	// 
	//
	var
		activeIndex = 0,				// 
		playing = true,					// 
		intervalID;							// 


	//
	// 
	//

	// 
	var $slideID = $('#' + slideID)
		.addClass(CLASS_IMAGE_BOX);

	//
	// 
	//
	function sendTraking(index) {
		var trackingData = slides[index - 1].traking;
		if ((trackingData != undefined) && (typeof dcsMultiTrack == 'function')) {
			dcsMultiTrack(
				'DCS.dcsuri', trackingData.uri,
				'WT.ti', trackingData.ti,
				'WT.dl', trackingData.dl,
				'WT.BannerID', trackingData.id
			);
		}	
	}


	//
	//
	//
	if (slides.length > 1) {

		// 
		var $controlList = $slideID
			.append(format('<ul class="{0} {1}"></ul>', CLASS_CONTROLLER, controlPos))
			.find('ul:last-child');


	// 

		// 
		function hoverIn() {
			var $this = $(this);
			$controlList.removeClass(CLASS_FOCUS);
			$this.addClass(CLASS_FOCUS);

			// 
			if ($this.data(DATA_INDEX)) {
				stopTimer();
				showPage($this.data(DATA_INDEX), true);
			};
			setImageSrc($this);
		}
		// 
		function hoverOut() {
			var $this = $(this);
			$this.removeClass(CLASS_FOCUS);
			setImageSrc($this);
			if (playing) {
				startTimer();
			}
		}

		// 
		$(format('<li><a href="#"><img src="{0}" alt="{1}" width="{2}" height="{3}" /></a></li>',
							getImageFileName(0), TEXT_PAUSE, CONTROL_IMAGE_WIDTH, CONTROL_IMAGE_HEIGHT))
			.appendTo($controlList)
			.find('a:last-child')
			.data(DATA_INDEX, 0)
			.bind('focusin mouseover', hoverIn)
			.bind('focusout mouseout', hoverOut)
			.click(function(){
				var $this = $(this);
				$this.toggleClass(CLASS_PAUSE);
				playing = !$this.hasClass(CLASS_PAUSE);
				$this.find('img').attr({
					'src':getImageFileName(0, CLASS_FOCUS),
					'alt':playing ? TEXT_PAUSE : TEXT_PLAY
				});
				if (playing) {
					startTimer();
				} else {
					stopTimer();
				}
				return false;
			});

		if (showControl) {
			// 
			$.each(slides, function(index, value) {
				$(format('<li><a href="{0}"><img src="{1}" alt="{2}" width="{3}" height="{4}" /></a></li>',
									value.link, getImageFileName(index + 1), value.text, CONTROL_IMAGE_WIDTH, CONTROL_IMAGE_HEIGHT))
					.appendTo($controlList)
					.find('a:last-child')
					.data(DATA_INDEX, index + 1)
					.bind('focusin mouseover', hoverIn)
					.bind('focusout mouseout', hoverOut)
					.click(function(){
						sendTraking($(this).data(DATA_INDEX));
					})
			});
			// 
			$controlList = $slideID.find('.' + CLASS_CONTROLLER + ' a');
		}
	}

	// 
	function getImageFileName(index, status) {
		var fileName = controlImagePath;
		if (index) {
			fileName += CONTROL_IMAGE_FILE + index;			
		} else {
			if (playing) {
				fileName += CONTROL_IMAGE_FILE_STOP;
			} else {
				fileName += CONTROL_IMAGE_FILE_PLAY;
			}
		}
		switch (status) {
			case CLASS_ACTIVE:
				fileName += CONTROL_IMAGE_ACTIVE_SUFFIX;
				break;
			case CLASS_FOCUS:
				fileName += CONTROL_IMAGE_HOVER_SUFFIX;
				break;
		}
		fileName += CONTROL_IMAGE_EXT;
		return fileName;
	}

	// 
	function setImageSrc($anchorObj) {
		var status = '';
		if ($anchorObj.hasClass(CLASS_FOCUS)) {
			status = CLASS_FOCUS;
		} else if ($anchorObj.hasClass(CLASS_ACTIVE)) {
			status = CLASS_ACTIVE;
		}
		$anchorObj
			.find('img')
			.attr('src', getImageFileName($anchorObj.data(DATA_INDEX), status));
	}

	//
	// 
	//
	var $slideList = $slideID
		.append(format('<div class="{0}"></div>', CLASS_SLIDE))
		.find('div:last-child');
	$.each(slides, function(index, value) {
		$(format('<a href="{0}"><img class="visible-md hidden-xs" src="{1}" alt="{4}" /><img class="visible-xs" src="{2}" alt="{4}" /><img class="visible-lg" src="{3}" alt="{4}" /><div class="caption">"{4}"</div></a>',
		//$(format('<a href="{0}"><img class="visible-xs hidden-xxs" src="{1}" alt="{4}" /><img class="visible-xxs" src="{2}" alt="{4}" /><img class="visible-lg" src="{3}" alt="{4}" /><div class="caption">"{4}"</div></a>',
				value.link, value.image, value.image_xs, value.image_lg, value.text))
			.appendTo($slideList)
			.data(DATA_INDEX, index + 1)
			.click(function(){
				sendTraking($(this).data(DATA_INDEX));
			})
	});
	// 
	$slideList = $slideID.find('.' + CLASS_SLIDE + ' a');

	$slideList.find('.caption').matchHeight();


	//
	// 
	//

	// 
	function showPage(index) {
		if (index == activeIndex) return;

		if (showControl && $controlList) {
			$controlList
				.removeClass(CLASS_ACTIVE)
				.eq(index)
				.addClass(CLASS_ACTIVE);
			$.each($controlList, function(index) {
				if (index) {
					setImageSrc($(this));
				}
			});
		}

		$slideList
			.css({zIndex:1}).hide();

		$slideListPrev = $slideList.eq(activeIndex - 1);
		$slideListPrev
			.css({position: "absolute", zIndex:2, display: "block"});
		activeIndex = index;
		$slideList
			.eq(index - 1)
			.css({position: "absolute", zIndex:3, display: "block"})
			.find("img")
			.css({opacity:0})
			.stop(true,true)
			.animate({opacity:1}, duration * 1000, function() {$slideListPrev.hide();});
	}


	//
	// 
	//

	// 
	function startTimer() {
		if (playing) {
			clearInterval(intervalID);
			intervalID = setInterval(function(){
				var index = activeIndex + 1;
				if (index > slides.length) {
					index = 1;
			}
				showPage(index);
			}, (interval + duration) * 1000);
		}
	}
	// 
	function stopTimer() {
		clearInterval(intervalID);
	}


	//
	// 
	//

	// 
	showPage(1);
	enableTouch();
	enableSingleSlide();
	startTimer();

	//
	//
	//

	//
	//
	//
	//
	//
	function format(fmt, arg) {
		var fn = undefined;
		if ($.isPlainObject(arg)) {
			fn = function(str, part) { return arg[part]; }
		} else {
			var args = arguments;
			fn = function(str, part) { return args[parseInt(part)+1] }
		}
		return fmt.replace(/\{(\w+)\}/g, fn);
	}

	function enableTouch() {
		if (ua('ie8')) {
			return;
		}

		var hammered = new Hammer.Manager($slideID[0]);
		hammered.add(new Hammer.Swipe({ threshold:0, velocity:0, direction:Hammer.DIRECTION_HORIZONTAL }));
		hammered.on('swipeleft swiperight', function(e){
			stopTimer();
			swipe(e.direction);
			if (playing) {
				startTimer();
			}
		});
		function swipe(direction) {
			var index = activeIndex;
			switch(direction) {
				case Hammer.DIRECTION_LEFT:
					index++;
					if (index > slides.length) {
						index = 1;
					}
					break;

				case Hammer.DIRECTION_RIGHT:
					index--;
					if (index === 0) {
						index = slides.length;
					}
					break;
			}
			console.log(direction, activeIndex, index);

			showPage(index);
		}
	}

	function enableSingleSlide() {
		if (slides.length > 1) {
			return;
		}

		$slideID.find('.' + CLASS_SLIDE).addClass('slide-one-only');
	}
	
	
	

});
// eof.



