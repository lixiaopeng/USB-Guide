/*global $, _, document, window, alert*/
var titleView;
var selectView;
var feedbackView;
var sliderView;
var log;

$(document).ready(function () {

    (function () {
        var Log = function (data) {
            data = data || {};

            var url = "wdj://window/log.json",
                datas = [],
                d;

            for (d in data) {
                if (data.hasOwnProperty(d)) {
                    datas.push(d + '=' + window.encodeURIComponent(data[d]));
                }
            }
            url += '?' + datas.join('&');

            window.OneRingRequest('get', url, '', function (resp) {
                return;
            });
        };

        log = Log;
    }(this));

    (function () {
        var TitleView = function () {
            this.$el = $('<div>').addClass(this.className);
            return this;
        };

        TitleView.prototype = {
            className : 'u-header',
            template : _.template($('#titleView').html()),
            render : function () {
                var self = this;

                this.$el.html(this.template({}))
                    .find('.button-feedback').on('click', function () {
                        self.clickFeedBack();
                        log({
                            'event': 'ui.click.new_usb_debug_feedback'
                        });
                    });

                if (window.DD_belatedPNG) {
                    setTimeout(function () {
                        window.DD_belatedPNG.fixPng(self.$el.find('.icon')[0]);
                    });
                }

                return this;
            },
            clickFeedBack : function () {
                var $btn = this.$el.find('.button-feedback');
                if (!$btn.hasClass('act')) {
                    $btn.addClass('act');
                    $.event.trigger('FEEDBACK');
                }
            },
            reset : function () {
                var $btn = this.$el.find('.button-feedback');
                $btn.removeClass('act');
            }
        };

        titleView = new TitleView();
    }(this));

    (function () {
        var data = {
            brands: [{
                name : '三星手机',
                className : 'samsung'
            }, {
                name : '小米手机',
                className : 'xiaomi'
            }, {
                name : '索尼手机',
                className : 'sony'
            }, {
                name : ' HTC 手机',
                className : 'htc'
            }, {
                name : '华为手机',
                className : 'huawei'
            }, {
                name : '联想手机',
                className : 'lenovo'
            }, {
                name : '中兴手机',
                className : 'zte'
            }, {
                name : 'MOTO 手机',
                className : 'motorola'
            }, {
                name : '天语手机',
                className : 'ktouch'
            }, {
                name : 'VIVIO 手机',
                className : 'vivo'
            }],
            systems: [{
                name : 'Android 1.6 - 3.2',
                className : 'gingerbread'
            }, {
                name : 'Android 4.0 - 4.1',
                className : 'ics'
            }, {
                name : 'Android 4.2',
                className : 'jeallybean'
            }, {
                name : 'MIUI V5',
                className : 'miuios'
            }, {
                name : 'Flyme',
                className : 'meizu'
            }]
        };

        var SelectView = function () {
            this.$el = $('<div>').addClass(this.className);
            return this;
        };

        SelectView.prototype = {
            className : 'u-select-view',
            template : _.template($('#selectView').html()),
            render : function () {
                var self = this;

                this.$el.html(this.template(data))
                    .on('click', 'li', this.clickSelect);

                if (window.DD_belatedPNG) {
                    setTimeout(function () {
                        self.$el.find('li .logo, li .system-logo, li .play').each(function () {
                            window.DD_belatedPNG.fixPng(this);
                        });
                    });
                }

                return this;
            },
            clickSelect : function (evt) {
                var tmp = /(\w+)\s(\w+)/.exec(evt.currentTarget.className);
                if (tmp[2] === 'nobrands') {
                    return;
                }
                var type = tmp[1];
                var version = tmp[2];

                $.event.trigger('SELECT', [type, version]);

                log({
                    'event': 'ui.click.new_usb_debug_select',
                    'type': type,
                    'version': version
                });
            }
        };

        selectView = new SelectView();
    }(this));

    (function () {
        var FeedbackView = function () {
            this.$el = $('<div>').addClass(this.className);
            return this;
        };

        FeedbackView.prototype = {
            className : 'u-feedback-ctn u-shadow',
            template : _.template($('#feedBackView').html()),
            render: function () {
                var self = this;

                this.$el.html(this.template({})).find('.return').click(this.clickReturn);

                var $numTip = this.$el.find('.body .not-a-number');
                var $connectTip = this.$el.find('.body .connect-error');
                var $numInput = this.$el.find('.body input');
                var $btn = this.$el.find('.button-send');

                $btn.click(function () {
                    var num = $.trim($numTip.val());

                    if (num) {
                        if (/1\d{10}/.test(num)) {
                            $numTip.hide();
                        } else {
                            $numTip.show();
                            return;
                        }
                    } else {
                        $btn.prop('disabled', true);
                        $numTip.css('visibility', 'hidden');
                        return;
                    }

                    $connectTip.hide();

                    log({
                        'event': 'ui.click.new_usb_debug_send_message'
                    });

                    $.ajax('http://www.wandoujia.com/sms', {
                        data : {
                            type : 'USB_SETUP',
                            action : 'send',
                            phone : num
                        },
                        error : function () {
                            $connectTip.show();
                        },
                        success : function () {
                            log({
                                'event': 'ui.click.new_usb_debug_send_message_success'
                            });
                        }
                    });

                    $btn.prop('disabled', true);

                    var index = 60;
                    $btn.html('重新发送(' + index-- + ')');
                    var handler = setInterval(function () {
                        if (index < 0) {
                            clearInterval(handler);
                            $btn.html('重新发送').prop('disabled', false);
                            return;
                        }
                        $btn.html('重新发送(' + index-- + ')');
                    }, 1000);

                });

                this.$el.find('.usb-help').on('click', function () {
                    log({
                        'event': 'ui.click.new_usb_debug_feed_back_usb_help'
                    });
                });

                this.$el.find('.usb-bbs').on('click', function () {
                    log({
                        'event': 'ui.click.new_usb_debug_feed_back_usb_bbs'
                    });
                });

                if (window.DD_belatedPNG) {
                    setTimeout(function () {
                        self.$el.find('.number, .img').each(function () {
                            window.DD_belatedPNG.fixPng(this);
                        });
                    });
                }

                return this;
            },
            clickReturn : function () {
                $.event.trigger('RETURN');
            }
        };

        feedbackView = new FeedbackView();
    }(this));

    (function () {
        var SilderView = function () {
            this.$el = $('<div>').addClass(this.className);
            return this;
        };

        SilderView.prototype = {
            className : 'u-slider-view u-shadow',
            template : _.template($('#sliderView').html()),
            render : function () {
                var self = this;

                this.$el.html(this.template({}));

                this.$arrow = this.$el.find('.pointer');
                this.$leftButton = this.$el.find('.left');
                this.$rightButton = this.$el.find('.right');
                this.$number = this.$el.find('.number');
                this.$describe = this.$el.find('.steps-describe');
                this.$page = this.$el.find('.page');

                this.$el.find('.more').click(function () {
                    $.event.trigger('MORE');
                    log({
                        'event': 'ui.click.new_usb_debug_more'
                    });
                });

                this.$el.find('.left').click(function () {
                    if (self.currentIndex > 0) {
                        self.moveLeft();
                        self.resetBtn();
                    }

                    log({
                        'event': 'ui.click.new_usb_debug_left'
                    });
                });

                this.$el.find('.right').click(function () {
                    if (self.currentIndex < self.devInfo.steps.length - 1) {
                        self.moveRight();
                        self.resetBtn();
                    }

                    log({
                        'event': 'ui.click.new_usb_debug_right'
                    });
                });

                this.$el.find('.reload').click(function () {
                    self.$el.find('.connect-error .vbox').hide();
                    self.$el.find('.w-ui-loading').show();
                    self.start(self.type, self.version);
                });

                if (window.DD_belatedPNG) {
                    setTimeout(function () {
                        self.$el.find('.button .icon, .pointer').each(function () {
                            window.DD_belatedPNG.fixPng(this);
                        });
                    });
                }

                return this;
            },
            currentIndex : 0,
            devInfo : {},
            totleIndex : 0,
            lis : [],
            preload : function (version, success, fail) {
                var loadResult = [false, false];
                var index = 0;

                var timeOutHandler;
                var intervalHandler;
                timeOutHandler = setTimeout(function () {
                    if (loadResult[0] && loadResult[1]) {
                        success();
                    } else {
                        fail();
                    }
                    clearTimeout(timeOutHandler);
                    clearInterval(intervalHandler);
                }, 15000);

                intervalHandler = setInterval(function () {
                    if (loadResult[0] && loadResult[1]) {
                        clearTimeout(timeOutHandler);
                        clearInterval(intervalHandler);
                        success();
                    }
                }, 500);

                var img;
                var i;
                for (index; index < 2; index++) {
                    img = new window.Image();
                    i = index + 1;

                    $(img).one('load', function () {
                        loadResult[--i] = true;
                    }).one('error', function () {
                        clearTimeout(timeOutHandler);
                        clearInterval(intervalHandler);
                        fail();
                    }).attr('src', 'images/course/' + version + '/' + i + '.png');
                }
            },
            start : function (type, version) {
                var self = this;
                var data = brandInfo;
                if (type === 'system') {
                    data = systemInfo;
                }

                self.type = type;
                self.version = version;

                self.devInfo = data[version];

                self.$el.find('.describe').html(self.devInfo.name);

                self.$el.find('.connect-error').show();
                self.$el.find('.slider-container').hide();

                this.preload(version, function () {
                    self.$el.find('.connect-error').hide();
                    self.$el.find('.slider-container').show();

                    var len = self.devInfo.steps.length;
                    var $ul = $('<ul>').addClass('warp');
                    var str = '';
                    var i = 0;

                    self.totleIndex = 10 * len;

                    for (i; i < len; i++) {
                        var t = i + 1;
                        str += "<li class='course-li'><img data-des='" +  self.devInfo.steps[i].des + "' src='images/course/" + version + "/" + t + ".png'></li>";
                    }

                    $ul.html(str);
                    if (self.warp) {
                        self.warp.remove();
                    }
                    self.$el.find('.ul-container').append($ul);
                    self.$warp = $ul;
                    self.lis = $ul.find('li');
                    self.initCss();

                }, function () {
                    self.$el.find('.connect-error').show();
                    self.$el.find('.w-ui-loading').hide();
                });
            },
            setNav : function (index) {
                this.$number.html(index + 1);
                this.$describe.html(this.devInfo.steps[index].des);
                var p = index + 1 + '/' + this.devInfo.steps.length;
                this.$page.html('(' + p + ')');
            },
            resetBtn : function () {
                if (this.currentIndex === 0) {
                    this.$leftButton.attr('disabled', true);
                } else {
                    this.$leftButton.removeAttr('disabled');
                }

                if (this.currentIndex === this.devInfo.steps.length - 1) {
                    this.$rightButton.attr('disabled', true);
                } else {
                    this.$rightButton.removeAttr('disabled');
                }
            },
            initCss : function () {
                var t = this.totleIndex;

                this.lis.addClass('init white');
                $.each(this.lis, function (index, li) {
                    t -= 1;
                    var tmp = t;
                    $(li).css('zIndex', t).attr('zindex', t);
                });

                this.currentIndex = 0;
                this.$el.find('.left').attr('disabled', true);
                this.$el.find('.right').attr('disabled', false);

                $(this.lis[0]).removeClass('white').addClass('go-current').css({
                    left : 185
                });
                this.showArrow(this.currentIndex);
                this.setNav(0);
            },
            hideArrow : function () {
                this.$arrow.hide().stop();
            },
            showArrow : function (index) {
                var pos = this.devInfo.steps[index].pos;

                var top = parseInt(pos.top, 10);
                if (pos.hasOwnProperty('-webkit-transform')) {
                    top = top - 15 + 'px';
                    this.$arrow.show().css(pos).fadeIn(1000);
                } else {
                    top = top + 15 + 'px';
                    pos['-webkit-transform'] = 'none';
                    this.$arrow.show().css(pos).fadeIn(1000);
                    delete pos['-webkit-transform'];
                }
                this.$arrow.animate({
                    top : top
                }, 'slow');
            },
            moveRight: function () {
                var self = this;
                this.hideArrow();

                var i;
                for (i = 0; i <= this.currentIndex; i++) {
                    var $li = $(this.lis[i]);
                    var zIndex = parseInt($li.attr('zindex'), 10);
                    zIndex -= 2;
                    $li.css('zIndex', zIndex).attr('zindex', zIndex);
                }

                $(this.lis[this.currentIndex]).addClass('go-before').animate({
                    left : 40
                });

                this.currentIndex++;

                $(this.lis[this.currentIndex]).animate({
                    left : 185
                }, function () {
                    self.showArrow(self.currentIndex);
                }).addClass('go-current');

                this.setNav(this.currentIndex);
            },
            moveLeft : function () {
                var self = this;

                this.hideArrow();

                var i;
                for (i = 0; i < this.currentIndex; i++) {
                    var $li = $(this.lis[i]);
                    var zIndex = parseInt($li.attr('zindex'), 10);
                    zIndex += 2;
                    $li.css('zIndex', zIndex).attr('zindex', zIndex);
                }

                $(this.lis[this.currentIndex]).removeClass('go-current').animate({
                    left : 360
                });

                this.currentIndex--;

                $(this.lis[this.currentIndex]).animate({
                    left : 185
                }, function () {
                    self.showArrow(self.currentIndex);
                }).removeClass('go-before');

                this.setNav(this.currentIndex);
            }
        };

        sliderView = new SilderView();
    }(this));
});

