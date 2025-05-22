var yuman = yuman || {}
yuman.vueui = yuman.vueui || {}
yuman.vueui.components = yuman.vueui.components || {}

yuman.vueui.guid = function guid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

yuman.vueui.pageSizes = [5, 10, 25, 50]


Vue.directive('enterInteger', {
    inserted: function (el) {
        el.addEventListener("keypress", function (e) {
            e = e || window.event;
            let charcode = typeof (e.charCode) == 'number' ? e.charCode : e.keyCode;
            let re = /\d/;
            if (!re.test(String.fromCharCode(charcode)) && charcode > 9 && !e.ctrlKey) {
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                }
            }
        }
        );
    }
});

Vue.directive('enterFloat', {
    inserted: function (el) {
        el.addEventListener("keypress", function (e) {
            e = e || window.event;
            let charcode = typeof e.charCode == 'number' ? e.charCode : e.keyCode;
            let re = /\d/;
            if (charcode == 46) {
                if (el.value.includes('.')) {
                    e.preventDefault();
                }
                return;
            } else if (!re.test(String.fromCharCode(charcode)) && charcode > 9 && !e.ctrlKey) {
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                }
            }
        });
    }
});

// 定义名为 yuman-search-input 的新组件
var yumanSearchInput = Vue.component('yuman-ser-input', {
    props: {
        value: {
            type: Object,
        },
        name: {
            type: String,
            required: true
        },
        label: {
            type: String,
            required: false
        },
        title: { type: String, },
        length: {
            type: Number,
            default: 100
        },
        disabled: {
            type: Object,
        },
        visiabled: {
            type: Object,
            default: true
        },
        placeholder: {
            type: String,
            default: ""
        },
        fied: {
            type: String,
        },
        type: {
            type: String
        },
        keyUpEnter: {
            type: Function,
            default: undefined
        }
    },
    methods: {
        onfocus: function () {
            var $ell = $(this.$el).find("input[name=" + this.name + "]");
            $ell.focus();
        },
        getDisabled: function () {
            var obj = this.disabled;
            if (obj) {
                if (typeof obj == "function") {
                    return this.disabled();
                }
                return this.disabled;
            }
        }, getVisiabled: function () {
            var obj = this.visiabled;
            if (obj) {
                if (typeof obj == "function") {
                    return this.visiabled();
                }
                return this.visiabled;
            }
        }
        , getStyle: function () {
            var style = {};

            if (this.length) {
                style.width = this.length + "px";
            }

            return style;
        },
        clickEnter: function () {
            if (this.keyUpEnter) {
                this.keyUpEnter()
            }
        }
    },
    created: function () {
        // `this` 指向 vm 实例
    },
    mounted: function () {
        if (this.placeholder === "")
            this.placeholder = this.title
    },
    template: `
    <div class="form-group" v-if="getVisiabled()">
        <label v-if="label != null">{{label}}</label>
        <input :name="name" class="form-control input_borderradius" :placeholder="placeholder" :style="getStyle()"  :maxLength="length" :disabled="getDisabled()"
        :value="value.value" v-model.trim="value.value" :title="title" autocomplete="off" v-on:keyup.enter="clickEnter"/>
    </div>
    `
})

var yumanSearchInputFloatLabel = Vue.component('yuman-ser-input-float-label', {
    props: {
        value: {
            type: Object,
        },
        name: {
            type: String,
            required: true
        },
        label: {
            type: String,
            required: false
        },
        title: { type: String, },
        length: {
            type: Number,
            default: 100
        },
        disabled: {
            type: Object,
        },
        visiabled: {
            type: Object,
            default: true
        },
        placeholder: {
            type: String,
            default: ""
        },
        fied: {
            type: String,
        },
        type: {
            type: String
        },
        keyUpEnter: {
            type: Function,
            default: undefined
        },
        inputClear:
        {
            type: Object,
            default: function ()
            {
                return { 'title': L("Clear"), 'type': 'input', 'show': true }
            }
        }
    },
    methods: {
        onfocus: function () {
            var $ell = $(this.$el).find("input[name=" + this.name + "]");
            $ell.focus();
        },
        getDisabled: function () {
            var obj = this.disabled;
            if (obj) {
                if (typeof obj == "function") {
                    return this.disabled();
                }
                return this.disabled;
            }
        }, getVisiabled: function () {
            var obj = this.visiabled;
            if (obj) {
                if (typeof obj == "function") {
                    return this.visiabled();
                }
                return this.visiabled;
            }
        }
        , getStyle: function () {
            var style = {};

            if (this.length) {
                style.width = this.length + "px";
            }

            return style;
        },
        clickEnter: function () {
            if (this.keyUpEnter) {
                this.keyUpEnter()
            }
        }
    },
    created: function () {
        // `this` 指向 vm 实例
    },
    mounted: function () {
        if (this.placeholder === "")
            this.placeholder = this.title;
        var self = this;
        if (this.inputClear && this.inputClear.show) {
            var $ell = $(this.$el).find("input[name=" + this.name + "]");
            $ell.inputClear({
                title: this.inputClear.title,
                type: this.inputClear.type,
                callback: function ($input) {
                    self.value.value = '';
                }
            });
        }
    },
    template: `
    <div class="form-group" v-if="getVisiabled()">
        <label v-if="label != null">{{label}}</label>
        <label class="has-float-label">
        <input :name="name" class="form-control input_borderradius" :placeholder="placeholder" :style="getStyle()"  :maxLength="length" :disabled="getDisabled()"
        :value="value.value" v-model.trim="value.value" :title="title" autocomplete="off" v-on:keyup.enter="clickEnter"/>
        <span :title="title">{{title}}</span>
        </label>
    </div>
    `
})

// 定义名为 yuman-search-text 的新组件
var yumanSearchText = Vue.component('yuman-ser-text', {
    props: {
        value: {
            type: Object,
        },
        name: {
            type: String,
            required: true
        },
        title: { type: String, },
        label: {
            type: String,
            required: false
        },
        length: {
            type: Number,
            default: 2000
        },
        disabled: {
            type: Object,
            default: false
        }, visiabled: {
            type: Object,
            default: true
        },
        mstyle: {
            type: Object,
            default: function () {
                return { 'width': '140px', 'height': '100%', 'resize': 'none', 'border-radius': '4px' }
            }
        }, rows: {
            type: Number,
            default: function () { return 3; }
        }, cols: {
            type: Number,
            default: function () { return 3; }
        },
        placeholder: {
            type: String,
            default: "",
        },
        formatterable: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        onfocus: function () {
            var $ell = $(this.$el).find("textarea[name=" + this.name + "]");
            $ell.focus();
        }
        , getDisabled: function () {
            var obj = this.disabled;
            if (obj) {
                if (typeof obj == "function") {
                    return this.disabled(this);
                }
                return this.disabled;
            }
        }, getVisiabled: function () {
            var obj = this.visiabled;
            if (obj) {
                if (typeof obj == "function") {
                    return this.visiabled(this);
                }
                return this.visiabled;
            }
        },
        textChange: function () {
            this.$emit('change', this.value.value)
        },
        showFormatMenu: function (e) {
            if (!this.formatterable) return
            e.preventDefault();

            var context = document.getElementById(this.name)
            context.style.display = "block"
            const x = e.offsetX
            const y = e.offsetY
            context.style.left = x + "px"
            context.style.top = y + "px"
            document.body.addEventListener("click", this.closeFormatMenu)
            return false
        },
        closeFormatMenu: function () {
            var contextmenu = document.getElementById(this.name)
            document.body.removeEventListener("click", this.closeFormatMenu)
            if (contextmenu) contextmenu.style.display = "none"
        },
        formatContext: function () {
            this.value.value = this.value.value.replace(/[^0-9A-Za-z\_\-\n\r]/g, "")
        },
        substr13: function () {
            this.formatContext()
            var textList = this.value.value.split('\n')
            var resultList = textList.map(text => text.slice(0, 13))
            this.value.value = resultList.join('\n')
        },
        substr18: function () {
            this.formatContext()
            var textList = this.value.value.split('\n')
            var resultList = textList.map(text => text.slice(0, 18))
            this.value.value = resultList.join('\n')
        }
    },
    created: function () {
        // `this` 指向 vm 实例

    },
    mounted: function () {
        const self = this
        if (this.placeholder === "")
            this.placeholder = this.title
        if (this.formatterable)
            document.getElementsByClassName(this.name)[0].addEventListener("contextmenu", e => this.showFormatMenu(e))

    },
    template: `<div class="form-group"  v-if="getVisiabled()"  style="position:relative;margin-right:0px;">
    <label v-if="label != null">{{label}}</label>
        <div style="position:absolute;width:130px;" class="formatMenu" :id="name">
            <ul class="">
                <li v-on:click="formatContext">
                    {{L("textareaFormat")}}
                </li>
                <li v-on:click="substr13">
                    {{L("Substr13")}}
                </li>
                <li v-on:click="substr18">
                    {{L("Substr18")}}
                </li>
            </ul>
        </div>
        <textarea :name="name" class="form-control input_borderradius" :class="name" :placeholder="placeholder"  :disabled="getDisabled()"
        :rows="rows" :cols="cols" :style="mstyle"
        v-model.trim="value.value" :onChange="textChange()" :title="title">{{value.value}}</textarea>
        </div>
        `
})

var yumanSearchTextFloatLabel = Vue.component('yuman-ser-text-float-label', {
    props: {
        value: {
            type: Object,
        },
        name: {
            type: String,
            required: true
        },
        title: { type: String, },
        label: {
            type: String,
            required: false
        },
        length: {
            type: Number,
            default: 2000
        },
        disabled: {
            type: Object,
            default: false
        }, visiabled: {
            type: Object,
            default: true
        },
        mstyle: {
            type: Object,
            default: function () {
                return { 'width': '140px', 'height': '100%', 'resize': 'none', 'border-radius': '4px' }
            }
        }, rows: {
            type: Number,
            default: function () { return 3; }
        }, cols: {
            type: Number,
            default: function () { return 3; }
        },
        placeholder: {
            type: String,
            default: "",
        },
        formatterable: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        onfocus: function () {
            var $ell = $(this.$el).find("textarea[name=" + this.name + "]");
            $ell.focus();
        }
        , getDisabled: function () {
            var obj = this.disabled;
            if (obj) {
                if (typeof obj == "function") {
                    return this.disabled(this);
                }
                return this.disabled;
            }
        }, getVisiabled: function () {
            var obj = this.visiabled;
            if (obj) {
                if (typeof obj == "function") {
                    return this.visiabled(this);
                }
                return this.visiabled;
            }
        },
        textChange: function () {
            this.$emit('change', this.value.value)
        },
        showFormatMenu: function (e) {
            if (!this.formatterable) return
            e.preventDefault();

            var context = document.getElementById(this.name)
            context.style.display = "block"
            const x = e.offsetX
            const y = e.offsetY
            context.style.left = x + "px"
            context.style.top = y + "px"
            document.body.addEventListener("click", this.closeFormatMenu)
            return false
        },
        closeFormatMenu: function () {
            var contextmenu = document.getElementById(this.name)
            document.body.removeEventListener("click", this.closeFormatMenu)
            if (contextmenu) contextmenu.style.display = "none"
        },
        formatContext: function () {
            this.value.value = this.value.value.replace(/[^0-9A-Za-z\_\-\n\r]/g, "")
        },
        substr13: function () {
            this.formatContext()
            var textList = this.value.value.split('\n')
            var resultList = textList.map(text => text.slice(0, 13))
            this.value.value = resultList.join('\n')
        },
        substr18: function () {
            this.formatContext()
            var textList = this.value.value.split('\n')
            var resultList = textList.map(text => text.slice(0, 18))
            this.value.value = resultList.join('\n')
        }
    },
    created: function () {
        // `this` 指向 vm 实例

    },
    mounted: function () {
        const self = this
        if (this.placeholder === "")
            this.placeholder = this.title
        if (this.formatterable)
            document.getElementsByClassName(this.name)[0].addEventListener("contextmenu", e => this.showFormatMenu(e))

    },
    template: `<div class="form-group"  v-if="getVisiabled()"  style="position:relative;margin-right:0px;">
    <label v-if="label != null">{{label}}</label>
        <div style="position:absolute;width:130px;" class="formatMenu" :id="name">
            <ul class="">
                <li v-on:click="formatContext">
                    {{L("textareaFormat")}}
                </li>
                <li v-on:click="substr13">
                    {{L("Substr13")}}
                </li>
                <li v-on:click="substr18">
                    {{L("Substr18")}}
                </li>
            </ul>
        </div>
   <label class="has-float-label">
        <textarea :name="name" class="form-control input_borderradius" :class="name" :placeholder="placeholder"  :disabled="getDisabled()"
        :rows="rows" :cols="cols" :style="mstyle"
        v-model.trim="value.value" :onChange="textChange()" :title="title">{{value.value}}</textarea>
       <span :title="title">{{title}}</span>
   </label>
        </div>
        `
})

// 定义名为 yuman-search-radios 的新组件
var yumanSearchRadio = Vue.component('yuman-ser-radio', {
    props: {
        value: {
            type: Object,
        },
        name: {
            type: String,
            required: true
        },
        css: {
            type: String,
        },
        items: {
            type: Array,
            default: []
        },
        title: { type: String, },
        label: {
            type: String,
            required: false
        }, direct: {
            type: String,
            default: 'horizontal' //horizontal,vertical
        },
        disabled: {
            type: Object,
            default: false
        }, getVisiabled: {
            type: Object,
            default: true
        }
    },
    watch: {


    },
    methods: {
        getDisabled: function () {
            var obj = this.disabled;
            if (obj) {
                if (typeof obj == "function") {
                    return this.disabled();
                }
                return this.disabled;
            }
        },
        getVisiabled: function () {
            var obj = this.visiabled;
            if (obj) {
                if (typeof obj == "function") {
                    return this.visiabled();
                }
                return this.visiabled;
            }
        }

    },
    created: function () {
    },
    template: `
    <template v-if="direct == 'horizontal'">
        <div class="btn-group input_borderradius"  :title="title">
        <label v-if="label != null"  class="btn">{{label}}</label>
        <template v-for="(item, index) in items">
            <label class="btn btn-default btn-sm">
                <input   type="radio" class="radio_input" :class="css" :value="item.id" :name="name" :checked="item.id == value.value"
                v-model="value.value" :disabled="getDisabled()"   />{{item.text}}
            </label>
        </template>
    </div>
    </template>
    <template v-else >
    <div class="form-group btn-group input_borderradius"  :title="title">
        <template v-for="(item, index) in items">
        <div class="form-check">
            <label class="btn btn-default btn-sm">
            <input   type="radio" class="radio_input" :class="css" :value="item.id" :name="name" :checked="item.id == value.value" v-model="value.value" :disabled="getDisabled()" />
            {{item.text}}
            </label>
        </div>
        </template>
    </div>
    </template>
        `
})


// 定义名为 yuman-select2 的新组件
var yumanSearchSelect2 = Vue.component('yuman-ser-select2', {
    // model: {
    //     prop: 'checked',
    //     event: 'change'
    //   },
    props: {
        value: {
            type: Object,
            default: {
                value: Object
            }
        },
        name: {
            type: String,
            required: true
        },
        tags: {
            type: Boolean,
            default: false
        },
        allowClear: {
            type: Boolean,
            default: true
        },
        multiple: {
            type: Boolean,
            default: false
        },
        datas: {
            type: Array,
            default: []
        },
        title: {
            type: String,
            required: true
        },
        label: {
            type: String,
            required: true
        },
        length: {
            type: Number,
            default: 120
        },
        disabled: {
            type: Object,
            default: false
        }, visiabled: {
            type: Object,
            default: true
        },
        placeholder: {
            type: String,
            default: "",
        },
        dropdownParent: {
            type: String,
            default: ''
        },
        fied: {
            type: String,
        },
        type: {
            type: String
        },
        isHtmlText: {
            type: Boolean,
            default: false
        },
    },
    methods: {
        onfocus: function () {
            var $ell = $(this.$el).find("select[name=" + this.name + "]");
            $ell.focus();
        },
        selected: function (val) {
            $(this.$el).find("select[name=" + this.name + "]").val(val).trigger("change");
        },
        init: function () {

            var self = this;
            var $selct = $(self.$el).find("select[name=" + self.name + "]");
            $selct.empty();

            var dds = self.datas.map(s => {
                var a = { id: s.id, text: s.text, disabled: s.disabled, selected: s.selected };
                if (s.id == self.value.value) {
                    a.selected = true;
                }
                return a;
            });

            if (this.dropdownParent != '') {
                var dt = {
                    allowClear: self.allowClear, data: dds, multiple: self.multiple, placeholder: self.title, dropdownAutoWidth: true, width: self.length, tags: self.tags, dropdownParent: this.dropdownParent
                };
            }
            else
                var dt = {
                    allowClear: self.allowClear, data: dds, multiple: self.multiple, placeholder: self.title, dropdownAutoWidth: true, width: self.length, tags: self.tags
                };
            if (this.isHtmlText) {
                dt.templateResult = function (state) {//选择时
                    if (!state.id) { return state.text }
                    var $state = $(state.text);
                    self.$emit('change', $state)
                    return $state;
                }
                dt.templateSelection = function (state) {//选择后
                    if (!state.id) { return state.text }

                    var $state = $(state.text);
                    self.$emit('change', $state)
                    return $state;
                }
            }
            $selct.select2(dt);
            $('.select2-selection__rendered').hover(function () {
                $(this).removeAttr('title');
            });
        },
        clearInput: function () {
            if (this.value.value !== '') {
                this.value.value = '';
                this.init()
            }
        }
        , getDisabled: function () {

            var obj = this.disabled;
            if (obj) {
                if (typeof obj == "function") {
                    return this.disabled();
                }
                return this.disabled;
            }
        }, getVisiabled: function () {
            var obj = this.visiabled;
            if (obj) {
                if (typeof obj == "function") {
                    return this.visiabled();
                }
                return this.visiabled;
            }
        }
    },
    created: function () {


    },
    watch: {

        datas: function (value) {
            this.init();
        }
    },
    mounted: function () {
        var self = this;
        var $selct = $(self.$el).find("select[name=" + self.name + "]");
        $selct.on('change', function (e) {
            let val = $selct.val();//val 可能是单选，也可能是数组
            console.log(self.name, 'change', val, self.value.value);
            if (val == self.value.value) return;
            self.value.value = val;
            self.$emit('change', val)
        });
        $selct.on('select2:open', function (e) {
            self.$emit('open', e)
            const evt = "scroll.select2";
            $(e.target).parents().off(evt);
            $(window).off(evt);
        })
        this.$nextTick(function () {
            self.$on('clearSelect', function () {
                self.clearInput()
            })
        })
        this.init();
        if (this.placeholder === "")
            this.placeholder = this.title
    },
    template: `
        <div class="form-group"  v-if="getVisiabled()">
        <label v-if="label != null">{{label}}</label>
        <select class="form-control input_borderradius" :title="title" :placeholder="placeholder" :name="name" :disabled="getDisabled()"></select>
        </div>
    `
})

