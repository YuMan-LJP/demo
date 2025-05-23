+function ($, window, document) {
    var PLUGIN_NAME = 'select2FloatLabel',
        VERSION = '1.0.0',
        DEFAULTS = {
        };

    function Plugin(element, options) {
        this.$select2 = $(element);
        this.options = options;
        this._init();
    }

    Plugin.prototype = {
        _init: function () {
            var that = this;
            that._select2FloatLabel(that.$select2);
        },
        _select2FloatLabel: function (element) {
        $(element).on('change', function () {
            // 获取当前选中的值
            var selectedValue = $(this).val();
            var parentElement = $(element).parent();
            var selection = parentElement.find(".select2-selection--single");
            if (selectedValue) {
                if (selection.find(".select2-selection__placeholder_float").length > 0)
                    return;
                var titleValue = selection.attr('title');
                selection.append('<span class="select2-selection__placeholder_float" title="' + titleValue + '">' + titleValue + '</span>');
            } else {
                if (selection.find(".select2-selection__placeholder_float").length > 0) {
                    selection.find(".select2-selection__placeholder_float").remove();
                }
            }
        });
    }
    };

    function fn(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('plugin_' + PLUGIN_NAME);
            var options = $.extend({}, DEFAULTS, $this.data(), typeof option == 'object' && option);

            if (!data) $this.data('plugin_' + PLUGIN_NAME, (data = new Plugin(this, options)));
            //if (typeof option == 'string') data[option]();
        });
    }

    $.fn[PLUGIN_NAME] = fn;
    $.fn[PLUGIN_NAME].Constructor = Plugin;

}(jQuery, window, document);

function select2FloatLabelClear(element) {
    var selectedValue = $(element).val();
    var parentElement = $(element).parent();
    var selection = parentElement.find(".select2-selection--single");
    if (!selectedValue) {
        if (selection.find(".select2-selection__placeholder_float").length > 0) {
            selection.find(".select2-selection__placeholder_float").remove();
        }
    }
}
