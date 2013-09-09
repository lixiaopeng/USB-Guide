require.config({
    paths : {
        $ : '../components/jquery/jquery',
        i18n : '../components/requirejs-i18n/i18n',
        _ : '../components/lodash/dist/lodash.underscore'
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
    '_'
], function (
    lang,
    $,
    _
) {
    window.i18n = lang;

    window.show = function (id) {
        var tpl = _.template($('#' + id).html());
        var $dom = $(tpl({}));
        $('.g-stage').append($dom);

        if ($('.g-ctn').length > 1) {
            $('.g-ctn:not(:last)').animate({
                'margin-left' : '-100%',
                'opacity' : '0'
            }, 1500, 'linear', function () {
                $('.g-ctn:not(:last)').remove();
            });
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

    $(function () {
        animation();
    });
});
