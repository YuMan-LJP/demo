<template>
    <div>
        <!-- <p>链接传过来的值: {{ $route.params.username }}</p> -->
        <h2>Home - 表格的增删改查demo</h2>

        <div>
            <b-table striped hover ref="selectableTable" selectable :select-mode="selectMode" @row-selected="onRowSelected"
                :fields="tableColumns" :items="tableRows" :current-page="currentPage" :per-page="perPage">
                <template v-slot:cell(selected)="{ rowSelected }">
                    <template v-if="rowSelected">
                        <span aria-hidden="true">&check;</span>
                        <span class="sr-only">Selected</span>
                    </template>
                    <template v-else>
                        <span aria-hidden="true">&nbsp;</span>
                        <span class="sr-only">Not selected</span>
                    </template>
                </template>
                <template v-slot:cell(showDetail)="data">
                    <b-button size="sm" @click="data.toggleDetails" class="mr-2">
                        {{ data.detailsShowing ? '-' : '+' }}
                    </b-button>
                </template>
                <template v-slot:cell(index)="data">
                    {{ data.index + 1 }}
                </template>
                <template v-slot:cell(action)="data">
                    <b-button-group class="mx-1">
                        <b-button variant="info" @click="showEditModal(data.item.id)">{{ $t("app.edit") }}</b-button>
                    </b-button-group>
                    <b-button-group class="mx-1">
                        <b-button variant="danger" @click="deleteRow(data.item.id)">{{ $t("app.delete") }}</b-button>
                    </b-button-group>
                </template>
                <template v-slot:cell(htmlCol)="data">
                    <span v-html="data.value"></span>
                </template>

                <template v-slot:row-details="row">
                    <b-card>
                        <b-row class="mb-2">
                            <b-col sm="2" class="text-sm-right"><b>主表行序号:</b></b-col>
                            <b-col sm="3">{{ row.index }}</b-col>
                            <b-col sm="2" class="text-sm-right"><b>主表行Id:</b></b-col>
                            <b-col sm="3">{{ row.item.id }}</b-col>
                        </b-row>
                    </b-card>
                </template>
            </b-table>

            <div>
                <div class="float-left">
                    <b-button-toolbar key-nav aria-label="Toolbar with button groups">
                        <b-button-group class="mx-1">
                            <b-button variant="success" @click="showCreateModal">{{ $t("app.create") }}</b-button>
                            <b-button variant="primary" @click="selectAllRows">{{ $t("app.selectall") }}</b-button>
                            <b-button variant="secondary" @click="clearSelected">{{ $t("app.unselectall") }}</b-button>
                            <b-dropdown id="dropdown-dropup" dropup :text="$t('app.prepage', { 'number': perPage })"
                                variant="light" class="s-1">
                                <b-dropdown-item href="#" v-for="pageOption in pageOptions"
                                    @click="changePageOption(pageOption)">{{ pageOption }}</b-dropdown-item>
                            </b-dropdown>
                        </b-button-group>
                    </b-button-toolbar>
                </div>
                <div class="float-left">
                    <ul class="list-group list-group-horizontal">
                        <li class="list-group-item">{{ $t("app.selected", { "number": selected.length }) }}</li>
                        <li class="list-group-item">{{ $t("app.pageNo", { "number": currentPage }) }}</li>
                        <li class="list-group-item">{{ $t("app.total", { "total": tableRows.length }) }}</li>
                    </ul>
                </div>
                <div class="float-right">
                    <b-pagination v-model="currentPage" :total-rows="tableRows.length" :per-page="perPage" align="fill"
                        size="m"></b-pagination>
                </div>
            </div>

            <b-row style="clear: both;"></b-row>
            <p>
                Selected Rows:<br>
                {{ selected }}
            </p>
        </div>

        <div>
            <MyForm ref="myForm" title="Create New Data" :myTagForm="form1" v-on:onsubmit="onSubmit" v-on:onreset="onReset" />
        </div>
    </div>
