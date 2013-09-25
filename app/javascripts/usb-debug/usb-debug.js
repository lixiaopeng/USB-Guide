/*global $, _, document, window, alert*/
var selectView;
var feedbackView;
var sliderView;
var log;

$(document).ready(function () {

    (function () {
        var Log = function (data) {
            data = data || {};

            // var url = "wdj://window/log.json",
            //     datas = [],
            //     d;

            // for (d in data) {
            //     if (data.hasOwnProperty(d)) {
            //         datas.push(d + '=' + window.encodeURIComponent(data[d]));
            //     }
            // }
            // url += '?' + datas.join('&');

            // window.OneRingRequest('get', url, '', function (resp) {
            //     return;
            // });
        };

        log = Log;
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
                name : 'Android<br />1.6 - 3.2',
                className : 'gingerbread'
            }, {
                name : 'Android<br />4.0 - 4.1',
                className : 'ics'
            }, {
                name : 'Android 4.2',
                className : 'jeallybean'
            }, {
                name : 'MIUI V5',
                className : 'miuios'
            }, {
                name : '魅族 Flyme',
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
            isRender : false,
            render : function () {
                var self = this;
                self.isRender = true;

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
            className : 'u-feedback-ctn',
            template : _.template($('#feedBackView').html()),
            render: function () {
                var self = this;

                this.$el.html(this.template({}));

                var $numTip = this.$el.find('.body .not-a-number');
                var $connectTip = this.$el.find('.body .connect-error');
                var $numInput = this.$el.find('.body input');
                var $btn = this.$el.find('.button-send');

                $btn.click(function () {
                    var num = $.trim($numInput.val());

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
                        dataType: "jsonp",
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
            className : 'u-slider-view',
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

                this.$el.find('.button-reload').click(function () {
                    self.$el.find('.error-des').hide();
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
                var videoId = self.devInfo['video'];

                self.$el.find('.describe').html(self.devInfo.name);

                self.$el.find('.connect-error').show();
                self.$el.find('.error-des').hide();
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
                    self.$el.find('.error-des').show();
                });

                return videoId;
            },
            setNav : function (index) {
                this.$number.html(index + 1);
                this.$describe.html(this.devInfo.steps[index].des);
                var p = index + 1 + '/' + this.devInfo.steps.length;
                this.$page.html('(' + p + ')');
            },
            resetBtn : function () {
                if (this.currentIndex === 0) {
                    this.$leftButton.toggleClass('dis', true);
                } else {
                    this.$leftButton.toggleClass('dis', false);
                }

                if (this.currentIndex === this.devInfo.steps.length - 1) {
                    this.$rightButton.toggleClass('dis', true);
                } else {
                    this.$rightButton.toggleClass('dis', false);
                }
            },
            initCss : function () {
                var t = this.totleIndex;
                var self = this;

                this.lis.addClass('init white');
                $.each(this.lis, function (index, li) {
                    t -= 1;
                    var tmp = t;
                    $(li).css('zIndex', t).attr('zindex', t);
                });

                this.currentIndex = 0;
                this.$el.find('.left').toggleClass('dis', true);
                this.$el.find('.right').toggleClass('dis', false);

                $(this.lis[0]).removeClass('white').animate({
                    left : 174,
                    top: 0
                }, function () {
                    self.showArrow(self.currentIndex);
                }).find('img').animate({
                    height: 280,
                    opacity: 1
                });

                this.setNav(0);
            },
            hideArrow : function () {
                this.$arrow.hide().stop();
            },
            showArrow : function (index) {
                var pos = this.devInfo.steps[index].pos;

                var top = parseInt(pos.top, 10);
                if (this.devInfo.steps[index].direction === 'up') {
                    top = top - 15 + 'px';
                } else {
                    top = top + 15 + 'px';
                }

                this.$arrow.show()
                    .css(pos)
                    .fadeIn(1000)
                    .toggleClass('up', this.devInfo.steps[index].direction === 'up')
                    .animate({
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

                $(this.lis[this.currentIndex]).animate({
                    left : 40,
                    top : 20
                }).find('img').animate({
                    height: 240,
                    opacity: .6
                });

                this.currentIndex++;

                $(this.lis[this.currentIndex]).animate({
                    left : 174,
                    top : 0
                }, function () {
                    self.showArrow(self.currentIndex);
                }).find('img').animate({
                    height: 280,
                    opacity: 1
                });

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

                $(this.lis[this.currentIndex]).animate({
                    left : 333,
                    top: 20
                }).find('img').animate({
                    height: 240,
                    opacity: .6
                });

                this.currentIndex--;

                $(this.lis[this.currentIndex]).animate({
                    left : 174,
                    top : 0
                }, function () {
                    self.showArrow(self.currentIndex);
                }).find('img').animate({
                    height: 280,
                    opacity: 1
                });

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

var creatVideoUrl = function (videoId) {
    return 'http://211.152.116.29/help/?do=topic&id=' + videoId;
    //return 'http://www.wandoujia.com/help/?do=topic&id=' + videoId;
};

$(document).ready(function () {

    $(document).on('mouseover', '.u-select-view .select li', function () {
        $(this).addClass('hover');
    });

    $(document).on('mouseout', '.u-select-view .select li', function () {
        $(this).removeClass('hover');
    });

    $(document).on('mouseover', '.ul-container .button', function () {
        $(this).addClass('hov');
        if (window.DD_belatedPNG) {
            $(this).find('.button .icon').each(function () {
                window.DD_belatedPNG.fixPng(this);
            });
        }
    });

    $(document).on('mouseout', '.ul-container .button', function () {
        $(this).removeClass('hov');
        if (window.DD_belatedPNG) {
            $(this).find('.button .icon').each(function () {
                window.DD_belatedPNG.fixPng(this);
            });
        }
    });

    $(document).on('mousedown', '.ul-container .button', function () {
        $(this).addClass('act');
        if (window.DD_belatedPNG) {
            $(this).find('.button .icon').each(function () {
                window.DD_belatedPNG.fixPng(this);
            });
        }
    });

    $(document).on('mouseup', '.ul-container .button', function () {
        $(this).removeClass('act');
        if (window.DD_belatedPNG) {
            $(this).find('.button .icon').each(function () {
                window.DD_belatedPNG.fixPng(this);
            });
        }
    });

    var $container = $('.container');
    var currentView;
    var lastView;
    var btnMore = $('.button-more');
    var btnReturn = $('.button-return');
    var btnFeedback = $('.button-feedback');
    var btnVideo = $('.button-video');

    var hideBtn = function (selector) {
        btnMore.hide();
        btnReturn.hide();
        btnFeedback.hide();
        btnVideo.hide();
    };

    var showView = function (nextView) {
        currentView.$el.hide();
        lastView = currentView;
        currentView = nextView;
        nextView.$el.show();
        hideBtn();
    };

    hideBtn();
    if (version) {
        $container.append(sliderView.render().$el);
        currentView = sliderView;
        currentView.$el.show();
        var videoId = currentView.start('brands', version);
        btnMore.show();

        if (videoId) {
            btnVideo.attr('href', creatVideoUrl(videoId)).show();
        }

        log({
            'event': 'ui.click.new_usb_debug_match',
            'brand' : version
        });

    } else {
        $container.append(selectView.render().$el);
        currentView = selectView;
        currentView.$el.show();
        btnFeedback.show();
    }

    $container.append(feedbackView.render().$el);

    $('.button-check-usb-debug').click(function () {
        window.external.call('{"cmd":"retry", "param":"connection.detect_device"}');
    });

    $('.button-feedback').on('click', function () {
        showView(feedbackView);
        btnReturn.show();

        log({
            'event': 'ui.click.new_usb_debug_feedback'
        });
    });

    $('.button-more').on('click', function () {

        if (!selectView.isRender) {
            $container.append(selectView.render().$el);
        }
        showView(selectView);
        btnFeedback.show();

        log({
            'event': 'ui.click.new_usb_debug_more'
        });
    });

    $('.button-return').on('click', function () {
        showView(selectView);
        btnFeedback.show();

        log({
            'event': 'ui.click.new_usb_debug_more'
        });
    });

    $(document).bind('SELECT', function (evt, type, version) {
        $container.append(sliderView.render().$el);
        showView(sliderView);

        var videoId = currentView.start(type, version);
        btnMore.show();
        if (videoId) {
            btnVideo.attr('href', creatVideoUrl(videoId)).show();
        }
    });
});
