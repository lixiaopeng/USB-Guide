/*global $, _, document, window, alert*/

//log
(function () {

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

    //window.device_id = getUrlParam('device_id');
    //window.product_id = getUrlParam('product_id');

    window.device_id = 'VID_1234';
    window.product_id = 'PID_1234';

}(this));

//getCourseByVidPid
(function () {
    var getCourseByVidPid = function (vid_pid, success, fail) {
        $.ajax('http://vmap.wandoujia.com/query', {
            'data' : {
                'data' : vid_pid
            },
            'dataType': 'jsonp',
            'success' : function (resp) {
                if (resp.data.length > 0) {
                    isMatchVid = true;
                }
                success(resp);
            },
            'fail' : fail || function () {}
        });
    }

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
    }

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
            name : 'Meizu Flyme',
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

            return this;
        },
        clickSelect : function (evt) {
            var tmp = /(\w+)\s(\w+)\s(\w+)/.exec(evt.currentTarget.className);
            var version = tmp[3];

            getCourseByVidPid('general_' + version, function (resp) {
                if (resp.data.length === 0) {
                    showNextView(selectView);
                    return;
                }

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

            if (window.DD_belatedPNG) {
                setTimeout(function () {
                    self.$el.find('.number, .img').each(function () {
                        window.DD_belatedPNG.fixPng(this);
                    });
                });
            }

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
            this.$el.find('.user-detail').val(content);
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
        ulWidth : 0,
        contentWidth : 680,
        render : function () {
            var me = this;
            me.isRender = true;
            me.$el.html(me.headTemplate({}));

            me.$el.find('.header .next').on('click', function () {
                me.showNext();
            });

            me.$el.find('.header .return').on('click', function () {
                me.currentIndex = -1;
                me.showCourse();
                me.switchHeader(true);
            });

            me.$el.find('.return').hide();

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
            this.$el.find('.content').remove();
            this.$el.find('.scrollbar').remove();
        },
        showCourse : function () {

            var me = this;
            var data;

            me.switchHeader(true);

            me.currentIndex ++;
            data = me.data[me.currentIndex];

            me.$el.find('.desc').html(data.desc);
            me.clearContent();

            me.$el.append(me.bodyTemplate({
                'guide_content' : data.guide_content
            }));

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
        },
        bindEvent : function () {

            var me = this;
            me.$el.find('.slider li .next').one('click', function () {
                me.showNext();
            });

            me.$el.find('.slider li .download').one('click', function () {
                showNextView(feedbackView);
            });

            me.$el.find('.left-arrow').on('mouseenter', function () {
                $(this).addClass('left-arrow-hover');
            }).on('mouseleave', function () {
                $(this).removeClass('left-arrow-hover');
                $(this).removeClass('left-arrow-press');
            }).on('mousedown', function () {
                $(this).addClass('left-arrow-press');
            }).on('mouseup', function () {
                $(this).removeClass('left-arrow-press');
            }).on('click', function () {
                me.goLeft();
            });

            me.$el.find('.right-arrow').on('mouseenter', function () {
                $(this).addClass('right-arrow-hover');
            }).on('mouseleave', function () {
                $(this).removeClass('right-arrow-hover');
                $(this).removeClass('right-arrow-press');
            }).on('mousedown', function () {
                $(this).addClass('right-arrow-press');
            }).on('mouseup', function () {
                $(this).removeClass('right-arrow-press');
            }).on('click', function () {
                me.goRight();
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
        switchHeader : function (isCourse) {

            var returnBtn =  this.$el.find('.return');
            var nextBtn = this.$el.find('.next');
            var mouseTip = this.$el.find('.mouse');

            returnBtn.toggle(!isCourse);
            nextBtn.toggle(isCourse);
            mouseTip.toggle(isCourse);
        },
        showLastPage : function () {
            var me = this;
            me.clearContent();
            me.switchHeader(false);

            me.$el.append(me.lastTemplate({}));

            me.$el.find('.last_page .download').one('click', function () {
                showNextView(feedbackView);
            });

            me.$el.find('.last_page .general').one('click', function () {
                showNextView(selectView);
            });
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
                $(this).removeClass('hover');
                $(this).removeClass('press');
            }).on('mousedown', function () {
                $(this).addClass('press');
            }).on('mouseup', function () {
                $(this).removeClass('press');
            }).on('click', function () {
                showLastView();
            });

            me.$el.find('.feedback').on('click', function () {
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
