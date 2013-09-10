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

    var show = function (id, data) {
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
            show('adbdebug_close', obj);
            break;
        default:
            if (obj.state >= 0) {
                show('connection-start', obj);
            } else {
                show('connection-error', obj);
            }
        }

        animation();
    };

    $(function () {
        window.external.call('ready');
    });
});