var yumanSearchSelect2FloatLabel = Vue.component('yuman-ser-select2-float-label', {
    // model: {
    //     prop: 'checked',
    //     event: 'change'
    //   },
    props: {
        value: {
            type: Object,
            default: {
                value: Object
            }
        },
        name: {
            type: String,
            required: true
        },
        tags: {
            type: Boolean,
            default: false
        },
        allowClear: {
            type: Boolean,
            default: true
        },
        multiple: {
            type: Boolean,
            default: false
        },
        datas: {
            type: Array,
            default: []
        },
        title: {
            type: String,
            required: true
        },
        label: {
            type: String,
            required: true
        },
        length: {
            type: Number,
            default: 120
        },
        disabled: {
            type: Object,
            default: false
        }, visiabled: {
            type: Object,
            default: true
        },
        placeholder: {
            type: String,
            default: "",
        },
        dropdownParent: {
            type: String,
            default: ''
        },
        fied: {
            type: String,
        },
        type: {
            type: String
        },
        isHtmlText: {
            type: Boolean,
            default: false
        },
        id: {
            type: String
        }
    },
    methods: {
        onfocus: function () {
            var $ell = $(this.$el).find("select[name=" + this.name + "]");
            $ell.focus();
        },
        selected: function (val) {
            $(this.$el).find("select[name=" + this.name + "]").val(val).trigger("change");
        },
        init: function () {

            var self = this;
            var $selct = $(self.$el).find("select[name=" + self.name + "]");
            $selct.empty();

            var dds = self.datas.map(s => {
                var a = { id: s.id, text: s.text, disabled: s.disabled, selected: s.selected };
                if (s.id == self.value.value) {
                    a.selected = true;
                }
                return a;
            });

            if (this.dropdownParent != '') {
                var dt = {
                    allowClear: self.allowClear, data: dds, multiple: self.multiple, placeholder: self.title, dropdownAutoWidth: true, width: self.length, tags: self.tags, dropdownParent: this.dropdownParent
                };
            }
            else
                var dt = {
                    allowClear: self.allowClear, data: dds, multiple: self.multiple, placeholder: self.title, dropdownAutoWidth: true, width: self.length, tags: self.tags
                };
            if (this.isHtmlText) {
                dt.templateResult = function (state) {//选择时
                    if (!state.id) { return state.text }
                    var $state = $(state.text);
                    self.$emit('change', $state)
                    console.log($state, 1);
                    return $state;
                }
                dt.templateSelection = function (state) {//选择后
                    if (!state.id) { return state.text }

                    var $state = $(state.text);
                    self.$emit('change', $state)
                    console.log($state, 2);
                    return $state;
                }
            }
            $selct.select2(dt);
            $('.select2-selection__rendered').hover(function () {
                $(this).removeAttr('title');
            });
        },
        clearInput: function () {
            if (this.value.value !== '') {
                this.value.value = '';
                this.init()
            }
        }
        , getDisabled: function () {

            var obj = this.disabled;
            if (obj) {
                if (typeof obj == "function") {
                    return this.disabled();
                }
                return this.disabled;
            }
        }, getVisiabled: function () {
            var obj = this.visiabled;
            if (obj) {
                if (typeof obj == "function") {
                    return this.visiabled();
                }
                return this.visiabled;
            }
        }
    },
    created: function () {


    },
    watch: {

        datas: function (value) {
            this.init();
        },
        "value.value": function () {
            var self = this;
            var selection = $(self.$el).find(".select2-selection--single");
            if (this.value.value) {
                if (selection.find(".select2-selection__placeholder_float").length > 0)
                    return;
                selection.append('<span class="select2-selection__placeholder_float" :title=title>' + this.placeholder + '</span>');
            } else
            {
                if (selection.find(".select2-selection__placeholder_float").length > 0)
                {
                    selection.find(".select2-selection__placeholder_float").remove();
                }
            }
        },
    },
    mounted: function () {
        var self = this;
        var $selct = $(self.$el).find("select[name=" + self.name + "]");
        $selct.on('change', function (e) {
            let val = $selct.val();//val 可能是单选，也可能是数组
            console.log(self.name, 'change', val, self.value.value);
            if (val == self.value.value) return;
            self.value.value = val;
            self.$emit('change', val)
        });
        $selct.on('select2:open', function (e) {
            self.$emit('open', e)
            const evt = "scroll.select2";
            $(e.target).parents().off(evt);
            $(window).off(evt);
        })
        this.$nextTick(function () {
            self.$on('clearSelect', function () {
                self.clearInput()
            })
        })
        this.init();
        if (this.placeholder === "")
            this.placeholder = this.title
    },
    template: `
        <div class="form-group"  v-if="getVisiabled()">
        <label v-if="label != null">{{label}}</label>
        <select class="form-control input_borderradius" :title="title" :placeholder="placeholder" :name="name" :disabled="getDisabled()"></select>
        </div>
    `
})


// 定义名为 yuman-dates 的新组件 ，双时间选择器
var yumanSearchDates = Vue.component('yuman-ser-dates', {
    props: {
        value: {
            type: Object,
        },
        name: {
            type: String,
            required: true
        },

        label: {
            type: String,
            required: false
        },
        format: {
            type: String
        },
        fied: {
            type: String,
            required: true
        },
        start: { type: Object },
        end: { type: Object },
        startId: '',
        endId: '',
        visiabled: {
            type: Object,
            default: true
        }
    },
    methods: {
        getVisiabled: function () {
            var obj = this.visiabled;
            if (obj) {
                if (typeof obj == "function") {
                    return this.visiabled();
                }
                return this.visiabled;
            }
        },
        clear: function () {

            var self = this;

            var $eelstart = $(this.$el).find("input[name=start]");
            var $eelend = $(this.$el).find("input[name=end]");
            self.value.start = self.start.text;
            self.value.end = self.end.text;
            var ssetting = { startDate: self.value.start, locale: { format: self.format } };
            var esetting = { startDate: self.value.end, locale: { format: self.format } };
            ssetting.autoUpdateInput = false;


            yuman.vueui.yumanDatePicker($eelstart, ssetting, (ldate, label) => {
                // self.$emit('date-start', ldate)
                self.value.start = ldate.format(self.format);

            });
            yuman.vueui.yumanDatePicker($eelend, esetting, (ldate, label) => {
                //  self.$emit('date-end', ldate)
                self.value.end = ldate.format(self.format);
            });

        }
    },
    created: function () {
        // `this` 指向 vm 实例

    },

    mounted: function () {

        var self = this;
        self.startId = yuman.vueui.guid();
        self.endId = yuman.vueui.guid();

        var $eelstart = $(this.$el).find("input[name=start]");
        var $eelend = $(this.$el).find("input[name=end]");

        var ssetting = { startDate: self.value.start, locale: { format: self.format } };
        var esetting = { startDate: self.value.end, locale: { format: self.format } };

        ssetting.autoUpdateInput = false;

        yuman.vueui.yumanDatePicker($eelstart, ssetting, (ldate, label) => {
            // self.$emit('date-start', ldate)
            self.value.start = ldate.format(self.format);

        });
        yuman.vueui.yumanDatePicker($eelend, esetting, (ldate, label) => {
            //  self.$emit('date-end', ldate)
            self.value.end = ldate.format(self.format);
        });
    },
    beforeDestroy: function () {

    }
    ,
    template: `
    <div class="form-group" v-if="getVisiabled()" style="position:relative;display:inline-flex">
    <label v-if="label != null">{{label}}</label>
    <span class="clearDate" v-on:click="value.start=''" v-if="value.start" :style="label!=null?'left:160px':''">×</span>
        <input   :id="startId"  class="form-control input_borderradius" :placeholder="start.title"  autocomplete="off" style="width:120px"
    name='start' :value="start.text" v-model="value.start" :title="start.title"/>
    <div style="line-height:34px">&nbsp;-&nbsp;</div>
    <span class="clearDate" v-on:click="value.end=''" v-if="value.end" :style="label!=null?'left:290px':'left:235px'">×</span>
    <input  :id="endId"  class="form-control input_borderradius" :placeholder="end.title"  autocomplete="off" style="width:120px"
        name='end' :value="end.text" v-model="value.end" :title="end.title"/>
    </div>
    `
})


var yumanSearchDatesFloatLabel = Vue.component('yuman-ser-dates-float-label', {
    props: {
        value: {
            type: Object,
        },
        name: {
            type: String,
            required: true
        },

        label: {
            type: String,
            required: false
        },
        format: {
            type: String
        },
        fied: {
            type: String,
            required: true
        },
        start: { type: Object },
        end: { type: Object },
        startId: '',
        endId: '',
        visiabled: {
            type: Object,
            default: true
        },
        inputClear:
        {
            type: Object,
            default: function () {
                return { 'title': L("Clear"), 'type': 'dateInput', 'show': true }
            }
        }
    },
    methods: {
        getVisiabled: function () {
            var obj = this.visiabled;
            if (obj) {
                if (typeof obj == "function") {
                    return this.visiabled();
                }
                return this.visiabled;
            }
        },
        clear: function () {

            var self = this;

            var $eelstart = $(this.$el).find("input[name=start]");
            var $eelend = $(this.$el).find("input[name=end]");
            self.value.start = self.start.text;
            self.value.end = self.end.text;
            var ssetting = { startDate: self.value.start, locale: { format: self.format } };
            var esetting = { startDate: self.value.end, locale: { format: self.format } };
            ssetting.autoUpdateInput = false;


            yuman.vueui.yumanDatePicker($eelstart, ssetting, (ldate, label) => {
                // self.$emit('date-start', ldate)
                self.value.start = ldate.format(self.format);

            });
            yuman.vueui.yumanDatePicker($eelend, esetting, (ldate, label) => {
                //  self.$emit('date-end', ldate)
                self.value.end = ldate.format(self.format);
            });

        }
    },
    created: function () {
        // `this` 指向 vm 实例
    },

    mounted: function () {
        var self = this;
        self.startId = yuman.vueui.guid();
        self.endId = yuman.vueui.guid();

        var $eelstart = $(this.$el).find("input[name=start]");
        var $eelend = $(this.$el).find("input[name=end]");

        var ssetting = { startDate: self.value.start, locale: { format: self.format } };
        var esetting = { startDate: self.value.end, locale: { format: self.format } };

        var timepickeroption = {
            singleDatePicker: true, //单日历
            showDropdowns: true,
            autoUpdateInput: false,
            //startDate: enddt.format("yyyy-MM-dd"),
            locale: {
                format: "YYYY-MM-DD",
                separator: " ~ ",
                applyLabel: L("DateRangePicker.Apply"),
                cancelLabel: L("DateRangePicker.Cancel"),
                fromLabel: L("DateRangePicker.StartDate"),
                toLabel: L("DateRangePicker.EndDate"),
                customRangeLabel: L("Custom"),
                daysOfWeek: [L("DateRangePicker.Su"), L("DateRangePicker.Mo"), L("DateRangePicker.Tu"), L("DateRangePicker.We"), L("DateRangePicker.Th"), L("DateRangePicker.Fr"), L("DateRangePicker.Sa")],
                monthNames: [L("DateRangePicker.Jan"), L("DateRangePicker.Feb"), L("DateRangePicker.Mar"), L("DateRangePicker.Apr"), L("DateRangePicker.May"), L("DateRangePicker.Jun"), L("DateRangePicker.Jul"), L("DateRangePicker.Aug"), L("DateRangePicker.Sep"), L("DateRangePicker.Oct"), L("DateRangePicker.Nov"), L("DateRangePicker.Dec")],
            }
        };

        var daterangepickerStartSetting = $.extend(timepickeroption, ssetting);

        $eelstart.daterangepicker(daterangepickerStartSetting).on('apply.daterangepicker', function (ev, picker) {
            self.value.start = picker.startDate.format(self.format);
        });

        var daterangepickerEndSetting = $.extend(timepickeroption, esetting);

        $eelend.daterangepicker(daterangepickerEndSetting).on('apply.daterangepicker', function (ev, picker) {
            self.value.end = picker.startDate.format(self.format);
        });

        if (self.inputClear && self.inputClear.show) {
            $eelstart.inputClear({
                title: self.inputClear.title,
                type: self.inputClear.type,
                callback: function ($input) {
                    self.value.start = '';
                }
            });
            $eelend.inputClear({
                title: self.inputClear.title,
                type: self.inputClear.type,
                callback: function ($input) {
                    self.value.end = '';
                }
            });
        }
    },
    beforeDestroy: function () {

    }
    ,
    template: `
    <div class="form-group" v-if="getVisiabled()" style="position:relative;display:inline-flex">
    <label v-if="label != null">{{label}}</label>
    <label class="has-float-label">
        <input   :id="startId"  class="form-control input_borderradius" :placeholder="start.title"  autocomplete="off" style="width:120px"
    name='start' :value="start.text" v-model="value.start" :title="start.title"/>
    <span :title="start.title">{{start.title}}</span>
    </label>
    <div style="line-height:34px">&nbsp;-&nbsp;</div>
    <label class="has-float-label">
    <input  :id="endId"  class="form-control input_borderradius" :placeholder="end.title"  autocomplete="off" style="width:120px"
        name='end' :value="end.text" v-model="value.end" :title="end.title"/>
    <span :title="end.title">{{end.title}}</span>
    </label>
    </div>
    `
})

// 定义名为 yuman-dates 的新组件 ，双时间选择器
var yumanSearchShortDate = Vue.component('yuman-ser-date', {
    props: {
        title: { type: Object },
        value: {
            type: Object,
        },
        name: {
            type: String,
            required: true
        },
        calendarMode: {
            type: String,
            default: 'day'
        },
        label: {
            type: String,
            required: false
        },
        format: {
            type: String
        },

        visiabled: {
            type: Object,
            default: true
        },
        isAutoInput: {
            type: Boolean,
            default: true,
        }
    },

    methods: {
        getVisiabled: function () {
            var obj = this.visiabled;
            if (obj) {
                if (typeof obj == "function") {
                    return this.visiabled();
                }
                return this.visiabled;
            }
        },
        dateChange: function () {
            this.$emit('change', this.value.value)
        },
        fixDate: function () {
            let date = this.value.value
            // let reg = /^(\d{4})-(\d{2})-(\d{2})$/;
            let reg = /(?!0000)[0-9]{4}-((0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-8])|(0[13-9]|1[0-2])-(29|30)|(0[13578]|1[02])-31)/
            var arr = reg.exec(date);
            if (date == null || date == "") return true;
            if (!reg.test(date)) {
                this.value.value = ""
            }
            return true;
        }
    },
    created: function () {
        // `this` 指向 vm 实例

    },

    mounted: function () {

        var self = this;
        var $eeldate = $(this.$el).find("input[name=date]");
        var ssetting = { locale: { format: self.format } };
        if (self.value.value) {
            ssetting.startDate = self.value.value;
            ssetting.autoUpdateInput = true;


        } else {
            ssetting.autoUpdateInput = false;
            this.isAutoInput = false
        }
        ssetting.calendarMode = self.calendarMode;

        yuman.vueui.yumanDatePickerShort($eeldate, ssetting, (ldate, label) => {
            // self.$emit('date-start', ldate)
            self.value.value = ldate.format(self.format);
        });


    },
    beforeDestroy: function () {

    }
    ,
    template: `
    <div class="form-group" v-if="getVisiabled()" style="position:relative;">
    <label v-if="label != null">{{label}}</label>
        <span class="clearDate" v-on:click="value.value=''" v-if="value.value && !isAutoInput">×</span>
        <input name='date' v-on:blur="fixDate()" :onChange="dateChange()" :title="title" class="form-control input_borderradius" :placeholder="title"  autocomplete="off" style="width:120px;" :value="value.value" v-model="value.value"/>
    </div>
    `
})


