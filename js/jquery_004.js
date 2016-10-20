/**
 * News Release (Embed) Module jQuery Plugin
 * --------------------------------------------------------------------------
 *
 * For Hitachi Reusable News Release Section (iframe)
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
    $.fn.newsReleasesEmbed = function (method) {
        var defaults = {
            loadItem: 10,
            countryFilter: 'All',
            jsonDataUrl: null,
            itemTemplate: null,
            emptyTemplate: null,
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
                        data = $element.data('newsReleasesEmbed');

                    if (!data) {
                        // make sure have json url and item template
                        if (opts.jsonDataUrl && opts.itemTemplate) {
                            // get news from ajax
                            $.ajax({
                                url: opts.jsonDataUrl,
                                dataType: 'json',
                                success: function(result) {
                                    if (result) {
                                        opts.result = result.news;

                                        _refresh($element, opts);

                                        // setup for plugin wise data
                                        data = opts;

                                        $element.data('newsReleasesEmbed', data);

                                        // after init of plugin
                                        if (data.afterInit) {
                                            data.afterInit();
                                        }
                                    } else {
                                        if (data.emptyTemplate) {
                                            $element.html(data.emptyTemplate);
                                        }
                                    }
                                },
                                error: function() {
                                    if (opts.emptyTemplate) {
                                        $element.html(opts.emptyTemplate);
                                    }
                                }
                            });
                        }
                    }
                });
            }
        };

        // Private functions
        var _refresh = function($element, data) {
            // reset the filter on all filter set
            data.currentCount = -1;

            // setup the result set filtered by country
            data.currentResultSet = _getResultSetByCountry($element, data);

            // sort the result, before years are generated, and year filter are being used
            _sortResultSet(data);

            // group filter, set the result set
            _loadItem($element, data);

            if (data.currentResultSet.length === 0) {
                if (data.emptyTemplate) {
                    $element.html(data.emptyTemplate);
                }

                return;
            }
        };

        var _loadItem = function($element, data) {
            var x;

            for (x = 0; x < data.loadItem; x++) {
                var currentObject = data.currentResultSet[x];

                if (currentObject) {
                    _generateTemplate($element, data, currentObject, x);
                }
            }
        };

        var _getResultSetByCountry = function ($element, data) {
            var x,
                y,
                countryFilter = data.countryFilter.toLowerCase(),
                result = [];

            // clean all in view
            for (x = 0; x < data.result.length; x++) {
                data.result[x].inView = false;
            }

            if (data.countryFilter.toLowerCase() === 'all') {
                result = data.result;
            } else {
                for (x = 0; x < data.result.length; x++) {
                    var country = data.result[x].country;

                    if (country) {
                        // check if country is an array
                        if (Object.prototype.toString.call(country) === '[object Array]') {
                            // convert all array item to lowercase
                            for (y = 0; y < country.length; y++) {
                                country[y] = country[y].toLowerCase();
                            }

                            if ($.inArray(countryFilter, country) !== -1) {
                                result.push(data.result[x]);
                            }
                        } else {
                            if (country.toLowerCase() === countryFilter) {
                                result.push(data.result[x]);
                            }
                        }
                    }
                }
            }

            return result;
        };

        var _sortResultSet = function (data) {
            data.currentResultSet.sort(function (a, b) {
                var aDate = new Date(a.date).getTime() || 0,
                    bDate = new Date(b.date).getTime() || 0;

                if (aDate < bDate)
                    return 1;
                if (aDate > bDate)
                    return -1;
                // a must be equal to b
                return 0;
            });
        };

        var _generateTemplate = function($element, data, currentObject, x) {
            var newsYear = new Date(currentObject.date).getFullYear(),
                newsMonth = _getMonString(new Date(currentObject.date).getMonth()),
                $cloneItem = $('<div class="cloneNew"></div>').clone();

            $cloneItem.html(format(data.itemTemplate, currentObject.date, currentObject.title, currentObject.titleUrl));

            // remove the wrapper and append to the container
            var $tempElement = $cloneItem.contents().unwrap();

            // add one item
            $element.append(
                $tempElement
                    .addClass('item-id-' + x)
                    .first()
                        .addClass(newsYear + ' ' + newsYear + '_' + newsMonth)
                        .data('date', newsYear + '_' + newsMonth)
                    .end());
        };

        var _getMonString = function (month) {
            var monthArray = "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split('_');

            return monthArray[month]
        };

        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist.');
        }

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
    };
}));