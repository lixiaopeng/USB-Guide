require.config({
    paths : {
        $ : '../components/jquery/jquery',
        i18n : '../components/requirejs-i18n/i18n',
        _ : '../components/underscore/underscore'
    },
    shim: {
        $ : {
            exports : "$"
        },
        _ : {
            exports : '_'
        }
    }
});

(function (window, document) {
    require([
        "i18n!nls/lang",
        "$",
        "_",
        "STATE",
        "FormatString"
    ], function (
        lang,
        $,
        _,
        STATE,
        FormatString
    ) {
        window.i18n = lang;

        var show = function (id, data) {
            if ($('div#' + id).length === 0) {
                var tpl = _.template($('#' + id).html());
                var $dom = $(tpl({}));
                $('.g-stage').append($dom.attr('id', id));

                if ($('.g-ctn').length > 1) {
                    $('.g-ctn:not(:last)').animate({
                        'margin-left' : '-100%',
                        'opacity' : '0'
                    }, 500, 'linear', function () {
                        $('.g-ctn:not(:last)').remove();
                    });
                }
            }
            if (id === 'usb-guide') {
                var src = 'http://conn.wandoujia.com/usb-engine/';
 
                src += '?device_id=' + encodeURIComponent(data.device_id);
                src += '&product_id=' + data.product_id;

                $('#usb-guide-iframe').attr('src', src);
            }
            if (id === "connecting-start") {
                if (data.screen_name !== undefined && data.screen_name !== "") {
                    $(".g-tips.h5").html(FormatString(lang.CONNECTION_START, data.screen_name));
                } else if (data.screen_name !== undefined && data.brand_name !== "") {
                    $(".g-tips.h5").html(FormatString(lang.CONNECTION_START, data.brand_name + "手机"));
                } else {
                    $(".g-tips.h5").html(FormatString(lang.CONNECTION_START, "手机"));
                }
            }
            if (id === "downloading") {
                var progress = data.progress + "%";
                $(".g-progress .inner").width(progress);
                $(".g-tips.h5").html(FormatString(lang.DOWNLOADING_TIP));

                var speedKbps = (data.speed / 1024).toFixed(2);
                var speedMbps = (speedKbps / 1024).toFixed(2);
                if (speedMbps >= 1) {
                    $(".g-tips.h6").html(FormatString(lang.SPEED_TIP, data.progress, speedMbps + " MB"));
                } else {
                    $(".g-tips.h6").html(FormatString(lang.SPEED_TIP, data.progress, speedKbps + " KB"));
                }
            }

            if (id === 'kill-adb') {
                $(".g-tips.h5").html(FormatString(lang.USER_KILL_ADB, data.adb_process_name));
            }

            if (id === 'kill-adb-error') {
                $(".g-tips.h5").html(FormatString(lang.USER_KILL_ADB_ERROR, data.adb_process_name));
            }

            if (id === 'usb-guide-local') {
                $('.cate').click(function () {
                    $('.cate').removeClass('selected');
                    $(this).addClass('selected');

                    $('.img-wrap').removeClass('guide guide-42 guide-41 guide-miui').addClass($(this).data('cate'));
                });
            }

            if (window.DD_belatedPNG) {
                $('.bg').each(function () {
                    window.DD_belatedPNG.fixPng(this);
                });
            }
        };
        window.show = show;

        var log = function (data) {
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
        window.log = log;

        var add = function (templateId, data) {
            var tpl = _.template($('#' + templateId));
            var $dom = $(tpl(data));
            $('body').append($dom);
        };

        var animation = function () {
            $('.g-progress-running').animate({
                'background-position-x' : '59px'
            }, 500, 'linear', function () {
                $(this).css({
                    'background-position-x' : '0'
                });
                animation();
            });
        };

        window.call = function (obj) {
            switch (obj.state) {
            case STATE.APK_INSTALL_CANCELED_BY_USER:
                show('allow-install', obj);
                break;
            case STATE.INSTALL_DRIVER:
                show('installing', obj);
                break;
            case STATE.DOWNLOADING_DRIVER:
                show('downloading', obj);
                break;
            case STATE.OFFLINE:
                show('offline', obj);
                break;
            case STATE.STORAGE_INSUFFICIENT:
                show('storage_insufficient', obj);
                break;
            case STATE.ADB_DEBUG_CLOSE:
                show('usb-guide', obj);
                break;
            case STATE.INSTALL_DRIVER_CANCELED:
                show('install_driver_canceled', obj);
                break;
            case STATE.DOWNLOAD_DRIVER_FAILED:
                show('download_driver_failed', obj);
                break;
            case STATE.ADB_SERVER_ERROR_OTHER:
                show('kill-adb', obj);
                break;
            case STATE.DRIVER_CONFLICT_VMWARE:
                show('conflict_vmware', obj);
                break;
            case STATE.PHONE_POWEROFF:
            case STATE.RECOVER:
                show('connecting-error', obj);
                break;
            case STATE.USB_GUIDE_LOCAL:
                show('usb-guide-local', obj);
                break;
            case STATE.ADB_SERVER_KILL_ERROR:
                show('kill-adb-error', obj);
                break;
            default:
                if (obj.state >= 0) {
                    show('connecting-start', obj);
                } else {
                    show('connecting-error', obj);
                }
            }
            animation();
        };

        $(document).on('click', '#fallback_tip', function () {
            show('connecting-error', {});
            log({
                //手机上没有这个提示，试试别的办法
                'event' : 'fallback_tip'
            });
        });

        $(document).on('click', '.retry-kill-adb', function () {
            window.external.call('{"cmd":"retry", "param":""}');
            log({
                //重试杀程序
                'event' : 'retry-kill-adb'
            });
        });

        $(document).on('click', '.retry-install-driver', function () {
            window.external.call('{"cmd":"retry-install-driver", "param":""}');
            log({
                //重新安装驱动
                'event' : 'retry-install-driver'
            });
        });

        $(document).on('click', '.retry-download-driver', function () {
            window.external.call('{"cmd":"retry-download-driver", "param":""}');
            log({
                //重新下载驱动
                'event' : 'retry-download-driver'
            });
        });

        $(document).on('click', '.button-retry-storage-insufficient', function () {
            window.external.call('{"cmd":"retry", "param":""}');
            log({
                //手机空间不足
                'event' : 'storage_insufficient'
            });
        });

        $(document).on('click', '.button-show-detail', function () {
            log({
                //查看详细错误信息
                'event' : 'show-detail'
            });
        });

        $(document).on('click', '.kill-adb', function () {
            window.external.call('{"cmd":"kill-adb", "param":""}');
            log({
                //关闭程序
                'event' : 'kill-adb'
            });
        });

        /*
        $(document).on('click', '.reboot', function () {
            window.external.call('{"cmd":"reboot", "param":""}');
            log({
                //重启电脑
                'event' : 'reboot'
            });
        });*/

        $(document).on('click', '.reboot-wdj', function () {
            window.external.call('{"cmd":"reboot-wdj", "param":""}');
            log({
                //重启豌豆荚
                'event' : 'reboot-wdj'
            });
        });

        $(document).on('click', '.button-no-solution', function () {
            log({
                //就是连不上
                'event' : 'no-solution'
            });
        });

        $(document).on('click', '.allow_install', function () {
            window.external.call('{"cmd":"retry", "param":""}');
            log({
                //就是连不上
                'event' : 'allow_install'
            });
        });





        $(function () {
            window.external.call('ready');
        });
    });
}(this, this.document));
