require.config({
    paths : {
        $ : '../components/jquery/jquery',
        i18n : '../components/requirejs-i18n/i18n',
        _ : '../components/underscore/underscore'
    },
    shim: {
        $ : {
            exports : '$'
        },
        _ : {
            exports : '_'
        }
    }
});

require([
    'i18n!nls/lang',
    '$',
    '_',
    'STATE',
    'FormatString'
], function (
    lang,
    $,
    _,
    STATE,
    FormatString
) {
    window.i18n = lang;

    window.show = function (id, data) {
        if ($('div#' + id).length === 0) {
            var tpl = _.template($('#' + id).html());
            var $dom = $(tpl({}));
            $('.g-stage').append($dom.attr('id', id));

            if ($('.g-ctn').length > 1) {
                $('.g-ctn:not(:last)').animate({
                    'margin-left' : '-100%',
                    'opacity' : '0'
                }, 1500, 'linear', function () {
                    $('.g-ctn:not(:last)').remove();
                });
            }
        }
        if (id == "connecting-start") {
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
        if (id === "installing") {
            // TODO
        }
        if (id === "offline") {
            // TODO
        }
        if (id === "storage_insufficient") {
            // TODO
        }
        if (id === "adbdebug_close") {
            // TODO
        }
        if (id === "connecting-error") {
            // TODO
        }
        if (id === "apk_install_cancel_by_user") {
            // TODO
        }
    };

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
            show('apk_install_cancel_by_user', obj);
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
        default:
            if (obj.state >= 0) {
                show('connecting-start', obj);
            } else {
                show('connecting-error', obj);
            }
        }
        animation();
    };

    $(document).on("click", "#fallback_tip",function(){
        show('connecting-error', {});
    })

    $(document).on("click", "#retry-btn", function(){
        window.external.call('{"cmd":"retry", "param":""}');
    })

    $(function () {
        window.external.call('ready');
    });
});
