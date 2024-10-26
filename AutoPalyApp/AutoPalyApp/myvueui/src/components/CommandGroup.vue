<template>
    <div>
        <h2>{{ $t("commandGroup.title") }}</h2>

        <div>
            <b-button-toolbar key-nav aria-label="Toolbar with button groups">
                <b-button-group class="mx-1">
                    <b-button variant="success" @click="newMainModal">{{ $t("app.create") }}</b-button>
                    <b-button variant="success" @click="getMainTable">{{ $t("app.refresh") }}</b-button>
                </b-button-group>
            </b-button-toolbar>

            <b-table striped hover ref="mainTable" :fields="mainTableColumns" :items="mainTableRows">
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
                        <b-button variant="info" @click="editMainModal(data.item.id)">{{ $t("app.edit") }}</b-button>
                    </b-button-group>
                    <b-button-group class="mx-1">
                        <b-button variant="danger" @click="deleteMainRow(data.item.id)">{{ $t("app.delete")
                            }}</b-button>
                    </b-button-group>
                    <b-button-group>
                        <b-button variant="primary" @click="saveMainodal(data.item.id)">{{ $t("app.save") }}</b-button>
                    </b-button-group>
                </template>

                <template v-slot:row-details="row">
                    <b-card>
                        <b-row class="mb-2">
                            <b-col sm="1" class="text-sm-right"><b>Index:</b></b-col>
                            <b-col sm="3" class="text-sm-left">{{ row.index + 1 }}</b-col>
                            <b-col sm="1" class="text-sm-right"><b>GUID:</b></b-col>
                            <b-col sm="3" class="text-sm-left">{{ row.item.id }}</b-col>
                            <b-col sm="1" class="text-sm-right"><b>Name:</b></b-col>
                            <b-col sm="3" class="text-sm-left">{{ row.item.name }}</b-col>
                        </b-row>
                        <b-row class="mb-2">
                            <b-col sm="1" class="text-sm-right"><b>Remark:</b></b-col>
                            <b-col sm="11" class="text-sm-left">{{ row.item.remark }}</b-col>
                        </b-row>


                        <b-button-toolbar key-nav aria-label="Toolbar with button groups">
                            <b-button-group class="mx-1">
                                <b-button variant="success" @click="newItemModal(row.item.id)">
                                    {{ $t("app.create") + ' Command' }}</b-button>
                            </b-button-group>
                        </b-button-toolbar>

                        <div>
                            <b-table striped small hover :ref="'itemTable' + row.index" :fields="itemTableColumns"
                                :items="row.item.commands">
                                <template v-slot:cell(index)="data">
                                    {{ data.index + 1 }}
                                </template>
                                <template v-slot:cell(action)="data">
                                    <b-button-group size="sm">
                                        <b-button variant="info" @click="editItemModal(row.item.id, data.item.id)">{{
                                            $t("app.edit") }}</b-button>
                                    </b-button-group>
                                    <b-button-group size="sm">
                                        <b-button variant="danger" @click="deleteItemRow(row.item.id, data.item.id)">{{
                                            $t("app.delete") }}</b-button>
                                    </b-button-group>
                                </template>
                            </b-table>
                        </div>
                    </b-card>
                </template>
            </b-table>

            <p>{{ $t("app.total", { "total": mainTableRows.length }) }}</p>
        </div>

        <div id="MainForm">
            <MyForm ref="mainForm" title="Create New Command Group" :myTagForm="mainForm"
                v-on:onsubmit="onMainSubmit" />
        </div>

        <div id="ItemForm">
            <MyForm ref="itemForm" title="Create New Command" :myTagForm="itemForm" v-on:onsubmit="onItemSubmit"
                v-on:onreset="onItemReset" />
        </div>
    </div>
</template>

<script>
import MyForm from './Common/MyTagForm.vue'

