/*global $, _, document, window, alert*/

//log
(function () {

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
                url : 'http://vmap.snappea.com/log',
                data : datas.join('&'),
                dataType : 'jsonp'
            });
            window.external.call('{"cmd":"log", "param":"' + url + '?' + datas.join('&')  + '"}');
        } catch (e) {
            if (window.console && window.console.log) {
                window.console.log(data);
            }
        }
    };

    try {
        $.ajax({
            url : 'http://vmap.snappea.com/log',
            data : 'debug-start-log',
            dataType : 'jsonp'
        });
        window.external.call('{"cmd":"debug-start-log"}');
    } catch (e) {}

}(this));

//device_id, product_id
(function () {
    var getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
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

}(this));

//getCourseByVidPid
(function () {

    //临时方案
    var backupMap = {
        'general_gingerbread' : {"msg": "", "data": [{"add_ts": 1387287199.193094, "guide_name": "new_2.3", "guide_desc": "", "guide_content": [{"img": "http://img.wdjimg.com/helpcenter/usb/new_2.3/2.3-1.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_2.3/2.3-2.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_2.3/2.3-3.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_2.3/2.3-4.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_2.3/2.3-5.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_2.3/2.3-6.jpg"}], "guide_id": "31606897", "guide_model": "", "guide_brand": "", "model_name": "", "api_level": 0}], "ret": 0},
        'general_ics' : {"msg": "", "data": [{"add_ts": 1387287225.532392, "guide_name": "new_4.0-4.1", "guide_desc": "", "guide_content": [{"img": "http://img.wdjimg.com/helpcenter/usb/new_4.0-4.1/4.0-4.1-1.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_4.0-4.1/4.0-4.1-2.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_4.0-4.1/4.0-4.1-3.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_4.0-4.1/4.0-4.1-4.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_4.0-4.1/4.0-4.1-5.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_4.0-4.1/4.0-4.1-6.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_4.0-4.1/4.0-4.1-7.jpg"}], "guide_id": "31610507", "guide_model": "", "guide_brand": "", "model_name": "", "api_level": 0}], "ret": 0},
        'general_jeallybean' : {"msg": "", "data": [{"add_ts": 1387287211.792048, "guide_name": "new_Nexus4-4.4", "guide_desc": "", "guide_content": [{"img": "http://img.wdjimg.com/helpcenter/usb/new_Nexus4-4.4/Nexus-4-android-4.4_1.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_Nexus4-4.4/Nexus-4-android-4.4_2.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_Nexus4-4.4/Nexus-4-android-4.4_3.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_Nexus4-4.4/Nexus-4-android-4.4_4_new.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_Nexus4-4.4/Nexus-4-android-4.4_5.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_Nexus4-4.4/Nexus-4-android-4.4_6.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_Nexus4-4.4/Nexus-4-android-4.4_7.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_Nexus4-4.4/Nexus-4-android-4.4_8.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_Nexus4-4.4/Nexus-4-android-4.4_9.jpg"}], "guide_id": "32141806", "guide_model": "", "guide_brand": "new_Nexus4", "model_name": "", "api_level": "4.4"}], "ret": 0},
        'general_samsung' : {"msg": "", "data": [{"add_ts": 1387287181.3277631, "guide_name": "new_MI-2SC-4.1.1", "guide_desc": "", "guide_content": [{"img": "http://img.wdjimg.com/helpcenter/usb/new_MI-2SC-4.1.1/MI-2SC---1.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_MI-2SC-4.1.1/MI-2SC---2.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_MI-2SC-4.1.1/MI-2SC---3.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_MI-2SC-4.1.1/MI-2SC---4.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_MI-2SC-4.1.1/MI-2SC---5.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_MI-2SC-4.1.1/MI-2SC---6.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_MI-2SC-4.1.1/MI-2SC---7.jpg"}], "guide_id": "31638167", "guide_model": "", "guide_brand": "", "model_name": "", "api_level": 0}, {"add_ts": 1387287119.5765641, "guide_name": "new_MI3-4.2.1", "guide_desc": "", "guide_content": [{"img": "http://img.wdjimg.com/helpcenter/usb/new_MI3-4.2.1/mi3-4.2.2-1.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_MI3-4.2.1/mi3-4.2.2-2.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_MI3-4.2.1/mi3-4.2.2-3.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_MI3-4.2.1/mi3-4.2.2-4_new.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_MI3-4.2.1/mi3-4.2.2-5.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_MI3-4.2.1/mi3-4.2.2-6.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_MI3-4.2.1/mi3-4.2.2-7.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_MI3-4.2.1/mi3-4.2.2-8.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_MI3-4.2.1/mi3-4.2.2-9.jpg"}], "guide_id": "32140716", "guide_model": "", "guide_brand": "new_MI3", "model_name": "", "api_level": "4.2.1"}], "ret": 0},
        'general_htc' : {"msg": "", "data": [{"add_ts": 1387287164.7930119, "guide_name": "new_meizu-MX2-flyme2.4.1", "guide_desc": "", "guide_content": [{"img": "http://img.wdjimg.com/helpcenter/usb/new_meizu-MX2-flyme2.4.1/meizu_MX2--flyme-2.4-1.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_meizu-MX2-flyme2.4.1/meizu-mx2-flyme2.4-2.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_meizu-MX2-flyme2.4.1/meizu-mx2-flyme2.4-3.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_meizu-MX2-flyme2.4.1/meizu-mx2-flyme2.4-4.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_meizu-MX2-flyme2.4.1/meizu-mx2-flyme2.4-5.jpg"}], "guide_id": "31637137", "guide_model": "", "guide_brand": "new_meizu-MX2-flyme2.4.1", "model_name": "", "api_level": ""}, {"add_ts": 1387287151.4678991, "guide_name": "new_meizu-MX3-flyme3", "guide_desc": "", "guide_content": [{"img": "http://img.wdjimg.com/helpcenter/usb/new_meizu-MX2-flyme2.4.1/meizu_MX2--flyme-2.4-1.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_meizu-MX3-flyme3/meizu-mx3-flyme3-2.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_meizu-MX3-flyme3/meizu-mx3-flyme3-3.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_meizu-MX3-flyme3/meizu-mx3-flyme3-4.jpg"}, {"img": "http://img.wdjimg.com/helpcenter/usb/new_meizu-MX3-flyme3/meizu-mx3-flyme3-5.jpg"}], "guide_id": "31637867", "guide_model": "", "guide_brand": "new_meizu-MX3-flyme3", "model_name": "", "api_level": ""}], "ret": 0}
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
        var url = 'http://vmap.snappea.com/query?callback=vmapCallBack&data=' +  encodeURIComponent(vid_pid);

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
            name : 'Samsung',
            className : 'samsung'
        }, {
            name : 'HTC',
            className : 'htc'
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
                'version' : version
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

    window.selectView = new SelectView();
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
        ulWidth : 0,
        contentWidth : 680,
        clickArrow : false,
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
                $(this).addClass('hover');
            }).on('mouseleave', function () {
                $(this).removeClass('hover press');
            }).on('mousedown', function () {
                $(this).addClass('press');
            }).on('mouseup', function () {
                $(this).removeClass('press');
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
                window.external.call('{"cmd":"retry", "param":"connection.detect_device"}');

            }).on('mouseenter', function () {
                $(this).addClass('hover');
            }).on('mouseleave', function () {
                $(this).removeClass('hover press');
            }).on('mousedown', function () {
                $(this).addClass('press');
            }).on('mouseup', function () {
                $(this).removeClass('press');
            });

            me.$el.find('.header .return').on('click', function () {

                log({
                    'event' : 'ui.click.v3_return_course',
                    'position' : 'header'
                });

                me.currentIndex = -1;
                me.showCourse();
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
        showNext : function () {
            if (this.currentIndex < this.data.length -1 ) {
                this.showCourse();
            } else {
                this.showLastPage();
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
            var data;

            me.currentIndex ++;
            data = me.data[me.currentIndex];
            me.switchHeader(true, me.currentIndex === me.data.length - 1);

            me.clearContent();

            me.$el.append(me.bodyTemplate({
                'pic_length' : data.guide_content.length,
                'course_length' : me.data.length
            }));
            me.loadPics(data.guide_content);

            me.ulWidth = (data.guide_content.length + 1) * this.imageWidth + 5;
            me.$el.find('.slider').css('width', me.ulWidth);
            me.scrollbar = me.$el.scrollbar({
                axis: 'x',
                handler : function (left) {
                    var width = me.ulWidth - me.contentWidth;
                    if (left === 0) {
                        me.$el.find('.left-arrow').hide();
                    } else if (left >= width){
                        me.$el.find('.right-arrow').hide();
                    } else {
                        me.$el.find('.left-arrow').show();
                        me.$el.find('.right-arrow').show();
                    }
                }
            });
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
        loadPics : function (datas) {
            var me = this;
            _.each(datas, function (data, index) {
                var img = new Image();
                img.onload = function () {
                    me.$el.find('li:eq(' + index + ') img').removeClass('loading').attr('src', data.img);
                };

                img.src = data.img;
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

            me.$el.find('.slider li .zendesk').one('click', function () {

                log({
                    'event' : 'ui.click.v3_show_zendesk',
                    'position' : 'lastPage'
                });
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

            var width = this.ulWidth - this.contentWidth;
            var $slider = this.$el.find('.slider');

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
        },
        goLeft : function () {
            var $slider = this.$el.find('.slider');
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
        },
        switchHeader : function (isCourse, isLast) {

            var returnBtn =  this.$el.find('.return');
            var nextBtn = this.$el.find('.next');
            var mouseTip = this.$el.find('.mouse');
            var descTip = this.$el.find('.desc');
            var generalBtn = this.$el.find('.general');

            returnBtn.toggle(!isCourse);
            if (this.data.length === 1) {
                nextBtn.hide();
                generalBtn.show();
            } else {
                generalBtn.hide();
                if (!isLast && isCourse) {
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
                $(this).addClass('hover');
            }).on('mouseleave', function () {
                $(this).removeClass('hover press');
            }).on('mousedown', function () {
                $(this).addClass('press');
            }).on('mouseup', function () {
                $(this).removeClass('press');
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