// 定义名为 yuman-table 的新组件 表格
var yumanSearchTableOld = Vue.component('yuman-table-Old', {
    props: {

        title: {
            type: String,
            required: false
        },
        columns: {
            type: Array,
            required: true,
            default: []
        },

        buttons: {
            type: Array,
            default: []
        },
        toolbar: {
            /**用于绑定表格的整体按钮 */
            type: Array,
            default: []
        },
        sizes: {
            type: Array,
            default: yuman.vueui.pageSizes
        },
        rows: {
            type: Array,
            default: []
        },
        originRows: {
            type: Array,
            default: [],
        },
        localPagination: {
            type: Boolean,
            default: false
        },
        page: {
            /**Object对象才能往上动态绑定 */
            type: Object,
            default: {
                pageSize: 10,
                pageIndex: 1,
            }
        },
        total: {
            type: Number,
            default: 0
        },
        pageShow: {
            type: Object,
            default: {
                showCount: 7,
                showNumbers: [],
                minNumber: 1,
                MaxNumber: 1,
                showPrevMore: false,
                showNextMore: false,
                itemUp: false,
            }
        },
        pagination: {
            /***是否显示分页插件 */
            type: Boolean,
            default: function () { return true; }
        },
        tabid: {
            type: String,
            required: false
        },
        hasSelected: {
            type: Boolean,
            default: function () { return false; }
        },
        selectedName: {
            type: String,
            default: function () { return 'id'; }
        },
        selectIds: {
            type: Object,
            default: { ids: [] }
        },
        isSelectPage: {     // 是否跨页多选(若设置为true则需要在获取表格数据的方法里面另外加判断是否已全选)
            type: Boolean,
            default: false,
        },
        hasExtend: {    // 是否有子表
            type: Boolean,
            default: false,
        },
        extendindex: {   // 子表序号
            type: String | Number,
            default: ''
        },
        checkAllEx: {   // 是否全选
            type: Boolean,
            default: function () { return false; }
        },
        displayNoneStyle: {
            type: String,
            default: function () { return ""; }
        },
        displayNoneColspan: {
            type: String,
            default: function () { return "1"; }
        },
        buttonAlign: {  // 操作按钮对齐方式
            type: String,
            default: 'center',
        },
        setColResizable: { // 是否设置宽度可拖动(若设置为true则每个column都要设置width属性给固定初始宽度)
            type: Boolean,
            default: false
        },
        fixAble: {  //是否设置固定列
            type: Boolean,
            default: false,
        },
        fixAbleConst: {
            type: String,
            default: "fixNum"
        },
        fixAbleDefaultNum: {
            type: Number,
            default: 0
        },
        actionStyle: {  // 操作按钮行样式(多用于设置width)
            type: String,
            default: ""
        },
        hiddenBottomText: {  // 隐藏表格左下角的信息
            type: Boolean,
            default: false,
        },
        fixDetailTableIndex: { // 子表表格做固定列时必须加的的唯一标识
            type: String | Number,
            default: ""
        },
        extendFilter: {      // 过滤显示展开子表方法
            type: Function,
            default: function () { return true }
        },
        showExtendAll: {     // 是否显示展开全部子表按钮
            type: Boolean,
            default: true
        },
        tableNoData: {
            type: String,
            default: ""
        },
        showAction: {
            type: Boolean,
            default: false
        }
    },
    data: function () {
        return {
            mybttons: [],
            mytoolbar: [],
            ids: {},
            checkAll: false,
            clicId: -1,//0:true ,用来标记那一行被选中的
            test: true,
            showNumber: [],
            showNextMore: false,
            showPreMore: false,
            binding: false,
            fixNum: 0,
        }
    },
    methods: {
        search: function () {
            this.pageChange();
        },
        refresh: function () {
            this.pageChange();
        },
        toolbarClick: function (btn) {
            if (btn.onclick) {
                btn.onclick(this, this.$parent);
            }
        },
        btnclick: function (btn, row, index) {
            //往上传递，要传递row对象
            if (btn.onclick) {
                btn.onclick(row, index, this.$parent, this);
            }
        },
        pageChange: function () {

            if (!this.isSelectPage) {
                this.clearSelect();
            }
            if (this.hasExtend)
                this.shrinkAll()
            this.getPageNumbers();
            if (this.localPagination) {
                const page = this.page
                this.rows = this.originRows.slice((page.pageIndex - 1) * page.pageSize, page.pageIndex * page.pageSize)
            }
            this.$emit('pagechange', { pageSize: this.page.pageSize, pageIndex: this.page.pageIndex });
            var tranSize = ($('.yumanTableThead th').css('fontSize')).slice(0, 2) - 0
            $('.yumanTableThead th').css('fontSize', tranSize + 0.01)
            setTimeout(() => {
                $('.yumanTableThead th').css('fontSize', tranSize)
            }, 200)
        },
        getIndex: function (rowindex) {
            // let start = ((this.page.pageIndex - 1) * this.page.pageSize);
            // return start + rowindex + 1;
            if (this.rows.length > rowindex) {
                return this.rows[rowindex].table_RowIndex;
            }
            return rowindex + 1;

        },
        setRowIndex: function (rowindex, row) {
            let start = ((this.page.pageIndex - 1) * this.page.pageSize);
            let ind = start + rowindex + 1;
            row.table_RowIndex = ind;
            return;
        },
        getTableTotalCount: function () {
            if (this.hasSelected)
                return L("TotalRecordCount2", this.selectIds.ids.length, this.total);//L("TotalRecordCount", this.total)
            if (this.total != 0)
                return L("TotalRecordCount", this.total)
        },
        getPageNumbers: function () {
            //根据当前总数，size，获得要显示出来的 1，2，3，4，5等页码数量
            var self = this;
            const pageCount = parseInt(Math.ceil(self.total / self.page.pageSize));
            const pagerCount = this.pageShow.showCount;//要显示的最大的页码数量 //self.page.pageSize;
            const halfPagerCount = (pagerCount - 1) / 2;
            const currentPage = Number(self.page.pageIndex);
            let showPrevMore = false;
            let showNextMore = false;
            if (pageCount > pagerCount) {
                if (currentPage > pagerCount - halfPagerCount) {
                    showPrevMore = true;
                }
                if (currentPage < pageCount - halfPagerCount) {
                    showNextMore = true;
                }
            }
            const array = [];
            if (showPrevMore && !showNextMore) {
                const startPage = pageCount - (pagerCount - 2);
                for (let i = startPage; i <= pageCount; i++) {
                    array.push(i);
                }
            } else if (!showPrevMore && showNextMore) {
                for (let i = 1; i <= pagerCount; i++) {
                    array.push(i);
                }
            } else if (showPrevMore && showNextMore) {
                const offset = Math.floor(pagerCount / 2) - 1;
                for (let i = currentPage - offset; i <= currentPage + offset; i++) {
                    array.push(i);
                }
            } else {
                for (let i = 1; i <= pageCount; i++) {
                    array.push(i);
                }
            }
            self.showPreMore = showPrevMore;
            self.showNextMore = showNextMore;
            self.showNumber = array;
        },
        pageSizeChange: function (val, v) {
            this.page.pageIndex = 1;
            this.page.pageSize = val;
            this.pageShow.itemUp = !this.pageShow.itemUp;
            this.pageChange();
        },
        pageIndexChange: function (val) {
            this.page.pageIndex = val;
            this.pageChange();
        },
        pagePreChange: function () {
            if (this.page.pageIndex == 1) return;
            this.page.pageIndex = this.page.pageIndex - 1;
            this.pageChange();
        },
        pageNexChange: function () {
            let maxNumber = Math.ceil(this.total / this.page.pageSize);
            if (this.page.pageIndex == maxNumber) return;
            // 修复 原本是这个 this.page.pageIndex = maxNumber; 然后一下子点击下一页跳到尾页，已修改
            this.page.pageIndex = this.page.pageIndex + 1;
            this.pageChange();
        },
        pageMaxChange: function () {
            let maxNumber = Math.ceil(this.total / this.page.pageSize);

            this.page.pageIndex = maxNumber;
            this.pageChange();
        },
        getColumnStyle: function (col) {
            var style = {};
            if (col.style == null) {
                style = { "text-align": 'center' };
            } else {
                style = col.style;
            }
            if (col.align) {
                style['text-align'] = col.align;
            }
            if (col.width) {
                style['width'] = col.width + 'px';
            }
            return style;
        },
        getClomnCount: function () {
            var count = 1;
            if (this.buttons.length > 0) {
                count = count + 1;
            }
            if (this.hasSelected) {
                count = count + 1;
            }
            if (this.hasExtend) {
                count = count + 1;
            }
            count = count + this.columns.length;
            return count;
        },
        getActionStyle: function (type) {
            //width:80px; max-width:230px; text-align: center;overflow: hidden;white-space: nowrap;
            let count = 0;
            var bts = this.mybttons;
            var st = {};
            if (this.setColResizable) {
                if (bts.length > 0) {
                    count += 20;
                }
                for (var i = 0; i < bts.length; i++) {
                    if (bts[i].visiabled) {
                        count += 50;
                    }
                }
                st.width = count + "px";
                st.maxWith = "10%";
            }
            else {
                st.width = "30px";
            }
            if (type == 'td')
                st.textAlign = this.buttonAlign;
            return st;
        },
        rowInputEnter: function (row, field, index, input) {
            if (index != this.rows.length - 1) {
                let lindex = index + 1;
                var b = this.$refs["rowtext_" + lindex + '_' + field];
                if (b)
                    b[0].onFocus();
            }
            return;
        },
        clearSelect: function () {
            this.ids = {};
            this.selectIds.ids = [];
            this.checkAll = false;
            this.clicId = -1;
        },
        onCheckAll: function () {
            var val = this.checkAll;
            let self = this
            if (!this.isSelectPage)
                this.selectIds.ids = [];
            //循环所有的行都改成true
            for (var i = 0; i < this.rows.length; i++) {
                var ro = this.rows[i];
                if (ro.hasErrorEx) continue

                this.ids[ro[this.selectedName]] = val;
                if (val && !this.selectIds.ids.includes(ro[this.selectedName] + "")) {
                    this.selectIds.ids.push(ro[this.selectedName]);
                }
                else if (!val && this.isSelectPage) {
                    this.selectIds.ids = this.selectIds.ids.filter(id => ro[self.selectedName] != id)
                }

            }
            this.$emit('checkallchange', { checked: val, self: this });

        },
        clearId: function (id) { //从外面触发修改选中值
            this.ids[id] = false;

            var che = false;
            var obj = this.ids;
            this.selectIds.ids = [];
            var reAll = true;

            for (var key in obj) {
                if (obj[key]) {
                    this.selectIds.ids.push(key);
                }

            }
            for (var i = 0; i < this.rows.length; i++) {
                var akey = this.rows[i][this.selectedName];
                reAll = reAll && obj[akey];
            }
            if (!che) {
                this.checkAll = false;
            } else {
                //所有的都是True 则
                this.checkAll = reAll;
            }
        },
        onCheckItem: function (row, index, event, isStopPropagation) {
            var val = this.ids[row[this.selectedName]];
            var che = val;
            var obj = this.ids;
            this.selectIds.ids = [];
            var reAll = true;

            for (var key in obj) {
                if (obj[key]) {
                    this.selectIds.ids.push(key);
                }

            }
            for (var i = 0; i < this.rows.length; i++) {
                var akey = this.rows[i][this.selectedName];
                if (this.rows[i].hasErrorEx) continue;
                reAll = reAll && obj[akey];
            }
            if (!che) {
                this.checkAll = false;
            } else {
                //所有的都是True 则
                this.checkAll = reAll;
            }

            if (!isStopPropagation) {//可以动态设置是否阻止传播
                this.$emit('checkchange', { row, index, che, event });
            }

        },
        recoverTableCheck: function () {
            //根据表格的selectIds.ids恢复页面显示的勾选的效果
            if (!$.isEmptyObject(this.ids)) {
                return;//ids有值的不需要恢复
            }
            this.checkAll = true;//刷新这个值才能触发页面刷新，不知道什么原因
            var reAll = true;

            for (var id of this.selectIds.ids) {
                this.ids[id] = true;
            }

            for (var i = 0; i < this.rows.length; i++) {
                var akey = this.rows[i][this.selectedName];
                if (this.rows[i].hasErrorEx) continue;
                reAll = reAll && this.ids[akey];
            }

            this.checkAll = reAll ? true : false;
        },
        onTdClick: function (row, index, col) {
            this.clicId = this.getIndex(index);
            this.$emit("tdclick", { row, index, col })
            if (col && col.onclick) {
                var model = { row, index };
                model.vm = this.$parent;
                col.onclick(model);
            }
        },
        switchExtend: function (e, index) {
            let className = e.currentTarget.className
            const path = e.composedPath && e.composedPath();
            if (className === 'extend yumanTableExtendRow') {
                e.currentTarget.className = 'shrink'
                e.currentTarget.classList.add('yumanTableExtendRow')
                path[1].nextElementSibling.className = "displayNone"
                this.$emit("setshrink", index)
            }
            else {
                e.currentTarget.className = 'extend'
                e.currentTarget.classList.add('yumanTableExtendRow')
                path[1].nextElementSibling.className = "displayOn"
                this.$emit("setextend", index)
            }
        },
        shrinkAll: function (e) {
            if (this.hasExtend) {
                let doms
                if (e) {
                    const path = e.composedPath && e.composedPath();
                    e.target.previousElementSibling.style.display = 'inline'
                    e.target.style.display = 'none'
                    doms = path[5].getElementsByClassName('yumanTableExtendRow')
                }
                else {
                    document.getElementById('exall').style.display = 'inline'
                    document.getElementById('coall').style.display = 'none'
                    doms = document.getElementsByClassName('yumanTableExtendRow')
                }
                for (let i = 0; i < doms.length; i++) {
                    if (doms[i].className.includes('extend')) {
                        doms[i].click()
                    }
                }
            }
        },
        extendAll: function (e) {
            if (this.hasExtend) {
                let doms
                if (e) {
                    const path = e.composedPath && e.composedPath();
                    e.target.nextElementSibling.style.display = 'inline'
                    e.target.style.display = 'none'
                    doms = path[5].getElementsByClassName('yumanTableExtendRow')
                } else {
                    document.getElementById('exall').style.display = 'none'
                    document.getElementById('coall').style.display = 'inline'
                    doms = document.getElementsByClassName('yumanTableExtendRow')
                }
                for (let i = 0; i < doms.length; i++) {
                    if (doms[i].className.includes('shrink')) {
                        doms[i].click()
                    }
                }
            }
        },
        clearFix: function () {
            this.binding = false
            this.fixNum = 0
            this.recover()
            this.closefixMenu()
        },
        recover: function () {
            var table = this.$refs['mytable' + this.fixDetailTableIndex]
            var len = this.rows.length
            for (let i = 0; i <= len; i++) {
                for (let j = 0; j < this.columns.length + 2; j++) {
                    table.rows[i].cells[j].classList.remove("fix")
                    table.rows[i].cells[j].classList.remove("whiteline")
                    table.rows[i].cells[j].style.left = "unset"
                    table.rows[i].cells[j].style.background = "inherit"
                    table.rows[i].cells[j].classList.remove('lastShadow')

                }
            }
            window.localStorage.setItem(this.fixAbleConst, 0)
        },
        clickFixMul: function () {
            if (this.fixNum > 0)
                this.fixMul()
            this.closefixMenu()
        },
        fixMul: function () {
            if (this.rows.length === 0) return
            this.recover()
            this.binding = true
            var table = this.$refs["mytable" + this.fixDetailTableIndex]
            var len = this.rows.length
            if (this.fixNum == 0) this.binding = false
            else if (this.fixNum < 0) this.fixNum = 0
            else if (this.fixNum > this.columns.length + 2)
                this.fixNum = this.columns.length + 2
            window.localStorage.setItem(this.fixAbleConst, this.fixNum)
            for (let i = 0; i <= len; i++) {
                for (let j = 0; j < this.fixNum; j++) {
                    table.rows[i].cells[j].classList.add("fix")
                    if (i % 2 === 0) {
                        table.rows[i].cells[j].style.background = "#ffffff"
                    }
                    else {
                        table.rows[i].cells[j].style.background = "#f9f9f9"
                    }
                    if (j !== this.fixNum - 1)
                        table.rows[i].cells[j].classList.add("whiteline")

                    if (j == 0) {
                        table.rows[i].cells[j].style.left = "-1px"
                    } else {
                        table.rows[i].cells[j].style.left =
                            table.rows[i].cells[j - 1].style.left.split("px")[0] -
                            0 +
                            table.rows[i].cells[j - 1].offsetWidth +
                            "px"
                    }
                }
                table.rows[i].cells[this.fixNum - 1].classList.add("lastShadow")
            }
            for (let j = 0; j < this.fixNum; j++) {
                table.rows[0].cells[j].style.background = "#87cefa"
            }
        },
        showfixMenu: function (e) {
            if (!this.fixAble) return
            var context = document.getElementById("fixContext" + this.fixDetailTableIndex)
            context.style.display = "block"
            var y = e.layerY
            var x = e.clientX
            if (this.fixDetailTableIndex)
                x = x - 100
            if (document.body.clientWidth - e.clientX < 218)
                context.style.left = x - 400 + "px"
            else
                context.style.left = x - 238 + "px"
            context.style.top = y + "px"

            document.body.addEventListener("click", this.closefixMenu)
            return false
        },
        closefixMenu: function () {
            var contextmenu = document.getElementById("fixContext" + this.fixDetailTableIndex)
            document.body.removeEventListener("click", this.closefixMenu)
            if (contextmenu) contextmenu.style.display = "none"
        },
        setFix: function () {
            if (this.fixNum != null && this.fixNum != 0) {
                this.$nextTick(() => {
                    this.fixMul()
                })
            }
        },
        showExtend: function (row, index) {
            return this.extendFilter(row, index)
        },
        rowInputDirectionUp: function (row, field, index, input) {
            if (index != 0) {
                let lindex = index - 1;
                var b = this.$refs["rowtext_" + field];
                if (b)
                    b[lindex].onFocus();
            }
            return;
        },
        rowInputDirectionDown: function (row, field, index, input) {
            if (index != this.rows.length - 1) {
                let lindex = index + 1;
                var b = this.$refs["rowtext_" + field];
                if (b)
                    b[lindex].onFocus();
            }
            return;
        },
    },
    created: function () {
        // `this` 指向 vm 实例
        this.tabid = yuman.vueui.guid();
        var bts = [];
        this.buttons.map(s => { if (s.visiabled) { bts.push(s); } });
        this.mybttons = bts;
        var tbs = [];
        this.toolbar.map(s => { if (s.visiabled) { tbs.push(s); } });
        this.mytoolbar = tbs;
        if (this.localPagination) {
            const page = this.page
            this.rows = this.originRows.slice((page.pageIndex - 1) * page.pageSize, page.pageIndex * page.pageSize)
            this.total = this.originRows.length
        }
    },
    mounted: function () {
        var self = this;
        if (this.setColResizable) {
            var $table = $(self.$el).find("#" + self.tabid);
            $table.colResizable({
                liveDrag: true,
                gripInnerHtml: "<div class='grip'></div>",
                draggingClass: "dragging",
                resizeMode: 'overflow'
            });
        }
        this.$nextTick(function () {
            this.$on('clearAll', function () {
                self.clearSelect()
            })
            if (this.setColResizable && this.hasExtend)
                setTimeout(() => { $(window).resize() }, 400)
            if (this.fixAble) {
                this.setFix()
            }
        })
        if (this.fixAble) {
            let fixnum = window.localStorage.getItem(this.fixAbleConst)
            if (!fixnum) {
                fixnum = this.fixAbleDefaultNum
                window.localStorage.setItem(this.fixAbleConst, fixnum)
            }
            this.fixNum = fixnum
        }
        // 避免修改 prop 属性
        this.showNumber = this.pageShow.showNumbers
        this.showPreMore = this.pageShow.showPrevMore
        this.showNextMore = this.pageShow.showNextMore
        $(".yumanTableThead th").css("fontSize", "14.01px")
        setTimeout(() => {
            $(".yumanTableThead th").css("fontSize", "14px")
        }, 600)
    },
    watch: {
        page: function (options) {
            this.getPageNumbers();
        },
        rows: function () {
            this.getPageNumbers();
        },
        total: function () {

            $(".yumanTableThead th").css("fontSize", "14.01px")
            setTimeout(() => {
                $(".yumanTableThead th").css("fontSize", "14px")
            }, 0)
            this.getPageNumbers();
        },
        "selectIds.ids": {
            handler: function (newList, oldList) {
                // 当列表数据发生变化时，该处理程序将被触发
                this.$emit("idschange", newList)
                // 在这里执行您想要的操作，比如更新其他数据、发送请求等
            },
            deep: true, // 深度监听，如果列表中的对象也发生了变化，也会被触发
        }
    }
    , components: {
        yumanRowBtn, yumanRowTxt
    },
    template: `
    <div class="bootstrap-table bootstrap3" style="position:relative;">
        <div class="fixed-table-container" style="padding-bottom: 0px;" :style="fixAble?'display:flex;':''">

            <div class="fixed-table-body">
                <table :id="tabid" :ref="'mytable'+fixDetailTableIndex" class="mainTable table table-striped table-bordered table-hover table-condensed table-responsive text-nowrap yumantable" >
                <slot name="tabheader">

                </slot>
                <thead v-on:contextmenu.prevent="showfixMenu(event)" :title="fixAble?L('FixTips'):''" >
                    <tr class="yumanTableThead">
                      <th v-if="hasExtend" style="vertical-align:middle;width:35px;">
                      <div class="th-inner" style="width:35px;" :style="showExtendAll?'':'visibility:hidden'">
                        <i id='exall' :title='L("ExtendAll")' class='glyphicon glyphicon-plus icon-plus' v-on:click="extendAll"></i>
                        <i id='coall' :title='L("CollapseAll")' class='glyphicon glyphicon-minus icon-minus' v-on:click="shrinkAll"></i>
                      </div>
                      </th>
                        <th v-if="hasSelected" style='width:36px;  text-align: center;'  >
                            <div class="th-inner" style="width:36px"> <input type="checkbox" name="allChecked" v-model="checkAll"  v-on:change="onCheckAll" /></div>
                            <div class="fht-cell"></div>
                        </th>
                        <th style='text-align: center;' :style="setColResizable?'width:35px':''">
                            <div class="th-inner" >#</div>
                            <div class="fht-cell"></div>
                        </th>
                        <th v-if="mybttons.length || showAction"  :style="actionStyle?actionStyle:getActionStyle('th')">
                            <div class="th-inner">{{L("Action")}}</div>
                            <div class="fht-cell"></div>
                        </th>
                        <template v-for="(item, index) in columns">
                            <th :style="getColumnStyle(item)" :class="'tableColumn_'+item.field+'_'+extendindex">
                                <div class="th-inner" style="text-align:center" v-if="item.htitle" v-html="item.htitle"></div>
                                <div class="th-inner" style="text-align:center" v-else>{{item.title}}</div>
                                <div class="fht-cell"></div>
                            </th>
                        </template>
                    </tr>
                </thead>
                    <tbody>
                    <template v-for="(row,rindex) in rows" >  {{setRowIndex(rindex,row)}} </template>
                        <template v-if="rows.length == 0" >
                            <tr class="no-records-found">
                                <td :colspan="getClomnCount()">{{ tableNoData || L("TableNoData") }}</td>
                            </tr>
                        </template>
                        <template v-else>
                        <template v-for="(row,rindex) in rows" >
                            <tr :class="{'selected': ids[row[selectedName]],'tr_select_yellow':clicId == row.table_RowIndex  }" :name="'tr_'+row.table_RowIndex" :style="row.style" :key="row.table_RowIndexs" >
                            <td v-if="hasExtend" :class="showExtend(row,rindex)?'shrink yumanTableExtendRow':'yumanTableExtendRow'" v-on:click="showExtend(row,rindex)?switchExtend($event,rindex):''"  style="text-align:center;">

                            </td>

                            <td v-if="hasSelected" style='width:36px; max-width:36px; text-align: center;' v-on:click="onTdClick(row,rindex)" >
                                <input type="checkbox" name="itemChecked"  v-model="ids[row[selectedName]]"  v-on:change="onCheckItem(row,rindex,$event)" :disabled="row.hasErrorEx" :title="row.checkBoxTips" />
                            </td>
                            <td style='width:25px; max-width:50px; text-align: center;' v-on:click="onTdClick(row,rindex)">{{ row.table_RowIndex }}</td>
                            <td v-if="mybttons.length || showAction"  :class="'tr_'+rindex" :style="getActionStyle('td')" v-on:click="onTdClick(row,rindex)">
                                <slot name="extendactionbefore" :rindex=rindex>

                                </slot>
                                <template v-if="mybttons.length">
                                    <template v-for="(btn, bindex) in mybttons">
                                        <yuman-table-btn :row="row" :btn="btn" :rowindex="rindex"  v-on:onclick="btn.onclick" ></yuman-table-btn>
                                    </template>
                                </template>
                                <template v-else-if="buttons.length">
                                    <template v-for="(btn, bindex) in buttons">
                                        <yuman-table-btn :row="row" :btn="btn" :rowindex="rindex"  v-on:onclick="btn.onclick" ></yuman-table-btn>
                                    </template>
                                </template>

                                <slot name="extendactionafter" :rindex=rindex>

                                </slot>
                            </td>
                                <template v-for="(col, cindex) in columns" :key="cindex">
                                    <td v-if="col.type=='buttons'"  :class="'tr_'+rindex" style="text-align:center;" v-on:click="onTdClick(row,rindex)">
                                        <template v-for="(btn, bindex) in col.buttons">
                                            <yuman-table-btn :row="row" :btn="btn" :rowindex="rindex"  v-on:onclick="btn.onclick" ></yuman-table-btn>
                                        </template>
                                    </td>

                                    <td :style="getColumnStyle(col)" :class="'tableColumn_'+col.field+'_'+extendindex" v-on:click="onTdClick(row,rindex,col)" v-else>
                                    <div v-if="col.type!=='buttons'" :class="'tableColumn_'+col.field+'_'+extendindex" :style="setColResizable?'overflow: hidden; white-space: nowrap;text-overflow: ellipsis;':''">
                                        <yuman-table-txt :row="row" :col="col" :rowindex="rindex"  :ref="'rowtext_'+col.field" v-on:rowInputEnter="rowInputEnter" v-on:rowInputDirectionUp="rowInputDirectionUp" v-on:rowInputDirectionDown="rowInputDirectionDown" :key="cindex" ></yuman-table-txt>
                                    </div>
                                    </td>
                                </template>

                                </tr>
                                <tr class="displayNone" :style="displayNoneStyle" v-if="hasExtend">
                                    <slot name="extend" :rindex=rindex>
                                    </slot>
                                </tr>
                            </template>
                        </template>
                    </tbody>
                    <slot name="tabfoot">

                    </slot>

                </table>

            </div>
        </div>


            <div class="fixed-table-pagination" :style="{'min-height':mytoolbar.length > 0 ?'50px':''}">
                <div class="fixed-table-footer" v-if="mytoolbar.length >0" style="padding-left:5px;">
                <template v-for="(btn, index) in mytoolbar" >
                    <yuman-tab-toolbar v-if="btn.visiabled"  v-bind:disabled="btn.disabled"  v-bind:name="btn.name" v-bind:title="btn.title" v-bind:css="btn.css" :style="btn.style"  v-bind:licss="btn.licss"  v-on:click="toolbarClick(btn)" ></yuman-tab-toolbar>
                    <span v-if="index!= mytoolbar.length-1" style="color: lightskyblue;" > | </span>
                </template>
                </div>
                <div class="fixed-table-footer">
                    <slot name="aftertoolbar"></slot>
                </div>

                <div class="pull-left pagination-detail"  style="padding-left:10px;" v-if="hasSelected || total || pagination" v-show="!hiddenBottomText"> 

                <span class="pagination-info" v-if="hasSelected || total">
                {{getTableTotalCount()}}
                </span>
                <span class="page-list" v-if="showNumber.length >0 && pagination">
                <span class="btn-group dropdown dropup"  >
                    <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" >
                        <span class="page-size">
                        {{page.pageSize}}
                        </span>
                        <span class="caret"></span>
                    </button>
                    <ul class="dropdown-menu" role="menu">
                        <template v-for="(asize, sindex) in sizes">
                            <li role="menuitem" v-if="asize==page.pageSize" class="active"><a href="#" v-on:click="pageSizeChange(asize)">{{asize}}</a></li>
                            <li role="menuitem" v-else><a href="#" v-on:click="pageSizeChange(asize)">{{asize}}</a></li>
                        </template>
                    </ul>
                    </span>&nbsp;&nbsp;{{L("CountPage")}}</span>
                </div>
                <div v-if="showNumber.length >0 && pagination" class="pull-right pagination" >
                    <ul class="pagination">
                        <li v-if="showPreMore" class="page-item page-pre" v-on:click="pageIndexChange(1)"><a class="page-link" aria-label="previous page" href="javascript:void(0)">‹‹</a></li>
                        <li v-if="showPreMore" class="page-item page-pre" v-on:click="pagePreChange"><a class="page-link" aria-label="previous page" href="javascript:void(0)">‹</a></li>
                        <template v-for="(anum, sindex) in showNumber">
                            <li v-if="anum==page.pageIndex" class="page-item active"  v-on:click="pageIndexChange(anum)"><a class="page-link" href="javascript:void(0)">{{anum}}</a></li>
                            <li v-else-if="anum==''" class="page-item page-last-separator disabled"><a class="page-link" href="javascript:void(0)">...</a></li>
                            <li v-else   class="page-item" v-on:click="pageIndexChange(anum)"><a class="page-link"   href="javascript:void(0)">{{anum}}</a></li>
                        </template>
                        <li  v-if="showNextMore" class="page-item page-next" v-on:click="pageNexChange"><a class="page-link" aria-label="next page" href="javascript:void(0)">›</a></li>
                        <li  v-if="showNextMore" class="page-item page-next" v-on:click="pageMaxChange"><a class="page-link" aria-label="next page" href="javascript:void(0)">››</a></li>
                    </ul>
                </div>
                <slot name="afterpagination"></slot>
        </div>
        <div class="fixMenu" :id="'fixContext'+fixDetailTableIndex" v-if="fixAble">
            <ul>
                <li v-on:click.stop="clickFixMul()">{{L("Fixed")}} <input v-model.number="fixNum" v-on:click.stop="{}" class="stickyInput" type="number" v-on:change="fixMul()"> {{L("Columns")}}</li>
                <li v-on:click.stop="clearFix()" v-if="binding">{{L("RemoveFixed")}}</li>
            </ul>
        </div>

    </div>


    `
})