var getUrlParam = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);

    if (r) {
        return unescape(r[2]);
    }

    return null;
};


var VIDMap = {
    '04E8' : 'samsung',
    '054C' : 'sony',
    '0FCE' : 'sony',
    '2717' : 'xiaomi',
    '0BB4' : 'htc',
    '12D1' : 'huawei',
    '17EF' : 'lenovo',
    '19D2' : 'zte',
    '22B8' : 'motorola',
    '24E3' : 'ktouch'
};

var proMap = {
    'samsung' : 1,
    'sony' : 1,
    'htc' : 1,
    'motorola' : 1,
    'huawei' : 1,
    'lenovo' : 1,
    'zte' : 1,
    'xiaomi' : 1
};

var device_id = getUrlParam('device_id');
var product_id = getUrlParam('product_id');
var version;

var device_result = /VID_(\w{4})/.exec(device_id);
var product_arr;

if (product_id) {
    product_arr = product_id.split('-');
    if (product_arr[0] === 'semc') {
        product_arr[0] = 'sony';
    }

    if (proMap.hasOwnProperty(product_arr[0])) {
        version = product_arr[0];
    }
} else if (device_result) {
    var vid = device_result[1];
    if (VIDMap.hasOwnProperty(vid)) {
        version = VIDMap[vid];
    }
}

