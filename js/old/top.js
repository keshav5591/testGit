/* **************************************************

Name: top.js

Description: JS for Hitachi.com top page

Create: 2014.02.13
Update: 2016.03.01

Copyright 2014 Hitachi, Ltd.

***************************************************** */



(function($){



var _fbAccessToken = "";

var _topV = [];
var _topCurrent = 1;
var _topPlaying = 1;
var _topStart = 0;
var _topYouTube = 0;
var _topSWFContents;
var _topCover;

$("html[class!='JS']").addClass("JS");

if(__videoHtml5[0] == null || __videoFlash[0] == null) {
	var _html5video = 0;
	var _noVideo = 1;
	$("html").addClass("NoVideo");
	_topV[1] = "";
} else {
	var _html5video = (ua("chrome") || (ua("ff") && ua("win") && !ua("xp")));
	var _noVideo = ua("sp");
	if (_noVideo) {
		$("html").addClass("NoVideo");
	} else if (_html5video) {
		$("html").addClass("HTML5");
	} else {
		$("html").addClass("Flash");
	}
}

if (ua("opera") || ua("ff") || ua("safari")) {
	window.onunload = function() {}
}



/* Background Image Adjust
=========================================================================================== */

var setBgImageSize = function() {
	
	var w = $("#HeaderArea").width();
	var h = getBrowserHeight() - 50;
	
	if (w < 320) w = 320;
	
	var bgW = w;
	var bgH = w / 16 * 9;
	
	if (h >= bgH) {
		bgH = h;
		bgW = bgH / 9 * 16;
	}
	
	if (!_checkRWD(768)) {
		$("#TopMovie .Inner, #TopImg .Inner").width(bgW).height(bgH).css({left:((w - bgW) / 2), top:((h - bgH) / 2)});
		if ($(".NoticeArea")[0]) {
			var noticeH = 0;
	 		$(".NoticeArea").each(function() {
				noticeH += $(this).height() + 15;
			});
			$("#Main").css({paddingBottom: 70 + noticeH, minHeight: 620 + noticeH});
		}
	}
	
}

$(window).on("load resize", setBgImageSize);



/* Add HTML
=========================================================================================== */

$(document).ready(function() {
	
	var cover = '<div id="TopCover"></div><div id="TopImgCover"></div>';
	
	if (_noVideo) {
		
		var movie = "";
		
	} else {
		
		var movie = '<div id="TopMovie"><div class="Inner">';
		
		if (_html5video) {
			for (i = 1; i <= __videoHtml5.length; i++) {
				movie += '<video id="TopMovie' + i + '"></video>';
			}
		} else {
			movie += '<div id="flashcontents"></div>';
		}
		
		movie += '</div></div>';
		
	}
	
	$("body").prepend(cover + movie);
	_topCover = $("#TopCover");
	
	if (_noVideo) {
		initImageRotation();
	} else if (_html5video) {
		initVideoHTML5();
	} else {
		initVideoFlash();
	}
	
	if ($(".Statement .Note")[0]) {$("#VideoControl").addClass("WithNote");}
	
});



/* Video
=========================================================================================== */

// HTML5

var initVideoHTML5 = function() {
	
	setBgImageSize();
	
	$(window).load(function() {
	
	var num = __videoHtml5.length;
	var indicator = "";
	
	for (var i = 1; i <= num; i++) {
		if (num > 1) {
			var alt = "Change to '" + $("#Statement" + i + " .Copy img").attr("alt") + "'";
			indicator += '<li class="Indicator"><a href="javascript:void(0);">' + alt + '</a></li>';
		}
		_topV[i] = document.getElementById("TopMovie" + i);
		_topV[i].src = __videoHtml5[i - 1];
		_topV[i].addEventListener("ended", function() {next();}, false);
	}
	
	_topV[1].play();
	
	if (num > 1) {
		$("#VideoControl ul").append(indicator);
		$(".Indicator").on("click", function() {
			var index = $(".Indicator").index(this) + 1;
			if (index == _topCurrent) {
				_topV[_topCurrent].currentTime = 0;
				if (_topPlaying) _topV[_topCurrent].play();
				return false;
			}
			_topV[_topCurrent].currentTime = 0;
			_topV[_topCurrent].pause();
			$(".Indicator").eq(_topCurrent-1).removeClass("Current");
			$("#TopMovie"+_topCurrent + ", #TopImg" + _topCurrent + ", #Statement" + _topCurrent).hide();
			_topCurrent = index;
			
			$(this).addClass("Current");
			
			$("#TopImg" + _topCurrent).show();
			$("#Statement" + _topCurrent).css({display: "inline-block"});
			if (_topPlaying) {
				$("#TopMovie"+_topCurrent).show();
				_topV[_topCurrent].play();
			} else {
				switchLayer(2);
			}
			return false;
		}).eq(0).addClass("Current");
	} else {
		$("#VideoControl ul").addClass("NoIndicator");
	}
	
	$("#VideoPlay").on("click", function() {
		if (_topPlaying) {
			_topPlaying = 0;
			_topV[_topCurrent].pause();
			$(this).addClass("Current").find("a").text("Play video");
		} else {
			_topPlaying = 1;
			$("#TopMovie"+_topCurrent).show();
			_topV[_topCurrent].play();
			$(this).removeClass("Current").find("a").text("Stop video");
			if (num == 1) {
				var tid = setTimeout(function() {switchLayer(1);}, 300);
			} else {
				switchLayer(1);
			}
		}
		return false;
	});
	
	var next = function() {
		
		if (num == 1) {
			_topPlaying = 0;
			$("#VideoPlay").addClass("Current").find("a").text("Play video");
			$("#TopImg .FirstImg").hide();
			$("#TopImg .LastImg").show();
			switchLayer(2);
			$("#TopImg").hide().fadeIn(300, function() {
				_topV[_topCurrent].currentTime = 0;
				_topV[_topCurrent].pause();
			});
		} else {
			_topV[_topCurrent].currentTime = 0;
			_topV[_topCurrent].pause();
			$(".Indicator").eq(_topCurrent-1).removeClass("Current");
			$("#TopMovie"+_topCurrent + ", #TopImg" + _topCurrent + ", #Statement" + _topCurrent).hide();
			_topCurrent = (_topCurrent < num) ? _topCurrent+1 : 1;
			$(".Indicator").eq(_topCurrent-1).addClass("Current");
			$("#TopImg" + _topCurrent).show();
			$("#Statement" + _topCurrent).css({display: "inline-block"});
			if (_topPlaying) {
				$("#TopMovie"+_topCurrent).show();
				_topV[_topCurrent].play();
			}
		}
		
	}
	
	_topV[1].addEventListener("canplay", function() {
		
		if (_topStart) return false;
		
		$("#VideoControl ul").show();
		switchLayer(1);
		_topStart = 1;
		
	}, false);
	
	});
	
}


// Flash

var flashNum;

var initVideoFlash = function() {
	
	if (swfobject.hasFlashPlayerVersion("11")) {
		
		setBgImageSize();

		var flashNum = __videoFlash.length;
		var flashVideo ="";
		var flashThumbnail = "";
		var flashRepeat = flashNum == 1 ? 0 : -1;
		for (i = 0; i < flashNum; i++) {
			if (i) {
				flashVideo += ", ";
				flashThumbnail += ", ";
			}
			flashVideo += __videoFlash[i];
			flashThumbnail += $("#TopImg"+(i+1)+"First img").attr("src");
		}
		var videoFlash = {
			video: flashVideo,
			thumbnail: flashThumbnail,
			repeat: flashRepeat
		};
		
		var params = { scale:'showall', bgcolor:'#ffffff', allowScriptAccess:'always',wmode:'transparent' };
		var attributes = { id:'flashcontents', name:'flashcontents'};
		swfobject.embedSWF("/image/en/r5/top/video/topMovie.swf", "flashcontents", "100%", "100%", "11.0.0", "", videoFlash, params, attributes);
		
		_topStart = 1;
		
	} else {
		
		setBgImageSize();
		
		$("#TopImg").show();
		$("#TopMovie").remove();
		$("html").removeClass("Flash").addClass("NoVideo");
		_html5video = 0;
		_noVideo = 1;
		initImageRotation();
		$('<div class="NoticeArea"><p class="TextStyle1 CenterAdjust">In order to view this page, you need to have <a href="http://www.adobe.com/go/getflashplayer">Adobe&reg; Flash&reg; Player</a> installed in your computer.</p></div>').insertBefore("#News");
		
	}
	
}

changeItems = function(n) {
	
	_topCurrent = n + 1;
	
	$("#TopImg .Inner div, #Main .Statement").hide();
	$("#TopImg" + _topCurrent).show();
	$("#Statement" + _topCurrent).css({display:"inline-block"});
	$(".Indicator").removeClass("Current");
	$(".Indicator").eq(_topCurrent - 1).addClass("Current");
	
}

createIndicatior = function(n) {
	
	if (!_topSWFContents) {
	
	var movieMax = n;
	_topSWFContents = document.flashcontents;
	
	if (movieMax > 1) {
		var indicator = "";
		for (i=1; i<=movieMax; i++) {
			var alt = "Change to '" + $("#Statement" + i + " .Copy img").attr("alt") + "'";
			indicator += '<li class="Indicator"><a href="javascript:void(0);">' + alt + '</a></li>';
		}
		$("#VideoControl ul").append(indicator);
		changeItems(_topCurrent - 1);
		
		$(".Indicator").on("click", function() {
			var index = $(".Indicator").index(this) + 1;
			if (index != _topCurrent) {
				$(".Indicator").removeClass("Current");
				$("#Main .Statement").hide();
				_topCurrent = index;
			}
			_topSWFContents.changeVideo(_topCurrent - 1);
			$(this).addClass("Current");
			$("#Statement" + _topCurrent).css({display:"inline-block"});
			return false;
		});
	} else {
		$("#VideoControl ul").addClass("NoIndicator");
	}
	
	$("#VideoControl ul").show();
	
	$("#VideoPlay").on("click", function() {
		if (_topPlaying) {
			_topPlaying = 0;
			_topSWFContents.pauseVideo();
			$(this).addClass("Current").find("a").text("Play video");
		} else {
			_topPlaying = 1;
			_topSWFContents.playVideo();
			$(this).removeClass("Current").find("a").text("Stop video");
			if (flashNum == 1) {
				var tid = setTimeout(function() {switchLayer(1);}, 500);
			} else {
				switchLayer(1);
			}
		}
		return false;
	});
	
	}
	
}

setPlayBtn = function(flag) {
	if (flag) {
		_topPlaying = 1;
		_topSWFContents.playVideo();
		switchLayer(1)	
		$("#VideoPlay").removeClass("Current").find("a").text("Stop video");
	} else {
		_topPlaying = 0;
		_topSWFContents.pauseVideo();
		$("#VideoPlay").addClass("Current").find("a").text("Play video");
		$("#TopImg .FirstImg").hide();
		$("#TopImg .LastImg").show();
		switchLayer(2);
		$("#TopImg").hide().fadeIn(300);
	}
}

var switchLayer = function(n) {
	
	$("#TopImg").css({zIndex:n});
	$("#TopMovie").css({zIndex:Math.abs(n - 3)});
	
}


// Image Rotation

var _rotationTimer;
var _rotationInterval = 5000;
var _currentImage = 1;
var _prevImage = 1;
var _lastImage = 1;

var initImageRotation = function() {
	
	setBgImageSize();
	
	_lastImage = $("#TopImg .Inner div").length;
	
	if (_lastImage > 1) {
		
		var indicator = "";
		
		for (var i = 1; i <= _lastImage; i++) {
			var alt = "Change to '" + $("#Statement" + i + " .Copy img").attr("alt") + "'";
			indicator += '<li class="Indicator"><a href="javascript:void(0);">' + alt + '</a></li>';
		}
		
		$("#VideoControl ul").show().append(indicator);
		$(".Indicator").eq(0).addClass("Current");
		
		$("#VideoPlay").on("click", function() {
			if (!$(this).hasClass("Current")) {
				clearTimeout(_rotationTimer);
				$(this).addClass("Current").find("a").text("Play video");
			} else {
				$(this).removeClass("Current").find("a").text("Stop video");
				_rotationTimer = setTimeout(nextImage, _rotationInterval);
			}
			return false;
		});
		
		$(".Indicator").on("click", function() {
			clearTimeout(_rotationTimer);
			var index = $(".Indicator").index(this) + 1;
			if (index != _currentImage) {
				_prevImage = _currentImage;
				_currentImage = index;
				swapImages();
			}
			return false;
		});
		
		_rotationTimer = setTimeout(nextImage, _rotationInterval);
		
	}
	
}

var nextImage = function() {
	
	clearTimeout(_rotationTimer);
	
	_prevImage = _currentImage;
	_currentImage++;
	if (_currentImage > _lastImage) {
		_currentImage = 1;
	}
	
	swapImages();
	
}

var swapImages = function() {
	
	$(".Indicator").removeClass("Current");
	$(".Indicator").eq(_currentImage - 1).addClass("Current");
	$("#Statement" + _prevImage).hide();
	$("#Statement" + _currentImage).css({display:"inline-block"});
	$("#TopImg" + _prevImage).css({zIndex:1});
	$("#TopImg" + _currentImage).css({zIndex:2}).stop(true, false).fadeIn(300, function() {
		$("#TopImg" + _prevImage).hide();
		if (!$("#VideoPlay").hasClass("Current")) {
			_rotationTimer = setTimeout(nextImage, _rotationInterval);
		}
	});
	
}



/* You Tube
=========================================================================================== */

$(document).ready(function() {
	
	var movieWidth = 853, movieHeight = 480, movieTitle = "";
	
	var html = '<div id="ModalYouTubeCover"></div>';
	html += '<div id="ModalYouTube">';
	html += '<div class="Inner">';
	html += '<div class="Movie"></div>';
	html += '<div class="Title"><p></p></div>';
	html += '<p class="BtnClose"><a href="javascript:void(0);">Close</a></p>';
	html += '</div>';
	html += '</div>';
	
	$("body").append(html);
	
	$("#ModalYouTubeCover, #ModalYouTube").on("click", function() {
		
		$("#ModalYouTube").hide();
		$("#ModalYouTube .Movie").empty();
		
		$("#ModalYouTubeCover").stop().animate({opacity: 0}, 300, function() {
			
			playPauseItems(1);
			_topYouTube = 0;
			
			$(this).hide();
			$(window).off("resize.lightbox");
			
		});
		
		return false;
		
	});
	
	
	$("#ModalYouTube .Movie, #ModalYouTube .Title").on("click", function(event) {
		
		event.stopPropagation();
		
	});
	
	
	$(".Statement .Banner, #Recommend .ColumnSet").on("click", ".YouTubeLink", function() {
		
		playPauseItems(0);
		_topYouTube = 1;
		
		var bodyHeight = $("body").height();
		$("#ModalYouTubeCover").css({opacity: 0}).show().animate({opacity: 0.8}, 300);
		
		movieTitle = $(this).find("p").text() || $(this).find("img").attr("alt");
		
		var url = $(this).attr("href");
		var id = /[0-9A-Za-z_-]{11}/.exec(url);
		var rel = url.indexOf("rel=0") !== -1 ? 0 : 1;
		var autoplay = url.indexOf("autoplay=1") !== -1 ? 1 : 0;
		
		$("#ModalYouTube .Movie").html('<iframe width="' + movieWidth + '" height="' + movieHeight + '" src="http://www.youtube.com/embed/' + id + '?autoplay=' + autoplay + '&rel=' + rel + '&wmode=transparent" frameborder="0" allowfullscreen></iframe>');
		
		fixSize(true);
		
		return false;
		
	});
	
	
	var openMovie = function(screenTop) {
		
		$("#ModalYouTube .Title p").text(movieTitle);
		$("#ModalYouTube").show();
		$(window).one("scroll", function() { $(window).scrollTop(screenTop); } );
		$("#ModalYouTube .BtnClose a").focus();
		$(window).on("resize.lightbox", function() { fixSize(false); });
		
	}
	
	
	var fixSize = function(open) {
		
		var screenWidth = $(window).width();
		var screenHeight = $(window).height();
		var screenTop = $(window).scrollTop();
		
		var boxPaddingLR = parseInt($("#ModalYouTube").css("paddingLeft"));
		var boxPaddingTB = 50;
		var bottomHeight = 50;
		
		if (movieWidth + boxPaddingLR * 2 > screenWidth) {
			var ratio = movieWidth / (screenWidth - boxPaddingLR * 2);
			var boxWidth = movieWidth / ratio;
			var boxHeight = movieHeight / ratio + bottomHeight;
		} else {
			var boxWidth = movieWidth;
			var boxHeight = movieHeight + bottomHeight;
		}
		
		if (boxHeight + boxPaddingTB * 2 > screenHeight) {
			var top = screenTop;
		} else {
			var top = (screenHeight - boxHeight) / 2 - boxPaddingTB + screenTop;
		}
		
		$("#ModalYouTube").css({
			width: boxWidth,
			height: boxHeight,
			top: top,
			left: (screenWidth - boxWidth) / 2 - boxPaddingLR
		});
		
		$("#ModalYouTube iframe").css({
			height: boxHeight - bottomHeight
		});
		
		if (open) {
			openMovie(screenTop);
		}
		
	}
	
});



/* News
=========================================================================================== */

var _newsItems = [];
var _newsIdx = 0;
var _newsNum = 0;

var _newsBodyW = 0;
var _newsW = 0;

var _newsRefreshTimer;
var _newsRefreshInterval = 5000;
var _newsTicking = true;

var _newsMarqueeTimer;
var _newsMarqueePos = 0;
var _newsMarqueeInterval = 50;
var _newsMarqueeStep = 3;

var fixNewsDiv;
var getNews;
var showNews;
var refreshNews;
var marqueeNews;

$(document).ready(function() {

	$.ajax({
		type: "GET",
		url: "/js/en/r5/news.json",
		dataType: "json",
		cache: false,
		success: function(news) {
			
			// New Ticker
			
			fixNewsDiv = function() {
				
				var h2 = $("#News h2").width();
				var contents = $("#MainMenu").width();
				_newsBodyW = !_checkRWD(768) ? contents - h2 - 90: contents;
				_newsBodyL = !_checkRWD(768) ? h2 : 0;
				
				$("#NewsBody").css({
					width: _newsBodyW,
					left: _newsBodyL
				});
				
			}
			
			getNews = function() {
				
				for (var i in news) {
					_newsIcon = (news[i].icon) ? '<img src="/image/en/r1/icon/icon_new_hd.gif" width="28" height="13" alt="New" />' : '';
					_newsItems[i] = news[i].date + '<a href="' + news[i].url + '">' + news[i].description + _newsIcon + '</a>';
					_newsNum = i;
				}
				
				showNews();
				
			}
			
			showNews = function() {
				
				fixNewsDiv();
				
				$("#NewsBodyInner").hide().html(_newsItems[_newsIdx]).fadeIn(500);
				
				_newsW = $("#NewsBodyInner").outerWidth();
				if (_newsW > _newsBodyW) {
					_newsMarqueePos = _newsMarqueeStep;
					if (_newsTicking) {
						_newsMarqueeTimer = setTimeout(marqueeNews, 2000);
					}
				}
				
				if (_newsTicking) {
					_newsRefreshTimer = setTimeout(refreshNews, _newsRefreshInterval);
				}
				
			}
			
			refreshNews = function() {
				
				clearTimeout(_newsRefreshTimer);
				
				if (_newsMarqueePos > 0) {
					
					_newsRefreshTimer = setTimeout(refreshNews, 200);
					
				} else {
					
					$("#NewsBodyInner").fadeOut(300, function() {
						_newsIdx = (_newsIdx == _newsNum) ? 0 : _newsIdx + 1;
						$("#NewsBody").css({textIndent: 0});
						showNews();
					});
					
				}
				
			}
			
			marqueeNews = function() {
				
				clearTimeout(_newsMarqueeTimer);
				
				$("#NewsBody").css({textIndent: -_newsMarqueePos});
				
				if (_newsW - _newsBodyW > _newsMarqueePos) {
					_newsMarqueePos += _newsMarqueeStep;
					_newsMarqueeTimer = setTimeout(marqueeNews, _newsMarqueeInterval);
				} else {
					_newsMarqueeTimer = setTimeout(function() {
						_newsMarqueePos = 0;
					}, 1000);
				}
				
			}
			
			$("#News").append('<div id="NewsBody"><span id="NewsBodyInner"></span></div>');
			
			$("#NewsPlay a").on("click", function() {
				if (_newsTicking) {
					if (_newsMarqueePos > 0) {
						clearTimeout(_newsMarqueeTimer);
					} else {
						clearTimeout(_newsRefreshTimer);
					}
					$(this).addClass("Current");
					$("#NewsPlay a").text("Play");
					_newsTicking = false;
				} else {
					if (_newsMarqueePos > 0) {
						_newsMarqueeTimer = setTimeout(marqueeNews, 0);
						_newsRefreshTimer = setTimeout(refreshNews, 0);
					} else {
						_newsRefreshTimer = setTimeout(refreshNews, 0);
					}
					$(this).removeClass("Current");
					$("#NewsPlay a").text("Stop");
					_newsTicking = true;
				}
				return false;
			});
			
			$("#NewsPrev a").on("click", function() {
				if (_newsMarqueePos > 0) {
					clearTimeout(_newsMarqueeTimer);
				}
				clearTimeout(_newsRefreshTimer);
				$("#NewsBodyInner").fadeOut(300, function() {
					$("#NewsBody").css({textIndent: 0});
					_newsMarqueePos = 0;
					_newsIdx = (_newsIdx == 0) ? _newsNum : _newsIdx - 1;
					showNews();
				});
				return false;
			});
			
			$("#NewsNext a").on("click", function() {
				if (_newsMarqueePos > 0) {
					clearTimeout(_newsMarqueeTimer);
				}
				clearTimeout(_newsRefreshTimer);
				$("#NewsBodyInner").fadeOut(300, function() {
					$("#NewsBody").css({textIndent: 0});
					_newsMarqueePos = 0;
					_newsIdx = (_newsIdx == _newsNum) ? 0 : _newsIdx + 1;
					showNews();
				});
				return false;
			});
			
			getNews();
			$(window).on("resize", function() {
				fixNewsDiv();
			});
			
		}
		
	});
	
});



/* Play/Pause Video, Image Rotation, News Ticker
=========================================================================================== */

var playPause = 1;

var playPauseItems = function(play) {
	
	playPause = play;
	
	if (_noVideo) {
		
		if (_lastImage > 1) {
			if (play) {
				if (!$("#VideoPlay").hasClass("Current")) {
					clearTimeout(_rotationTimer);
					_rotationTimer = setTimeout(nextImage, _rotationInterval);
				}
			} else {
				clearTimeout(_rotationTimer);
			}
		}
		
	} else {
		
		if (play) {
			
			if (_topPlaying) {
				if (_topSWFContents) {
					_topSWFContents.playVideo();
				} else {
					_topV[_topCurrent].play();
				}
			}
		
		} else {
			
			if (_topPlaying) {
				if (_topSWFContents) {
					_topSWFContents.pauseVideo();
				} else {
					_topV[_topCurrent].pause();
				}
			}
			
		}
		
	}
	
	if (_newsTicking) {
		
		if (play) {
			
			if (_newsMarqueePos > 0) {
				_newsMarqueeTimer = setTimeout(marqueeNews, 0);
				_newsRefreshTimer = setTimeout(refreshNews, 0);
			} else {
				_newsRefreshTimer = setTimeout(refreshNews, 0);
			}
			
		} else {
			
			if (_newsMarqueePos > 0) {
				clearTimeout(_newsMarqueeTimer);
			} else {
				clearTimeout(_newsRefreshTimer);
			}
			
		}
		
	}
	
}



/* Ultra Global Navigation
=========================================================================================== */

// Define

var _headerAction = 0;



// Set height of panels

var headerSetHeight = function(menu) {
	
	switch(menu) {
		
		case "SearchArea":
			$("#SearchArea").show();
			return $("#SearchSet").height() + 35;
			break;
		case "CountryRegionArea":
			$("#CountryRegionArea").show();
			if (_checkRWD(768)) {
				var areaH = $("#CountryRegion div.Current")[0] ? $("#CountryRegion div.Current").height() : 0;
				var h = 225 + $("#CountryRegion h2").height() + $("#CountryRegion .Global").height() + areaH;
			} else {
				var $cr = $("#CountryRegion div.Europe");
				var h =  150 + $cr.show().height();
				$cr.removeAttr("style");
			}
			return h;
			break;
		case "SuperGlobalNaviProducts":
			$("#SuperGlobalNaviProducts").show();
			return $("#SuperGlobalNaviProducts .Inner").height() + (_checkRWD(768) ? 0 : 10);
			break;
		case "SuperGlobalNaviCompany":
			$("#SuperGlobalNaviCompany").show();
			return $("#SuperGlobalNaviCompany .Inner").height() + (_checkRWD(768) ? 0 : 10);
			break;
		case "UltraGlobalNavi":
			$("#UltraGlobalNavi").show();
			return $("#GlobalNaviSP").height() + $("#SuperGlobalNaviProducts").height() + $("#SuperGlobalNaviCompany").height() + 30;
			break;
		
	}
	
}



var ultraGlobalNavi = function() {
	
	// Append to DOM
	
	$("#Search").append(_SText);
	$("#CountryRegion").append(_CRText);
	$("#UltraGlobalNaviProducts").after(_SGNProductsText);
	$("#UltraGlobalNaviCompany").after(_SGNCompanyText);
	
	$("#HeaderArea .BtnOpen a").attr("href", "javascript:void(0);");
	alert("Hello");
	
	
	
	// Bind click events : Open button
	
	$("#HeaderArea .BtnOpen a").on("click", function() {
		
		if (_headerAction) return false;
		_headerAction = 1;
		
		var $this = $(this);
		
		if ($this.hasClass("Current")) {
			
			_headerClose();
			
		} else {
			
			
			if ($(this).parent().attr("id") == "GlobalNaviTopButtonSP") {
				$("html").removeClass("MenuOpen");
			} else {
				$("html").addClass("MenuOpen");
			}
			if ($("#HeaderArea .BtnOpen .Current")[0]) {
				$("#HeaderArea .BtnOpen .Current").removeClass("Current").parent().next().removeAttr("style");
				_topCover.css({display:"block", opacity:"0.5"});
			} else {
				_topCover.css({display:"block", opacity:"0.01"}).animate({opacity:"0.5"}, 300);
				if (!_checkRWD(768)) playPauseItems(0);
			}
			$("#GlobalNaviTopButtonSP .CurrentSP").removeClass("CurrentSP");
			if ($this.parent().parent().attr("id") == "CountryRegion") {
				if (_checkRWD(768)) {
					$("#CountryRegionSet .Current").removeClass("Current");
				} else {
					if (!$("#CountryRegionSet .Current")[0]) $("#CountryRegion .Americas").addClass("Current");
				}
			}
			
			var h = headerSetHeight($this.parent().next().attr("id"));
			$this.addClass("Current").parent().next().height($("#HeaderArea").css("margin-bottom")).animate({height:h}, 300);
			if (_checkRWD(768)) $("#TopImg, #TopMovie").animate({marginTop:h}, 300);
			$("#HeaderArea").animate({marginBottom:h}, 300, function() {
				_headerAction = 0;
			});
			
		}
		
	
	});
	
	
	// Bind click events : Close button & Cover
	
	var _headerClose = function() {
		
		var $current = $("#HeaderArea .BtnOpen .Current");
		$current.removeClass("Current").parent().next().animate({height:0}, 300);
		$("#GlobalNaviTopButtonSP .CurrentSP").removeClass("CurrentSP");
		_topCover.animate({opacity:"0"}, 300);
		if (_checkRWD(768)) $("#TopImg, #TopMovie").animate({marginTop:0}, 300);
		
		$("#HeaderArea").animate({marginBottom:0}, 300, function() {
			$current.parent().next().removeAttr("style");
			_headerAction = 0;
			
			_topCover.removeAttr("style");
			if (!_checkRWD(768)) playPauseItems(1);
			$("html").removeClass("MenuOpen");
		});
		
	}
	
	$("#HeaderArea .BtnClose a, #TopCover").on("click", function() {
		
		if (_headerAction) return false;
		_headerAction = 1;
		_headerClose();
		
	});
	
	
	// Bind click events : Link to Global Network Page
	
	$("#CountryRegion .Global").on("click", function() {
		if (_checkRWD(768)) location.href = $(this).find("a").attr("href");
	});
	
	
	// Bind mouseover events : Coutry/Region Tab
	
	$("#CountryRegion h3 a").on("mouseover focus", function() {
		
		if(!_checkRWD(768)) {
			$("#CountryRegion .Inner .Current").removeClass("Current");
			$(this).parent().addClass("Current").next().addClass("Current");
		}
		
	}).on("click", function() {
		
		if (_checkRWD(768) && !_headerAction) {
			
			_headerAction = 1;
			
			var $parent = $(this).parent();
			var $next = $parent.next();
			var areaH = $next.height();
			var current = ($parent.hasClass("Current")) ? 1 : 0;
			if ($("#CountryRegion h3.Current")[0]) {
				$("#CountryRegion h3.Current").removeClass("Current").next().slideUp(300, function() {
					$(this).removeClass("Current").removeAttr("style");
				});
			}
			if(!current) {
				var tid = setTimeout(function() {$parent.addClass("Current");}, 0);
				$next.slideDown(300, function(){$(this).addClass("Current").removeAttr("style");});
			} else {
				areaH = 0;
			}
			_headerScrollTop();
			var h = 225 + $("#CountryRegion h2").height() + $("#CountryRegion .Global").height() + areaH;
			$("#CountryRegionArea").animate({height:h}, 300);
			$("#TopImg, #TopMovie").animate({marginTop:h}, 300);
			$("#HeaderArea").animate({marginBottom:h}, 300, function() {
				_headerAction = 0;
			});
			
		}
		
	});
	
}

$(document).ready(function() {
	var headerID = setInterval(function() {
		if(typeof _SText !== "undefined" && typeof _CRText !== "undefined" && typeof _SGNProductsText !== "undefined" && typeof _SGNCompanyText !== "undefined") {
			clearInterval(headerID);
			ultraGlobalNavi();
		}
	}, 50);
});

var _headerSP = 1;

$(window).on("resize", function() {
	
	if ($("#HeaderArea .BtnOpen .Current")[0] || $("#GlobalNaviTopButtonSP .CurrentSP")[0]) {
		
		if (_checkRWD(768)) {
			if (!_headerSP) {
				_headerSP = 1;
				$("#CountryRegionSet .Current").removeClass("Current");
				$("#GlobalNaviTopButtonSP .CurrentSP").removeClass("CurrentSP").addClass("Current");
				$("#UltraGlobalNavi .BtnOpen .Current").parent().next().removeAttr("style");
				if (!playPause && !_topYouTube) playPauseItems(1);
			}
		} else {
			if (_headerSP) {
				_headerSP = 0;
				if (!$("#CountryRegionSet .Current")[0]) $("#CountryRegion .Americas").addClass("Current");
				if (_topYouTube) {
					$("#HeaderArea").removeAttr("style");
					$("#HeaderArea .BtnOpen .Current").removeClass("Current").parent().next().removeAttr("style");
					$("#TopImg, #TopMovie").css({marginTop:0});
					_topCover.removeAttr("style");
					$("html").removeClass("MenuOpen");
				}
				if ($("#GlobalNaviTopButtonSP .Current")[0]) {
					$("#GlobalNaviTopButtonSP .Current").removeClass("Current").addClass("CurrentSP");
					$("#HeaderArea").removeAttr("style");
					$("#UltraGlobalNavi").removeAttr("style");
					$("html").removeClass("MenuOpen");
					if (!_topYouTube) _topCover.removeAttr("style");
				} else if (playPause) playPauseItems(0);
			}
		}
		
		$current = $("#HeaderArea .BtnOpen .Current").parent().next();
		var h = headerSetHeight($current.attr("id"));
		$current.height(h);
		$("#TopImg, #TopMovie").css({marginTop:_checkRWD(768) ? h : 0});
		$("#HeaderArea").css({marginBottom:h});
	}
	
});



/* Share Buttons
=========================================================================================== */

$(document).ready(function() {
	
	
	var html;
	var url = "http://www.hitachi.com/";
	
	
	// Facebook
	
	html = '<li id="SbFacebook"><iframe src="//www.facebook.com/plugins/like.php?href=' + encodeURIComponent(url) + '&amp;width&amp;layout=button_count&amp;action=like&amp;show_faces=false&amp;share=false&amp;height=21&amp;locale=en_US" scrolling="no" frameborder="0" style="border:none; overflow:hidden; height:21px;" allowTransparency="true"></iframe></li>';
	
	
	// Twitter
	
	if ((!ua("mac") || !ua("safari") || navigator.userAgent.indexOf("Version/5.0") == -1) && navigator.userAgent.indexOf("Android 2") == -1 && (!ua("ios") || navigator.userAgent.indexOf("OS 4") == -1)) {
		
		html += '<li id="SbTwitter"><a href="https://twitter.com/share" class="twitter-share-button" data-url="' + url + '">Tweet</a></li>';
		
	}
	
	
	// Google+
	
	if (!ua("ios") || navigator.userAgent.indexOf("OS 4") == -1) {
		
		html += '<li id="SbGplusone"><div class="g-plusone" data-size="medium" data-href="' + url + '"></div></li>';
		
		(function() {
			var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
			po.src = 'https://apis.google.com/js/platform.js';
			var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
		})();
		
	}
	
	
	// Linkedin
	
	html += '<li id="SbLinkedin">';
	html += '<script src="//platform.linkedin.com/in.js" type="text/javascript">lang: en_US</script>';
	html += '<script type="IN/Share" data-url="' + url + '" data-counter="right"></script>';
	html += '</li>';
	
	
	$("#ShareButtons").append(html);
	
	
});



/* Smooth Scroll
=========================================================================================== */

$(document).ready(function() {
	
	var topID = (ua("safari")) ? "body" : "html";
	
	$(".SmoothScroll").unbind().click(function(){
		var link = $(this).attr("href");
		if(link.charAt(0)=="#" && link.charAt(1)!="") {
			var offset = $(link).offset();
			var tid = setTimeout(function() {
				$(topID).stop().animate({scrollTop: link == "#top" ? 0 : offset.top}, 800, "easeInOutCubic", function() {
					location.href = link;
				});
			}, 10);
			return false;
		}
	});
	
});



/* Facebook Page
=========================================================================================== */

var renderFacebookPanel = function(panel) {
	
	var url = panel.children("a").attr("href");
	var user = url.match(/facebook\.com\/([a-zA-Z0-9.]+)/)[1];
	if (!user) return;
	
	$.ajax({
		
		url: "https://graph.facebook.com/v2.5/" + user + "?access_token=" + _fbAccessToken,
		type: "GET",
		dataType: "json"
		
	}).done(function(data) {
		
		if (data.error) return;
		
		$.ajax({
			
			url: "https://graph.facebook.com/v2.5/" + data.id + "/feed?limit=1&access_token=" + _fbAccessToken,
			type: "GET",
			dataType: "json"
			
		}).done(function(data) {
			
			var msg = data.data[0].message;
			msg = msg.length > 60 ? msg.substr(0, 60) + "…" : msg;
			panel.find(".FbBox p").text(msg);
			
			var ids = data.data[0].id.split("_");
			var link = "https://www.facebook.com/" + ids[0] + "/posts/" + ids[1];
			panel.children("a").attr({ href: link });
			
		});
		
	});
	
}


$(document).ready(function() {
	
	var fbPanels = $("#Recommend .Facebook");
	
	if (fbPanels.length > 0) {
		
		for (var i = 0; i < fbPanels.length; i++) {
			renderFacebookPanel(fbPanels.eq(i));
		}
		
	}
	
});



/* Skip Link
=========================================================================================== */


var _skipLinkOpen = false;


$(document).ready(function() {
	
	$("#top a").on("focus", function() {
		
		_skipLinkOpen = true;
		
		var tid = setTimeout(function() {
			fixSkipLink();
		}, 0);
		
	}).on("focusout", function() {
		
		_skipLinkOpen = false;
		
		var offsetTop = 0;
		
		if (_crbOpen) {
			$("#CountryRegionBar").css({ top: 0 });
			offsetTop = $("#CountryRegionBar").height();
		}
		
		$("#HeaderArea").css({ marginTop: offsetTop });
		$("#Main").css({marginTop: offsetTop });
		$("#TopImg, #TopMovie").css({top: offsetTop + 50 });
		_topCover.css({ top: offsetTop });
		
	});
	
	var fixSkipLink = function(){
			
			if (!_skipLinkOpen && !_crbOpen) return false;
			
			var offsetTop = $("#top").height();
			var headerOffsetTop = _checkRWD(768) ? 0 : offsetTop;
			
			if (_crbOpen) {
				$("#CountryRegionBar").css({ top: offsetTop });
				offsetTop += $("#CountryRegionBar").height();
				headerOffsetTop += $("#CountryRegionBar").height();
			}
			
			$("#HeaderArea").css({ marginTop: headerOffsetTop });
			$("#Main").css({ marginTop: headerOffsetTop });
			_topCover.css({ top: offsetTop });
			$("#TopImg, #TopMovie").css({top: offsetTop + 50 });
			
	}
	
	$(window).on("resize", fixSkipLink);
	
});



/* Country/Region Bar
=========================================================================================== */


var _crbTimer;
var _crbOpen = false;
var _crbOpenTime = 2000;
var _crbOpenDuration = 1000;
var _crbCloseTime = 16000;
var _crbCloseDuration = 300;

var _ipDetectionApi = "http://www-lang.ext.hitachi.co.jp/geoip/ajax_getcountry.php";
var _countryDataFile = "/js/en/r5/network.json";


$(document).ready(function() {
	
	
	// Referer check
	
	if (document.referrer.indexOf(location.hostname + "/") != -1) {
		return;
	}
	
	
	// IP detection
	
	$.ajax({
		url: _ipDetectionApi,
		dataType: "jsonp",
		data: {count: 1},
		jsonp: "JsonCallback",
		success: function(data) {
			if (data["country"] != "unknown") {
				getCountryInfo(data["country"]);
			}
		}
	});
	
	
	// Get country info
	
	var getCountryInfo = function(countryId) {
		
		$.ajax({
			url: _countryDataFile,
			dataType: "json",
			success: function(data) {
				if (countryId in data) {
					showBar(data[countryId]);
				}
			}
		});
		
	}
	
	
	// Show bar
	
	var showBar = function(countryInfo) {
		
		
		// Add country/region bar HTML
		
		var lang = "";
		var str = countryInfo["site"];
		for (var i = 0; i < countryInfo["lang"].length; i++) {
			lang += (lang) ? " / " : "";
			lang += '<a href="' + countryInfo["lang"][i]["url"] + '">' + countryInfo["lang"][i]["label"] + '</a>';
			str += countryInfo["lang"][i]["label"];
		}
		
		var html = '<div id="CountryRegionBar"><div id="CRBarInner">';
		html += '<div class="Inner">';
		html += "<p><span>Welcome to Hitachi Global</span></p>";
		html += '<div id="CRBarGo">Go to ' + countryInfo["site"] + ' (' + lang + ')</div>';
		html += '</div>';
		html += '<div id="CRBarClose"><a href="javascript:void(0);">Close</a></div>';
		html += '</div></div>';
		
		$("#top").after(html);
		
		
		// Show bar
		
		_crbTimer = setTimeout(function() {
			
			_crbOpen = true;
			
			var offsetTop = $("#CountryRegionBar").height();
			var headerOffsetTop = offsetTop;
			
			if (_skipLinkOpen) {
				var skipLinkHeight = $("#top").height();
				$("#CountryRegionBar").css({ top: skipLinkHeight });
				offsetTop += skipLinkHeight;
				headerOffsetTop += _checkRWD(768) ? 0 : skipLinkHeight;
			} else {
				$("#CountryRegionBar").css({ top: 0 });
			}
			
			if (!_checkRWD(768)) $("#CountryRegionBar").height(0).animate({ height: offsetTop });
			$("#HeaderArea, #Main").animate({ marginTop: headerOffsetTop }, _crbOpenDuration);
			_topCover.animate({ top: offsetTop }, _crbOpenDuration);
			$("#TopImg, #TopMovie").animate({ top: offsetTop + 50 }, _crbOpenDuration, function() {
				startCRBarCloseTimer();
			});
			
		}, _crbOpenTime);
		
		
		// Close button
		
		$("#CRBarClose").on("click", function() {
			
			if (_headerAction) return false;
			clearTimeout(_crbTimer);
			
			hideBar();
			
		});
		
		
	}
		
		
	// Hide bar
	
	var hideBar = function() {
		
		_crbOpen = false;
		_headerAction = 1;
		
		var offsetTop = (_skipLinkOpen) ? $("#top").height() : 0;
		var headerOffsetTop = _checkRWD(768) ? 0 : offsetTop;
		
		if (!_checkRWD(768)) $("#CountryRegionBar").animate({ height: 0 });
		$("#HeaderArea, #Main").animate({ marginTop: headerOffsetTop }, _crbCloseDuration);
		_topCover.animate({ top: offsetTop }, _crbCloseDuration);
		$("#TopImg, #TopMovie").animate({top: offsetTop + 50 }, _crbCloseDuration, function() {
			$("#CountryRegionBar").remove();
			_headerAction = 0;
		});
		
	}
	
	var startCRBarCloseTimer = function() {
		_crbTimer = setTimeout(hideBar, _crbCloseTime);
	}
	
});



/* Recommendation
=========================================================================================== */

var _categoryDataFile = "/js/en/r5/recommend/category.json";
var _categoryHtmlDir = "/js/en/r5/recommend/";
var _categoryData = [];
var _targetElements = {}
var _defaultContents = {};
var _cookieDays = 30;
var _defaultAccessToken;




// initialize

var initRecommendation = function() {
	
	_targetElements.mainmenu = $("#MainMenu ul li:nth-child(4)");
	_targetElements.recommend = $("#Recommend .ColumnSet");
	_targetElements.fatbanner = $("#BannerArea ul");
	
	
	// save default contents
	
	_defaultContents.mainmenu = _targetElements.mainmenu.html();
	_defaultContents.recommend = _targetElements.recommend.html();
	_defaultContents.fatbanner = _targetElements.fatbanner.html();
	_defaultAccessToken = _fbAccessToken;
	
	
	// load category file
	
	$.ajax({
		
		url: _categoryDataFile,
		dataType: "json"
		
	}).done(function(data) {
		
		
		_categoryData = data;
		
		var referrers = {};
		$.each(_categoryData, function(key, value) {
			for (var i = 0; i < value.referrer.length; i++) {
				referrers[value.referrer[i]] = key;
			}
		});
		
		
		// bind event to category buttons
		
		$("#Category a").on("click", function() {
			
			var $li = $(this).parent();
			
			if (!$li.hasClass("Current")) {
				var id = $li.attr("id").substr(8);
				Cookies.set("tpcBtn", id, _cookieDays);
				switchCategory(id, true);
			}
			
		});
		
		
		// set initial category
		
		var initialId = "None";
		
		var lastRefId = Cookies.get("tpcRef");
		var lastBtnId = Cookies.get("tpcBtn");
		
		var thisRefId = "";
		var ref = document.referrer;
		$.each(referrers, function(key, value) {
			if (ref.indexOf(key) != -1) {
				thisRefId = value;
				Cookies.set("tpcRef", value, _cookieDays);
				return false;
			}
		});
		
		if (lastBtnId && lastBtnId != "None") {
			initialId = lastBtnId;
		} else if (thisRefId) {
			initialId = thisRefId;
		} else if (lastRefId && lastRefId != "None") {
			initialId = lastRefId;
		}
		
		if (initialId != "None") {
			switchCategory(initialId, false);
		}
		
		
	}).fail(function() {
		
		$("#Category").hide();
		
	});
	
	
}




// switch contents by category

var switchCategory = function(id, fade) {
	
	var ltIE9 =  navigator.userAgent.indexOf("MSIE 9") != -1;
	var fadeInterval = 500;
	
	
	// fade
	
	if (fade) {
		
		$("#Recommend .GridSet").addClass("Loading");
		playPauseItems(0);
		
		if(!ltIE9) {
			var css = { transition: "opacity " + (fadeInterval/1000) +"s", opacity: 0 }
			_targetElements.recommend.css(css);
		} else {
			var tid3 = setTimeout(function() {_targetElements.recommend.fadeTo(fadeInterval, 0);}, 0);
		}
		
	}
	
	if(!ltIE9) var css = { transition: "opacity " + (fadeInterval/1000) +"s", opacity: 1 }
	
	
	// radio button
	
	$("#Category li").removeClass("Current");
	$("#Category li#Category" + id).addClass("Current");
	
	
	// load and swap contents
	
	var tid = setTimeout(function() {
		
		if (id == "None") {
			
			_targetElements.mainmenu.html(_defaultContents.mainmenu);
			_targetElements.fatbanner.html(_defaultContents.fatbanner);
			if(!ltIE9) {
				_targetElements.recommend.html(_defaultContents.recommend).css(css);
			} else {
				_targetElements.recommend.html(_defaultContents.recommend).fadeTo(fadeInterval, 1);
			}
			
			var tid2 = setTimeout(function() {
				$("#Recommend .GridSet").removeClass("Loading");
				if(!playPause) playPauseItems(1);
			}, fadeInterval);
			
			_fbAccessToken = _defaultAccessToken;
			renderSocialMedia();
			
		} else {
			
			$.ajax({
				
				url: _categoryHtmlDir + _categoryData[id].html,
				dataType: "html",
				cache: false
				
			}).done(function(data) {
				
				$data = $(data);
				
				var $mainmenu = $("#Menu li", $data).html();
				if (!$mainmenu) $mainmenu = _defaultContents.mainmenu;
				var $recommend = $("#Recommend .ColumnSet", $data).html();
				if (!$recommend) $recommend = _defaultContents.recommend;
				var $fatbanner = $("#Banner ul", $data).html();
				if (!$fatbanner) $fatbanner = _defaultContents.fatbanner;
				
				_targetElements.mainmenu.html($mainmenu);
				_targetElements.fatbanner.html($fatbanner);
				if(!ltIE9) {
					_targetElements.recommend.html($recommend).css(css);
				} else {
					_targetElements.recommend.html($recommend).fadeTo(fadeInterval, 1);
				}
				
				var tid2 = setTimeout(function() {
					$("#Recommend .GridSet").removeClass("Loading");
					if(!playPause) playPauseItems(1);
				}, fadeInterval);
				
				_fbAccessToken = _categoryData[id].accesstoken;
				if (!_fbAccessToken) _fbAccessToken = _defaultAccessToken;
				renderSocialMedia();
				
			}).fail(function() {
				
				_targetElements.mainmenu.html(_defaultContents.mainmenu);
				_targetElements.fatbanner.html(_defaultContents.fatbanner);
				if(!ltIE9) {
					_targetElements.recommend.html(_defaultContents.recommend).css(css);
				} else {
					_targetElements.recommend.html(_defaultContents.recommend).fadeTo(fadeInterval, 1);
				}
				
				var tid2 = setTimeout(function() {
					$("#Recommend .GridSet").removeClass("Loading");
					if(!playPause) playPauseItems(1);
				}, fadeInterval);
				
				_fbAccessToken = _defaultAccessToken;
				renderSocialMedia();
				
			});
			
		}
		
	}, 800);
	
	
}




// social media


var renderSocialMedia = function() {
	
	
	// facebook
	
	var fbPanels = _targetElements.recommend.children(".Facebook");
	
	if (fbPanels.length > 0) {
		
		for (var i = 0; i < fbPanels.length; i++) {
			renderFacebookPanel(fbPanels.eq(i));
		}
		
	}
	
	
	// twitter
	
	var twPanel = _targetElements.recommend.children(".Twitter");
	
	if (twPanel.length > 0) {
		
		for (var i = 0; i < twPanel.length; i++) {
			window.twttr.widgets.load(twPanel.eq(i));
		}
		
	}
	
	
}




// cookie

var Cookies = {
	
	get: function(key) {
		
		if (!this.has(key)) return null;
		
		return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
		
	},
	
	set: function(key, value, days, path, domain, secure) {
		
		if (days) {
			var expires = new Date();
			expires.setMilliseconds(expires.getMilliseconds() + days * 864e+5);
			expires = expires.toUTCString();
		} else {
			var expires = "";
		}
		
		document.cookie = escape(key) + "=" + escape(value) + (expires ? "; expires=" + expires : "") + (domain ? "; domain=" + domain : "") + (path ? "; path=" + path : "") + (secure ? "; secure" : "");
		
	},
	
	has: function(key) {
		
		return (new RegExp("(?:^|;\\s*)" + escape(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
		
	}
	
};




// on load

$(document).ready(function() {
	
	if($("#Category")[0]) initRecommendation();
	
	!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');
	
});



})(jQuery);