// 定义名为 yuman-table 的新组件 表格
var yumanSearchTable = Vue.component('yuman-table', {
    props: {

        title: {
            type: String,
            required: false
        },
        columns: {
            type: Array,
            required: true,
            default: []
        },

        buttons: {
            type: Array,
            default: []
        },
        toolbar: {
            /**用于绑定表格的整体按钮 */
            type: Array,
            default: []
        },
        sizes: {
            type: Array,
            default: yuman.vueui.pageSizes
        },
        rows: {
            type: Array,
            default: []
        },
        originRows: {
            type: Array,
            default: [],
        },
        localPagination: {
            type: Boolean,
            default: false
        },
        page: {
            /**Object对象才能往上动态绑定 */
            type: Object,
            default: {
                pageSize: 10,
                pageIndex: 1,
            }
        },
        total: {
            type: Number,
            default: 0
        },
        pageShow: {
            type: Object,
            default: {
                showCount: 7,
                showNumbers: [],
                minNumber: 1,
                MaxNumber: 1,
                showPrevMore: false,
                showNextMore: false,
                itemUp: false,
            }
        },
        pagination: {
            /***是否显示分页插件 */
            type: Boolean,
            default: function () { return true; }
        },
        tabid: {
            type: String,
            required: false
        },
        hasSelected: {
            type: Boolean,
            default: function () { return false; }
        },
        selectedName: {
            type: String,
            default: function () { return 'id'; }
        },
        selectIds: {
            type: Object,
            default: { ids: [] }
        },
        isSelectPage: {     // 是否跨页多选(若设置为true则需要在获取表格数据的方法里面另外加判断是否已全选)
            type: Boolean,
            default: false,
        },
        hasExtend: {    // 是否有子表
            type: Boolean,
            default: false,
        },
        extendindex: {   // 子表序号
            type: String | Number,
            default: ''
        },
        checkAllEx: {   // 是否全选
            type: Boolean,
            default: function () { return false; }
        },
        displayNoneStyle: {
            type: String,
            default: function () { return ""; }
        },
        displayNoneColspan: {
            type: String,
            default: function () { return "1"; }
        },
        buttonAlign: {  // 操作按钮对齐方式
            type: String,
            default: 'center',
        },
        setColResizable: { // 是否设置宽度可拖动(若设置为true则每个column都要设置width属性给固定初始宽度)
            type: Boolean,
            default: false
        },
        fixAble: {  //是否设置固定列
            type: Boolean,
            default: false,
        },
        fixAbleConst: {
            type: String,
            default: "fixNum"
        },
        fixAbleDefaultNum: {
            type: Number,
            default: 0
        },
        actionStyle: {  // 操作按钮行样式(多用于设置width)
            type: String,
            default: ""
        },
        hiddenBottomText: {  // 隐藏表格左下角的信息
            type: Boolean,
            default: false,
        },
        fixDetailTableIndex: { // 子表表格做固定列时必须加的的唯一标识
            type: String | Number,
            default: ""
        },
        extendFilter: {      // 过滤显示展开子表方法
            type: Function,
            default: function () { return true }
        },
        showExtendAll: {     // 是否显示展开全部子表按钮
            type: Boolean,
            default: true
        },
        tableNoData: {
            type: String,
            default: ""
        },
        showAction: {
            type: Boolean,
            default: false
        }
    },
    data: function () {
        return {
            mybttons: [],
            mytoolbar: [],
            ids: {},
            checkAll: false,
            clicId: -1,//0:true ,用来标记那一行被选中的
            test: true,
            showNumber: [],
            showNextMore: false,
            showPreMore: false,
            binding: false,
            fixNum: 0,
            dropPage: {
                dropNumbers1: [],
                dropNumbers2: [],
                pagerCount: 0,
                minNumber: 0,
                maxNumber: 0,
            },
        }
    },
    methods: {
        search: function () {
            this.pageChange();
        },
        refresh: function () {
            this.pageChange();
        },
        toolbarClick: function (btn) {
            if (btn.onclick) {
                btn.onclick(this, this.$parent);
            }
        },
        btnclick: function (btn, row, index) {
            //往上传递，要传递row对象
            if (btn.onclick) {
                btn.onclick(row, index, this.$parent, this);
            }
        },
        pageChange: function () {

            if (!this.isSelectPage) {
                this.clearSelect();
            }
            if (this.hasExtend)
                this.shrinkAll()
            this.getPageNumbers();
            if (this.localPagination) {
                const page = this.page
                this.rows = this.originRows.slice((page.pageIndex - 1) * page.pageSize, page.pageIndex * page.pageSize)
            }
            this.$emit('pagechange', { pageSize: this.page.pageSize, pageIndex: this.page.pageIndex });
            var tranSize = ($('.yumanTableThead th').css('fontSize')).slice(0, 2) - 0
            $('.yumanTableThead th').css('fontSize', tranSize + 0.01)
            setTimeout(() => {
                $('.yumanTableThead th').css('fontSize', tranSize)
            }, 200)
        },
        getIndex: function (rowindex) {
            // let start = ((this.page.pageIndex - 1) * this.page.pageSize);
            // return start + rowindex + 1;
            if (this.rows.length > rowindex) {
                return this.rows[rowindex].table_RowIndex;
            }
            return rowindex + 1;

        },
        setRowIndex: function (rowindex, row) {
            let start = ((this.page.pageIndex - 1) * this.page.pageSize);
            let ind = start + rowindex + 1;
            row.table_RowIndex = ind;
            return;
        },
        getTableTotalCount: function () {
            if (this.hasSelected)
                return L("TotalRecordCount2", this.selectIds.ids.length, this.total);//L("TotalRecordCount", this.total)
            if (this.total != 0)
                return L("TotalRecordCount", this.total)
        },
        getPageNumbers: function () {
            //根据当前总数，size，获得要显示出来的 1，2，3，4，5等页码数量
            var self = this;
            const pageCount = parseInt(Math.ceil(self.total / self.page.pageSize));
            const pagerCount = this.pageShow.showCount;//要显示的最大的页码数量 //self.page.pageSize;
            const halfPagerCount = (pagerCount - 1) / 2;
            const currentPage = Number(self.page.pageIndex);
            let showPrevMore = false;
            let showNextMore = false;
            if (pageCount > pagerCount) {
                if (currentPage > pagerCount - halfPagerCount) {
                    showPrevMore = true;
                }
                if (currentPage < pageCount - halfPagerCount) {
                    showNextMore = true;
                }
            }
            const array = [];
            if (showPrevMore && !showNextMore) {
                const startPage = pageCount - (pagerCount - 3);
                for (let i = startPage; i <= pageCount; i++) {
                    array.push(i);
                }
            } else if (!showPrevMore && showNextMore) {
                var offset = pageCount > pagerCount ? 2 : 1;
                for (let i = 1; i <= pagerCount - offset; i++) {
                    array.push(i);
                }
            } else if (showPrevMore && showNextMore) {
                const offset = Math.floor(pagerCount / 2) - 2;
                for (let i = currentPage - offset; i <= currentPage + offset; i++) {
                    array.push(i);
                }
            } else {
                for (let i = 1; i <= pageCount; i++) {
                    array.push(i);
                }
            }
            self.showPreMore = showPrevMore;
            self.showNextMore = showNextMore;
            self.showNumber = array;

            if (self.showNumber.length > 0) {
                self.dropPage.minNumber = Math.min.apply(null, self.showNumber);
                self.dropPage.maxNumber = Math.max.apply(null, self.showNumber);
            } else {
                self.dropPage.minNumber = 0;
                self.dropPage.maxNumber = 0;
            }

            self.dropPage.dropNumbers1 = [];
            if (self.dropPage.minNumber > 1) {
                var dropPageContainer1 = self.$refs.dropPageContainer1;
                if (self.page.pageSize > 10) {
                    if (dropPageContainer1) {
                        dropPageContainer1.style.bottom = '100%';
                        dropPageContainer1.style.top = 'auto';
                    }
                }

                if (dropPageContainer1) {
                    dropPageContainer1.scrollTop = 0;
                }
                self.dropPageRender(1, self.dropPage.minNumber - 1, "1");
            }

            self.dropPage.dropNumbers2 = [];
            if (self.dropPage.maxNumber < pageCount) {
                var dropPageContainer2 = self.$refs.dropPageContainer2;
                if (self.page.pageSize > 10) {
                    if (dropPageContainer2) {
                        dropPageContainer2.style.bottom = '100%';
                        dropPageContainer2.style.top = 'auto';
                    }
                }
                if (dropPageContainer2) {
                    dropPageContainer2.scrollTop = 0;
                }
                self.dropPageRender(self.dropPage.maxNumber, pageCount, "2");
            }

            self.dropPage.pagerCount = pageCount;
        },
        dropPageRender: function (startNumber, endNumber, type) {

            if (!startNumber || startNumber == 0 || !endNumber || endNumber == 0)
                return;

            var dropPageNext = startNumber;
            var renderedItems = [];

            if (type == "1") {
                renderedItems = this.dropPage.dropNumbers1;
            } else if (type == "2") {
                renderedItems = this.dropPage.dropNumbers2;
            }

            if (renderedItems.length > 0) {
                dropPageNext = renderedItems[renderedItems.length - 1];
            }

            if (dropPageNext >= endNumber) {
                // 数据加载完毕，可以停止滚动
                return;
            }

            var currDropPage = [];

            for (var i = 0; i < 10; i++) {
                dropPageNext += 1;
                if (dropPageNext > endNumber)
                    break;
                else {
                    currDropPage.push(dropPageNext);
                }
            }

            for (var i = 0; i < currDropPage.length; i++) {
                if (renderedItems.indexOf(currDropPage[i]) === -1) {

                    if (type == "1") {
                        this.dropPage.dropNumbers1.push(currDropPage[i]);
                    } else if (type == "2") {
                        this.dropPage.dropNumbers2.push(currDropPage[i]);
                    }
                }
            }
        },
        dropPageScroll1: function (event) {
            var self = this;
            if (event.target.scrollTop + event.target.clientHeight >= event.target.scrollHeight) {
                // 滚动条到达底部，触发方法
                self.dropPageRender(1, self.dropPage.minNumber - 1, "1");
            }
        },
        dropPageScroll2: function (event) {
            var self = this;
            if (event.target.scrollTop + event.target.clientHeight >= event.target.scrollHeight) {
                // 滚动条到达底部，触发方法
                self.dropPageRender(self.dropPage.maxNumber, self.dropPage.pagerCount, "2");
            }
        },
        pageSizeChange: function (val, v) {
            this.page.pageIndex = 1;
            this.page.pageSize = val;
            this.pageShow.itemUp = !this.pageShow.itemUp;
            this.pageChange();
        },
        pageIndexChange: function (val) {
            this.page.pageIndex = val;
            this.pageChange();
        },
        pagePreChange: function () {
            if (this.page.pageIndex == 1) return;
            this.page.pageIndex = this.page.pageIndex - 1;
            this.pageChange();
        },
        pageNexChange: function () {
            let maxNumber = Math.ceil(this.total / this.page.pageSize);
            if (this.page.pageIndex == maxNumber) return;
            // 修复 原本是这个 this.page.pageIndex = maxNumber; 然后一下子点击下一页跳到尾页，已修改
            this.page.pageIndex = this.page.pageIndex + 1;
            this.pageChange();
        },
        pageMaxChange: function () {
            let maxNumber = Math.ceil(this.total / this.page.pageSize);

            this.page.pageIndex = maxNumber;
            this.pageChange();
        },
        getColumnStyle: function (col) {
            var style = {};
            if (col.style == null) {
                style = { "text-align": 'center' };
            } else {
                style = col.style;
            }
            if (col.align) {
                style['text-align'] = col.align;
            }
            if (col.width) {
                style['width'] = col.width + 'px';
            }
            return style;
        },
        getClomnCount: function () {
            var count = 1;
            if (this.buttons.length > 0) {
                count = count + 1;
            }
            if (this.hasSelected) {
                count = count + 1;
            }
            if (this.hasExtend) {
                count = count + 1;
            }
            count = count + this.columns.length;
            return count;
        },
        getActionStyle: function (type) {
            //width:80px; max-width:230px; text-align: center;overflow: hidden;white-space: nowrap;
            let count = 0;
            var bts = this.mybttons;
            var st = {};
            if (this.setColResizable) {
                if (bts.length > 0) {
                    count += 20;
                }
                for (var i = 0; i < bts.length; i++) {
                    if (bts[i].visiabled) {
                        count += 50;
                    }
                }
                st.width = count + "px";
                st.maxWith = "10%";
            }
            else {
                st.width = "30px";
            }
            if (type == 'td')
                st.textAlign = this.buttonAlign;
            return st;
        },
        rowInputEnter: function (row, field, index, input) {
            if (index != this.rows.length - 1) {
                let lindex = index + 1;
                var b = this.$refs["rowtext_" + lindex + '_' + field];
                if (b)
                    b[0].onFocus();
            }
            return;
        },
        clearSelect: function () {
            this.ids = {};
            this.selectIds.ids = [];
            this.checkAll = false;
            this.clicId = -1;
        },
        onCheckAll: function () {
            var val = this.checkAll;
            let self = this
            if (!this.isSelectPage)
                this.selectIds.ids = [];
            //循环所有的行都改成true
            for (var i = 0; i < this.rows.length; i++) {
                var ro = this.rows[i];
                if (ro.hasErrorEx) continue

                this.ids[ro[this.selectedName]] = val;
                if (val && !this.selectIds.ids.includes(ro[this.selectedName] + "")) {
                    this.selectIds.ids.push(ro[this.selectedName]);
                }
                else if (!val && this.isSelectPage) {
                    this.selectIds.ids = this.selectIds.ids.filter(id => ro[self.selectedName] != id)
                }

            }
            this.$emit('checkallchange', { checked: val, self: this });

        },
        clearId: function (id) { //从外面触发修改选中值
            this.ids[id] = false;

            var che = false;
            var obj = this.ids;
            this.selectIds.ids = [];
            var reAll = true;

            for (var key in obj) {
                if (obj[key]) {
                    this.selectIds.ids.push(key);
                }

            }
            for (var i = 0; i < this.rows.length; i++) {
                var akey = this.rows[i][this.selectedName];
                reAll = reAll && obj[akey];
            }
            if (!che) {
                this.checkAll = false;
            } else {
                //所有的都是True 则
                this.checkAll = reAll;
            }
        },
        onCheckItem: function (row, index, event, isStopPropagation) {
            var val = this.ids[row[this.selectedName]];
            var che = val;
            var obj = this.ids;
            this.selectIds.ids = [];
            var reAll = true;

            for (var key in obj) {
                if (obj[key]) {
                    this.selectIds.ids.push(key);
                }

            }
            for (var i = 0; i < this.rows.length; i++) {
                var akey = this.rows[i][this.selectedName];
                if (this.rows[i].hasErrorEx) continue;
                reAll = reAll && obj[akey];
            }
            if (!che) {
                this.checkAll = false;
            } else {
                //所有的都是True 则
                this.checkAll = reAll;
            }

            if (!isStopPropagation) {//可以动态设置是否阻止传播
                this.$emit('checkchange', { row, index, che, event });
            }

        },
        recoverTableCheck: function () {
            //根据表格的selectIds.ids恢复页面显示的勾选的效果
            if (!$.isEmptyObject(this.ids)) {
                return;//ids有值的不需要恢复
            }
            this.checkAll = true;//刷新这个值才能触发页面刷新，不知道什么原因
            var reAll = true;

            for (var id of this.selectIds.ids) {
                this.ids[id] = true;
            }

            for (var i = 0; i < this.rows.length; i++) {
                var akey = this.rows[i][this.selectedName];
                if (this.rows[i].hasErrorEx) continue;
                reAll = reAll && this.ids[akey];
            }

            this.checkAll = reAll ? true : false;
        },
        onTdClick: function (row, index, col) {
            this.clicId = this.getIndex(index);
            this.$emit("tdclick", { row, index, col })
            if (col && col.onclick) {
                var model = { row, index };
                model.vm = this.$parent;
                col.onclick(model);
            }
        },
        switchExtend: function (e, index) {
            let className = e.currentTarget.className
            const path = e.composedPath && e.composedPath();
            if (className === 'extend yumanTableExtendRow') {
                e.currentTarget.className = 'shrink'
                e.currentTarget.classList.add('yumanTableExtendRow')
                path[1].nextElementSibling.className = "displayNone"
                this.$emit("setshrink", index)
            }
            else {
                e.currentTarget.className = 'extend'
                e.currentTarget.classList.add('yumanTableExtendRow')
                path[1].nextElementSibling.className = "displayOn"
                this.$emit("setextend", index)
            }
        },
        shrinkAll: function (e) {
            if (this.hasExtend) {
                let doms
                if (e) {
                    const path = e.composedPath && e.composedPath();
                    e.target.previousElementSibling.style.display = 'inline'
                    e.target.style.display = 'none'
                    doms = path[5].getElementsByClassName('yumanTableExtendRow')
                }
                else {
                    document.getElementById('exall').style.display = 'inline'
                    document.getElementById('coall').style.display = 'none'
                    doms = document.getElementsByClassName('yumanTableExtendRow')
                }
                for (let i = 0; i < doms.length; i++) {
                    if (doms[i].className.includes('extend')) {
                        doms[i].click()
                    }
                }
            }
        },
        extendAll: function (e) {
            if (this.hasExtend) {
                let doms
                if (e) {
                    const path = e.composedPath && e.composedPath();
                    e.target.nextElementSibling.style.display = 'inline'
                    e.target.style.display = 'none'
                    doms = path[5].getElementsByClassName('yumanTableExtendRow')
                } else {
                    document.getElementById('exall').style.display = 'none'
                    document.getElementById('coall').style.display = 'inline'
                    doms = document.getElementsByClassName('yumanTableExtendRow')
                }
                for (let i = 0; i < doms.length; i++) {
                    if (doms[i].className.includes('shrink')) {
                        doms[i].click()
                    }
                }
            }
        },
        clearFix: function () {
            this.binding = false
            this.fixNum = 0
            this.recover()
            this.closefixMenu()
        },
        recover: function () {
            var table = this.$refs['mytable' + this.fixDetailTableIndex]
            var len = this.rows.length
            for (let i = 0; i <= len; i++) {
                for (let j = 0; j < this.columns.length + 2; j++) {
                    table.rows[i].cells[j].classList.remove("fix")
                    table.rows[i].cells[j].classList.remove("whiteline")
                    table.rows[i].cells[j].style.left = "unset"
                    table.rows[i].cells[j].style.background = "inherit"
                    table.rows[i].cells[j].classList.remove('lastShadow')

                }
            }
            window.localStorage.setItem(this.fixAbleConst, 0)
        },
        clickFixMul: function () {
            if (this.fixNum > 0)
                this.fixMul()
            this.closefixMenu()
        },
        fixMul: function () {
            if (this.rows.length === 0) return
            this.recover()
            this.binding = true
            var table = this.$refs["mytable" + this.fixDetailTableIndex]
            var len = this.rows.length
            if (this.fixNum == 0) this.binding = false
            else if (this.fixNum < 0) this.fixNum = 0
            else if (this.fixNum > this.columns.length + 2)
                this.fixNum = this.columns.length + 2
            window.localStorage.setItem(this.fixAbleConst, this.fixNum)
            for (let i = 0; i <= len; i++) {
                for (let j = 0; j < this.fixNum; j++) {
                    table.rows[i].cells[j].classList.add("fix")
                    if (i % 2 === 0) {
                        table.rows[i].cells[j].style.background = "#ffffff"
                    }
                    else {
                        table.rows[i].cells[j].style.background = "#f9f9f9"
                    }
                    if (j !== this.fixNum - 1)
                        table.rows[i].cells[j].classList.add("whiteline")

                    if (j == 0) {
                        table.rows[i].cells[j].style.left = "-1px"
                    } else {
                        table.rows[i].cells[j].style.left =
                            table.rows[i].cells[j - 1].style.left.split("px")[0] -
                            0 +
                            table.rows[i].cells[j - 1].offsetWidth +
                            "px"
                    }
                }
                table.rows[i].cells[this.fixNum - 1].classList.add("lastShadow")
            }
            for (let j = 0; j < this.fixNum; j++) {
                table.rows[0].cells[j].style.background = "#87cefa"
            }
        },
        showfixMenu: function (e) {
            if (!this.fixAble) return
            var context = document.getElementById("fixContext" + this.fixDetailTableIndex)
            context.style.display = "block"
            var y = e.layerY
            var x = e.clientX
            if (this.fixDetailTableIndex)
                x = x - 100
            if (document.body.clientWidth - e.clientX < 218)
                context.style.left = x - 400 + "px"
            else
                context.style.left = x - 238 + "px"
            context.style.top = y + "px"

            document.body.addEventListener("click", this.closefixMenu)
            return false
        },
        closefixMenu: function () {
            var contextmenu = document.getElementById("fixContext" + this.fixDetailTableIndex)
            document.body.removeEventListener("click", this.closefixMenu)
            if (contextmenu) contextmenu.style.display = "none"
        },
        setFix: function () {
            if (this.fixNum != null && this.fixNum != 0) {
                this.$nextTick(() => {
                    this.fixMul()
                })
            }
        },
        showExtend: function (row, index) {
            return this.extendFilter(row, index)
        },
        rowInputDirectionUp: function (row, field, index, input) {
            if (index != 0) {
                let lindex = index - 1;
                var b = this.$refs["rowtext_" + field];
                if (b)
                    b[lindex].onFocus();
            }
            return;
        },
        rowInputDirectionDown: function (row, field, index, input) {
            if (index != this.rows.length - 1) {
                let lindex = index + 1;
                var b = this.$refs["rowtext_" + field];
                if (b)
                    b[lindex].onFocus();
            }
            return;
        },
    },
    created: function () {
        // `this` 指向 vm 实例
        this.tabid = yuman.vueui.guid();
        var bts = [];
        this.buttons.map(s => { if (s.visiabled) { bts.push(s); } });
        this.mybttons = bts;
        var tbs = [];
        this.toolbar.map(s => { if (s.visiabled) { tbs.push(s); } });
        this.mytoolbar = tbs;
        if (this.localPagination) {
            const page = this.page
            this.rows = this.originRows.slice((page.pageIndex - 1) * page.pageSize, page.pageIndex * page.pageSize)
            this.total = this.originRows.length
        }
    },
    mounted: function () {
        var self = this;
        if (this.setColResizable) {
            var $table = $(self.$el).find("#" + self.tabid);
            $table.colResizable({
                liveDrag: true,
                gripInnerHtml: "<div class='grip'></div>",
                draggingClass: "dragging",
                resizeMode: 'overflow'
            });
        }
        this.$nextTick(function () {
            this.$on('clearAll', function () {
                self.clearSelect()
            })
            if (this.setColResizable && this.hasExtend)
                setTimeout(() => { $(window).resize() }, 400)
            if (this.fixAble) {
                this.setFix()
            }
        })
        if (this.fixAble) {
            let fixnum = window.localStorage.getItem(this.fixAbleConst)
            if (!fixnum) {
                fixnum = this.fixAbleDefaultNum
                window.localStorage.setItem(this.fixAbleConst, fixnum)
            }
            this.fixNum = fixnum
        }
        // 避免修改 prop 属性
        this.showNumber = this.pageShow.showNumbers
        this.showPreMore = this.pageShow.showPrevMore
        this.showNextMore = this.pageShow.showNextMore
        $(".yumanTableThead th").css("fontSize", "14.01px")
        setTimeout(() => {
            $(".yumanTableThead th").css("fontSize", "14px")
        }, 600);
    },
    watch: {
        page: function (options) {
            this.getPageNumbers();
        },
        rows: function () {
            this.getPageNumbers();
        },
        total: function () {

            $(".yumanTableThead th").css("fontSize", "14.01px")
            setTimeout(() => {
                $(".yumanTableThead th").css("fontSize", "14px")
            }, 0)
            this.getPageNumbers();
        },
        "selectIds.ids": {
            handler: function (newList, oldList) {
                // 当列表数据发生变化时，该处理程序将被触发
                this.$emit("idschange", newList)
                // 在这里执行您想要的操作，比如更新其他数据、发送请求等
            },
            deep: true, // 深度监听，如果列表中的对象也发生了变化，也会被触发
        }
    }
    , components: {
        yumanRowBtn, yumanRowTxt
    },
    template: `
    <div class="bootstrap-table bootstrap3" style="position:relative;">
        <div class="fixed-table-container" style="padding-bottom: 0px;" :style="fixAble?'display:flex;':''">

            <div class="fixed-table-body">
                <table :id="tabid" :ref="'mytable'+fixDetailTableIndex" class="mainTable table table-striped table-bordered table-hover table-condensed table-responsive text-nowrap yumantable" >
                <slot name="tabheader">

                </slot>
                <thead v-on:contextmenu.prevent="showfixMenu(event)" :title="fixAble?L('FixTips'):''" >
                    <tr class="yumanTableThead">
                      <th v-if="hasExtend" style="vertical-align:middle;width:35px;">
                      <div class="th-inner" style="width:35px;" :style="showExtendAll?'':'visibility:hidden'">
                        <i id='exall' :title='L("ExtendAll")' class='glyphicon glyphicon-plus icon-plus' v-on:click="extendAll"></i>
                        <i id='coall' :title='L("CollapseAll")' class='glyphicon glyphicon-minus icon-minus' v-on:click="shrinkAll"></i>
                      </div>
                      </th>
                        <th v-if="hasSelected" style='width:36px;  text-align: center;'  >
                            <div class="th-inner" style="width:36px"> <input type="checkbox" name="allChecked" v-model="checkAll"  v-on:change="onCheckAll" /></div>
                            <div class="fht-cell"></div>
                        </th>
                        <th style='text-align: center;' :style="setColResizable?'width:35px':''">
                            <div class="th-inner" >#</div>
                            <div class="fht-cell"></div>
                        </th>
                        <th v-if="mybttons.length || showAction"  :style="actionStyle?actionStyle:getActionStyle('th')">
                            <div class="th-inner">{{L("Action")}}</div>
                            <div class="fht-cell"></div>
                        </th>
                        <template v-for="(item, index) in columns">
                            <th :style="getColumnStyle(item)" :class="'tableColumn_'+item.field+'_'+extendindex">
                                <div class="th-inner" style="text-align:center" v-if="item.htitle" v-html="item.htitle"></div>
                                <div class="th-inner" style="text-align:center" v-else>{{item.title}}</div>
                                <div class="fht-cell"></div>
                            </th>
                        </template>
                    </tr>
                </thead>
                    <tbody>
                    <template v-for="(row,rindex) in rows" >  {{setRowIndex(rindex,row)}} </template>
                        <template v-if="rows.length == 0" >
                            <tr class="no-records-found">
                                <td :colspan="getClomnCount()">{{ tableNoData || L("TableNoData") }}</td>
                            </tr>
                        </template>
                        <template v-else>
                        <template v-for="(row,rindex) in rows" >
                            <tr :class="{'selected': ids[row[selectedName]],'tr_select_yellow':clicId == row.table_RowIndex  }" :name="'tr_'+row.table_RowIndex" :style="row.style" :key="row.table_RowIndexs" >
                            <td v-if="hasExtend" :class="showExtend(row,rindex)?'shrink yumanTableExtendRow':'yumanTableExtendRow'" v-on:click="showExtend(row,rindex)?switchExtend($event,rindex):''"  style="text-align:center;">

                            </td>

                            <td v-if="hasSelected" style='width:36px; max-width:36px; text-align: center;' v-on:click="onTdClick(row,rindex)" >
                                <input type="checkbox" name="itemChecked"  v-model="ids[row[selectedName]]"  v-on:change="onCheckItem(row,rindex,$event)" :disabled="row.hasErrorEx" :title="row.checkBoxTips" />
                            </td>
                            <td style='width:25px; max-width:50px; text-align: center;' v-on:click="onTdClick(row,rindex)">{{ row.table_RowIndex }}</td>
                            <td v-if="mybttons.length || showAction"  :class="'tr_'+rindex" :style="getActionStyle('td')" v-on:click="onTdClick(row,rindex)">
                                <slot name="extendactionbefore" :rindex=rindex>

                                </slot>
                                <template v-if="mybttons.length">
                                    <template v-for="(btn, bindex) in mybttons">
                                        <yuman-table-btn :row="row" :btn="btn" :rowindex="rindex"  v-on:onclick="btn.onclick" ></yuman-table-btn>
                                    </template>
                                </template>
                                <template v-else-if="buttons.length">
                                    <template v-for="(btn, bindex) in buttons">
                                        <yuman-table-btn :row="row" :btn="btn" :rowindex="rindex"  v-on:onclick="btn.onclick" ></yuman-table-btn>
                                    </template>
                                </template>

                                <slot name="extendactionafter" :rindex=rindex>

                                </slot>
                            </td>
                                <template v-for="(col, cindex) in columns" :key="cindex">
                                    <td v-if="col.type=='buttons'"  :class="'tr_'+rindex" style="text-align:center;" v-on:click="onTdClick(row,rindex)">
                                        <template v-for="(btn, bindex) in col.buttons">
                                            <yuman-table-btn :row="row" :btn="btn" :rowindex="rindex"  v-on:onclick="btn.onclick" ></yuman-table-btn>
                                        </template>
                                    </td>

                                    <td :style="getColumnStyle(col)" :class="'tableColumn_'+col.field+'_'+extendindex" v-on:click="onTdClick(row,rindex,col)" v-else>
                                    <div v-if="col.type!=='buttons'" :class="'tableColumn_'+col.field+'_'+extendindex" :style="setColResizable?'overflow: hidden; white-space: nowrap;text-overflow: ellipsis;':''">
                                        <yuman-table-txt :row="row" :col="col" :rowindex="rindex"  :ref="'rowtext_'+col.field" v-on:rowInputEnter="rowInputEnter" v-on:rowInputDirectionUp="rowInputDirectionUp" v-on:rowInputDirectionDown="rowInputDirectionDown" :key="cindex" ></yuman-table-txt>
                                    </div>
                                    </td>
                                </template>

                                </tr>
                                <tr class="displayNone" :style="displayNoneStyle" v-if="hasExtend">
                                    <slot name="extend" :rindex=rindex>
                                    </slot>
                                </tr>
                            </template>
                        </template>
                    </tbody>
                    <slot name="tabfoot">

                    </slot>

                </table>

            </div>
        </div>


            <div class="fixed-table-pagination" :style="{'min-height':mytoolbar.length > 0 ?'50px':''}">
                <div class="fixed-table-footer" v-if="mytoolbar.length >0" style="padding-left:5px;">
                <template v-for="(btn, index) in mytoolbar" >
                    <yuman-tab-toolbar v-if="btn.visiabled"  v-bind:disabled="btn.disabled"  v-bind:name="btn.name" v-bind:title="btn.title" v-bind:css="btn.css" :style="btn.style"  v-bind:licss="btn.licss"  v-on:click="toolbarClick(btn)" ></yuman-tab-toolbar>
                    <span v-if="index!= mytoolbar.length-1" style="color: lightskyblue;" > | </span>
                </template>
                </div>
                <div class="fixed-table-footer">
                    <slot name="aftertoolbar"></slot>
                </div>

                <div class="pull-left pagination-detail"  style="padding-left:10px;" v-if="hasSelected || total || pagination" v-show="!hiddenBottomText"> 

                <span class="pagination-info" v-if="hasSelected || total">
                {{getTableTotalCount()}}
                </span>
                <span class="page-list" v-if="showNumber.length >0 && pagination">
                <span class="btn-group dropdown dropup"  >
                    <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" >
                        <span class="page-size">
                        {{page.pageSize}}
                        </span>
                        <span class="caret"></span>
                    </button>
                    <ul class="dropdown-menu" role="menu">
                        <template v-for="(asize, sindex) in sizes">
                            <li role="menuitem" v-if="asize==page.pageSize" class="active"><a href="#" v-on:click="pageSizeChange(asize)">{{asize}}</a></li>
                            <li role="menuitem" v-else><a href="#" v-on:click="pageSizeChange(asize)">{{asize}}</a></li>
                        </template>
                    </ul>
                    </span>&nbsp;&nbsp;{{L("CountPage")}}</span>
                </div>
                <div v-if="showNumber.length >0 && pagination" class="pull-right pagination" >
                    <ul class="pagination">
                        <li v-if="showPreMore" class="page-item page-pre" v-on:click="pageIndexChange(1)"><a class="page-link" aria-label="previous page" href="javascript:void(0)">‹‹</a></li>
                        <li v-if="showPreMore" class="page-item page-pre" v-on:click="pagePreChange"><a class="page-link" aria-label="previous page" href="javascript:void(0)">‹</a></li>
                        <li  v-if="dropPage.minNumber!=1"   class="page-item" v-on:click="pageIndexChange(1)"><a class="page-link"   href="javascript:void(0)">1</a></li>
                        <li v-if="dropPage.dropNumbers1.length >0">
                           <span style="padding: 6px 1px">
                             <li class="page-item page-last-separator" data-toggle="dropdown">
                               <a class="page-link" href="javascript:void(0)">...</a>
                            </li>
                           <ul class="dropdown-menu dropdown-menu-droppage" ref="dropPageContainer1" style="max-height:200px;overflow-y:auto;" @scroll="dropPageScroll1">
                             <template v-for="(anum, sindex) in dropPage.dropNumbers1">
                               <li class="page-item" v-on:click="pageIndexChange(anum)"><a class="page-link"   href="javascript:void(0)">{{anum}}</a></li>
                             </template>
                           </ul>
                          </span>
                        </li>
                        <template v-for="(anum, sindex) in showNumber">
                            <li v-if="anum==page.pageIndex" class="page-item active"  v-on:click="pageIndexChange(anum)"><a class="page-link" href="javascript:void(0)">{{anum}}</a></li>
                            <li v-else   class="page-item" v-on:click="pageIndexChange(anum)"><a class="page-link"   href="javascript:void(0)">{{anum}}</a></li>
                        </template>
                        <li v-if="dropPage.dropNumbers2.length >0">
                           <span style="padding: 6px 1px">
                             <li class="page-item page-last-separator" data-toggle="dropdown">
                               <a class="page-link" href="javascript:void(0)">...</a>
                            </li>
                            <ul class="dropdown-menu dropdown-menu-droppage" ref="dropPageContainer2" style="max-height:200px;overflow-y:auto;" @scroll="dropPageScroll2">
                             <template v-for="(anum, sindex) in dropPage.dropNumbers2">
                               <li class="page-item" v-on:click="pageIndexChange(anum)"><a class="page-link"   href="javascript:void(0)">{{anum}}</a></li>
                             </template>
                           </ul>
                          </span>
                        </li>
                        <li  v-if="dropPage.maxNumber!=dropPage.pagerCount"   class="page-item" v-on:click="pageIndexChange(dropPage.pagerCount)"><a class="page-link"   href="javascript:void(0)">{{dropPage.pagerCount}}</a></li>
                        <li  v-if="showNextMore" class="page-item page-next" v-on:click="pageNexChange"><a class="page-link" aria-label="next page" href="javascript:void(0)">›</a></li>
                        <li  v-if="showNextMore" class="page-item page-next" v-on:click="pageMaxChange"><a class="page-link" aria-label="next page" href="javascript:void(0)">››</a></li>
                    </ul>
                </div>
                <slot name="afterpagination"></slot>
        </div>
        <div class="fixMenu" :id="'fixContext'+fixDetailTableIndex" v-if="fixAble">
            <ul>
                <li v-on:click.stop="clickFixMul()">{{L("Fixed")}} <input v-model.number="fixNum" v-on:click.stop="{}" class="stickyInput" type="number" v-on:change="fixMul()"> {{L("Columns")}}</li>
                <li v-on:click.stop="clearFix()" v-if="binding">{{L("RemoveFixed")}}</li>
            </ul>
        </div>

    </div>


    `
})




