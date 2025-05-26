+function ($, window, document) {

    var PLUGIN_NAME = 'inputClear',
        VERSION = '1.0.0',
        DEFAULTS = {
            show: 'always',
            title: 'clear',
            type:'input',
            callback: function ($input) {
                $input.val('');
                $input.focus();
            }
        };

    function Plugin(element, options) {
        this.$input = $(element);
        this.options = options;
        this._init();
    }

    Plugin.prototype = {
        _init: function () {
            var that = this,
                show = this.options.show,
                title = this.options.title,
                type = this.options.type,
                callback = this.options.callback,
                wrap,
                btn,
                display = '';
            wrap = that.$input.parent();
            display = 'style="display:none;"';
            switch (type) {
                case 'dateInput':
                    var $newElement = $('<span class="input_date_clear_span" title="' + title + '" ' + display + '>×</span>');
                    wrap.prepend($newElement);
                    btn = wrap.find('.input_date_clear_span');
                    break;
                default:
                    var $newElement = $('<span class="input_clear_span" title="' + title + '" ' + display + '>×</span>');
                    wrap.prepend($newElement);
                    btn = wrap.find('.input_clear_span');
                    break;
            }

            that.$input.on('input', function () {
                if ($(this).val()) {
                    $(btn).show();
                } else {
                    $(btn).hide();
                }
            });

            $(btn).on('click', function () {
                callback(that.$input);
            });

            var hoverTimer;

            $(wrap).hover(function () {
                // 鼠标移入，清除定时器
                clearTimeout(hoverTimer);
                // 显示元素
                if (that.$input.val()) {
                    $(btn).stop(true, true).fadeIn(150);
                }
            }, function () {
                // 设置延时
                hoverTimer = setTimeout(function () {
                    // 鼠标移出后延时隐藏元素
                    $(btn).stop(true, true).fadeOut(150);
                }, 200); // 延时200毫秒
            });

            $(btn).hover(function () {
                // 鼠标移入元素时，清除定时器
                clearTimeout(hoverTimer);
            }, function () {
                // 鼠标移出元素时设置延时
                hoverTimer = setTimeout(function () {
                    $(btn).stop(true, true).fadeOut(150);
                }, 200); // 延时200毫秒
            });

        },
        _getOriginalStyle: function (element, prop) {
            var parent = element.parentNode,
                computedStyle = getComputedStyle(element),
                display = parent.style.display,
                value;
            parent.style.display = 'none';
            value = computedStyle.getPropertyValue(prop);
            parent.style.display = display;
            return value;
        }
    };

    function fn(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('plugin_' + PLUGIN_NAME);
            var options = $.extend({}, DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('plugin_' + PLUGIN_NAME, (data = new Plugin(this, options)))
            if (typeof option == 'string') data[option]();
        });
    }

    $.fn[PLUGIN_NAME] = fn;
    $.fn[PLUGIN_NAME].Constructor = Plugin;

}(jQuery, window, document);