</template>

<script>
import MyForm from './Common/MyTagForm.vue'

export default {
    name: 'Home',
    components: {
        MyForm
    },
    data: function () {
        return {
            currentPage: 1,
            perPage: 5,
            pageOptions: [5, 10, 15],
            selectMode: 'multi',//multi: 每次单击都会选择/取消选择该行，single: 一次只能选择一行，range: 选择任何单击的行，取消选择任何其他行。
            selected: [],
            tableColumns: [
                'selected',
                {
                    key: 'showDetail',
                    label: 'Show Detail',
                },
                'index',
                'action',
                {
                    key: 'isActive',
                    label: 'Active',
                    formatter: (value, key, item) => {
                        return value ? "已激活" : "未激活"
                    }
                },
                {
                    key: 'id',
                    label: 'ID',
                },
                {
                    key: 'first_name',
                    label: 'First Name',
                    sortable: false
                },
                {
                    key: 'last_name',
                    label: 'Last Name',
                    sortable: true
                },
                {
                    key: 'age',
                    label: 'Person age',
                    sortable: true,
                    formatter: (value, key, item) => {
                        if (30 < value && value < 60) {
                            return value + "（中年人）"
                        }
                        else if (value > 60) {
                            return value + "（老年人）"
                        }
                        return value
                    }
                },
                {
                    key: 'sex',
                    label: 'Sex',
                    formatter: (value, key, item) => {
                        var sexItem = this.sexList.filter(f => f.id === value)
                        if (sexItem) {
                            return sexItem[0].text
                        }
                        return value
                    }
                },
                {
                    key: 'htmlCol',
                    label: 'Html格式文本',
                }
            ],//指定显示需要的字段
            tableRows: [
                { isActive: true, id: 1, age: 40, first_name: 'Dickerson', last_name: 'Macdonald', sex: 'Men', htmlCol: 'This is <i>raw <strong>HTML</strong></i> <span style="color:red">content</span>' },
                { isActive: false, id: 2, age: 21, first_name: 'Larsen', last_name: 'Shaw', sex: 'Women', htmlCol: 'This is <i>raw <strong>HTML</strong></i> <span style="color:blue">content</span>' },
                { isActive: false, id: 3, age: 89, first_name: 'Geneva', last_name: 'Wilson', sex: 'Men', htmlCol: 'This is <i>raw <strong>HTML</strong></i> <span style="color:green">content</span>' },
                { isActive: true, id: 4, age: 38, first_name: 'Jami', last_name: 'Carney', sex: 'Women', htmlCol: 'This is <i>raw <strong>HTML</strong></i> <span style="color:black">content</span>' },
                { isActive: true, id: 5, age: 40, first_name: 'WERWER', last_name: 'SDF', sex: 'Men', htmlCol: 'This is <i>raw <strong>HTML</strong></i> <span style="color:red">content</span>' },
                { isActive: false, id: 6, age: 21, first_name: 'dfg', last_name: 'ertert', sex: 'Women', htmlCol: 'This is <i>raw <strong>HTML</strong></i> <span style="color:blue">content</span>' },
                { isActive: false, id: 7, age: 89, first_name: 'fdg', last_name: '6lkjhkk', sex: 'Men', htmlCol: 'This is <i>raw <strong>HTML</strong></i> <span style="color:green">content</span>' },
                { isActive: true, id: 8, age: 38, first_name: 'fgh', last_name: 'yuiyu', sex: 'Women', htmlCol: 'This is <i>raw <strong>HTML</strong></i> <span style="color:black">content</span>' },
                { isActive: true, id: 9, age: 40, first_name: 'erhfgh', last_name: 'ghjg', sex: 'Men', htmlCol: 'This is <i>raw <strong>HTML</strong></i> <span style="color:red">content</span>' },
                { isActive: false, id: 10, age: 21, first_name: 'yuiy', last_name: 'rty', sex: 'Women', htmlCol: 'This is <i>raw <strong>HTML</strong></i> <span style="color:blue">content</span>' },
                { isActive: false, id: 11, age: 89, first_name: 'ghj', last_name: 'wer', sex: 'Men', htmlCol: 'This is <i>raw <strong>HTML</strong></i> <span style="color:green">content</span>' },
                { isActive: true, id: 12, age: 38, first_name: 'cvbcb', last_name: 'erte', sex: 'Women', htmlCol: 'This is <i>raw <strong>HTML</strong></i> <span style="color:black">content</span>' },
            ],
            form1: [
                {
                    title: '请填写表单',
                    form: [
                        { field: 'id', value: 0, type: 'number', label: '', placeholder: '', isShow: false, isRequired: false },
                        { field: 'first_name', value: '', type: 'text', label: 'First Name', placeholder: '请输入您的姓', description: '必填', isShow: true, isRequired: true },
                        { field: 'last_name', value: '', type: 'text', label: 'Last Name', placeholder: '请输入您的名', description: '必填', isShow: true, isRequired: true },
                        { field: 'age', value: 0, type: 'number', label: 'Age', placeholder: '请输入您的年龄', description: '必填，数字', isShow: true, isRequired: true },
                        {
                            field: 'sex', value: '', type: 'select', label: 'Sex', description: '必填', isShow: true, isRequired: true,
                            options: [],
                            valuefield: 'id', textfield: 'text', NullValue: '',
                        },
                        { field: 'isActive', value: false, type: 'checkbox', label: 'Is Active', description: '是否激活', isShow: true },
                    ]
                }
            ],

            sexList: [
                { text: '男', id: 'Men' },
                { text: '女', id: 'Women' }
            ]
        }
    },
    methods: {
        changePageOption(num) {
            this.perPage = num;
        },
        onRowSelected(items) {
            this.selected = items
        },
        selectAllRows() {
            this.$refs.selectableTable.selectAllRows()
        },
        clearSelected() {
            this.$refs.selectableTable.clearSelected()
        },
        selectRowByIndex(index) {
            this.$refs.selectableTable.selectRow(index)
        },
        unselectRowByIndex(index) {
            this.$refs.selectableTable.unselectRow(index)
        },

        showCreateModal() {
            this.$refs.myForm.showMyModal();
        },
        onSubmit(data) {
            console.log(data)
            if (data.id !== 0) {
                var index = this.tableRows.findIndex(f => f.id === data.id);
                var row = this.tableRows[index];
                row.id = data.id
                row.first_name = data.first_name
                row.last_name = data.last_name
                row.age = data.age
                row.sex = data.sex
                row.isActive = data.isActive
            } else {
                this.tableRows.push({
                    id: this.tableRows.length + 1,
                    isActive: data.isActive,
                    age: data.age,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    sex: data.sex,
                    htmlCol: 'This is <i>raw <strong>HTML</strong></i> <span style="color:red">content</span>'
                })
            }
        },
        onReset() {
            //暂时不需要事项，组件里面自动重置了
        },

        showEditModal(id) {
            var index = this.tableRows.findIndex(f => f.id === id);
            if (index !== -1) {
                var row = this.tableRows[index];
                this.$refs.myForm.setFormValue(row);
                this.showCreateModal()
            } else {
                this.$messageError('System Tip', 'NoFound')
            }
        },
        deleteRow(id) {
            var index = this.tableRows.findIndex(f => f.id === id);
            if (index !== -1) {
                this.tableRows.splice(index, 1);
            } else {
                this.$messageError('System Tip', 'NoFound')
            }
        },

        initSelectData() {
            var firstForm = this.form1[0].form;
            var index = firstForm.findIndex(f => f.field === "sex")
            firstForm[index].options = [
                { text: '请选择', id: '', disabled: true },
            ]
            this.sexList.forEach(f => firstForm[index].options.push(f))
        }
    },
    mounted() {
        this.initSelectData();
    }
}
</script>