// 定义名为 yuman-btn-search 的新组件
var yumanRowTxt = Vue.component('yuman-table-txt', {
    props: {
        css: {
            type: String,
        },
        col: {
            type: Object,
        },
        row: {
            type: Object
        },
        rowindex: { type: Number },
        visiabled: {
            type: Object,
            default: true
        },

    },
    data: function() {
        return {
            idnumber3: '',//标签唯一ID，用来定位标签使用js操作节点
        }
    },
    computed:{
        txtVisiable:function(){
            return this.getVisiabled()
            
        }
    },
    methods: {

        onchange: function (e) {
            if (this.col.onchange) {
                if (!this.number3CheckValidity()) {
                    return;
                }
                this.col.onchange(this.row, this.rowindex, this.$parent.$parent, e, this.$parent);
            }
        },
        onBlur: function (e) {
            if (this.col.onBlur) {
                if (!this.number3CheckValidity()) {
                    return;
                }
                this.col.onBlur(this.row, this.rowindex, this.$parent.$parent, e, this.$parent);
            }
        },
        oninput: function (e) {
            if (this.idnumber3) {
                var inputWastage = $('#' + this.idnumber3)[0];
                if (inputWastage) {
                    inputWastage.setCustomValidity("");//输入时清空错误提示
                }
            }

            if (this.col.oninput) {
                if (!this.number3CheckValidity()) {
                    return;
                }
                this.col.oninput(this.row, this.rowindex, this.$parent.$parent, e, this.$parent);
            }
        },
        getDisabled: function () {
            var obj = this.col.disabled;
            if (obj) {
                if (typeof obj == "function") {
                    return this.col.disabled(this.row, this.rowindex, this.$parent.$parent);
                }
                return this.col.disabled;
            }
            return false;
        },
        getVisiabled: function () {
            var obj = this.col.visiabled;
            if (obj) {
                if (typeof obj == "function") {
                    return this.col.visiabled(this.row, this.rowindex, this.$parent.$parent);
                }
                return this.col.visiabled;
            }
            return obj === false ? false : true
        },
        getSelectText: function () {
            //可以实现下拉框列的同时，某行是文本，某行是下拉框，如果返回的是空/空字符串/未定义，当前行都显示为下拉框，如果返回有效字符串则显示文本
            var obj = this.col.selectText;
            if (obj) {
                if (typeof obj == "function") {
                    return this.col.selectText(this.row, this.rowindex, this.$parent.$parent);
                }
                return this.col.selectText;
            }
            return '';
        },
        getSelectData: function () {
            //获取当前行的数据作为下拉框内容
            var obj = this.col.selectData;
            if (obj) {
                if (typeof obj == "function") {
                    return this.col.selectData(this.row, this.rowindex, this.$parent.$parent);
                }
                return this.col.selectData;
            }
            return [];
        }
        , getColValue: function () {
            //let val = eval("this.row." + this.col.field);
            let val = eval("this.row['" + this.col.field + "']");//如果字段带有空格，上面的那种取值方法会报错
            if (this.col.formatter) {

                return this.col.formatter(val, this.row, this.rowindex, this.$parent)
            } else {
                return val;
            }
        }, getValue: function () {
            //let val = eval("this.row." + this.col.field, this);
            //let val = eval("this.row['" + this.col.field + "']", this);//如果字段带有空格，上面的那种取值方法会报错
            let val = this.row[this.col.field];//如果字段带有单引号，上面的那种取值方法会报错
            return val;
        },
        getNumberValue: function () {
            if (this.col.type == 'number3' && this.col.isReportValidity) {
                return;
            }
            let val = this.row[this.col.field] + "";
            this.row[this.col.field] = parseInt(val.replace(/[^\d]/g, '')) || 0
        },
        inputEnter: function () {
            this.$emit('rowInputEnter', this.row, this.col.field, this.rowindex, this)
        },
        inputDirectionUp: function () {
            this.$emit('rowInputDirectionUp', this.row, this.col.field, this.rowindex, this)
        },
        inputDirectionDown: function () {
            this.$emit('rowInputDirectionDown', this.row, this.col.field, this.rowindex, this)
        },
        onFocus: function () {

            var $ell = $(this.$el).find("input");
            console.warn('onFocus', $ell);


            this.$nextTick(() => {
                this.$refs[this.col.field].focus();
            })

        },
        setClick: function (e) {
            if (this.col.setclick) {
                this.col.setclick(this.row, this.rowindex, this.$parent.$parent, e, this.$parent);
            }
        },
        setBlur: function (e) {
            if (this.col.setBlur) {
                this.col.setBlur(this.row, this.rowindex, this.$parent.$parent, e, this.$parent);
            }
        },
        setPaste: function (e) {
            if (this.col.setPaste) {
                this.col.setPaste(this.row, this.rowindex, this.$parent.$parent, e, this.$parent);
            }
        },
        setFocus: function (e) {
            if (this.col.setFocus) {
                this.col.setFocus(this.row, this.rowindex, this.$parent.$parent, e, this.$parent);
            }
        },
        setInit: function () {
            // $("[data-toggle='popover']").popover({ 'trigger': 'hover', 'placement': 'auto top', 'container': 'body' });
            if (this.col.setInit) {
                this.col.setInit(this.row, this.rowindex, this.$parent.$parent)
            }
        },
        setContextMenu: function (e) {
            if (this.col.setContextMenu) {
                return this.col.setContextMenu(this.row, this.rowindex, this.$parent.$parent, e, this.$parent)
            }
            return true;
        }
        , getIsMustInput: function () {
            return this.col.isMust;
        },
        copyValue: function () {
            const input = document.createElement("input")
            input.value = this.row[this.col.field]
            document.body.appendChild(input)
            input.select()
            document.execCommand("copy")
            document.body.removeChild(input)
        },
        getExtendIndex: function () {
            return this.$parent.extendindex > -1 ? this.$parent.extendindex : ""
        },
        onSelect2Change: function (value, e) {
            if (this.col.onchange) {
                this.col.onchange(this.row, this.rowindex, this.$parent.$parent, value, e, this.$parent, value);
            }
        },
        onOpening: function (e) { // 打开前
            if (this.col.onOpening) {
                this.col.onOpening(this.row, this.rowindex, this.$parent.$parent, e, this.$parent)
            }
        },
        onOpen: function (e) {  // 打开后
            if (this.col.onOpen) {
                this.col.onOpen(this.row, this.rowindex, this.$parent.$parent, e, this.$parent)
            }
        },
        number3CheckValidity: function () {
            if (this.col.type == 'number3' && this.col.isReportValidity) {
                var inputWastage = $('#' + this.idnumber3)[0];
                if (inputWastage.validity.badInput ||
                    inputWastage.validity.patternMismatch ||
                    inputWastage.validity.rangeOverflow ||
                    inputWastage.validity.rangeUnderflow ||
                    inputWastage.validity.stepMismatch ||
                    inputWastage.validity.tooLong ||
                    inputWastage.validity.tooShort ||
                    inputWastage.validity.typeMismatch ||
                    inputWastage.validity.valueMissing) {
                    inputWastage.setCustomValidity(L("VansPoInformation.IntegerFormatError", L("ReleaseOrder.WastagePercent")));
                } else {
                    inputWastage.setCustomValidity("");//注意一定要清空自定义错误，不然输入什么都是错误的
                }
                var isCheck = inputWastage.reportValidity();
                if (!isCheck) {
                    return false;
                }
            }
            return true;
        }
    },
    mounted: function () {
        this.setInit();
        var self = this;
        
        if (self.col.type == 'date' || self.col.type == 'date2') {
            self.$nextTick(function () {
                var $date = $(self.$el).find(".yumanTableDate");
                var ssetting = { startDate: self.getValue(), locale: { format: self.col.format } };
                if (self.getValue()) {
                    ssetting.startDate = self.getValue();
                } else if (self.col.nullDate) {
                    ssetting.startDate = self.col.nullDate;//如果值默认是空的时候，给一个初始值，防止日期控件出现NaN
                }
                ssetting.autoUpdateInput = false;
                ssetting.calendarMode = self.col.calendarMode ? self.col.calendarMode : "day";
                yuman.vueui.yumanDatePickerShort($date, ssetting, (ldate, label) => {
                    // self.$emit('date-start', ldate)
                    self.row[self.col.field] = ldate.format(self.col.format);
                });
                $date.on('change', function (e) {
                    setTimeout(() => {
                        self.row[self.col.field] = this.value;
                        if (self.col.onchange) {
                            self.col.onchange(self.row, self.rowindex, self.$parent.$parent);
                        }
                    }, 0)
                })
            })
        }
        else if (self.col.type == 'logoImg' || self.col.type == 'productImg') {
            // this.loadingImg()
            let magnifyOptions = {
                title: false,
                initMaximized: true,
                headToolbar: ['close'],
                footToolbar: ['zoomIn', 'zoomOut', 'fullscreen', 'actualSize', 'rotateRight']
            }
            $('[data-magnify=gallery]').magnify(magnifyOptions);
        }
        else if (self.col.type == 'number3') {
            this.idnumber3 = yuman.vueui.guid();
        }
    },
    template: `
    <template v-if="col.type == 'input'"  >
        <span > <input  :class="col.css" class="yumanTableInput"  autocomplete="off" :name="rowindex +'_'+ col.field" type="text" :ref="col.field" v-model.trim="row[col.field]"  :disabled="getDisabled()" v-if="txtVisiable" v-on:input="onchange" v-on:click="setClick" v-on:blur="setBlur" v-on:paste="setPaste" v-on:focus="setFocus" :placeholder="col.placeholder" :title="row[col.field]" :readonly="col.isreadonly" v-on:contextmenu="setContextMenu" v-on:keyup.up="inputDirectionUp" v-on:keyup.down="inputDirectionDown" v-on:keyup.enter="inputDirectionDown" /><span v-if="getIsMustInput()" style="color:red">*</span></span>
    </template>
    <template v-else-if="col.type == 'number'" >
        <span > <input   :class="col.css" class="yumanTableNumber" autocomplete="off" :name="rowindex +'_'+ col.field" type="number"  :ref="col.field" :onkeyup="getNumberValue()"  v-model.number="row[col.field]" v-on:input="oninput" v-on:click="setClick" :disabled="getDisabled()" v-on:change="onchange" v-on:blur="onBlur" v-on:keyup.enter="inputEnter"  v-if="txtVisiable" v-on:contextmenu="setContextMenu"/> <span v-if="getIsMustInput()" style="color:red">*</span></span>
    </template>
    <template v-else-if="col.type == 'number2'" >
        <span > <input   :class="col.css" class="yumanTableNumber" autocomplete="off" :name="rowindex +'_'+ col.field" type="text" :onkeyup="getNumberValue()" :ref="col.field"  v-model.number="row[col.field]" v-on:input="oninput" v-on:click="setClick" :disabled="getDisabled()" v-on:change="onchange" v-on:keyup.enter="inputEnter"  v-if="txtVisiable" v-on:contextmenu="setContextMenu"/> <span v-if="getIsMustInput()" style="color:red">*</span></span>
    </template>
    <template v-else-if="col.type == 'number3'" >
        <span > <input  :id="idnumber3" :min="col.min" :class="col.css" class="yumanTableNumber" autocomplete="off" :name="rowindex +'_'+ col.field" type="number"  :ref="col.field" :onkeyup="getNumberValue()"  v-model.number="row[col.field]" v-on:input="oninput" v-on:click="setClick" :disabled="getDisabled()" v-on:change="onchange" v-on:blur="onBlur" v-on:keyup.enter="inputEnter"  v-if="txtVisiable" v-on:contextmenu="setContextMenu"/> <span v-if="getIsMustInput()" style="color:red">*</span></span>
    </template>
    <template v-else-if="col.type == 'date'"  >
    <span style="position:relative"><span class="clearTableDate" v-on:click="row[col.field]=''" v-if="row[col.field] && !col.hiddenClear && txtVisiable">×</span><input  :class="col.css" class="yumanTableDate" autocomplete="off" v-show="txtVisiable"  :name="rowindex +'_'+ col.field" type="text" :ref="col.field" v-model.trim="row[col.field]"  :disabled="getDisabled()"/> <span v-if="getIsMustInput()" style="color:red">*</span></span>
    </template>
    <template v-else-if="col.type == 'date2'"  >
    <span style="position:relative"><span class="clearTableDate" v-on:click="row[col.field]=''" v-if="row[col.field] && !col.hiddenClear && txtVisiable">×</span><input  :class="col.css" class="yumanTableDate" autocomplete="off" v-show="txtVisiable" :name="rowindex +'_'+ String.fromCharCode(65+Math.ceil(Math.random() * 25)) + String.fromCharCode(65+Math.ceil(Math.random() * 25)) + String.fromCharCode(65+Math.ceil(Math.random() * 25)) + String.fromCharCode(65+Math.ceil(Math.random() * 25)) +'_'+ col.field" type="text" :ref="col.field" v-model.trim="row[col.field]"  :disabled="getDisabled()"/> <span v-if="getIsMustInput()" style="color:red">*</span></span>
    </template>
    <template v-else-if="col.type == 'checkbox'" >
        <span > <input :class="col.css"  class="yumanTableChekbox"   :name="rowindex +'_'+ col.field" type="checkbox"  :ref="col.field"  v-model="row[col.field]" :disabled="getDisabled()" v-on:change="onchange" /></span>
    </template>
    <template v-else-if="col.type == 'select'" >
        <span > <select   :class="col.css" class="yumanTableSelect"  :name="rowindex +'_'+ col.field"  :ref="col.field"  v-model="row[col.field]" :disabled="getDisabled()" v-on:change="onchange" >
            <template>
                <option v-for="(opt,idx) in col.rows" :key='opt.text' :value='opt.id'  >{{opt.text}}</option>
            </template>
        </select> </span>
    </template>
    <template v-else-if="col.type == 'sp_select'">
        <span v-if="row[col.optionsListName] && row[col.optionsListName].length">
            <select :class="col.css" class="yumanTableSelect"  :name="rowindex +'_'+ col.field"  :ref="col.field"  v-model="row[col.field]" :disabled="getDisabled()" v-on:change="onchange" >
                <template>
                    <option v-for="(opt,idx) in row[col.optionsListName]" :key='opt.text' :value='opt.id'  >{{opt.text}}</option>
                </template>
            </select>
        </span>
        <span v-else class="yumanTableSpan" :class="col.css"  v-on:click="setClick" :ref="col.field" data-toggle="popover"  :title="getValue()"  >{{row[col.field]}}</span>
    </template>
    <template v-else-if="col.type == 'href'" >
        <a :name="rowindex +'_'+ col.field"   :ref="col.field"    :disabled="getDisabled()" v-on:click="onchange" :href="col.href(row)" > <span :class="col.css"  class="yumanTableHref">{{getValue()}}</span></a>
    </template>
    <template v-else-if="col.type == 'button'" >
        <button :name="rowindex +'_'+ col.field" :class="col.css" :ref="col.field"  :disabled="getDisabled()" v-on:click="setClick">{{(col.btnTitle || col.title)}}</span></button>
    </template>
    <template v-else-if="col.type == 'select2'">
        <yuman-table-select2 :datas="col.datas" v-if="txtVisiable" :noResultsText="col.noResultsText" :tags="col.tags" :isCompareText="col.isCompareText" :allowClear="col.allowClear" :multiple="col.multiple" :title="getValue() || col.placeholder" :placeholder="col.placeholder" :length="col.length" :disabled="getDisabled()" :value="row[col.field]" :name="String.fromCharCode(65+Math.ceil(Math.random() * 25)) + String.fromCharCode(65+Math.ceil(Math.random() * 25)) + String.fromCharCode(65+Math.ceil(Math.random() * 25)) + String.fromCharCode(65+Math.ceil(Math.random() * 25)) +'_'+ col.field" v-on:change="onSelect2Change" v-on:onOpening="onOpening" v-on:onOpen="onOpen" :ref='"select2_"+rowindex+"_"+getExtendIndex()' ></yuman-table-select2>
    </template>
    <template v-else-if="col.type == 'select2Html'">
        <yuman-table-select2 :datas="col.datas" v-if="txtVisiable" :isHtmlText="col.isHtmlText" :afterField="col.afterField" :noResultsText="col.noResultsText" :tags="col.tags" :isCompareText="col.isCompareText" :allowClear="col.allowClear" :multiple="col.multiple" :title="getValue() || col.placeholder" :placeholder="col.placeholder" :length="col.length" :disabled="getDisabled()" :value="row[col.field]" :name="String.fromCharCode(65+Math.ceil(Math.random() * 25)) + String.fromCharCode(65+Math.ceil(Math.random() * 25)) + String.fromCharCode(65+Math.ceil(Math.random() * 25)) + String.fromCharCode(65+Math.ceil(Math.random() * 25)) +'_'+ col.field" v-on:change="onSelect2Change" v-on:onOpening="onOpening" v-on:onOpen="onOpen" :ref='"select2_"+rowindex+"_"+getExtendIndex()' ></yuman-table-select2>
    </template>
    <template v-else-if="col.type == 'select2HtmlAndData'">
        <div v-if="!getSelectText()">
            <yuman-table-select2 :datas="getSelectData()" v-if="txtVisiable" :isHtmlText="col.isHtmlText" :afterField="col.afterField" :noResultsText="col.noResultsText" :tags="col.tags" :isCompareText="col.isCompareText" :allowClear="col.allowClear" :multiple="col.multiple" :title="getValue() || col.placeholder" :placeholder="col.placeholder" :length="col.length" :disabled="getDisabled()" :value="row[col.field]" :name="String.fromCharCode(65+Math.ceil(Math.random() * 25)) + String.fromCharCode(65+Math.ceil(Math.random() * 25)) + String.fromCharCode(65+Math.ceil(Math.random() * 25)) + String.fromCharCode(65+Math.ceil(Math.random() * 25)) +'_'+ col.field" v-on:change="onSelect2Change" v-on:onOpening="onOpening" v-on:onOpen="onOpen" :ref='"select2_"+rowindex+"_"+getExtendIndex()' ></yuman-table-select2>
        </div>
        <div v-else>
            <span>{{getSelectText()}}</span>
        </div>
    </template>
    <template v-else-if="col.type == 'logoImg'">
        <div v-if="row[col.field]=='data:image/jpg;base64,'||row[col.field]==''">
        
        </div>
        <div v-else-if="!row[col.field]" class="smallImageLoading fa fa-spinner fa-spin">
        
        </div>
        <div v-else :style="row[col.field]?'cursor:zoom-in;border:1px solid rgb(221,221,221)':''"  :class="row[col.field]?'smallImageLoaded':row[col.field]!==''?'smallImageLoaded':'smallImageLoading fa fa-spinner fa-spin'"  style="">
            <img :name="rowindex +'_'+ col.field" data-magnify="gallery" :data-src="row[col.field]" :src="row[col.field]" style="width:100%;max-height:inherit;object-fit: contain;"  >
        </div>
    </template>
    <template v-else>
        <span v-if="col.formatter" class="yumanTableSpan"   :ref="col.field" data-toggle="popover" v-html="getColValue()"> </span>
        <span v-else-if="col.showMaxLength && col.showMaxLength > 0" class="yumanTableSpan" :class="col.css"  v-on:click="setClick" :ref="col.field" data-toggle="popover"  :title="getValue()"  ><div class="hide_over" :style="'max-width:'+col.showMaxLength+'px'">{{row[col.field]}}</div></span>
        <span v-else class="yumanTableSpan" :class="col.css"  v-on:click="setClick" :ref="col.field" data-toggle="popover"  :title="getValue()"  >{{row[col.field]}}</span>
    </template>
    `
})


