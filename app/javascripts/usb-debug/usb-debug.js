/*global $, _, document, window, alert*/
var selectView;
var feedbackView;
var sliderView;
var detailView;

$(document).ready(function () {

    try {
        window.external.call('{cmd:""}');
        window.log = function (data) {
            data = data || {};

            var url = "wdj://window/log.json",
                datas = [],
                d;

            for (d in data) {
                if (data.hasOwnProperty(d)) {
                    datas.push(d + '=' + window.encodeURIComponent(data[d]));
                }
            }

            window.external.call('{"cmd":"log", "param":"' + url + '?' + datas.join('&')  + '"}');
        };

    } catch (e) {
        window.log = function () {};
    }

    (function () {
        var data = {
            systems: [{
                name : 'Android 1.6 - 3.2',
                className : 'gingerbread'
            }, {
                name : 'Android 4.0 - 4.1',
                className : 'ics'
            }, {
                name : 'Android 4.2 - 4.4',
                className : 'jeallybean'
            }, {
                name : 'MIUI V5',
                className : 'miuios'
            }, {
                name : 'Meizu Flyme3',
                className : 'meizu'
            }]
        };

        var SelectView = function () {
            this.$el = $('.tmp_select').addClass(this.className);
            return this;
        };

        SelectView.prototype = {
            className : 'u-select-view',
            template : _.template($('#selectView').html()),
            isRender : false,
            isShow : false,
            render : function () {
                this.isRender = true;
                this.$el.html(this.template(data)).on('click', 'li', this.clickSelect);

                this.$el.find('li').on('mouseenter', function () {
                    $(this).find('.top').animate({
                        'top' : "-5px"
                    }, 100, 'linear');
                }).on('mouseleave', function () {
                    $(this).find('.top').animate({
                        'top' : "0px"
                    }, 100, 'linear');
                });

                return this;
            },
            clickSelect : function (evt) {
                var tmp = /(\w+)\s(\w+)\s(\w+)/.exec(evt.currentTarget.className);
                var version = tmp[3];

                $.event.trigger('SELECT_PHONE', 'general_' + version);

                log({
                    'event': 'ui.click.new_usb_debug_select',
                    'version': version
                });
            }
        };

        selectView = new SelectView();
    }(this));

    (function () {
        var FeedbackView = function () {
            this.$el = $('.tmp_feedback').addClass(this.className);
            return this;
        };

        FeedbackView.prototype = {
            className : 'u-feedback-ctn',
            template : _.template($('#feedBackView').html()),
            isShow : false,
            eventName : '',
            render: function () {
                var self = this;

                this.$el.html(this.template({}));

                var smsPanel = this.$el.find('.sms');
                var qrPanel = this.$el.find('.qr');

                /*if (Math.floor(Math.random()*2)) {
                    this.eventName = 'ui.show.smsPanel';
                    qrPanel.hide();
                } else {*/
                    this.eventName = 'ui.show.qrPanel';
                    smsPanel.hide();
                /*}*/

                var $numTip = this.$el.find('.body .not-a-number');
                var $connectTip = this.$el.find('.body .connect-error');
                var $numInput = this.$el.find('.body input');
                var $dis = this.$el.find('.body .tip');
                var $btn = this.$el.find('.button-send');

                $btn.click(function () {
                    var num = $.trim($numInput.val());

                    if (num) {
                        if (/1\d{10}/.test(num)) {
                            $numTip.hide();
                            $dis.show();
                        } else {
                            $numTip.show();
                            $dis.hide();
                            return;
                        }
                    } else {
                        $numTip.hide();
                        $dis.show();
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
                            $dis.hide();
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

    /*
    (function () {
        var SilderView = function () {
            this.$el = $('.tmp_silder').addClass(this.className);
            return this;
        };

        SilderView.prototype = {
            className : 'u-slider-view',
            template : _.template($('#sliderView').html()),
            isShow : false,
            render : function () {

                var self = this;

                this.$el.html(this.template({}));
                this.$el.find('.left').click(function () {
                    log({
                        'event': 'ui.click.new_usb_debug_left'
                    });
                });

                this.$el.find('.right').click(function () {

                    log({
                        'event': 'ui.click.new_usb_debug_right'
                    });
                });


                //TODO:check
                if (window.DD_belatedPNG) {
                    setTimeout(function () {
                        self.$el.find('.button .icon, .pointer').each(function () {
                            window.DD_belatedPNG.fixPng(this);
                        });
                    });
                }*

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
                if (!window.DD_belatedPNG) {
                    this.$el.find('.left').toggleClass('dis', true);
                    this.$el.find('.right').toggleClass('dis', false);
                }

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
    }(this));*/

    (function () {
        var DetailView = function () {
            this.$el = $('.tmp_detail').addClass(this.className);
            return this;
        };

        DetailView.prototype = {
            className : 'u-detail-view',
            template : _.template($('#detailView').html()),
            isShow : false,
            render : function () {
                this.$el.html(this.template({}));
                return this;
            },
            setContent : function (content) {
                this.$el.find('.user-detail').val(content);
            }
        };

        detailView = new DetailView();

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
    'xiaomi' : 1,
    'xiaomi3' : 1
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

    if (product_arr[0] === 'xiaomi') {
        if (product_arr[1] === 'mi3' || product_arr[1] === 'hm1') {
            product_arr[0] = 'xiaomi3';
        }

    }
    product_arr[0] = product_arr[0].toLowerCase();

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
    return 'http://www.wandoujia.com/help/?do=topic&id=' + videoId;
};

$(document).ready(function () {



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

    var btnUsbQQ = $('.button-qq');
    var btnCheckUsb = $('.button-check-usb-debug');

    try {
            window.external.call('{cmd:""}');
        }catch (e) {
            btnCheckUsb.hide();
        }

    var showQQ = false;

    var hideBtn = function (selector) {
        btnMore.hide();
        btnReturn.hide();
        btnFeedback.hide();
        btnUsbQQ.hide();
    };

    var showView = function (nextView) {
        currentView.$el.hide();
        currentView.isShow = false;
        lastView = currentView;
        currentView = nextView;
        nextView.$el.show();
        nextView.isShow = true;
        hideBtn();
    };

    hideBtn();
    if (version) {
        sliderView.render();
        currentView = sliderView;
        currentView.$el.show();
        var videoId = currentView.start('brands', version);
        btnMore.show();



        log({
            'event': 'ui.click.new_usb_debug_match',
            'brand' : version
        });

    } else {
        selectView.render();
        currentView = selectView;
        currentView.isShow = true;
        currentView.$el.show();
        btnFeedback.show();
    }

    feedbackView.render();

    btnCheckUsb.click(function () {
        window.external.call('{"cmd":"retry", "param":"connection.detect_device"}');
    });

    btnFeedback.on('click', function () {
        showView(feedbackView);
        btnReturn.show();

        log({
            'event': 'ui.click.new_usb_debug_feedback'
        });

        log({
            'event' : feedbackView.eventName
        });
    });

    btnMore.on('click', function () {

        if (!selectView.isRender) {
            selectView.render();
        }
        showView(selectView);
        if (showQQ) {
            btnUsbQQ.show();
        } else {
            btnFeedback.show();
        }

        log({
            'event': 'ui.click.new_usb_debug_more'
        });
    });

    btnReturn.on('click', function () {
        showView(selectView);
        if (showQQ) {
            btnUsbQQ.show();
        } else {
            btnFeedback.show();
        }

        try {
            window.external.call('{cmd:""}');
            btnCheckUsb.show();
        }catch (e) {
            btnCheckUsb.hide();
        }

        log({
            'event': 'ui.click.new_usb_debug_more'
        });
    });

    $('.button-qq, .usb-qq').on('click', function () {

        if (!detailView.isShow) {
            detailView.render();
        }
        showView(detailView);
        btnCheckUsb.hide();
        detailView.setContent('device_id : ' + device_id + '\r\nproduct_id : ' + product_id);
        btnReturn.show();

        log({
            'event': 'ui.click.new_usb_qq'
        });
    });


    $(document).bind('SELECT_PHONE', function (evt, type, version) {
        sliderView.render();
        showView(sliderView);

        var videoId = currentView.start(type, version);
        btnMore.show();

    });

    $.ajax('http://conn-feedback.wandoujia.com/request', {
        data : {
            device_id : device_id
        },
        dataType: "jsonp",
        success : function (resp) {
            if (resp.ret > 0) {

                showQQ = true;
                btnFeedback.hide();
                if (selectView.isShow) {
                    btnUsbQQ.show();
                }
            }
        }
    });
});
