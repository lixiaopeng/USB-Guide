/*global $, _, document, window, alert*/

//log
(function () {

    window.execCmd = function (cmd) {
        if (window.externalCall) {
            window.externalCall('', 'connection-guide', cmd);
        } else {
            window.external.call(cmd);
        }
    };

    window.log = function (data) {
        data = data || {};

        var url = "wdj://window/log.json",
            datas = [],
            d;

        data.dx_guid = dx_guid;

        for (d in data) {
            if (data.hasOwnProperty(d)) {
                datas.push(d + '=' + window.encodeURIComponent(data[d]));
            }
        }

        try {
            $.ajax({
                url : 'http://vmap.wandoujia.com/log',
                data : datas.join('&'),
                dataType : 'jsonp'
            });

            execCmd('{"cmd":"log", "param":"' + url + '?' + datas.join('&')  + '"}');
        } catch (e) {
            if (window.console && window.console.log) {
                window.console.log(data);
            }
        }
    };

    try {
        $.ajax({
            url : 'http://vmap.wandoujia.com/log',
            data : 'debug-start-log',
            dataType : 'jsonp'
        });

        execCmd('{"cmd":"debug-start-log"}');
    } catch (e) {}

}(this));

//device_id, product_id
(function () {
    var getUrlParam = function (name) {
        var reg = new RegExp("(\\?|^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);

        if (r) {
            return unescape(r[2]);
        }

        return null;
    };

    window.device_id = getUrlParam('device_id');
    window.product_id = getUrlParam('product_id');
    window.device_key = getUrlParam('device_key');
    window.dx_guid = getUrlParam('dx_guid');

    window.test = 'A';


    var vid = decodeURIComponent(window.device_id);
    vid = vid.match(/VID\_(\w{4})/)[1] + '_' +  vid.match(/PID\_(\w{4})/)[1];
    var vid_arr = [
        '0BB4_0001',
        '1782_5D03',
        '17EF_743A',
        '1782_5D00',
        '18D1_4E21',
        '22DA_0001',
        '0BB4_0C03',
        '18D1_0001'
    ];

    if (_.contains(vid_arr, vid) && window.dx_guid) {
        var guid = window.dx_guid.split('-')[4];
        if (parseInt(guid, 16) % 2 === 0) {
            window.test = 'B';
        }
    }


}(this));

//getCourseByVidPid
(function () {

    //临时方案
    var backupMap = {
        'general_gingerbread' : {"msg": "", "data": [{"add_ts": 1387287199.193094, "guide_name": "new_2.3", "guide_desc": "", "guide_content": [{"img": "http://img.wdjimg.com/helpcenter/usb/new_2.3/2.3-1.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_2.3/2.3-2.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_2.3/2.3-3.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_2.3/2.3-4.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_2.3/2.3-5.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_2.3/2.3-6.jpg"}], "guide_id": "31606897", "guide_model": "", "guide_brand": "", "model_name": "", "api_level": 0}], "ret": 0},
        'general_ics' : {"msg": "", "data": [{"add_ts": 1387287225.532392, "guide_name": "new_4.0-4.1", "guide_desc": "", "guide_content": [{"img": "http://img.wdjimg.com/helpcenter/usb/new_4.0-4.1/4.0-4.1-1.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_4.0-4.1/4.0-4.1-2.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_4.0-4.1/4.0-4.1-3.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_4.0-4.1/4.0-4.1-4.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_4.0-4.1/4.0-4.1-5.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_4.0-4.1/4.0-4.1-6.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_4.0-4.1/4.0-4.1-7.jpg"}], "guide_id": "31610507", "guide_model": "", "guide_brand": "", "model_name": "", "api_level": 0}], "ret": 0},
        'general_jeallybean' : {"msg": "", "data": [{"add_ts": 1387287211.792048, "guide_name": "new_Nexus4-4.4", "guide_desc": "", "guide_content": [{"img": "http://img.wdjimg.com/helpcenter/usb/new_Nexus4-4.4/Nexus-4-android-4.4_1.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_Nexus4-4.4/Nexus-4-android-4.4_2.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_Nexus4-4.4/Nexus-4-android-4.4_3.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_Nexus4-4.4/Nexus-4-android-4.4_4_new.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_Nexus4-4.4/Nexus-4-android-4.4_5.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_Nexus4-4.4/Nexus-4-android-4.4_6.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_Nexus4-4.4/Nexus-4-android-4.4_7.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_Nexus4-4.4/Nexus-4-android-4.4_8.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_Nexus4-4.4/Nexus-4-android-4.4_9.jpg"}], "guide_id": "32141806", "guide_model": "", "guide_brand": "new_Nexus4", "model_name": "", "api_level": "4.4"}], "ret": 0},
        'general_miuios' : {"msg": "", "data": [{"add_ts": 1387287181.3277631, "guide_name": "new_MI-2SC-4.1.1", "guide_desc": "", "guide_content": [{"img": "http://img.wdjimg.com/helpcenter/usb/new_MI-2SC-4.1.1/MI-2SC---1.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_MI-2SC-4.1.1/MI-2SC---2.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_MI-2SC-4.1.1/MI-2SC---3.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_MI-2SC-4.1.1/MI-2SC---4.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_MI-2SC-4.1.1/MI-2SC---5.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_MI-2SC-4.1.1/MI-2SC---6.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_MI-2SC-4.1.1/MI-2SC---7.jpg"}], "guide_id": "31638167", "guide_model": "", "guide_brand": "", "model_name": "", "api_level": 0}, {"add_ts": 1387287119.5765641, "guide_name": "new_MI3-4.2.1", "guide_desc": "", "guide_content": [{"img": "http://img.wdjimg.com/helpcenter/usb/new_MI3-4.2.1/mi3-4.2.2-1.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_MI3-4.2.1/mi3-4.2.2-2.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_MI3-4.2.1/mi3-4.2.2-3.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_MI3-4.2.1/mi3-4.2.2-4_new.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_MI3-4.2.1/mi3-4.2.2-5.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_MI3-4.2.1/mi3-4.2.2-6.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_MI3-4.2.1/mi3-4.2.2-7.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_MI3-4.2.1/mi3-4.2.2-8.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_MI3-4.2.1/mi3-4.2.2-9.jpg"}], "guide_id": "32140716", "guide_model": "", "guide_brand": "new_MI3", "model_name": "", "api_level": "4.2.1"}], "ret": 0},
        'general_meizu' : {"msg": "", "data": [{"add_ts": 1387287164.7930119, "guide_name": "new_meizu-MX2-flyme2.4.1", "guide_desc": "", "guide_content": [{"img": "http://img.wdjimg.com/helpcenter/usb/new_meizu-MX2-flyme2.4.1/meizu_MX2--flyme-2.4-1.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_meizu-MX2-flyme2.4.1/meizu-mx2-flyme2.4-2.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_meizu-MX2-flyme2.4.1/meizu-mx2-flyme2.4-3.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_meizu-MX2-flyme2.4.1/meizu-mx2-flyme2.4-4.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_meizu-MX2-flyme2.4.1/meizu-mx2-flyme2.4-5.jpg"}], "guide_id": "31637137", "guide_model": "", "guide_brand": "new_meizu-MX2-flyme2.4.1", "model_name": "", "api_level": ""}, {"add_ts": 1387287151.4678991, "guide_name": "new_meizu-MX3-flyme3", "guide_desc": "", "guide_content": [{"img": "http://img.wdjimg.com/helpcenter/usb/new_meizu-MX2-flyme2.4.1/meizu_MX2--flyme-2.4-1.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_meizu-MX3-flyme3/meizu-mx3-flyme3-2.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_meizu-MX3-flyme3/meizu-mx3-flyme3-3.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_meizu-MX3-flyme3/meizu-mx3-flyme3-4.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_meizu-MX3-flyme3/meizu-mx3-flyme3-5.jpg"}], "guide_id": "31637867", "guide_model": "", "guide_brand": "new_meizu-MX3-flyme3", "model_name": "", "api_level": ""}], "ret": 0}
    };

    var getCourseByVidPid = function (vid_pid, success, error) {

        var handler = setTimeout(function () {
            var data = backupMap[vid_pid];
            if (data) {
                vmapCallBack(data);
                return;
            }

            error && error();
        }, 2000);

        window.vmapCallBack = function(resp) {
            if (resp.data.length > 0) {
                isMatchVid = true;
            }
            success(resp);
            clearTimeout(handler);
        };

        var sc = document.createElement('script');
        var url = 'http://vmap.wandoujia.com/query?callback=vmapCallBack&data=' +  encodeURIComponent(vid_pid);

        if (device_key) {
            url +=  '&device_key=' + encodeURIComponent(device_key);
        }

        //var data = window.external.call('{"cmd":"getData", "param":' + vid_pid + '}')
        //var url = 'http://vmap.wandoujia.com/query?callback=vmapCallBack&data=' +  data;

        sc.setAttribute('src', url);
        document.getElementsByTagName('head')[0].appendChild(sc);
    };

    window.getCourseByVidPid = getCourseByVidPid;
    window.isMatchVid = false;

}(this));

//showView
(function () {
    var viewQueue = [];

    var showNextView = function (view) {
        if (viewQueue.length) {
            var current = viewQueue[viewQueue.length - 1];
            current.hide();
        }
        view.show();
        viewQueue.push(view);
    };

    var showLastView = function () {
        var current = viewQueue.pop();
        current.hide();

        current = viewQueue[viewQueue.length - 1];
        current.show();
    };

    window.showLastView = showLastView;
    window.showNextView = showNextView;
}(this));

//get qq state
(function () {
    var getQQState = function () {
        $.ajax('http://conn-feedback.wandoujia.com/request', {
            data : {
                'device_id' : device_id
            },
            'dataType' : 'jsonp',
            'success' : function (resp) {
                if (resp.ret > 0) {
                    showQQ = true;
                }
            }
        });
    };
    getQQState();

    window.showQQ = false;
}(this));

//select brand view;
(function () {
    var data = {
        brands: [{
            name : '三星 Samsung',
            className : 'Samsung'
        },{
            name : 'HTC',
            className : 'HTC'
        },{
            name : '华为 Huawei',
            className : 'Huawei'
        },{
            name : '小米 Xiaomi',
            className : 'xiaomi'
        },{
            name : 'OPPO',
            className : 'oppo'
        },{
            name : '联想 Lenovo',
            className : 'Lenovo'
        },{
            name : '中兴 ZTE',
            className : 'ZTE'
        },{
            name : '索尼 Sony',
            className : 'Sony'
        },{
            name : 'VIVO',
            className : 'Vivo'
        },{
            name : '酷派 Coolpad',
            className : 'Coolpad'
        },{
            name : '天语 K-Touch',
            className : 'Ktouch'
        },{
            name : '海信 Hisense',
            className : 'Hisense'
        },{
            name : 'LG',
            className : 'LG'
        },{
            name : '摩托 Moto',
            className : 'Moto'
        },{
            name : '魅族 Meizu',
            className : 'Meizu'
        }],
        systems : [{
            name : '安卓 Android 1.6 - 3.2',
            className : 'gingerbread'
        }, {
            name : '安卓 Android 4.0 - 4.1',
            className : 'ics'
        }, {
            name : '安卓 Android 4.2 - 4.4',
            className : 'jeallybean'
        }]
    };

    var SelectBrandView = function () {
        this.$el = $('.tmp_select').addClass(this.className);
        return this;
    };

    SelectBrandView.prototype = {
        className : 'u-select-brand-view',
        template : _.template($('#selectBrandView').html()),
        isRender : false,
        isShow : false,
        render : function () {
            this.isRender = true;
            this.$el.html(this.template(data));

            this.$el.find('.brands li').on('click', this.clickSelect);
            this.$el.find('.systems li').on('click', this.clickSystem);

            return this;
        },
        clickSystem : function (evt) {
            var tmp = /(\w+)\s(\w+)\s(\w+)/.exec(evt.currentTarget.className);
            var version = tmp[3];

            log({
                'event' : 'ui.click.v3_general_By_test',
                'version' : version,
                'instance_id' :  device_id
            });

            getCourseByVidPid('general_' + version, function (resp) {
                if (resp.data.length === 0) {
                    showNextView(selectView);
                    return;
                }

                sliderView.data = null;
                sliderView.currentIndex = -1;

                showNextView(sliderView);
                sliderView.data = resp.data;
                sliderView.showCourse();
            });
        },
        clickSelect : function (evt) {
            var tmp = /(\w+)\s(\w+)\s(\w+)/.exec(evt.currentTarget.className);
            var version = tmp[3];

            log({
                'event' : 'ui.click.v3_brand',
                'version' : version,
                'instance_id' :  device_id
            });

            getCourseByVidPid('brand_' + version, function (resp) {
                if (resp.data.length === 0) {
                    showNextView(selectView);
                    return;
                }

                sliderView.data = null;
                sliderView.currentIndex = -1;

                showNextView(sliderView);
                sliderView.data = resp.data;
                sliderView.showCourse();
            });
        },
        hide : function () {
            this.$el.hide();
            this.isShow = false;
        },
        show : function () {
            if (!this.isRender) {
                this.render();
            }
            this.$el.show();
            this.isShow = true;
        }
    };

    if (window.test === 'B') {
        window.selectView = new SelectBrandView();
    }

}(this));

//select view;
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
            name : 'MIUI',
            className : 'miuios'
        }, {
            name : '魅族 Flyme',
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
            this.$el.html(this.template(data)).on('click', 'li:not(.howto)', this.clickSelect);

            this.$el.find('li').on('mouseenter', function () {
                $(this).find('.top').animate({
                    'top' : "-5px"
                }, 100, 'linear');
            }).on('mouseleave', function () {
                $(this).find('.top').animate({
                    'top' : "0px"
                }, 100, 'linear');
            });

            this.$el.find('.howto').click(function () {
                log({
                    'event' : 'ui.click.v3_open_find_version'
                });
            });

            return this;
        },
        clickSelect : function (evt) {
            var tmp = /(\w+)\s(\w+)\s(\w+)/.exec(evt.currentTarget.className);
            var version = tmp[3];

            log({
                'event' : 'ui.click.v3_general',
                'version' : version,
                'instance_id' : device_id
            });

            getCourseByVidPid('general_' + version, function (resp) {
                if (resp.data.length === 0) {
                    showNextView(selectView);
                    return;
                }

                sliderView.data = null;
                sliderView.currentIndex = -1;

                showNextView(sliderView);
                sliderView.data = resp.data;
                sliderView.showCourse();
            });
        },
        hide : function () {
            this.$el.hide();
            this.isShow = false;
        },
        show : function () {
            if (!this.isRender) {
                this.render();
            }
            this.$el.show();
            this.isShow = true;
            footerView.show();
        }
    };

    if (window.test === 'A') {
        window.selectView = new SelectView();
    }

}(this));