var yumanRowSelect2 = Vue.component('yuman-table-select2', {
    props: {
        value: Object,
        name: String,
        tags: {
            type: Boolean,
            default: false
        },
        allowClear: {
            type: Boolean,
            default: true
        },
        multiple: {
            type: Boolean,
            default: false
        },
        datas: {
            type: Array,
            default: [],
        },
        length: {
            type: Number,
            default: 100
        },
        disabled: {
            type: Object,
            default: false,
        },
        placeholder: {
            type: String,
            default: ""
        },
        isHtmlText: {//拓展功能：支持文本转Html显示
            type: Boolean,
            default: false
        },
        afterField: {//拓展功能：支持选择之后的文本显示指定源数据的字段，此功能需要在【支持文本转html显示】功能的基础上进行支持
            type: String,
            default: ""
        },
        isCompareText: {
            type: Boolean,
            default: true
        },
        noResultsText: {//没有选项时默认提示文本
            type: String,
            default: ""
        }
    },
    methods: {
        selected: function (val) {
            $(this.$el).find("select[name=" + this.name + "]").val(val).trigger("change");
        },
        init: function (openInitFlag = false) {
            var $selct = $(this.$el).find("select[name=" + this.name + "]");
            $selct.empty();
            var dds = this.datas.map(s => {
                var a = { id: s.id, text: s.text, disabled: s.disabled, selected: s.selected };
                if (this.isCompareText) {
                    if (s.text == this.value) {
                        a.selected = true;
                    }
                }
                else {
                    if (s.id == this.value) {
                        a.selected = true;
                    }
                }
                return a;
            });
            var dt = {
                allowClear: this.allowClear, data: dds, multiple: false, placeholder: this.placeholder, dropdownAutoWidth: true, width: this.length, tags: this.tags
            };
            if (this.isHtmlText) {
                var self = this;
                dt.templateResult = function (state) {//选择时
                    if (!state.id) { return state.text }
                    var $state = $(state.text);
                    return $state;
                }
                dt.templateSelection = function (state) {//选择后
                    if (!state.id) { return state.text }
                    if (self.afterField) {
                        var index = self.datas.findIndex(f => f.id == state.id);
                        if (index !== -1) {
                            if (self.datas[index][self.afterField]) {//显示源数据指定字段的值
                                return self.datas[index][self.afterField];
                            }
                        }
                    }
                    var $state = $(state.text);
                    return $state;
                }
            }
            if (this.noResultsText) {
                dt.language = {
                    noResults: (params) => {
                        return this.noResultsText;
                    }
                };
            }
            $selct.select2(dt);
            $('.select2-selection__rendered').hover(function () {
                $(this).removeAttr('title');
            });
            if (openInitFlag) {
                $selct.select2("open") // 监听open事件 调用init时避免死循环
            }
        },
        reset: function () {
            var $selct = $(this.$el).find("select[name=" + this.name + "]");

            var dds = this.datas.map(s => {
                var a = { id: s.id, text: s.text, disabled: s.disabled, selected: s.selected };
                if (s.text == this.value) {
                    a.selected = true;
                }
                return a;
            });
            var dt = {
                allowClear: this.allowClear, data: dds, multiple: false, placeholder: this.placeholder, dropdownAutoWidth: true, width: this.length, tags: this.tags
            };
            if (this.noResultsText) {
                dt.language = {
                    noResults: (params) => {
                        return this.noResultsText;
                    }
                };
            }
            $selct.select2(dt);
            $('.select2-selection__rendered').hover(function () {
                $(this).removeAttr('title');
            });
        },
        getDisabled: function () {
            var obj = this.disabled;
            if (obj) {
                if (typeof obj == "function") {
                    return this.disabled();
                }
                return this.disabled;
            }
        },
        addOption: function (text, id) {
            var newOption = new Option(text, id);
            $(this.$el).find("select[name=" + this.name + "]").append(newOption)
        }
    },
    mounted: function () {
        var self = this;
        var $selct = $(self.$el).find("select[name=" + self.name + "]");
        $selct.on('change', function (e) {
            let val = $selct.val();//val 可能是单选，也可能是数组
            console.log(self.name, 'change', val, self.value);
            if (val == self.value) return;
            self.value = val;
            self.$emit('change', val, e)
        });
        $selct.on('select2:opening', function (e) {
            self.$emit('onOpening', e)
            const evt = "scroll.select2";
            $(e.target).parents().off(evt);
            $(window).off(evt);
        })
        $selct.on('select2:open', function (e) {
            self.$emit('onOpen', e)
            const evt = "scroll.select2";
            $(e.target).parents().off(evt);
            $(window).off(evt);
        })
        this.init();
        this.$nextTick(function () {
            self.$on('initInput', function () {
                self.init()
            })
        })
    },
    template: `
        <span class="tableSelect2"> <select :name="name" :disabled="getDisabled()"/></span>
    `
})


