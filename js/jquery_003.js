/**
 * Navigation Menu jQuery Plugin
 * --------------------------------------------------------------------------
 *
 * For Hitachi Navigation Menu
 *
 *
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    $.fn.navMenu = function (method) {
        var defaults = {
            itemClass: null,
            col: 4,
            minimizeCol: 2,
            itemHeight: 165,
            itemMargin: 15,
            maxCharacter: [150, 60, 60],
            childMaxCharacter: [60, 60, 60],
            itemMinimizeHeight: 93,
            itemExpandDefaultHeight: 400,
            itemExpandHeight: [],
            itemExpandWidth: '100%',
            infoClass: 'nav-menu-info',
            excerptClass: 'excerpt-main',
            bgSwitchClass: 'bg-switch',
            btnExpandClass: ['btn-expand'],
            btnCollapseClass: ['btn-minus', 'btn-close'],
            speed: 500,
            ease: 'swing',
            hoverSpeed: 200,
            itemClick: null,
            itemClicked: null,
            beforeExpand: null,
            afterExpand: null,
            beforeCollapse: null,
            afterCollapse: null,
            afterInit: null
        };

        // Default + User options variable
        var plugin = this;
        plugin.o = {};		// this o is for all plugin(s) share state

        var methods = {
            init: function (options) {
                return plugin.each(function () {
                    var $element = $(this),
                        opts = $.extend({}, defaults, options),
                        data = $element.data('navMenu');

                    if (!data) {
                        _init($element, opts);

                        // setup for plugin wise data
                        data = opts;

                        $element.data('navMenu', data);

                        // call afterInit if any
                        if (data.afterInit) {
                            data.afterInit(data.itemsArray);
                        }
                    }
                });
            },

            expand: function (i) {
                return plugin.each(function () {
                    var $element = $(this),
                        data = $element.data('navMenu');

                    if (data) {
                        _expand($element, data, i);
                    }
                });
            },

            collapse: function() {
                return plugin.each(function(){
                    var $element = $(this);
                    var data = $element.data('navMenu');

                    if (data) {
                        _collapse($element, data);
                    }
                });
            },

            minimize: function() {
                return plugin.each(function(){
                    var $element = $(this);
                    var data = $element.data('navMenu');

                    if (data) {
                        _minimize($element, data);
                    }
                });
            }
        };

        // Private functions
        var _init = function ($element, data) {
            var $items,
                elementWidth = $element.width(),
                itemWidth = elementWidth,
                allMargin = 0,
                currentX = 0,
                currentY = 0;

            // define an empty arrya to hold item names
            data.itemsArray = [];

            // calculate individual item width
            if (data.col > 1) {
                allMargin = (data.col-1) * data.itemMargin;

                itemWidth = Math.floor((elementWidth - allMargin) / data.col);
            }

            if (data.itemClass) {
                $items = $element.find('.' + data.itemClass);
            } else {
                $items = $element.find('> li');
            }

            // set item position, width and index
            $items.each(function(i) {
                var x,
                    className,
                    $this = $(this),
                    myWidth,
                    excerpt = $this.find('.' + data.excerptClass).text(),
                    $info = $this.find('.' + data.infoClass),
                    $bgSwitchDiv = $this.find('.' + data.bgSwitchClass);

                // setup for the items absolute position
                if ($this.hasClass('double')) {
                    myWidth = (itemWidth*2) + data.itemMargin;
                } else {
                    myWidth = itemWidth;
                }

                $this
                    .data('index', i)
                    .data('original-excerpt', excerpt)
                    .data('original-top', currentY)
                    .data('original-left', currentX)
                    .data('original-width', myWidth)
                    .data('original-margin', data.itemMargin)
                    .css({
                        position: 'absolute',
                        marginRight: data.itemMargin,
                        marginBottom: data.itemMargin,
                        top: currentY,
                        left: currentX,
                        width: myWidth
                    });

                // truncate the text
                $this.find('.' + data.excerptClass).text(_truncate(excerpt, data, $this.data('index')));

                // setup the default bg image
                //$bgSwitchDiv
                //    .css({
                //        'background-image': 'url(' + $bgSwitchDiv.data('url') + ')'
                //    })
                //    .show();

                // update the current left position
                currentX += myWidth + (data.itemMargin);

                // reach the end?
                if (currentX >= elementWidth) {
                    currentX = 0;
                    currentY += data.itemHeight + data.itemMargin;

                    // add the last class to this item
                    $this.addClass('last');
                }

                // bind all hover
                $info.stop(true, true).css({'top': 88});

                $this.off("mouseenter.navMenu");
                $this.on("mouseenter.navMenu", function () {
                    $this.find('.' + data.excerptClass).text($this.data('original-excerpt'));
                    $info.stop(true, true).animate({'top': 0}, data.hoverSpeed, function() {
                        $().fadeIn();
                    });
                });

                $this.off("mouseleave.navMenu");
                $this.on("mouseleave.navMenu", function () {
                    // truncate the text
                    $this.find('.' + data.excerptClass).text(_truncate(excerpt, data, $this.data('index')));
                    $info.stop(true, true).animate({'top': 88}, data.hoverSpeed);
                });

                // bind expand btn
                for (x = 0; x < data.btnExpandClass.length; x++) {
                    var index;

                    className = data.btnExpandClass[x];

                    $this.find('.' + className).on('click.navMenu', function(e) {
                        if (data.itemClick) {
                            data.itemClick(e, {
                                name: $this.data('name')
                            });
                        }

                        if (e.isImmediatePropagationStopped()) {
                            return;
                        }
                        e.preventDefault();

                        if (! $this.hasClass('expand')) {
                            // add hash for url
                            window.location.hash = '#' + $(this).closest('li').data('name');

                            if (data.itemClass) {
                                index = $(this).closest('.' + data.itemClass).data('index');
                            } else {
                                index = $(this).closest('li').data('index');
                            }

                            if (! data.animating) {
                                // then open the one in target
                                _expand($element, data, index);
                            }
                        }

                        // fire the click event
                        if (data.itemClicked) {
                            data.itemClicked(e, {
                                name: $this.data('name')
                            });
                        }
                    });
                }

                // bind collapse btn
                for (x = 0; x < data.btnCollapseClass.length; x++) {
                    className = data.btnCollapseClass[x];

                    $this.find('.' + className).on('click.navMenu', function(e) {
                        e.preventDefault();

                        if (! data.animating) {
                            _collapse($element, data);
                        }
                    });
                }

                // for keyboard navigation
                $this.find('a').on('focus', function() {
                    $this.addClass('focus');
                    $info.stop(true, true).css({'top': 0});
                });

                $this.find('a').on('blur', function() {
                    $this.removeClass('focus');

                    if ($this.hasClass('expand') || $this.hasClass('child')) {
                        $info.stop(true, true).css({'top': 0});
                    } else {
                        $info.stop(true, true).css({'top': 88});
                    }
                });

                // push the name into item array
                data.itemsArray.push($this.data('name'));
            });

            // set the parent to relative
            $element
                .data('original-height', currentY + (currentX !== 0 ? data.itemHeight : 0))
                .css({
                    overflow: 'hidden',
                    position: 'relative',
                    height: currentY + (currentX !== 0 ? data.itemHeight : 0)
                });
        };

        var _expand = function ($element, data, i) {
            // first minimize all
            _minimize($element, data);

            // indicate in the process of animation
            data.animating = true;

            var $items,
                elementWidth = $element.width(),
                allMargin = (data.minimizeCol-1) * data.itemMargin,
                childWidth = Math.floor((elementWidth - allMargin) / data.minimizeCol),
                currentX = 0,
                shouldExpandHeight,
                currentY = data.itemHeight + data.itemMargin; // default same height as item

            if (data.itemClass) {
                $items = $element.find('.' + data.itemClass);
            } else {
                $items = $element.find('> li');
            }


            if (data.itemExpandHeight[i] && data.itemExpandHeight[i] > 0) {
                currentY = data.itemExpandHeight[i] + data.itemMargin;
                shouldExpandHeight = data.itemExpandHeight[i];
            } else {
                currentY = data.itemExpandDefaultHeight + data.itemMargin;
                shouldExpandHeight = data.itemExpandDefaultHeight;
            }

            // if user did specify expand height in the data-expand-height, use it
            if (parseFloat($items.eq(i).data('expand-height')) > 0) {
                currentY = parseFloat($items.eq(i).data('expand-height')) + data.itemMargin;
                shouldExpandHeight = parseFloat($items.eq(i).data('expand-height'));
            }

            $items.each(function() {
                var $this = $(this),
                    currentIndex = $this.data('index'),
                    $info = $this.find('.' + data.infoClass),
                    $bgSwitchDiv = $this.find('.' + data.bgSwitchClass);

                // hide the bg
                //$bgSwitchDiv.hide();

                // expand current item
                if (i === currentIndex) {
                    // callback before expand
                    if (data.beforeExpand) {
                        data.beforeExpand({
                            name: $this.data('name')
                        });
                    }

                    $this
                        .addClass('expand')
                        .css({
                            opacity: 0,
                            top: '50%',
                            left: '50%',
                            width: 0,
                            height: 0
                        })
                        .stop(true, true)
                        .animate({
                            opacity: 1,
                            marginRight: 0,
                            top: 0,
                            left: 0,
                            width: data.itemExpandWidth,
                            height: shouldExpandHeight,
                            zIndex: 2
                        }, data.speed, function() {
                            // indicate end of animation
                            data.animating = false;

                            // callback after expand
                            if (data.afterExpand) {
                                data.afterExpand({
                                    name: $this.data('name')
                                });
                            }

                            // remove the focus of the item
                            $this.removeClass('focus');

                            // show the large bg
                            //$bgSwitchDiv
                            //    .css({
                            //        'background-image': 'url(' + $bgSwitchDiv.data('url-l') + ')',
                            //        'z-index': '-1'
                            //    })
                            //    .fadeIn();
                        });

                    // remove the hover binds
                    $info.stop(true, true).css({top: 0});

                    $this.off("mouseenter.navMenu");
                    $this.off("mouseleave.navMenu");

                    // focus the first A tag
                    $this.find('a:eq(0)').focus();
                } else {
                    // minimize other
                    $this
                        .addClass('child')
                        .css({
                            marginRight: data.itemMargin,
                            top: currentY,
                            left: currentX,
                            width: childWidth,
                            height: data.itemMinimizeHeight
                        });

                    // update the current left position
                    currentX += childWidth + (data.itemMargin);

                    // show the small bg
                    //$bgSwitchDiv
                    //    .css({
                    //        'background-image': 'url(' + $bgSwitchDiv.data('url-s') + ')',
                    //        'z-index': '-1'
                    //    })
                    //    .fadeIn();

                    // reach the end?
                    if (currentX >= elementWidth) {
                        currentX = 0;
                        currentY += data.itemMinimizeHeight + data.itemMargin;

                        // add the last class to this item
                        $this.addClass('last');
                    }
                }
            });

            $element
                .css({
                    height: currentY + (currentX !== 0 ? data.itemMinimizeHeight : 0)
                });
        };

        var _collapse = function ($element, data) {
            var $items;

            // indicate in the process of animation
            data.animating = true;

            if (data.itemClass) {
                $items = $element.find('.' + data.itemClass);
            } else {
                $items = $element.find('> li');
            }

            // revert all original dimension and position
            $items.each(function() {
                var $this = $(this),
                    elementOriginalExcerpt = $this.data('original-excerpt'),
                    elementOriginalTop = $this.data('original-top'),
                    elementOriginalLeft = $this.data('original-left'),
                    elementOriginalWidth = $this.data('original-width'),
                    elementOriginalMargin = $this.hasClass('last') ? 0 : $this.data('original-margin'),
                    $info = $this.find('.' + data.infoClass),
                    $bgSwitchDiv = $this.find('.' + data.bgSwitchClass);

                // truncate the text
                $this.find('.' + data.excerptClass).text(_truncate(elementOriginalExcerpt, data, $this.data('index')));

                // hide the bg
                $bgSwitchDiv.hide();

                // callback before collapse
                if (data.beforeCollapse) {
                    data.beforeCollapse({
                        name: $this.data('name')
                    });
                }

                $this
                    .stop(true, true)
                    .animate({
                        marginRight: elementOriginalMargin,
                        top: elementOriginalTop,
                        left: elementOriginalLeft,
                        width: elementOriginalWidth,
                        height: data.itemHeight,
                        zIndex: 1
                    }, data.speed, function() {
                        // indicate in the process of animation
                        data.animating = false;

                        // callback after collapse
                        if (data.afterCollapse) {
                            data.afterCollapse({
                                name: $this.data('name')
                            });
                        }

                        // remove the focus of the item
                        $this.removeClass('focus');

                        // show the default bg
                        $bgSwitchDiv
                            //.css({
                            //    'background-image': 'url(' + $bgSwitchDiv.data('url') + ')',
                            //    'z-index': '-1'
                            //})
                            .fadeIn(function(){
                                $bgSwitchDiv.removeAttr('style');
                            });

                    }).removeClass("expand child");

                // bind the hover
                $info.stop(true, true).css({'top': 88});

                $this.off("mouseenter.navMenu");
                $this.on("mouseenter.navMenu", function () {
                    $this.find('.' + data.excerptClass).text(elementOriginalExcerpt);
                    $info.stop(true, true).animate({'top': 0}, data.hoverSpeed);
                });

                $this.off("mouseleave.navMenu");
                $this.on("mouseleave.navMenu", function () {
                    // truncate the text
                    $this.find('.' + data.excerptClass).text(_truncate(elementOriginalExcerpt, data, $this.data('index')));
                    $info.stop(true, true).animate({'top': 88}, data.hoverSpeed);
                });
            });

            // revert parent height
            var elementOriginalHeight = $element.data('original-height');

            $element
                .css({
                    height: elementOriginalHeight
                });
        };

        var _minimize = function ($element, data) {
            var $items;

            if (data.itemClass) {
                $items = $element.find('.' + data.itemClass);
            } else {
                $items = $element.find('> li');
            }

            // revert all original dimension and position
            $items.each(function() {
                var $this = $(this),
                    $info = $this.find('.' + data.infoClass),
                    elementOriginalExcerpt = $this.data('original-excerpt'),
                    elementOriginalTop = $this.data('original-top'),
                    elementOriginalLeft = $this.data('original-left'),
                    elementOriginalWidth = $this.data('original-width'),
                    elementOriginalMargin = $this.hasClass('last') ? 0 : $this.data('original-margin');

                // callback before collapse
                if (data.beforeCollapse) {
                    data.beforeCollapse({
                        name: $this.data('name')
                    });
                }

                $this
                    .css({
                        marginRight: elementOriginalMargin,
                        top: elementOriginalTop,
                        left: elementOriginalLeft,
                        width: elementOriginalWidth,
                        height: data.itemHeight,
                        zIndex: 1
                    }).removeClass("expand child");

                // remove the hover binds
                $info.stop(true, true).css({top: 0});

                $this.off("mouseenter.navMenu");
                $this.off("mouseleave.navMenu");

                // truncate the child
                $this.find('.' + data.excerptClass).text(_truncateChild(elementOriginalExcerpt, data, $this.data('index')));

                // remove the focus of the item
                $this.removeClass('focus');
            });

            // revert parent height
            var elementOriginalHeight = $element.data('original-height');

            $element
                .css({
                    height: elementOriginalHeight
                });
        };

        var _truncate = function (str, data, i) {
            // Check if the element is longer than the limit
            if (data.maxCharacter[i] && str.length > data.maxCharacter[i]) {
                var limitStr = str.substr(0, data.maxCharacter[i]),
                    spacePos = limitStr.lastIndexOf(' '),
                    finalStr = limitStr.substr(0, spacePos);

                return finalStr + '...';
            }

            return str;
        };
        var _truncateChild = function (str, data, i) {
            // Check if the element is longer than the limit
            if (data.childMaxCharacter[i] && str.length > data.childMaxCharacter[i]) {
                var limitStr = str.substr(0, data.childMaxCharacter[i]),
                    spacePos = limitStr.lastIndexOf(' '),
                    finalStr = limitStr.substr(0, spacePos);

                return finalStr + '...';
            }

            return str;
        };

        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist.');
        }
    };
}));