//feedback view
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

            this.$el.find('.qq').on('click', function () {
                log({
                    'event' : 'ui.click.v3_click_qq',
                    'position' : 'feedback_Page'
                });

                showNextView(detailView);
                detailView.setContent({
                    'vid' : decodeURIComponent(device_id),
                    'pid' : decodeURIComponent(product_id)
                });
            });

            return this;
        },
        hide : function () {
            this.$el.hide();
            this.isShow = false;
        },
        show : function () {
            if (!this.isRender) {
                this.render();
            }
            this.$el.show();
            this.isShow = true;
            footerView.show();
            footerView.toggleReturn(true);
            footerView.toggleFeedBack(false);
        }
    };

    window.feedbackView = new FeedbackView();
}(this));

//detail view
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
            var text = '';
            $.each(content, function (key, value) {
                text += key + " : " + value + "\n";
            });
            this.$el.find('.user-detail').val(text);
        },
        hide : function () {
            this.$el.hide();
            this.isShow = false;
        },
        show : function () {

            if (!this.isRender) {
                this.render();
            }

            this.$el.show();
            this.isShow = true;
        }
    };

    window.detailView = new DetailView();

}(this));

//slider view
(function () {
    var SliderView = function () {
        this.$el = $('.tmp_silder').addClass(this.className);
        return this;
    };

    SliderView.prototype = {
        className : 'u-slider-view',
        headTemplate : _.template($('#sliderViewHead').html()),
        bodyTemplate : _.template($('#sliderViewBody').html()),
        lastTemplate : _.template($('#sliderViewLastPage').html()),
        isShow : false,
        isRender : false,
        currentIndex : -1,
        data : null,
        imageWidth : 260,
        overviewWidth : 0,
        contentWidth : 680,
        clickArrow : false,
        prefixArr : [],
        render : function () {
            var me = this;
            me.isRender = true;
            me.$el.html(me.headTemplate({}));

            me.$el.find('.header .next').on('click', function () {

                log({
                    'event' : 'ui.click.v3_course_next',
                    'position' : 'header',
                    'instance_id' :  device_id,
                    'guide_id' : me.data[me.currentIndex].guide_id,
                    'total_page' : me.data[me.currentIndex].guide_content.length
                });
                me.showNext();
            }).on('mouseenter', function () {
                $(this).addClass('next-hover');
            }).on('mouseleave', function () {
                $(this).removeClass('next-hover next-press');
            }).on('mousedown', function () {
                $(this).addClass('next-press');
            }).on('mouseup', function () {
                $(this).removeClass('next-press');
            });

            me.$el.find('.header .general').on('click', function () {

                log({
                    'event' : 'ui.click.v3_show_general',
                    'position' : 'header'
                });
                showNextView(selectView);
            });

            me.$el.find('.header .checkusb').on('click', function () {

                log({
                    'event' : 'ui.click.v3_checkusb'
                });
                execCmd('{"cmd":"retry", "param":"connection.detect_device"}');

            }).on('mouseenter', function () {
                $(this).addClass('checkusb-hover');
            }).on('mouseleave', function () {
                $(this).removeClass('checkusb-hover checkusb-press');
            }).on('mousedown', function () {
                $(this).addClass('checkusb-press');
            }).on('mouseup', function () {
                $(this).removeClass('checkusb-press');
            });

            me.$el.find('.header .return').on('click', function () {

                log({
                    'event' : 'ui.click.v3_return_course',
                    'position' : 'header'
                });

                me.currentIndex = -1;
                me.showCourse();
            });

            me.$el.find('.header .qq').hide().on('click', function () {
                log({
                    'event' : 'ui.click.v3_click_qq',
                    'position' : 'header'
                });
            });

            me.$el.find('.return').hide();

            /*function flash () {
                 var handler = setInterval(function () {
                 $('.header .next').animate({backgroundColor: "#D1D1D1"}, 800, function () {
                        $('.header .next').animate({backgroundColor: "#EAEAEA"}, 800);
                    });
                }, 1600);

                setTimeout(function () {
                    clearInterval(handler);
                }, 11200);
            };

            setTimeout(function () {
                flash();
                setInterval(flash, 21200);
            }, 10000);*/

            return this;
        },
        moveTo : function (index) {
            var $slider = this.$el.find('.overview');
            var prefix = 0;

            this.$el.find('.left-arrow').hide();
            this.$el.find('.right-arrow').show();

            if (index !== 0) {
                prefix = this.prefixArr[--index] + 260;
                this.$el.find('.left-arrow').show();
            }

            $slider.css('left', -prefix);

            this.$el.find('.thumb').css('left', prefix / this.scrollbar.getRatio());
            this.scrollbar.updateN(prefix);
        },
        showNext : function () {
            if (this.currentIndex === this.data.length - 1 ) {
                this.showLastPage();
            } else {
                this.moveTo(++this.currentIndex);
            }
        },
        hide : function () {
            this.$el.hide();
            this.isShow = false;
        },
        show : function () {

            if (!this.isRender) {
                this.render();
            }

            this.$el.show();
            this.isShow = true;
            footerView.hide();

            if (this.data) {
                this.currentIndex = -1;
                this.showCourse();
            }
        },
        clearContent : function () {

            var me = this;
            log({
                'event' : 'ui.click.v3_course_clear',
                'page'  : -(parseInt(me.$el.find('.slider').css('left')) || 0) / 250,
                'total_page' : me.data[me.currentIndex] ? me.data[me.currentIndex].guide_content.length : 0,
                'clickArrow' : me.clickArrow,
                'wheel' : me.scrollbar ? me.scrollbar.getIsUsedWheel() : 0,
                'guide_id' : me.data[me.currentIndex].guide_id,
                'instance_id' : device_id
            });

            me.$el.find('.content').remove();
            me.$el.find('.scrollbar').remove();
        },
        showCourse : function () {

            var me = this;

            me.currentIndex ++;
            me.switchHeader(true, me.currentIndex === me.data.length - 1);

            me.clearContent();
            me.prefixArr = [];
            me.overviewWidth = 0;

            me.$el.append(me.bodyTemplate({
                'data' : me.data
            }));
            me.loadPics();

            _.each(me.data, function (data, index) {
                var ulWidth = 0;
                var length = data.guide_content.length;

                if (index > 0) {
                    length ++;
                }

                if (index === me.data.length - 1) {
                    length ++;
                }
                var ulWidth = length * me.imageWidth + 5;
                me.$el.find('.slider:eq(' + index + ')').css('width', ulWidth);

                me.overviewWidth += ulWidth;

                me.prefixArr.push(me.overviewWidth);
            });

            me.$el.find('.overview').css('width', me.overviewWidth);

            me.scrollbar = me.$el.scrollbar({
                axis: 'x',
                handler : function (left) {
                    var width = me.overviewWidth - me.contentWidth;
                    if (left === 0) {
                        me.$el.find('.left-arrow').hide();
                    } else if (left >= width){
                        me.$el.find('.right-arrow').hide();
                    } else {
                        me.$el.find('.left-arrow').show();
                        me.$el.find('.right-arrow').show();
                    }

                    me.updateCurrent(left);
                }
            })
            me.bindEvent();

            if (window.DD_belatedPNG) {
                setTimeout(function () {
                    me.$el.find('.wanxiaodou .img').each(function () {
                        window.DD_belatedPNG.fixPng(this);
                    });
                });
            }

            log({
                'event' : 'ui.click.v3_course',
                'total_page' : me.data[me.currentIndex].guide_content.length,
                'guide_id' : me.data[me.currentIndex].guide_id,
                'instance_id' : device_id
            });
        },
        updateCurrent : function (left) {
            for(var i = 0; i < this.prefixArr.length; i++) {
                if (left < this.prefixArr[i]) {
                    this.currentIndex = i;
                    break;
                }
            }
        },
        loadPics : function () {
            var me = this;
            _.each(me.data, function (data, index) {
                _.each(data.guide_content, function (guide, i) {
                    var img = new Image();
                    img.onload = function () {
                        if (index > 0) {
                            i++;
                        }
                        me.$el.find('ul:eq(' + index + ') li:eq(' + i + ')').css('background-image', 'url(' + guide.img + ')').find('img').remove();
                    };

                    img.src = guide.img;
                });
            });
        },
        bindEvent : function () {

            var me = this;
            me.$el.find('.slider li .next').one('click', function () {

                log({
                    'event' : 'ui.click.v3_course_next',
                    'position' : 'lastPage',
                    'instance_id' :  device_id,
                    'guide_id' : me.data[me.currentIndex].guide_id,
                    'total_page' : me.data[me.currentIndex].guide_content.length
                });
                me.showNext();
            });

            me.$el.find('.slider li .download').one('click', function () {

                log({
                    'event' : 'ui.click.v3_show_feedback',
                    'position' : 'lastPage'
                });
                showNextView(feedbackView);
            });

            me.$el.find('.slider li .general').one('click', function () {

                log({
                    'event' : 'ui.click.v3_show_general',
                    'position' : 'lastPage'
                });
                showNextView(selectView);
            });

            me.$el.find('.left-arrow').on('mouseenter', function () {
                $(this).addClass('left-arrow-hover');
            }).on('mouseleave', function () {
                $(this).removeClass('left-arrow-hover left-arrow-press');
            }).on('mousedown', function () {
                $(this).addClass('left-arrow-press');
            }).on('mouseup', function () {
                $(this).removeClass('left-arrow-press');
            }).on('click', function () {
                me.goLeft();

                me.clickArrow = true;
            });

            me.$el.find('.right-arrow').on('mouseenter', function () {
                $(this).addClass('right-arrow-hover');
            }).on('mouseleave', function () {
                $(this).removeClass('right-arrow-hover right-arrow-press');
            }).on('mousedown', function () {
                $(this).addClass('right-arrow-press');
            }).on('mouseup', function () {
                $(this).removeClass('right-arrow-press');
            }).on('click', function () {
                me.goRight();
                me.clickArrow = true;
            });
        },
        goRight : function () {

            var width = this.overviewWidth - this.contentWidth;
            var $slider = this.$el.find('.overview');

            this.$el.find('.left-arrow').show();
            var left = parseInt($slider.css('left'));
            if (left - 250 > -width) {
                left -= 250;
            } else {
                left = -width;
                this.$el.find('.right-arrow').hide();
            }
            $slider.css('left', left);

            this.$el.find('.thumb').css('left', -left / this.scrollbar.getRatio());
            this.scrollbar.updateN(-left);

            this.updateCurrent(-left);
        },
        goLeft : function () {
            var $slider = this.$el.find('.overview');
            this.$el.find('.right-arrow').show();

            var left = parseInt($slider.css('left'));
            if (left + 250< 0) {
                left += 250;
            } else {
                left = 0;
                this.$el.find('.left-arrow').hide();
            }
            $slider.css('left', left);

            this.$el.find('.thumb').css('left', -left / this.scrollbar.getRatio());
            this.scrollbar.updateN(-left);

            this.updateCurrent(-left);
        },
        switchHeader : function (isCourse, isLast) {

            var returnBtn =  this.$el.find('.return');
            var nextBtn = this.$el.find('.next');
            var mouseTip = this.$el.find('.mouse');
            var descTip = this.$el.find('.desc');
            var generalBtn = this.$el.find('.general');
            var qqBtn = this.$el.find('.qq');

            returnBtn.toggle(!isCourse);
            if (this.data.length === 1) {
                nextBtn.hide();
                generalBtn.show();
            } else {
                generalBtn.hide();
                qqBtn.toggle(isLast && showQQ && isCourse);
                if (!(isLast && showQQ) && isCourse) {
                    nextBtn.css('display', 'inline-block');
                } else {
                    nextBtn.hide();
                }
            }

            mouseTip.toggle(isCourse);
            descTip.toggle(isCourse);
        },
        showLastPage : function () {
            var me = this;
            me.clearContent();
            me.switchHeader(false, false);

            me.$el.append(me.lastTemplate({}));

            me.$el.find('.last_page .download').one('click', function () {

                log({
                    'event' : 'ui.click.v3_show_feedback',
                    'position' : 'final_Page'
                });
                showNextView(feedbackView);
            });

            me.$el.find('.last_page .general').one('click', function () {

                log({
                    'event' : 'ui.click.v3_show_general',
                    'position' : 'final_Page'
                });
                showNextView(selectView);
            });

            me.$el.find('.last_page .qq').off('click').on('click', function () {
                log({
                    'event' : 'ui.click.v3_click_qq',
                    'position' : 'final_Page'
                });

                showNextView(detailView);
                detailView.setContent({
                    'vid' : decodeURIComponent(device_id),
                    'pid' : decodeURIComponent(product_id)
                });
            });

            if (window.DD_belatedPNG) {
                setTimeout(function () {
                    me.$el.find('.wanxiaodou, .img').each(function () {
                        window.DD_belatedPNG.fixPng(this);
                    });
                });
            }
        }
    };

    window.sliderView = new SliderView();
}(this));