export default {
    name: 'About',
    components: {
        MyForm
    },
    data() {
        return {
            mainForm: [
                {
                    title: '请填写表单',
                    form: [
                        { field: 'id', value: '', type: 'text', label: 'GUID', isShow: true, isDisabled: true },//自动生成，禁止输入
                        { field: 'name', value: '', type: 'text', label: 'Name', placeholder: '请输入命令组名称', description: '必填', isShow: true, isRequired: true },
                        { field: 'fileName', value: '', type: 'text', label: 'File Name', placeholder: '请输入文件名称', description: '必填', isShow: true, isRequired: true },
                        { field: 'remark', value: '', type: 'textarea', label: 'Remark', placeholder: '请输入备注', description: '可空', isShow: true },
                        { field: 'total', value: 0, type: 'number', label: 'Total', isShow: false },
                    ]
                }
            ],
            mainTableColumns: [
                {
                    key: 'showDetail',
                    label: 'Show Detail',
                },
                'index',
                'action',
                {
                    key: 'id',
                    label: 'GUID',
                },
                {
                    key: 'name',
                    label: 'Name',
                },
                {
                    key: 'fileName',
                    label: 'File Name',
                },
                {
                    key: 'remark',
                    label: 'Remark',
                },
                {
                    key: 'total',
                    label: 'Total',
                },
            ],
            mainTableRows: [
                //{ id: '202410261450', name: 'Test', fileName: 'TestFile', remark: '测试数据', total: 0, commands: [] },//测试数据
            ],

            itemForm: [
                {
                    title: '一般设置',
                    form: [
                        { field: 'mainId', value: 0, type: 'number', isShow: false },//主表Id
                        { field: 'id', value: '', type: 'text', label: 'GUID', isShow: false, isDisabled: true },//自动生成，禁止输入
                        { field: 'myIndex', value: 0, type: 'number', label: 'Index', isShow: false, isDisabled: true },//自动生成，禁止输入
                        { field: 'parentIndex', value: null, type: 'number', label: 'Parent Index', isShow: false, isDisabled: true },//自动生成，禁止输入
                        { field: 'name', value: '', type: 'text', label: 'Name', placeholder: '请输入名称', description: '必填', isShow: true, isRequired: true, },
                        {
                            field: 'operate', value: -1, type: 'select', label: 'Operate', description: '必填', isShow: true, isRequired: true,
                            options: [],
                            valuefield: 'id', textfield: 'text', NullValue: -1,
                        },
                        {
                            field: 'type', value: -1, type: 'select', label: 'Type', description: '必填', isShow: true, isRequired: true,
                            options: [],
                            valuefield: 'id', textfield: 'text', NullValue: -1, change: (selectedValue, vm) => {
                                //如果选择图片，显示Image，否则显示Content
                                if (selectedValue === 1) {
                                    vm.updateFormItem('content', false, false);
                                    vm.updateFormItem('image', true, true);
                                } else {
                                    vm.updateFormItem('image', false, false);
                                    vm.updateFormItem('content', true, true);
                                }
                            }
                        },
                        { field: 'content', value: '', type: 'textarea', label: 'Content', placeholder: '请输入内容', description: '必填', isShow: true, isRequired: true, },
                        { field: 'image', value: '', type: 'uploadimage', label: 'Image', placeholder: '请上传图片', description: '必填', isShow: false, isRequired: false, },
                        { field: 'remark', value: '', type: 'textarea', label: 'Remark', placeholder: '请输入备注', description: '可空', isShow: true },
                    ]
                },
                {
                    title: '高级设置',
                    form: [
                        { field: 'interval', value: 3, type: 'number', label: 'Interval', placeholder: '请输入时间间隔（单位秒）', description: '必填，默认为3', isShow: true, isRequired: true, },
                        { field: 'timeout', value: 10, type: 'number', label: 'Timeout', placeholder: '请输入超时时间（单位秒）', description: '必填，默认为10', isShow: true, isRequired: true, },
                        { field: 'count', value: 1, type: 'number', label: 'Count', placeholder: '请输入执行次数', description: '必填，默认为1', isShow: true, isRequired: true, },
                        { field: 'isThrowExceptionIfNoFind', value: true, type: 'checkbox', label: 'Is Throw Exception If No Find', description: '异常不会报错', isShow: true },
                        { field: 'getIndex', value: 0, type: 'number', label: 'Get Index', placeholder: '请输入取值序号', description: '默认为0', isShow: true, },
                    ]
                }
            ],
            itemTableColumns: [
                'index',
                'action',
                {
                    key: 'myIndex',
                    label: 'Index',
                },
                {
                    key: 'parentIndex',
                    label: 'Parent Index',
                },
                {
                    key: 'name',
                    label: 'Name',
                },
                {
                    key: 'type',
                    label: 'Type',
                    formatter: (value, key, item) => {
                        var typeItem = this.typeList.filter(f => f.id === value)
                        if (typeItem) {
                            return typeItem[0].text
                        }
                        return value
                    }
                },
                {
                    key: 'interval',
                    label: 'Interval',
                },
                {
                    key: 'timeout',
                    label: 'Timeout',
                },
                {
                    key: 'operate',
                    label: 'Operate',
                    formatter: (value, key, item) => {
                        var operateItem = this.operateList.filter(f => f.id === value)
                        if (operateItem) {
                            return operateItem[0].text
                        }
                        return value
                    }
                },
                {
                    key: 'content',
                    label: 'Content',
                },
                {
                    key: 'count',
                    label: 'Count',
                },
                {
                    key: 'isThrowExceptionIfNoFind',
                    label: 'Is Throw Exception If No Find',
                },
                {
                    key: 'getIndex',
                    label: 'Get Index',
                },
                {
                    key: 'remark',
                    label: 'Remark',
                },
            ],
            typeList: [
                { text: 'Text', id: 0 },
                { text: 'Image', id: 1 }
            ],
            operateList: [
                { text: 'WaitToClick', id: 0 },
                { text: 'Sleep', id: 1 },
                { text: 'Loop_Break', id: 2 },
                { text: 'Loop_Continue', id: 3 },
            ]
        }
    },
    methods: {
        getMainTable() {
            this.$axios.get("/api/home/getAllJsonList").then((response) => {
                console.log(response);
               this.mainTableRows = response.data;
            }).catch((err) => {
                console.log(err)
                this.$alert('System Tip', err)
            })
        },
        newMainModal() {
            var data = {
                id: this.$common.getGuid(),//生成GUID作为Key，并且不能编辑
                name: '',
                remark: '',
                total: 0
            }
            this.$refs.mainForm.setFormValue(data);
            this.$refs.mainForm.showMyModal();
        },
        editMainModal(mainId) {
            var index = this.mainTableRows.findIndex(f => f.id === mainId);
            if (index !== -1) {
                var row = this.mainTableRows[index];
                this.$refs.mainForm.setFormValue(row);
                this.$refs.mainForm.showMyModal();
            } else {
                this.$alert('System Tip', 'NoFound')
            }
        },
        deleteMainRow(mainId) {
            var index = this.mainTableRows.findIndex(f => f.id === mainId);
            if (index !== -1) {
                //调用后端接口
                this.mainTableRows.splice(index, 1);
            } else {
                this.$alert('System Tip', 'NoFound')
            }
        },
        saveMainodal(mainId) {
            var index = this.mainTableRows.findIndex(f => f.id === mainId);
            if (index !== -1) {
                var row = this.mainTableRows[index];

                let formData = new FormData();
                for (var command of row.commands) {
                    if (command.image) {
                        formData.append('files', command.image)
                    }
                }
                formData.append('groupData', JSON.stringify(row))

                this.$axios.post("/api/home/SaveJsonFile", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then((response) => {
                    console.log(response)
                    if (response.data === true) {
                        this.$alert('System Tip', 'Save Success')
                    } else {
                        this.$alert('System Tip', 'Save Fail')
                    }
                }).catch((err) => {
                    console.log(err)
                    this.$alert('System Tip', 'Save Fail')
                })
            } else {
                this.$alert('System Tip', 'NoFound')
            }
        },
        onMainSubmit(data) {
            var index = this.mainTableRows.findIndex(f => f.id === data.id);
            if (index !== -1) {
                var row = this.mainTableRows[index];
                row.name = data.name
                row.fileName = data.fileName
                row.remark = data.remark
                row.total = data.total
                //调用后端接口
            } else {
                this.mainTableRows.push({
                    id: data.id,
                    name: data.name,
                    fileName: data.fileName,
                    remark: data.remark,
                    total: data.total,
                    commands: [],//初始化子表集合
                })
                //调用后端接口
            }
        },

        newItemModal(mainId) {
            var mainRow = this.mainTableRows.filter(f => f.id === mainId)[0];

            var itemIndexs = mainRow.commands.map(m => m.myIndex).sort(function (a, b) { return b - a });

            var data = {
                mainId: mainId,
                id: this.$common.getGuid(),//生成GUID作为Key，并且不能编辑
                myIndex: itemIndexs.length > 0 ? itemIndexs[0] + 1 : 0,//取目前最大的序号往后加1
            }
            this.$refs.itemForm.setFormValue(data);
            this.$refs.itemForm.showMyModal();
        },
        editItemModal(mainId, itemId) {
            var mainRow = this.mainTableRows.filter(f => f.id === mainId)[0];
            var index = mainRow.commands.findIndex(f => f.id === itemId);
            if (index !== -1) {
                var itemRow = mainRow.commands[index];
                this.$refs.itemForm.setFormValue(itemRow);
                this.$refs.itemForm.showMyModal();
            } else {
                this.$alert('System Tip', 'NoFound')
            }
        },
        deleteItemRow(mainId, itemId) {
            var mainRow = this.mainTableRows.filter(f => f.id === mainId)[0];
            var index = mainRow.commands.findIndex(f => f.id === itemId);
            if (index !== -1) {
                //调用后端接口
                mainRow.commands.splice(index, 1);
            } else {
                this.$alert('System Tip', 'NoFound')
            }
        },
        onItemSubmit(data) {
            var mainRow = this.mainTableRows.filter(f => f.id === data.mainId)[0];
            var index = mainRow.commands.findIndex(f => f.id === data.id);
            if (index !== -1) {
                var row = mainRow.commands[index];
                row.name = data.name
                row.remark = data.remark
                row.total = data.total
                row.myIndex = data.myIndex
                row.parentIndex = data.parentIndex
                row.name = data.name
                row.type = data.type
                row.interval = data.interval
                row.timeout = data.timeout
                row.operate = data.operate
                row.content = data.type === 1 ? data.image.name : data.content
                row.image = data.image
                row.count = data.count
                row.isThrowExceptionIfNoFind = data.isThrowExceptionIfNoFind
                row.getIndex = data.getIndex
                row.remark = data.remark
                //调用后端接口
            } else {
                mainRow.commands.push({
                    mainId: data.mainId,
                    id: data.id,
                    myIndex: data.myIndex,
                    parentIndex: data.parentIndex,
                    name: data.name,
                    type: data.type,
                    interval: data.interval,
                    timeout: data.timeout,
                    operate: data.operate,
                    content: data.type === 1 ? data.image.name : data.content,
                    image: data.image,
                    count: data.count,
                    isThrowExceptionIfNoFind: data.isThrowExceptionIfNoFind,
                    getIndex: data.getIndex,
                    remark: data.remark,
                    commands: [],//初始化子表集合
                })
                //调用后端接口
            }

            mainRow.total = mainRow.commands.length;
        },
        onItemReset() {
            var data = {
                mainId: '',
                id: '',
                myIndex: 0,
                parentIndex: null,
                name: '',
                type: -1,
                interval: 3,
                timeout: 10,
                operate: -1,
                content: '',
                image: '',
                count: 1,
                isThrowExceptionIfNoFind: true,
                getIndex: 0,
            }

            this.$refs.itemForm.updateFormItem('image', false, false);
            this.$refs.itemForm.updateFormItem('content', true, true);
            this.$refs.itemForm.setFormValue(data);
        },

        initSelectData() {
            var firstForm = this.itemForm[0].form;
            var index_type = firstForm.findIndex(f => f.field === "type")
            firstForm[index_type].options = [
                { text: '请选择', id: -1, disabled: true },
            ]
            this.typeList.forEach(f => firstForm[index_type].options.push(f))

            var index_operate = firstForm.findIndex(f => f.field === "operate")
            firstForm[index_operate].options = [
                { text: '请选择', id: -1, disabled: true },
            ]
            this.operateList.forEach(f => firstForm[index_operate].options.push(f))
        }
    },
    mounted() {
        this.initSelectData();

        this.getMainTable();
    }
}
</script>