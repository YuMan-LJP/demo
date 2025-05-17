var yuman = yuman || {};
(function () {
    if (!$.blockUI) {
        return;
    }

    $.extend($.blockUI.defaults, {
        message: ' ',
        css: {},
        overlayCSS: {
            backgroundColor: '#AAA',
            opacity: 0.3,
            cursor: 'wait'
        }
    });

    yuman.ui = yuman.ui || {};
    yuman.ui.block = function (elm) {
        if (!elm) {
            $.blockUI();
        } else {
            $(elm).block();
        }
    };

    yuman.ui.unblock = function (elm) {
        if (!elm) {
            $.unblockUI();
        } else {
            $(elm).unblock();
        }
    };

    if (!$.fn.spin) {
        return;
    }

    yuman.libs = yuman.libs || {};

    yuman.libs.spinjs = {

        spinner_config: {
            position: "fixed",//固定屏幕中央
            lines: 11,
            length: 0,
            width: 10,
            radius: 20,
            corners: 1.0,
            trail: 60,
            speed: 1.2
        },
    };

    yuman.ui.setBusy = function (elm, optionsOrPromise) {
        optionsOrPromise = optionsOrPromise || {};
        if (optionsOrPromise.always || optionsOrPromise['finally']) { //Check if it's promise
            optionsOrPromise = {
                promise: optionsOrPromise
            };
        }

        var options = $.extend({}, optionsOrPromise);

        if (!elm) {
            if (options.blockUI != false) {
                yuman.ui.block();
            }

            $('body').spin(yuman.libs.spinjs.spinner_config);
        } else {
            var $elm = $(elm);
            if (options.blockUI != false) {
                yuman.ui.block(elm);
            }
            $elm.spin(yuman.libs.spinjs.spinner_config);
        }

        if (options.promise) { //Supports Q and jQuery.Deferred
            if (options.promise.always) {
                options.promise.always(function () {
                    yuman.ui.clearBusy(elm);
                });
            } else if (options.promise['finally']) {
                options.promise['finally'](function () {
                    yuman.ui.clearBusy(elm);
                });
            }
        }
    };

    yuman.ui.clearBusy = function (elm) {
        if (!elm) {
            yuman.ui.unblock();
            $('body').spin(false);
        } else {
            var $elm = $(elm);
            yuman.ui.unblock(elm);
            $elm.spin(false);
        }
    };
})();