//footerView
(function () {
    var FooterView = function () {
        this.$el = $('.tmp_footer').addClass(this.className);
        return this;
    };

    FooterView.prototype = {
        className : 'u-footer-view',
        template : _.template($('#footerView').html()),
        isRender : false,
        isShow : false,
        render : function () {
            var me = this;
            me.isRender = true;
            me.$el.html(me.template());

            me.$el.find('.button-return').on('mouseenter', function () {
                $(this).addClass('button-return-hover');
            }).on('mouseleave', function () {
                $(this).removeClass('button-return-hover button-return-press');
            }).on('mousedown', function () {
                $(this).addClass('button-return-press');
            }).on('mouseup', function () {
                $(this).removeClass('button-return-press');
            }).on('click', function () {

                log({
                    'event' : 'ui.click.v3_return',
                    'position' : 'general'
                });
                showLastView();
            });

            me.$el.find('.feedback').on('click', function () {

                log({
                    'event' : 'ui.click.v3_show_feedback',
                    'position' : 'general'
                });
                showNextView(feedbackView);
                $(this).hide();
            });

            return this;
        },
        hide : function () {
            this.$el.hide();
            this.isShow = false;
        },
        show : function () {
            if (!this.isRender) {
                this.render();
            }
            this.$el.show();
            this.isShow = true;

            this.toggleReturn(isMatchVid);
            this.toggleFeedBack(true);
        },
        toggleReturn : function (show) {
            this.$el.find('.button-return').toggle(show);
        },
        toggleFeedBack : function (show) {
            this.$el.find('.feedback').toggle(show);
        }

    };
    window.footerView = new FooterView();
}(this));

//main function
$(document).ready(function (){

    if (window.test === 'B') {
        showNextView(selectView);
        return;
    }

    getCourseByVidPid(device_id + '_' + product_id, function (resp) {
        if (resp.data.length === 0) {
            showNextView(selectView);
            return;
        }

        showNextView(sliderView);
        sliderView.data = resp.data;
        sliderView.showCourse();
    }, function () {
        showNextView(selectView);
    });
});
