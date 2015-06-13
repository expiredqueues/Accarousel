/*! jquery.cjAccarousel - v1.0.1 - 2015-06-14
* https://github.com/expiredqueues/Accarousel
* Copyright (c) 2015 ; Licensed  */
;(function ($) {

    $.fn.cjAccarousel = function (settings) {

        var defaults = {
            stand: '.stand', /* Visible stands element */
            panel: '.detail-panel', /* Expandable element   */
            pagerClass: 'pager', /* Pager CSS Class */
            x: '.detail-panel', /* Panel Collapse handler */
            groupOf: 5, /* Number of stands for visible group*/
            scrollSpeed: 1000, /* Carousel Speed */
            ease: 'swing', /* Use jQuery Easing Plug in for more easing effects */
            flyOutGap: 3, /* Gap between expanded and other two flyouts */
            nextPrev: true /* set false to disable Next/Prev Nav */

        };
        /* defaults */

        settings = $.extend(defaults, settings);

        this.each(function () {

            var $wrapper = $(this),
                $container = $wrapper.children('ul'),
                $items = $container.children('li'),
                noOfItems = $items.length,
                itemWidth = $items.outerWidth(),
                fullWidth = settings.groupOf * itemWidth,
                contWidth = noOfItems * itemWidth,
                startPosition = 0;

            $container.width(contWidth);
            $container.wrap('<div class="inner-mask"/>');
            $wrapper.width(fullWidth);
            settings.pagerEnable = true;

            $items.each(function () {
                if ($(this).is(':first-child')) {
                    $(this).addClass('first-item');
                }
                if ($(this).is(':last-child')) {
                    $(this).addClass('last-item');
                }
            });

            function expand(elm) {
                $wrapper.find(settings.stand).show();
                $(elm).hide();

                $items.addClass('disabled');
                $(elm).parent().removeClass('disabled');

                if ($(elm).parent().is('.first-item')) {
                } else {
                    $container.animate({
                        'margin-left': '-' + itemWidth + 'px'
                    }, 300);
                }

                $items.hide();
                $(elm).parent().prev().fadeIn(1000);
                $(elm).parent().next().fadeIn(1000);
                $(elm).parent().addClass('active-panel').width((fullWidth)).show(100);

                $(elm).siblings(settings.panel).animate({
                    'width': fullWidth + 'px',
                    'margin-left': '-' + (fullWidth / 2) + 'px'
                }, 300, function () {
                    $('.inner-mask').addClass('expanded');
                });
                $container.width(fullWidth + (itemWidth * 2) + settings.flyOutGap);
                settings.pagerEnable = false;
                $pager.addClass('disabled');

            }

            /* expand */

            function resetExpand(elm) {
                $('.inner-mask').removeClass('expanded');
                $(settings.stand).show();
                $(settings.panel).animate({
                    'width': '0',
                    'margin-left': '0'

                }, 300);
                $items.show().removeClass('disabled');

                $container.animate({
                    'margin-left': '-' + startPosition
                }, 300);
                $(elm).parent().removeClass('active-panel').css('width', itemWidth - settings.flyOutGap);
                $container.width(contWidth);
                settings.pagerEnable = true;
                $pager.removeClass('disabled');

            }

            /* resetExpand */

            $items.children(settings.stand).click(function () {
                if ($(this).parent().is('.disabled')) {
                    return false;
                }
                expand(this);
                return false;
            });
            /* stand click */

            $items.children(settings.x).click(function () {
                resetExpand(this);
                return false;
            });
            /* x click */

            /* ESC pressed: collapsed */
            $(document).keyup(function (evt) {
                if (evt.keyCode == 27) {
                    resetExpand($items.children(settings.x));
                }
            });

            /* animate */
            this.animate = function (evt) {

                if (settings.pagerEnable) {

                    var $anchor = $(evt.target),
                        stageIndex = $anchor.attr('href').split('-')[1];

                    if ($anchor.is('.active')) {
                        return false;
                    }
                    else if ($anchor.is('.pager-last')) {
                        $('.pager-prev').removeClass('disabled');
                        $('.pager-next').addClass('disabled');
                    }
                    else if ($anchor.is('.pager-first')) {
                        $('.pager-prev').addClass('disabled');
                        $('.pager-next').removeClass('disabled');
                    }
                    else {
                        $('.pager-prev, .pager-next').removeClass('disabled');
                    }

                    startPosition = (settings.groupOf * itemWidth) * stageIndex;

                    if ($anchor.is('.pager-last')) {
                        var remainingStands = noOfItems - (settings.groupOf * (stageIndex));

                        if (remainingStands < settings.groupOf) {
                            var gapStand = settings.groupOf - remainingStands;
                            startPosition = (noOfItems - remainingStands - gapStand) * itemWidth;
                        }
                    }

                    $container.animate({
                        'margin-left': '-' + startPosition

                    }, settings.scrollSpeed, settings.ease);

                    $pager.find('a').removeClass('active');
                    $anchor.addClass('active');

                }

            };
            /* animate */

            /* pagination */
            this.pager = function () {

                var i, links = [];
                $pager = $('<ol class="' + settings.pagerClass + '" />');

                var groups = noOfItems / settings.groupOf;

                if (groups > Math.floor(groups)) {
                    groups = Math.floor(groups) + 1;
                }
                else {
                    groups = Math.floor(groups);
                }

                for (i = 0; i < groups; i++) {
                    links[i] = '<li><a href="#stage-' + (i) + '">' + (i + 1) + '</a></li>';
                }

                $pager.append(links.join(''));
                $pager.find('a').click(this.animate);
                $pager.find('a:first').addClass('active pager-first');
                $pager.find('a:last').addClass('pager-last');
                $wrapper.append($pager);

                if (settings.nextPrev) {
                    var $next = $('<li><a href="#" class="pager-next">Next &raquo;</a></li>'),
                        $prev = $('<li><a href="#" class="disabled pager-prev">&laquo; Prev</a></li>'),
                        $activeAnchor;

                    $next.find('a').bind('click', function () {
                        if ($(this).is('.disabled')) {
                            return false;
                        }
                        else {
                            $activeAnchor = $pager.find('a.active');
                            $activeAnchor.parent().next().find('a').click();
                            return false;
                        }
                    });

                    $prev.find('a').bind('click', function () {
                        if ($(this).is('.disabled')) {
                            return false;
                        }
                        else {
                            $activeAnchor = $pager.find('a.active');
                            $activeAnchor.parent().prev().find('a').click();
                            return false;
                        }

                    });

                    $pager.prepend($prev);
                    $pager.append($next);

                }
                /*nextPrev*/

            };
            /*pager*/

            this.pager();

        });
        /*this.each*/

        return this;
        /*chain*/

    };
    /*accarousel*/

})(jQuery);