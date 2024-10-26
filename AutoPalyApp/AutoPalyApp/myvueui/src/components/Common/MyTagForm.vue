<template>
    <div>
        <b-modal :ref="'mymodal' + guid" :title="title" :id="'myModal' + guid" header-bg-variant="dark"
            header-text-variant="light" body-bg-variant="light" body-text-variant="dark" footer-bg-variant="dark"
            footer-text-variant="light">
            <div>
                <b-form @submit="onSubmit" @reset="onReset" v-if="isshowform">

                    <b-tabs content-class="mt-3" v-if="myTagForm.length > 0">
                        <b-tab v-for="(tagItem, index) in myTagForm" :title="tagItem.title">
                            <b-form-group v-if="tagItem.form.length > 0" v-for="(formItem, index) in tagItem.form"
                                :id="'input-group-' + index" :label="formItem.label" v-show="formItem.isShow"
                                :label-for="'input-' + index" :description="formItem.description">
                                <b-form-input v-if="formItem.type === 'text' && formItem.isShow && !formItem.isDisabled"
                                    :id="'input-' + index" v-model="formItem.value"
                                    :placeholder="formItem.placeholder"></b-form-input>
                                <b-form-input
                                    v-else-if="formItem.type === 'number' && formItem.isShow && !formItem.isDisabled"
                                    :id="'input-' + index" v-model="formItem.value" :placeholder="formItem.placeholder"
                                    :type="formItem.type"></b-form-input>
                                <b-form-select
                                    v-else-if="formItem.type === 'select' && formItem.isShow && !formItem.isDisabled"
                                    :id="'input-' + index" v-model="formItem.value" :options="formItem.options"
                                    :value-field="formItem.valuefield" :text-field="formItem.textfield"></b-form-select>
                                <b-form-checkbox
                                    v-else-if="formItem.type === 'checkbox' && formItem.isShow && !formItem.isDisabled"
                                    v-model="formItem.value" :id="'input-' + index">
                                    {{ formItem.description }}
                                </b-form-checkbox>
                                <div v-else-if="formItem.type === 'textarea' && formItem.isShow && !formItem.isDisabled">
                                    <textarea class="form-control" :id="'input-' + index" rows="3"
                                        v-model="formItem.value"></textarea>
                                </div>
                                <div v-else-if="formItem.isDisabled && formItem.isShow">
                                    <p>{{ formItem.value }}</p><!--禁用时直接显示文本即可-->
                                </div>
                            </b-form-group>
                        </b-tab>
                    </b-tabs>

                    <!--注意想要使用表单自带的必填校验，需要在from里设置type="submit"的按钮，而且不能再设置点击事件，提交事件在form上面的@submit声明-->
                    <!-- <b-button-group size="sm" class="float-right">
                        <b-button type="submit" variant="primary">Submit</b-button>
                        <b-button type="reset" variant="info">Reset</b-button>
                        <b-button type="button" variant="danger" @click="hideMyModal">Close</b-button>
                    </b-button-group> -->
                </b-form>
            </div>

            <template v-slot:modal-footer>
                <b-button-group size="sm" class="float-right">
                    <b-button type="submit" variant="primary"
                        @click="onSubmit">Submit</b-button><!--为了样式统一，显示页脚，就不用他自带的校验了，自己写校验-->
                    <b-button type="reset" variant="info" @click="onReset">Reset</b-button>
                    <b-button type="button" variant="danger" @click="hideMyModal">Close</b-button>
                </b-button-group>
            </template>
        </b-modal>
    </div>
</template>

<script>
export default {
    name: 'MyForm',
    props: {
        title: {
            type: String,
            default: 'MyModal',
        },
        myTagForm: {
            type: Array,
            default: () => ([])//Array/Object的默认返回值要用工厂形式返回   样例数据：[{ title: '选项卡标题', form: [] }]
        },
    },
    data() {
        return {
            guid: '',
            isshowform: true,
            // 传入的结构如下：
            // form2: [
            //     { field: 'id', value: 0, type: 'number', label: '', placeholder: '', isShow: false, isRequired: false, isDisabled: true },
            //     { field: 'first_name', value: '', type: 'text', label: 'First Name', placeholder: '请输入您的姓', description: '必填', isShow: true, isRequired: true },
            //     { field: 'last_name', value: '', type: 'text', label: 'Last Name', placeholder: '请输入您的名', description: '必填', isShow: true, isRequired: true },
            //     { field: 'age', value: 0, type: 'number', label: 'Age', placeholder: '请输入您的年龄', description: '必填，数字', isShow: true, isRequired: true },
            //     {
            //         field: 'sex', value: '', type: 'select', label: 'Sex', isShow: true, isRequired: true,
            //         options: [
            //             { text: '请选择', id: '', disabled: true },
            //             { text: '男', id: 'Men' },
            //             { text: '女', id: 'Women' }
            //         ],
            //         valuefield: 'id', textfield: 'text', NullValue: '',
            //     },
            //     { field: 'isActive', value: false, type: 'checkbox', label: 'Is Active', description: '是否激活', isShow: true },
            // ],
        }
    },
    methods: {
        showMyModal() {
            this.$refs['mymodal' + this.guid].show()
        },
        hideMyModal() {
            this.$refs['mymodal' + this.guid].hide()
        },
        onSubmit(evt) {
            evt.preventDefault()

            console.log('onSubmit')

            var object = {};
            var emptyLabels = [];

            for (var tagItem of this.myTagForm) {
                for (var item of tagItem.form) {
                    object[item.field] = item.value;
                    if (!item.isRequired) {
                        continue;
                    }
                    if (item.type === "checkbox") {
                        continue;
                    }
                    if (item.type === "select") {
                        if (item.value === item.NullValue) {
                            emptyLabels.push(item.label);//注意下来判断是否是空的，要按配置的NullValue来判断，有的时候下拉框id可以是任意类型不确定的
                        }
                    }
                    else if (!item.value) {
                        emptyLabels.push(item.label);
                    }
                }
            }

            if (emptyLabels.length > 0) {
                alert("以下字段不能为空：" + emptyLabels.join(', '));
                return;
            }

            this.$emit('onsubmit', object)

            this.hideMyModal();
        },
        onReset(evt) {
            if (evt) {
                evt.preventDefault()
            }
            console.log('onReset')

            for (var tagItem of this.myTagForm) {
                for (var item of tagItem.form) {
                    if (item.type === "number") {
                        item.value = 0;
                    } else if (item.type === "checkbox") {
                        item.value = false;
                    } else {
                        item.value = "";
                    }
                }
            }

            this.$emit('onreset')//如果需要重置为指定值的时候，就需要调用者自己去设置了

            this.isshowform = false
            this.$nextTick(() => {
                this.isshowform = true
            })
        },
        setFormValue(data) {
            for (var tagItem of this.myTagForm) {
                for (var item of tagItem.form) {
                    if (data[item.field] === undefined) {
                        continue;
                    }
                    item.value = data[item.field];
                }
            }
        },
    },
    created() {
        this.guid = this.$common.getGuid();
    },
    mounted() {
        this.$root.$on('bv::modal::show', (bvEvent, modalId) => {
            console.log('Modal Show', modalId)
            if (modalId === "myModal" + this.guid) {
                //TODO...
            }
        })
        this.$root.$on('bv::modal::hide', (bvEvent, modalId) => {
            console.log('Modal Hide', modalId)
            if (modalId === "myModal" + this.guid) {
                this.onReset();
            }
        })
    }
}
</script>