// 定义名为 yuman-btn-search 的新组件
var yumanRowBtn = Vue.component('yuman-table-btn', {
    props: {

        licss: {
            type: String,

        },
        row: {
            type: Object
        },
        btn: {
            type: Object
        },

        rowindex: {
            type: Number
        },

    },
    data: function () {
        return {
            className: ''
        }
    },
    methods: {
        onclick: function () {

            if (this.btn.onclick) {
                this.btn.onclick(this.row, this.rowindex, this.$parent.$parent, this.$parent);
            }
        }
        , getDisabled: function () {

            var obj = this.btn.disabled;
            if (obj) {
                if (typeof obj === "function") {
                    return this.btn.disabled(this.row, this.btn, this.$parent.$parent, this.$parent);
                }
                return this.btn.disabled;
            }

        }, getVisiabled: function () {
            var obj = this.btn.visiabled;
            if (obj) {
                if (typeof obj === "function") {
                    return this.btn.visiabled(this.row, this.$parent.$parent);
                }

                return this.btn.visiabled;
            }

        },
    },

    template: `<button type="button" v-if="getVisiabled()"  :disabled="getDisabled()" :title="btn.title" :name="btn.name" v-on:click="onclick" class="btn btn-xs" :class="btn.css" :style="btn.style" style="margin:0 3px;"><i :class="btn.licss"></i>{{btn.title}}</button>`
})




// 定义名为 yuman-table-toolbar 的新组件
var yumanTableToolbar = Vue.component('yuman-tab-toolbar', {
    props: {
        name: {
            type: String,
        },

        title: {
            type: String,
        },
        css: {
            type: String,
        },
        style: {
            type: Object,
        },
        licss: {
            type: String,
        },
        disabled: {
            type: Object,
            default: false
        },
        visiabled: {
            type: Object,
            default: true
        }
    },
    methods: {
        onclick: function () {
            this.$emit('click')
        }, getDisabled: function () {
            var obj = this.disabled;
            if (obj) {
                if (typeof obj == "function") {
                    return this.disabled(this.$parent);
                }
                return this.disabled;
            }
        }
        , getVisiabled: function () {
            var obj = this.visiabled;
            if (obj) {
                if (typeof obj == "function") {
                    return this.visiabled(this.$parent);
                }
                return this.visiabled;
            }
        }
    },
    template: `
        <button type="button" v-if="getVisiabled()" v-bind:disabled="getDisabled()"  :name="name" v-on:click="onclick" class="btn btn-xs" :class="css" :style="style"><i :class="licss"></i>{{title}}</button>
    `
})


// 定义名为 yuman-btn-search 的新组件
var yumanButton = Vue.component('yuman-button', {
    props: {
        css: {
            type: String,
        },
        cssli: {
            type: String,
        },
        name: {
            type: String,
        },
        title: {
            type: String,
        },
        disabled: {
            type: Object,
            default: false,
        },
        visiabled: {
            type: Object,
            default: true
        },

    },
    methods: {
        doclick: function () {
            this.$emit('click')
        }
        , getDisabled: function () {
            var obj = this.disabled;
            if (obj) {
                if (typeof obj == "function") {
                    return this.disabled(this.$parent);
                }
                return this.disabled;
            }
        }
        , getVisiabled: function () {
            var obj = this.visiabled;
            if (obj) {
                if (typeof obj == "function") {
                    return this.visiabled(this.$parent);
                }
                return this.visiabled;
            }
        }
    },
    template: `
    <button type="button" v-if="getVisiabled()" :disabled="getDisabled()" :name="name" v-on:click="doclick" class="btn" :class="css">{{title}}</button>
    `
})


// 定义名为 yuman-btn-search 的新组件
var yumanSearchButton = Vue.component('yuman-ser-search', {
    props: {
        name: {
            type: String,
        },
        title: {
            type: String,
        },
        disabled: {
            type: Object,
            default: false
        },
        visiabled: {
            type: Object,
            default: true
        },
        repage: Function
    },
    methods: {
        dosearch: function () {
            if (this.repage) {
                this.repage();
            }
            this.$emit('search')
        }
        , getDisabled: function () {
            var obj = this.disabled;
            if (obj) {
                if (typeof obj == "function") {
                    return this.disabled();
                }
                return this.disabled;
            }
        }, getVisiabled: function () {
            var obj = this.visiabled;
            if (obj) {
                if (typeof obj == "function") {
                    return this.visiabled(this.row);
                }
                return this.visiabled;
            }
        }
    },
    template: `
    <div class="form-group" v-if="getVisiabled()">
        <button type="button"  :disabled="getDisabled()" :name="name" v-on:click="dosearch" class="btn btn-primary btn-sm"><i class="fa fa-search"></i>{{title}}</button>
    </div>
    `
})


// 定义名为 yuman-btn-search 的新组件
var yumanResetButton = Vue.component('yuman-ser-reset', {
    props: {
        name: {
            type: String,
        },
        title: {
            type: String,
        },
        disabled: {
            type: Boolean,
            default: false
        },
        visiabled: {
            type: Object,
            default: true
        },
        search: Object
    },
    methods: {
        doreset: function () {
            var obj = this.search;
            var keys = Object.keys(obj);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var item = obj[key];
                var operator = item.type;

                //时间类型，时间类型的不变化
                if (operator === 'Between') {
                    item.value.start = item.start.text;
                    item.value.end = item.end.text;
                }
                else if (operator === 'In') {
                    var yumanValue = item.value.value;
                    if (Array.isArray(yumanValue)) {
                        item.value.value = [];
                    }
                    else {
                        item.value.value = null;
                    }
                }
                else {
                    var yumanValue = item.value.value;
                    item.value.value = null;
                }
                if (item.datas && Array.isArray(item.datas) && item.datas.length > 0) {
                    item.datas = [];
                    if (item.onInit) { item.onInit(this); }
                }
            }
            this.$emit('reset')
        }, getVisiabled: function () {
            var obj = this.visiabled;
            if (obj) {
                if (typeof obj == "function") {
                    return this.visiabled(this);
                }
                return this.visiabled;
            }

        }
    },
    template: `
    <div class="form-group"  v-if="getVisiabled()">
        <button type="button" v-bind:disabled="disabled" :name="name" v-on:click="doreset" class="btn btn-primary btn-sm"><i class="fa fa-undo"></i>{{title}}</button>
    </div>
    `
})

var yumanSearchResetButton = Vue.component('yuman-ser-search-reset', {
    props: {
        searchobj: Object,
        resetobj: Object,
        dosearch: Function,
        doreset: Function,
        search: Object,

    },
    template: `
        <div class="form-group">
            <yuman-ser-search v-bind="searchobj" v-on:search="dosearch" style="margin-left:5px;"></yuman-ser-search>
            <yuman-ser-reset v-bind="resetobj" v-on:reset="doreset" :search="search"></yuman-ser-reset>
        </div>
    `
})


yuman.vueui.yumanDatePicker = function (yumanobj, options, events) {

    var timepickeroption = {
        singleDatePicker: true, //单日历
        showDropdowns: true,
        autoUpdateInput: true,
        //startDate: enddt.format("yyyy-MM-dd"),
        locale: {
            format: "YYYY-MM-DD",
            separator: " ~ ",
            applyLabel: L("DateRangePicker.Apply"),
            cancelLabel: L("DateRangePicker.Cancel"),
            fromLabel: L("DateRangePicker.StartDate"),
            toLabel: L("DateRangePicker.EndDate"),
            customRangeLabel: L("Custom"),
        }
    };


    var daysOfWeek = [L("DateRangePicker.Su"), L("DateRangePicker.Mo"), L("DateRangePicker.Tu"), L("DateRangePicker.We"), L("DateRangePicker.Th"), L("DateRangePicker.Fr"), L("DateRangePicker.Sa")];
    var monthNames = [L("DateRangePicker.Jan"), L("DateRangePicker.Feb"), L("DateRangePicker.Mar"), L("DateRangePicker.Apr"), L("DateRangePicker.May"), L("DateRangePicker.Jun"), L("DateRangePicker.Jul"), L("DateRangePicker.Aug"), L("DateRangePicker.Sep"), L("DateRangePicker.Oct"), L("DateRangePicker.Nov"), L("DateRangePicker.Dec")];


    var yumanSetting = $.extend(timepickeroption, options);

    yumanSetting.locale.daysOfWeek = daysOfWeek;
    yumanSetting.locale.monthNames = monthNames;

    yumanobj.daterangepicker(yumanSetting, events);
    return yumanobj;
};
yuman.vueui.yumanDatePickerShort = function (yumanobj, options, events) {
    var timepickeroption = {
        singleDatePicker: true, //单日历
        showDropdowns: true,
        //startDate: enddt.format("yyyy-MM-dd"),
        locale: {
            format: "YYYY-MM-DD",
            separator: " ~ ",
            applyLabel: L("DateRangePicker.Apply"),
            cancelLabel: L("DateRangePicker.Cancel"),
            fromLabel: L("DateRangePicker.StartDate"),
            toLabel: L("DateRangePicker.EndDate"),
            customRangeLabel: L("Custom"),
        }
    };

    var daysOfWeek = [L("DateRangePicker.Su"), L("DateRangePicker.Mo"), L("DateRangePicker.Tu"), L("DateRangePicker.We"), L("DateRangePicker.Th"), L("DateRangePicker.Fr"), L("DateRangePicker.Sa")];
    var monthNames = [L("DateRangePicker.Jan"), L("DateRangePicker.Feb"), L("DateRangePicker.Mar"), L("DateRangePicker.Apr"), L("DateRangePicker.May"), L("DateRangePicker.Jun"), L("DateRangePicker.Jul"), L("DateRangePicker.Aug"), L("DateRangePicker.Sep"), L("DateRangePicker.Oct"), L("DateRangePicker.Nov"), L("DateRangePicker.Dec")];


    var yumanSetting = $.extend(timepickeroption, options, events);
    yumanSetting.locale.daysOfWeek = daysOfWeek;
    yumanSetting.locale.monthNames = monthNames;
    yumanobj.daterangepicker(yumanSetting, events);
    return yumanobj;
};


//弃用
yuman.vueui.getSearch = function (obj, page) {


    var yumanParam = {
        conditions: [],
        //sort: { key: "Id", sort: "DESC" }
    };
    if (page.sort) {
        yumanParam.sort = page.sort;
    }
    yumanParam.maxResultCount = page.pageSize;
    yumanParam.skipCount = (page.pageIndex - 1) * page.pageSize;
    if (obj == null) { }
    else {
        var keys = Object.keys(obj);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var yumanKey = obj[key].fied;
            if (!yumanKey) continue;
            let unlocal = obj[key].unLocalize || false
            var operator = obj[key].type;
            if (obj[key].undeal && obj[key].value.value) {
                yumanParam.conditions.push({ key: yumanKey, value: JSON.stringify(obj[key].value.value), operator: operator });
                continue
            }
            var val = null;
            //时间类型，添加两条
            if (operator === 'Between') {
                if (!obj[key].value.start && !obj[key].value.end)
                    val = ""
                else {
                    let timeEND = obj[key].value.end
                    if (obj[key].value.end) {    // end +1 day
                        dateLast = new Date(obj[key].value.end)
                        timeEND = new Date((dateLast / 1000 + 86400) * 1000).format('yyyy-MM-dd');
                    }
                    startDate = obj[key].value.start || ""
                    timeEND = timeEND || ""
                    if (startDate !== "" && unlocal === false) {
                        try {
                            startDate = moment.tz(startDate, 'YYYY-MM-DD', true, 'Asia/Shanghai').format();
                        } catch (exe) { }
                        startDate = (new Date(startDate).getTime())
                    }
                    if (timeEND !== "" && unlocal === false) {
                        try {
                            timeEND = moment.tz(timeEND, 'YYYY-MM-DD', true, 'Asia/Shanghai').format();
                        } catch (exe) { }
                        timeEND = new Date(timeEND).getTime()
                    }
                    val = startDate + "," + timeEND;
                    // if (obj[key].value.start) {
                    // } else {
                    //     val = '';
                    // }
                }
            }
            else if (operator === 'In') {
                var yumanValue = obj[key].value.value;
                if (yumanValue == null || yumanValue == '' || yumanValue.length == 0) { continue; }

                if (Array.isArray(yumanValue)) {
                    val = yumanValue.join(',');//将数组元素连接起来以构建一个字符串
                } else {
                    if (yumanValue && yumanValue.length > 0) {
                        val = yumanValue.replace(/[\r\n]/g, ",");
                    }
                }
            } else {
                var yumanValue = obj[key].value.value;
                if (yumanValue == null || yumanValue === '' || yumanValue.length == 0) { continue; }

                val = yumanValue + '';
            }
            const format = obj[key].format || ""
            if (format === "YYYY-MM-DD" && operator !== "Between" && unlocal == false) {
                try {
                    val = moment.tz(val, 'YYYY-MM-DD', true, 'Asia/Shanghai').format();
                } catch (exx) { }
                val = (new Date(val).getTime())
            }
            if (typeof (val) == "string")
                val = val.trim();
            if (val == null || val == '' || val.length == 0) { continue; }
            yumanParam.conditions.push({ key: yumanKey, value: val, operator: operator });
        }
    }
    return yumanParam;

}


//弃用
yuman.vueui.setReset = function (obj) {
    var vm = this;
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var item = obj[key];
        var operator = item.type;

        //时间类型，时间类型的不变化
        if (operator === 'Between') {
            item.value.start = item.start.text;
            item.value.end = item.end.text;
        }
        else if (operator === 'In') {
            var yumanValue = item.value.value;
            if (Array.isArray(yumanValue)) {
                item.value.value = [];
            }
            else {
                item.value.value = null;
            }
        } else {
            var yumanValue = item.value.value;
            item.value.value = null;
        }
        if (item.datas && Array.isArray(item.datas) && item.datas.length > 0) {
            item.datas = [];
            if (item.onInit) { item.onInit(vm); }
        }

    }
    return;

}
// 获取指定query值
yuman.vueui.getQueryString = function (name) {
    let reg = `(^|&)${name}=([^&]*)(&|$)`
    let r = window.location.search.substring(1).match(reg);
    if (r != null) return decodeURI(r[2]); return null;
}

// 把所有query值都合并到search里,放在created内。
yuman.vueui.getQueryToSearch = function (vm) {
    Object.keys(vm.search).map(title => {
        let res = yuman.vueui.getQueryString(title)
        if (res) {
            vm.search[title].value.value = res
        }
    })
}

//纵向的yuman-tab组 vertical
var yumanVerTab = Vue.component('yuman-ver-tab', {
    props: {
        id: {
            type: String,
            required: true
        },

        visiabled: {
            type: Object,
            default: true
        },
        tabs: {
            type: Array,//["菜单1","菜单2"]
            default: []
        },
        currentTab: {
            type: Number,
            default: 0
        },
        mencss: {
            type: String,
            default: 'tab list-group-item li_borderTop noborder'
        }
    },
    created: function () {
    },
    methods: {
        limenuClick: function (row, index) {
            this.currentTab = index;
            this.$emit('limenuClick', row, index)
        },
        getVisiabled: function () {
            var obj = this.visiabled;
            if (obj) {
                if (typeof obj == "function") {
                    return this.visiabled(this.row);
                }
                return this.visiabled;
            }

        }

    },
    template: `
    <div :id="id" class="main" v-if="getVisiabled()">
        <div class="left-menu"  >
            <ul class="sidebar-menu tree" >
                <template v-for="(item ,index ) in tabs" >
                <slot name="tabui">
                    <li v-bind:class="['treeview', { active: currentTab === index }]">
                        <a href="javascript:void(0)" :tab="'tab_'+index" :class="mencss" v-on:click="limenuClick(item,index)">{{item}}</a>
                    </li>
                </slot>
                <template>

            </ul>

        </div>
        <div class="right-content">
            <slot name="tabbody">
                <div id="tab_0" class="tab-item">
                </div>
            </slot>
        </div>
    </div>
    `
})

//横向的yuman tab组 horizontal
var yumanHorTab = Vue.component('yuman-hor-tab', {
    props: {
        id: {
            type: String,
            required: true
        },

        visiabled: {
            type: Object,
            default: true
        },
        tabs: {
            type: Array,//["菜单1","菜单2"]
            default: []
        },
        currentTab: {
            type: Number,
            default: 0
        },
        mencss: {
            type: String,
            default: 'card card-primary card-outline card-outline-tabs'
        }
    },
    created: function () {
    },
    methods: {
        limenuClick: function (row, index) {
            this.currentTab = index;
            this.$emit('limenuClick', row, index)
        },
        getVisiabled: function () {
            var obj = this.visiabled;
            if (obj) {
                if (typeof obj == "function") {
                    return this.visiabled(this);
                }
                return this.visiabled;
            }

        }

    },
    template: `
    <div :id="id"  class="main" v-if="getVisiabled()">
        <div :class="mencss">
            <div class="card-header p-0 border-bottom-0">
                <ul class="nav nav-tabs" role="tablist">
                    <template v-for="(item ,index ) in tabs" >
                    <slot name="tabui">
                        <li class="nav-item">
                            <a  v-bind:class="['nav-link', { active: currentTab === index }]" :id="'custom-tabs-{{index}}-tab'" data-toggle="pill" :href="'#custom-tabs-{{index}}-card'" role="tab" :aria-controls="'custom-tabs-{{index}}-card'" :aria-selected="currentTab === index">{{item}}</a>
                        </li>
                    </slot>
                    <template>

                </ul>

            </div>
            <div  class="card-body">
                <div class="tab-content" id="custom-tabs-tabContent">
                    <slot name="tabbody">
                        <div id="custom-tabs-0-card" role="tabpanel" aria-labelledby="custom-tabs-0-tab">
                        </div>
                    </slot>
                </div>
            </div>  <!-- /.card -->
        </div> <!-- /.card -->
    </div>
    `
})



