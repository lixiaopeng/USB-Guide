(function (window, document) {
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
                allowInstall(obj);
                break;
            case STATE.DOWNLOAD_DRIVER_SUCCESS:
            case STATE.INSTALL_DRIVER:
                installing(obj);
                break;
            case STATE.DOWNLOADING_DRIVER:
                downLoading(obj);
                break;
            case STATE.OFFLINE:
                offLine(obj);
                break;
            case STATE.STORAGE_INSUFFICIENT:
                storageInsufficient(obj);
                break;
            case STATE.ADB_DEBUG_CLOSE:
                usbGuide(obj);
                break;
            case STATE.INSTALL_DRIVER_CANCELED:
                installDriverCanceled(obj);
                break;
            case STATE.DOWNLOAD_DRIVER_FAILED:
                downloadDriverFailed(obj);
                break;
            case STATE.ADB_SERVER_ERROR_OTHER:
                killADB(obj);
                break;
            case STATE.DRIVER_CONFLICT_VMWARE:
                conflictVmware(obj);
                break;
            case STATE.ADB_SERVER_KILL_ERROR:
                killADBError(obj);
                break;
            case STATE.START_CDROM_FAILED:
                startDdromFailed(obj);
                break;
            case STATE.ADB_SERVER_ERROR_WDJ:
            case STATE.PHONE_POWEROFF:
            case STATE.RECOVER:
                connectingError(obj);
                break;
            case STATE.INSTALL_DRIVER_UAC_CANCEL:
                uacCanceled(obj);
                break;
            case STATE.PUBLISHER_NOT_TRUSTED:
                publisherNotTrusted(obj);
                break;
            case STATE.DRIVERSIGN_VERIFY_FAILED:
                driversignVerifyFailed(obj);
                break;
            default:
                if (obj.state >= 0) {
                    connectingStart(obj);
                } else {
                    connectingError(obj);
                }
            };
            animation();
        };

        var connectingStart = function (data) {
            show('connecting-start');
            if (data.screen_name !== undefined && data.screen_name !== "") {
                $(".g-tips.h5").html(FormatString(lang.CONNECTION_START, data.screen_name));
            } else if (data.screen_name !== undefined && data.brand_name !== "") {
                $(".g-tips.h5").html(FormatString(lang.CONNECTION_START, data.brand_name + "手机"));
            } else {
                $(".g-tips.h5").html(FormatString(lang.CONNECTION_START, "手机"));
            }
        };

        var allowInstall = function (data) {
            show('allow-install');
            $('.allow-install').one('click', function () {
                window.external.call('{"cmd":"retry", "param":""}');
                log({
                    'event' : 'ui.click.allow_install'
                });
            });
        };

        var installing = function (data) {
            show('installing');
        };

        var downLoading = function (data) {
            show('downloading');
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
        };

        var offLine = function (data) {
            show('offline');
            $('.button-retry-offline').on('click', function () {
                window.external.call('{"cmd":"show-rsa-on-device", "param":""}');
                log({
                    'event' : 'ui.click.retry_debug'
                });
            });

            $('.button-fallback-tip').on('click', function () {
                connectingError();
                log({
                    'event' : 'ui.click.fallback_tip'
                });
            });
        };

        var storageInsufficient = function (data) {
            show('storage_insufficient');
            $('.button-retry-storage-insufficient').one('click', function () {
                window.external.call('{"cmd":"retry", "param":""}');
                log({
                    'event' : 'ui.click.storage_insufficient'
                });
            });
        };

        var usbGuide = function (data) {
            show('usb-guide');
            var src = 'http://conn.wandoujia.com/usb-engine/';

            src += '?device_id=' + encodeURIComponent(data.device_id);
            src += '&product_id=' + data.product_id;
            src += '&user_detail=' + data.user_detail;

            var img = new window.Image();
            $(img).one('load', function () {
                $('#usb-guide-iframe').attr('src', src).show();
            }).one('error', function () {
                usbGuideLocal();
            }).attr('src', "http://conn.wandoujia.com/usb-engine/test.gif?t=" + new Date().valueOf());
        };

        var usbGuideLocal = function (data) {
            show('usb-guide-local');
            $('.cate').click(function () {
                $('.cate').removeClass('selected');
                $(this).addClass('selected');

                $('.img-wrap').removeClass('guide guide-42 guide-41 guide-miui').addClass($(this).data('cate'));
            });
        };

        var installDriverCanceled = function (data) {
            show('install_driver_canceled');
            $('.retry-install-driver').one('click', function () {
                window.external.call('{"cmd":"retry-install-driver", "param":""}');
                log({
                    'event' : 'ui.click.retry-install-driver'
                });
            });
        };

        var downloadDriverFailed = function (data) {
            show('download_driver_failed');
            $('.retry-download-driver').one('click', function () {
                window.external.call('{"cmd":"retry-download-driver", "param":""}');
                log({
                    'event' : 'ui.click.retry-download-driver'
                });
            });
        };

        var killADB = function (data) {
            show('kill-adb');
            $(".g-tips.h5").html(FormatString(lang.USER_KILL_ADB, data.adb_process_name));

            $('.kill-adb').one('click', function () {
                window.external.call('{"cmd":"kill-adb", "param":""}');
                log({
                    'event' : 'ui.click.kill-adb'
                });
            });
        };

        var conflictVmware = function (data) {
             show('conflict_vmware');
             $('.button-show-detail').one('click', function () {
                log({
                    'event' : 'ui.click.show-detail'
                });
            });
        };

        var connectingError = function (data) {
            show('connecting-error');
        };

        var killADBError = function (data) {
            show('kill-adb-error');
            $(".g-tips.h5").html(FormatString(lang.USER_KILL_ADB_ERROR, data.adb_process_name));

            $('.retry-kill-adb').one('click', function () {
                window.external.call('{"cmd":"retry", "param":""}');
                log({
                    'event' : 'ui.click.retry-kill-adb'
                });
            });
        };

        var startDdromFailed = function (data) {
            show('start_cdrom_failed');

            var $btnQQ = $('.button-qq');
            var $noSolution = $('.button-no-solution');

            $.ajax('http://conn-cdrom.wandoujia.com/request', {
                data : {
                    device_id : encodeURIComponent(data.device_id)
                },
                dataType: "jsonp",
                success : function (resp) {
                    if (resp.ret > 0) {
                        $btnQQ.show();
                    } else {
                        $noSolution.show();
                    }
                }
            });

            $noSolution.one('click', function () {
                connectingError();
            });
        };

        var uacCanceled = function (data) {
            show('uac_canceled');
            $(".click_uac").one('click', function () {
                window.external.call('{"cmd":"retry", "param":""}');
            });
        };

        var publisherNotTrusted = function (data) {
            show('publisher-not-trusted');
            $(".retry-trust").one('click', function () {
                window.external.call('{"cmd":"retry", "param":""}');
            });
        };

        var driversignVerifyFailed = function (data) {
            show('installing-credit');
            $(".retry-credit").one('click', function () {
                window.external.call('{"cmd":"retry", "param":""}');
            });
        };

        window.external.call('ready');
    });
}(this, this.document));
