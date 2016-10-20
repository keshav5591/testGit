/* **************************************************

Name: hd_common.js

Description: Main JavaScript for Header

Create: 2014.05.31
Update: 2015.09.30

Copyright 2014 Hitachi, Ltd.

***************************************************** */



/* Main
=========================================================================================== */

// Define

var _headerAction = 0;
var _headerClose;

var _oldIE = navigator.userAgent.indexOf("MSIE 7") !== -1 || navigator.userAgent.indexOf("MSIE 8") !== -1
if (_checkRWD == undefined) var _checkRWD = function() {return false};
if (_globalNaviClose == undefined) var _globalNaviClose = function() {};	// for old version
if (_headerScrollTop == undefined) var _headerScrollTop = function() {};

if(_STextAdd == undefined) var _STextAdd = 0;



(function($){



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
		case "UltraGlobalNavi":															// for new version
			$("#UltraGlobalNavi").show();													//
			return $("#GlobalNaviSP").height() + $("#SuperGlobalNaviProducts").height() + $("#SuperGlobalNaviCompany").height() + 30;	//
			break;																//
		
	}
	
}

var ultraGlobalNavi = function() {
	
	// Append to DOM
	
	if(!$("#SearchArea .BtnClose")[0]) {
		$("#Search").append(_SText);
		if(_STextAdd) $("#SearchSet").prepend(_STextAdd);
	}
	$("#CountryRegion").append(_CRText);
	$("#UltraGlobalNaviProducts").after(_SGNProductsText);
	$("#UltraGlobalNaviCompany").after(_SGNCompanyText);
	
	$("#HeaderArea .BtnOpen a").attr("href", "javascript:void(0);");
	
	
	
	// Bind click events : Open button
	
	$("#HeaderArea .BtnOpen a").bind("click", function() {
		
		if (_headerAction) return false;
		_headerAction = 1;
		
		var $this = $(this);
		
		if ($this.hasClass("Current")) {
			
			_headerClose();
			
		} else {
			
			$("#HeaderArea .BtnOpen .Current").removeClass("Current").parent().next().removeAttr("style");
			$("#GlobalNaviTopButtonSP .CurrentSP").removeClass("CurrentSP");	// for new version
			if ($this.parent().parent().attr("id") == "CountryRegion") {
				if (_checkRWD(768)) {
					$("#CountryRegionSet .Current").removeClass("Current");
				} else {
					if (!$("#CountryRegionSet .Current")[0]) $("#CountryRegion .Americas").addClass("Current");
				}
			}
			_globalNaviClose();							// for old version
			
			var h = headerSetHeight($this.parent().next().attr("id"));
			$this.addClass("Current").parent().next().height($("#HeaderArea").css("margin-bottom")).animate({height:h}, 300);
			$("#HeaderArea").animate({marginBottom:h}, 300, function() {
				_headerAction = 0;
			});
			
		}
		
	
	});
	
	
	// Bind click events : Close button
	
	_headerClose = function() {
		
		var $current = $("#HeaderArea .BtnOpen .Current");
		$current.removeClass("Current").parent().next().animate({height:0}, 300);
		$("#GlobalNaviTopButtonSP .CurrentSP").removeClass("CurrentSP");		// for new version
		
		$("#HeaderArea").animate({marginBottom:0}, 300, function() {
			$(this).removeAttr("style");
			$current.parent().next().removeAttr("style");
			_headerAction = 0;
		});
		
	}
	
	$("#HeaderArea .BtnClose a").bind("click", function() {
		
		if (_headerAction) return false;
		_headerAction = 1;
		_headerClose();
		
	});
	
	
	// Bind click events : Link to Global Network Page
	
	$("#CountryRegion .Global").bind("click", function() {
		if (_checkRWD(768)) location.href = $(this).find("a").attr("href");
	});
	
	
	// Bind mouseover events : Coutry/Region Tab
	
	$("#CountryRegion h3 a").bind("mouseover focus", function() {
		
		if(!_checkRWD(768)) {
			$("#CountryRegion .Inner .Current").removeClass("Current");
			$(this).parent().addClass("Current").next().addClass("Current");
		}
		
	}).bind("click", function() {
		
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
			$("#HeaderArea").animate({marginBottom:h}, 300, function() {
				_headerAction = 0;
			});
			
		}
		
	});
	
	
	// Image Icon
	
	if (!_oldIE && $(".ShowRWD")[0]) {
		
		$(".SuperGlobalNavi .NoIcon img").each(function() {
			
			var $img = $(this).clone();
			var src = $img.attr("src");
			$img.attr("src", src.replace("_hd.gif", "_white_hd.png"));
			$(this).parent().append($img);
			
		});
		
	}
	
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

$(window).resize(function() {
	
	if (!_oldIE && ($("#HeaderArea .BtnOpen .Current")[0] || $("#GlobalNaviTopButtonSP .CurrentSP")[0])) {
		
		if (_checkRWD(768)) {
			if (!_headerSP) {
				_headerSP = 1;
				$("#CountryRegionSet .Current").removeClass("Current");
				$("#GlobalNaviTopButtonSP .CurrentSP").removeClass("CurrentSP").addClass("Current");		// for new version
				$("#UltraGlobalNavi .BtnOpen .Current").parent().next().removeAttr("style");			//
			}
		} else {
			if (_headerSP) {
				_headerSP = 0;
				if (!$("#CountryRegionSet .Current")[0]) $("#CountryRegion .Americas").addClass("Current");
				if ($("#GlobalNaviTopButtonSP .Current")[0]) {							// for new version
					$("#GlobalNaviTopButtonSP .Current").removeClass("Current").addClass("CurrentSP");	//
					$("#HeaderArea").removeAttr("style");							//
					$("#UltraGlobalNavi").removeAttr("style");						//
				}												//
			}
		}
		
		var $current = $("#HeaderArea .BtnOpen .Current").parent().next();
		var h = headerSetHeight($current.attr("id"));
		$current.height(h);
		$("#HeaderArea").css({marginBottom:h});
		
	}
	
});



/* Base Settings
=========================================================================================== */

$("html[class!='JS']").addClass("JS");



})(jQuery);
$(function(){

	$(".HorizontalInnerLinks ul li a").on("click", function(){
	console.log("12")
         $(".HorizontalInnerLinks ul li a").removeClass("selected");
      $(this).each(function(){
       
        $(this).addClass("selected");
      })
      })
})