// 定义名为 yuman-form-label 的新组件
var yumanForm = Vue.component('yuman-form', {
    props: {

        name: String,
        method: {
            type: String,
            default: 'post'
        },
        visiabled: {
            type: Object,
            default: true
        }
    },
    created: function () {
        // `this` 指向 vm 实例
    },
    methods: {
        getVisiabled: function () {
            var obj = this.visiabled;
            if (obj) {
                if (typeof obj == "function") {
                    return this.visiabled(this);
                }
                return this.visiabled;
            }

        }
    },
    template: `
    <form  :name="name"  role="form" :method="method" action="#" v-if="getVisiabled()">
        <div class="card-body">
            <slot name="body">
            </slot>
        </div>
        <div class="card-footer">
            <slot name="foot">
            </slot>
        </div>
    </form>
    `
})




// 定义名为 yuman-form-label 的新组件
var yumanModal = Vue.component('yuman-modal', {
    props: {
        id: String,
        name: String,
        isShow: {
            type: Boolean,
            default: false
        },
        title: String,
        hasLgClose: {
            type: Boolean,
            default: () => { return false; }
        },//遮罩背景点击关闭
        closeTitle: {
            type: String,
            default: () => { return L('Cancel'); }
        },
        saveTitle: {
            type: String,
            default: () => { return L('Save'); }
        },
        hasHeader: false,
        visiabled: {
            type: Object,
            default: () => { return true; }
        },
        cssCustom: {
            type: String,
            default: () => { return "width:auto;max-width:calc(100vw - 100px); height:auto; max-height:calc(100vh - 100px);"; }
        },   // 自定义大小或其他样式
        isSonModal: false, // 是子模态框 退出不显示body滚动条
        scrollToTop: {
            type: Boolean,
            default: true
        }
    },
    created: function () {
    },
    watch: {
        isShow: function (val) {
            if (val) {
                document.documentElement.style.overflow = "hidden";
                this.$nextTick(() => {
                    if (this.scrollToTop) {
                        $(".modal-body").scrollTop(0, 0);
                    }
                })
            }
            else if (!this.isSonModal) {
                document.documentElement.style.overflowY = "auto";
                document.documentElement.style.overflowX = "hidden";
            }
        }
    },
    methods: {
        onLgClick: function () {
            if (this.hasLgClose) this.onclose();
        },
        onclose: function () {
            this.$emit('onclose');
        },
        onsave: function () {
            this.$emit('onsave');
        },
        getVisiabled: function () {
            var obj = this.visiabled;
            if (obj) {
                if (typeof obj == "function") {
                    return this.visiabled(this);
                }
                return this.visiabled;
            }

        }
    },
    template: `
<div class="modal fade in" :id="id" :style="{'display':isShow ? 'block':'none'}"   aria-hidden="true"  >
    <div class="modal-dialog modal-lg" :style="cssCustom" >
        <div class="modal-content">
            <div class="modal-header" v-if="hasHeader">
            <slot name="header">
                <h4 style="margin-top:0px;margin-right:45px;">{{title}}</h4>
                    <button type="button" class="close" v-on:click="onclose" >
                        <span aria-hidden="true" >&times;</span>
                    </button>
            </slot>
            </div>
            <div class="modal-body" style="max-height:63vh;overflow-y:auto;">
            <slot name="body">
            </slot>
            </div>
            <div class="modal-footer justify-content-between">
                <slot name="footer">
                    <yuman-button :css="'btn-secondary btn-outline-light btn btn-default close-button waves-effect'" :licss="''" :title="closeTitle" v-on:click="onclose"></yuman-button>
                    <yuman-button :css="'btn-secondary btn-outline-light btn btn-primary save-button waves-effect'" :licss="''" :title="saveTitle" v-on:click="onsave"></yuman-button>
                </slot>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>
    `
})


// 定义名为 yuman-form-label 的新组件
var yumanFormLabel = Vue.component('yuman-form-label', {
    props: {
        value: {
            type: Object,
            default: {}
        },
        name: {
            type: String,
            required: true
        },
        label: {
            type: String,
            required: true
        },
        title: { type: String, },
        length: {
            type: Number,
            default: 100
        },
        visiabled: {
            type: Object,
            default: true
        }
    },
    created: function () {
        // `this` 指向 vm 实例
    },
    methods: {
        getVisiabled: function () {
            var obj = this.visiabled;
            if (obj) {
                if (typeof obj == "function") {
                    return this.visiabled(this);
                }
                return this.visiabled;
            }

        }

    },
    template: `
    <div class="form-group"  v-if="getVisiabled()">
        <label v-if="label != null">{{label}}</label>
        <label v-if="value.value" :name="name" >{{value.value}}</label>
    </div>
    `
})

// 定义名为 yuman-search-input 的新组件
var yumanFormNumber = Vue.component('yuman-form-number', {
    props: {
        value: {
            type: Object,
        },
        name: {
            type: String,
            required: true
        },

        label: {
            type: String,
            required: false
        },
        title: { type: String, },
        length: {
            type: Number,
            default: 100
        },
        disabled: {
            type: Object,
        },
        visiabled: {
            type: Object,
            default: true,
        },
    },
    data: function () {
        return {
            oldValue: '',//缓存一下上一次输入的原始值，如果下一次输入不符合要求变回上一步的值
        }
    },
    methods: {
        getDisabled: function () {
            var obj = this.disabled;
            if (obj) {
                if (typeof obj == "function") {
                    return this.disabled();
                }
                return this.disabled;
            }
        },
        getVisiabled: function () {
            var obj = this.visiabled;
            if (obj) {
                if (typeof obj == "function") {
                    return this.visiabled(this);
                }
                return this.visiabled;
            }

        },
        getStyle: function () {
            var style = {};

            if (this.length) {
                style.width = this.length + "px";
            }

            return style;
        },
        onChange: function () {
            //if (!/^\d+$/.test(this.value.value)) {
            //    this.value.value = this.oldValue;
            //}
        }
    },
    created: function () {
        // `this` 指向 vm 实例<input type="number" step="0.0000000001"  >
    },
    template: `
    <div class="form-group" v-if="getVisiabled()" >
        <label v-if="label != null">{{label}}</label>
        <input :name="name" class="form-control input_borderradius" v-on:input="onChange" :placeholder="title" :style="getStyle()" :maxLength="length" :disabled="getDisabled()"
        :value="value.value" v-model.number="value.value" type="number"  v-enter-enterInteger/>
    </div>
    `
})


// 定义名为 yuman-search-radios 的新组件
var yumanFormRadio = Vue.component('yuman-form-radio', {
    props: {
        value: {
            type: Object,
        },
        name: {
            type: String,
            required: true
        },
        css: {
            type: String,
        },
        datas: {
            type: Array,
            default: []
        },
        title: { type: String, },
        label: {
            type: String,
            required: false
        }, direct: {
            type: String,
            default: 'horizontal' //horizontal,vertical
        },
        disabled: {
            type: Object,
            default: false
        }, getVisiabled: {
            type: Object,
            default: true
        },
        setchange: {
            type: Function,
            default: function () { }
        },
    },
    watch: {


    },
    methods: {
        getDisabled: function () {
            var obj = this.disabled;
            if (obj) {
                if (typeof obj == "function") {
                    return this.disabled();
                }
                return this.disabled;
            }
        },
        getVisiabled: function () {
            var obj = this.visiabled;
            if (obj) {
                if (typeof obj == "function") {
                    return this.visiabled();
                }
                return this.visiabled;
            }
        },
        settoChange: function () {
            this.setchange(this.$parent)
        }

    },
    created: function () {
    },
    template: `
    <template v-if="direct == 'horizontal'">
        <div class="btn-group input_borderradius"  :title="title">
        <label v-if="label != null"  class="btn">{{label}}</label>
        <template v-for="(item, index) in datas">
            <label class="btn btn-default btn-sm">
                <input   type="radio" class="radio_input" :class="css" :value="item.id" :name="name" :checked="item.id == value.value" v-model="value.value" :disabled="getDisabled()" v-on:change="settoChange()"/>{{item.text}}
            </label>
        </template>
    </div>
    </template>
    <template v-else >
    <div class="form-group btn-group input_borderradius"  >
        <template v-for="(item, index) in datas">
        <div class="form-check">
            <label class="btn btn-default btn-sm">
            <input   type="radio" class="radio_input" :class="css" :value="item.id" :name="name" :checked="item.id == value.value" v-model="value.value" :disabled="getDisabled()" :onChange="settoChange()" />
            {{item.text}}
            </label>
        </div>
        </template>
    </div>
    </template>
    `
})

// 定义名为 yuman-select2 的新组件
var yumanFormSelect2 = Vue.component('yuman-form-select2', {
    // model: {
    //     prop: 'checked',
    //     event: 'change'
    //   },
    props: {
        value: {
            type: Object,
            default: {
                value: Object
            }
        },

        name: {
            type: String,
            required: true
        },
        allowClear: {
            type: Boolean,
            default: true
        },
        multiple: {
            type: Boolean,
            default: false
        },
        datas: {
            type: Array,
            default: []
        },
        title: {
            type: String,
            required: true
        }, label: {
            type: String,
            required: false
        },
        css: String,
        length: {
            type: Number,
            default: 100
        },
        disabled: {
            type: Object,
            default: false,
        },
        visiabled: {
            type: Object,
            default: true,
        },
    },
    methods: {
        onfocus: function () {
            var $ell = $(this.$el).find("select[name=" + this.name + "]");
            $ell.focus();
        },
        selected: function (val) {

            $(this.$el).find("select[name=" + this.name + "]").val(val).trigger("change");
        },
        init: function () {

            var self = this;
            var $selct = $(self.$el).find("select[name=" + self.name + "]");
            $selct.empty();

            var dds = self.datas.map(s => {
                var a = { id: s.id, text: s.text, disabled: s.disabled, selected: s.selected };
                if (s.id == self.value.value) {
                    a.selected = true;
                }
                return a;
            });
            var dt = {
                allowClear: self.allowClear, data: dds, multiple: self.multiple, placeholder: self.title, dropdownAutoWidth: true,
            };
            if (self.length) {
                dt.width = self.length;
            }
            $selct.select2(dt);
        },
        getDisabled: function () {
            var obj = this.disabled;
            if (obj) {
                if (typeof obj == "function") {
                    return this.disabled();
                }
                return this.disabled;
            }
        }, getVisiabled: function () {
            var obj = this.visiabled;
            if (obj) {
                if (typeof obj == "function") {
                    return this.visiabled(this);
                }
                return this.visiabled;
            }

        }, getStyle: function () {
            var style = {};
            if (this.length) {
                style.width = this.length + "px";
            }
            return style;
        }
    },
    created: function () {


    },
    watch: {
        datas: function (value) {
            this.init();
        }
    },
    mounted: function () {
        var self = this;
        var $selct = $(self.$el).find("select[name=" + self.name + "]");
        $selct.on('change', function (e) {
            let val = $selct.val();//val 可能是单选，也可能是数组
            console.log(self.name, 'change', val, self.value.value);
            if (val == self.value.value) return;
            self.value.value = val;
            self.$emit('change', val)
        });
        this.init();
    },
    template: `
        <div class="form-group" :class="css" v-if="getVisiabled()" >
            <label v-if="label != null">{{label}}</label>
            <select class="form-control input_borderradius" :title="title" :placeholder="title" :name="name" :style="getStyle()" :disabled="getDisabled()" >
            </select>
            <slot name="footer"></slot>
        </div>
    `
})




// 定义名为 yuman-search-input 的新组件
var yumanFormInput = Vue.component('yuman-form-input', {
    props: {
        value: {
            type: Object,
        },
        name: {
            type: String,
            required: true
        },
        label: {
            type: String,
            required: false
        },
        title: { type: String, },
        length: {
            type: Number,
            default: 100
        },
        disabled: {
            type: Object,
        },
        visiabled: {
            type: Object,
            default: true
        },
        css: String
    },
    methods: {
        getDisabled: function () {
            var obj = this.disabled;
            if (obj) {
                if (typeof obj == "function") {
                    return this.disabled();
                }
                return this.disabled;
            }
        }, getVisiabled: function () {
            var obj = this.visiabled;
            if (obj) {
                if (typeof obj == "function") {
                    return this.visiabled();
                }
                return this.visiabled;
            }
        }

    },
    created: function () {
        // `this` 指向 vm 实例
    },
    template: `
    <div class="form-group" :class="css" v-if="getVisiabled()">
        <label v-if="label != null">{{label}}</label>
        <input :name="name" class="form-control input_borderradius" :placeholder="title"   :maxLength="length" :disabled="getDisabled()"
        :value="value.value" v-model.trim="value.value" :title="title" autocomplete="off"/>
    </div>
    `
})

var yumanInputAutoComplete = Vue.component('yuman-input-autocomplete', {
    props: {
        ajaxurl: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: 'text'
        },
        title: {
            type: String,
            default: ''
        },
        value: {
            type: String,
            default: ''
        },
        name: String,
        cache: {
            type: Boolean,
            default: true
        },
        length: {
            type: Number,
            default: 220
        },
        otherParams: {
            type: Object,//需要额外传递的接口参数；格式按key:value的形式，如：{ factoryCode:'XXX',factoryId:1 }
        }
    },
    data: function () {
        return {
            inputValue: ''
        }
    },
    methods: {
        setAutoComplete: function () {
            let that = this;
            $('.' + this.name).autocomplete({
                serviceUrl: this.ajaxurl,
                paramName: 'searchString',
                noCache: !this.cache,
                dataType: 'json',
                onSearchStart: function (params) {
                    if (that.otherParams) {
                        try {
                            for (var paramKey in that.otherParams) {
                                params[paramKey] = that.otherParams[paramKey];
                            }
                        }
                        catch (ex) { console.log(ex) }
                    }
                },
                transformResult: function (response) {
                    return {
                        suggestions: $.map((response.result ? response.result.data : response.data), function (dataItem) {
                            return {
                                value: dataItem.value,
                                data: dataItem.data
                            };
                        })
                    };
                },
                onSelect: (suggestion) => {
                    this.$emit('input', suggestion.data)
                    this.$emit("changeval", suggestion.data)
                }
            })
        },
        changeValue: function () {
            this.$emit('input', this.inputValue)
            this.$emit("changeval", this.inputValue)
        },
        setValue: function (value) {
            this.inputValue = value;
            this.changeValue();
        },
        getLen: function () {
            return "width:" + this.length + "px"
        },
        clearInput: function () {
            this.inputValue = ""
        },
        keyupHandle: function () {
            this.$emit("handleenter")
        }
    },
    mounted: function () {
        this.inputValue = this.value
        this.setAutoComplete()
    },
    template: ` <div class="form-group">
                    <input :type="type" :style="getLen()" class="form-control input_borderradius" 
                            :class="name" :placeholder="title" :title="title" v-on:change="changeValue" 
                            v-model="inputValue" v-on:keyup.enter="keyupHandle">
                </div>`
})

var yumanInputAutoCompleteFloatLabel = Vue.component('yuman-input-autocomplete-float-label', {
    props: {
        ajaxurl: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: 'text'
        },
        title: {
            type: String,
            default: ''
        },
        //value: {
        //    type: String,
        //    default: ''
        //},
        value: {
            type: Object,
        },
        name: String,
        cache: {
            type: Boolean,
            default: true
        },
        length: {
            type: Number,
            default: 220
        },
        inputClear:
        {
            type: Object,
            default: function () {
                return { 'title': L("Clear"), 'type': 'input', 'show': true }
            }
        }
    },
    //data: function () {
    //    return {
    //        inputValue: ''
    //    }
    //},
    methods: {
        setAutoComplete: function () {
            let that = this;
            $('.' + this.name).autocomplete({
                deferRequestBy: 500,//延迟 Ajax 请求的毫秒数
                serviceUrl: this.ajaxurl,
                paramName: 'searchString',
                noCache: !this.cache,
                dataType: 'json',
                onSearchStart: function (params) {
                    if (that.otherParams) {
                        try {
                            for (var paramKey in that.otherParams) {
                                params[paramKey] = that.otherParams[paramKey];
                            }
                        }
                        catch (ex) { console.log(ex) }
                    }
                },
                transformResult: function (response) {
                    return {
                        suggestions: $.map((response.result ? response.result.data : response.data), function (dataItem) {
                            return {
                                value: dataItem.value,
                                data: dataItem.data
                            };
                        })
                    };
                },
                onSelect: (suggestion) => {
                    this.$emit('input', suggestion.data)
                    this.$emit("changeval", suggestion.data)
                    this.value.value = suggestion.data;
                }
            })
        },
        changeValue: function () {
            this.$emit('input', this.value.value)
            this.$emit("changeval", this.value.value)
        },
        getLen: function () {
            return "width:" + this.length + "px"
        },
        //clearInput: function () {
        //    this.inputValue = ""
        //},
        keyupHandle: function () {
            this.$emit("handleenter")
        }
    },
    mounted: function () {
        //this.inputValue = this.value.value;
        this.setAutoComplete();
        var self = this;
        if (this.inputClear && this.inputClear.show) {
            $('.has-float-label .' + this.name).inputClear({
                title: this.inputClear.title,
                type: this.inputClear.type,
                callback: function ($input) {
                    self.value.value = "";
                }
            });
        }
    },
    template: ` <div class="form-group">
                <label class="has-float-label">
                    <input  :style="getLen()" class="form-control input_borderradius" 
                            :class="name" :placeholder="title" :title="title" v-on:change="changeValue" 
                            :value="value.value" v-model.trim="value.value" v-on:keyup.enter="keyupHandle">
                    <span :title="title">{{title}}</span>
                </label>
                </div>`
})

yuman.vueui.setBusy = function (selector, call, time, error) {
    var uibusy = {};
    uibusy.id = selector;
    uibusy.call = call;
    uibusy.error = error;
    if (!time) {
        uibusy.times = 10 * 1000;
    } else {
        uibusy.times = time * 1000;
    }

    uibusy.timi = setTimeout(function () {

        console.log('timi clearTimeout', uibusy.id, uibusy.error);
        yuman.ui.clearBusy(uibusy.id);
        if (uibusy.error) {
            uibusy.error();
        }
    }, uibusy.times);
    yuman.ui.setBusy(selector);

    if (uibusy.call) {
        uibusy.call();
    }

    uibusy.end = function () {

        yuman.ui.clearBusy(uibusy.id);
        if (uibusy.timi) clearTimeout(uibusy.timi);
        console.log('clearTimeout', uibusy.id, uibusy.timi);
        uibusy.timi = null;
    }

    return uibusy;
}
yuman.vueui.setBusyEx = function (selector, call, time, error) {
    var uibusy = {};
    uibusy.id = selector;
    uibusy.call = call;
    uibusy.error = error;
    if (!time) {
        uibusy.times = 10 * 1000;
    } else {
        uibusy.times = time * 1000;
    }

    uibusy.timi = setTimeout(function () {

        console.log('timi clearTimeout', uibusy.id, uibusy.error);
        yuman.ui.clearBusy(uibusy.id);
        if (uibusy.error) {
            uibusy.error();
        }
    }, uibusy.times);
    yuman.ui.setBusy(uibusy.id);

    if (uibusy.call) {
        uibusy.call();
    }
    //
    uibusy.end = function () {

        yuamn.ui.clearBusy(uibusy.id);
        if (uibusy.timi) clearTimeout(uibusy.timi);
        console.log('clearTimeout', uibusy.id, uibusy.timi);
        uibusy.timi = null;
    }

    return uibusy;
}

yuman.vueui.groupBy = function groupBy(list, keyArr) {
    var groupObj = {};
    var result = [];
    list.forEach(function (item) {
        keyStr = "";
        keyArr.forEach(function (value) {
            keyStr += item[value] + "|";
        });
        if (!groupObj[keyStr]) {
            groupObj[keyStr] = [item];
        } else {
            groupObj[keyStr].push(item);
        }
    });
    for (var key in groupObj) {
        result.push(groupObj[key]);
    }
    return result;
}

//前端防抖，指定时间内只执行一次函数
var yumanDebounceTime;
function yumanDebounce(func, delay) {
    return function () {
        var args = arguments, context = this;
        clearTimeout(yumanDebounceTime);

        yumanDebounceTime = setTimeout(function () {
            func.apply(context, args);
        }, delay);
    };
}

//复制目录订购方法，千分位符，位数不足补0
yuman.vueui.numberFormat = function (num, n) {
    if (!num && num !== 0) {
        return "";
    }
    //var reg = /(\d{1,3})(?=(\d{3})+(?:$|\.))/g;
    //num = num.toFixed(n);
    //return num && num
    //    .toString()
    //    .replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
    //        return $1 + ",";
    //    });

    num = num.toFixed(n);
    var re = /\d{1,3}(?=(\d{3})+$)/g;
    var n1 = num.toString().replace(/^(\d+)((\.\d+)?)$/, function (s, s1, s2) { return s1.replace(re, "$&,") + s2; });
    return n1;
}