$(document).ready(function () {
    $(document).on('mouseover', '.u-select-view .select li', function () {
        $(this).addClass('hover');
    });
    $(document).on('mouseout', '.u-select-view .select li', function () {
        $(this).removeClass('hover');
    });

    var $container = $('.container');
    var currentView;
    var lastView;

    $container.append(titleView.render().$el);

    if (version) {
        $container.append(sliderView.render().$el);
        currentView = sliderView;
        currentView.$el.show();
        currentView.start('brands', version);

        log({
            'event': 'ui.click.new_usb_debug_match',
            'brand' : version
        });

    } else {
        $container.append(selectView.render().$el);
        currentView = selectView;
        currentView.$el.show();
    }

    $container.append(feedbackView.render().$el);

    $('.button-check-usb-debug').click(function () {
        window.externalCall('', 'connection.detect_device', window.location.search);
    });

    $(document).bind('FEEDBACK', function () {
        currentView.$el.hide();
        lastView = currentView;
        currentView = feedbackView;
        feedbackView.$el.show();
    });

    $(document).bind('RETURN', function () {
        currentView.$el.hide();
        lastView.$el.show();
        currentView = lastView;
        lastView = feedbackView;
        titleView.reset();
    });

    $(document).bind('SELECT', function (evt, type, version) {
        currentView.$el.hide();
        lastView = selectView;
        currentView = sliderView;

        $container.append(sliderView.render().$el);

        sliderView.$el.show();
        currentView.start(type, version);
    });

    $(document).bind('MORE', function () {
        currentView.$el.hide();
        lastView = selectView;
        currentView = selectView;

        if (!selectView.$el) {
            $container.append(selectView.render().$el);
        }
        selectView.$el.show();
    });
});
