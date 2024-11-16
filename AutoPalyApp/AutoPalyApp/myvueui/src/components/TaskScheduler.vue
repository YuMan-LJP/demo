<template>
    <div>
        <h2>{{ $t("taskScheduler.title") }}</h2>
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
                </template>

                <template v-slot:row-details="row">
                    <b-card>
                        <b-row class="mb-2">
                            <b-col sm="1" class="text-sm-right"><b>Index:</b></b-col>
                            <b-col sm="3" class="text-sm-left">{{ row.index + 1 }}</b-col>
                            <b-col sm="1" class="text-sm-right"><b>GUID:</b></b-col>
                            <b-col sm="3" class="text-sm-left">{{ row.item.id }}</b-col>
                            <b-col sm="1" class="text-sm-right"><b>Key:</b></b-col>
                            <b-col sm="3" class="text-sm-left">{{ row.item.key }}</b-col>
                        </b-row>
                        <b-row class="mb-2">
                            <b-col sm="1" class="text-sm-right"><b>Group:</b></b-col>
                            <b-col sm="3" class="text-sm-left">{{ row.item.group }}</b-col>
                            <b-col sm="1" class="text-sm-right"><b>Description:</b></b-col>
                            <b-col sm="3" class="text-sm-left">{{ row.item.description }}</b-col>
                        </b-row>

                        <b-button-toolbar key-nav aria-label="Toolbar with button groups">
                            <b-button-group class="mx-1">
                                <b-button variant="success" @click="newItemModal(row.item.id)">
                                    {{ $t("app.create") + ' Trigger' }}</b-button>
                            </b-button-group>
                        </b-button-toolbar>

                        <div>
                            <b-table striped small hover :ref="'itemTable' + row.index" :fields="itemTableColumns"
                                :items="row.item.triggers">
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
                                    <b-button-group size="sm">
                                        <b-button variant="primary"
                                            @click="startCommandGroupJob(row.item.id, data.item.id)">启动</b-button>
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
            <MyForm ref="mainForm" title="Create New Task" :myTagForm="mainForm" v-on:onsubmit="onMainSubmit" />
        </div>

        <div id="ItemForm">
            <MyForm ref="itemForm" title="Create New Trigger" :myTagForm="itemForm" v-on:onsubmit="onItemSubmit" />
        </div>
    </div>
</template>

<script>
import MyForm from './Common/MyTagForm.vue'

export default {
    name: 'TaskScheduler',
    components: {
        MyForm
    },
    data() {
        return {
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
                    key: 'key',
                    label: 'Key',
                },
                {
                    key: 'group',
                    label: 'Group',
                },
                {
                    key: 'description',
                    label: 'Description',
                },
                {
                    key: 'total',
                    label: 'Total',
                    formatter: (value, key, item) => {
                        return item.triggers.length;
                    }
                },
            ],
            mainTableRows: [],
            mainForm: [
                {
                    title: '请填写表单',
                    form: [
                        { field: 'id', value: '', type: 'text', label: 'GUID', isShow: true, isDisabled: true },//自动生成，禁止输入
                        { field: 'key', value: '', type: 'text', label: 'key', placeholder: '请输入Key', description: '必填', isShow: true, isRequired: true },
                        { field: 'group', value: '', type: 'text', label: 'Group', placeholder: '请输入Group', description: '必填', isShow: true, isRequired: true },
                        { field: 'description', value: '', type: 'textarea', label: 'Description', placeholder: '请输入Description', description: '可空', isShow: true },
                    ]
                }
            ],

            itemTableColumns: [
                'index',
                'action',
                {
                    key: 'id',
                    label: 'Id',
                },
                {
                    key: 'key',
                    label: 'Key',
                },
                {
                    key: 'group',
                    label: 'Group',
                },
                {
                    key: 'description',
                    label: 'Description',
                },
                {
                    key: 'cron',
                    label: 'Cron',
                },
                {
                    key: 'commandGroupId',
                    label: 'Command Group Id',
                    // formatter: (value, key, item) => {
                    //     var commandGroupItem = this.commandGroupList.filter(f => f.id === value)
                    //     if (commandGroupItem) {
                    //         return commandGroupItem[0].text
                    //     }
                    //     return value
                    // }
                },
            ],
            itemForm: [
                {
                    title: '请填写表单',
                    form: [
                        { field: 'jobId', value: 0, type: 'number', isShow: false },//主表Id
                        { field: 'id', value: '', type: 'text', label: 'GUID', isShow: true, isDisabled: true },//自动生成，禁止输入
                        { field: 'key', value: '', type: 'text', label: 'key', placeholder: '请输入Key', description: '必填', isShow: true, isRequired: true },
                        { field: 'group', value: '', type: 'text', label: 'Group', placeholder: '请输入Group', description: '必填', isShow: true, isRequired: true },
                        { field: 'description', value: '', type: 'textarea', label: 'Description', placeholder: '请输入Description', description: '可空', isShow: true },
                        { field: 'cron', value: '', type: 'text', label: 'Cron', placeholder: '请输入Cron', description: '必填', isShow: true, isRequired: true },
                        {
                            field: 'commandGroupId', value: -1, type: 'select', label: 'Command Group Id', description: '必填', isShow: true, isRequired: true,
                            options: [],
                            valuefield: 'id', textfield: 'text', NullValue: -1,
                        },
                    ]
                }
            ],
            commandGroupList: [],
        }
    },
    methods: {
        getMainTable() {
            this.$setBusy();
            this.$axios.get("/api/taskScheduler/getJobList?isIncludeItem=true").then((response) => {
                this.$clearBusy();
                console.log(response);
                this.mainTableRows = response.data;
            }).catch((err) => {
                this.$clearBusy();
                console.log(err)
                this.$messageError('System Tip', err)
            })
        },
        newMainModal() {
            var data = {
                id: this.$common.getGuid(),//生成GUID作为Key，并且不能编辑
                key: '',
                group: '',
                description: '',
            }
            this.$refs.mainForm.setFormValue(data);
            this.$refs.mainForm.showMyModal();
        },
        editMainModal(jobId) {
            var index = this.mainTableRows.findIndex(f => f.id === jobId);
            if (index !== -1) {
                var row = this.mainTableRows[index];
                this.$refs.mainForm.setFormValue(row);
                this.$refs.mainForm.showMyModal();
            } else {
                this.$messageError('System Tip', 'NoFound')
            }
        },
        deleteMainRow(jobId) {
            var index = this.mainTableRows.findIndex(f => f.id === jobId);
            if (index !== -1) {
                var mainRow = this.mainTableRows[index];

                this.$setBusy();
                this.$axios.get("/api/taskScheduler/deleteMyJobInfo?id=" + mainRow.id).then((response) => {
                    this.$clearBusy();
                    console.log(response);
                    if (response.data) {
                        this.mainTableRows.splice(index, 1);
                        this.$messageSuccess('System Tip', 'Delete Success')
                    }
                }).catch((err) => {
                    this.$clearBusy();
                    console.log(err)
                    this.$messageError('System Tip', err)
                })
            } else {
                this.$messageError('System Tip', 'NoFound')
            }
        },
        onMainSubmit(data) {
            this.$setBusy();
            this.$axios.post("/api/taskScheduler/saveMyJobInfo", data).then((response) => {
                this.$clearBusy();
                console.log(response)
                if (response.data === true) {
                    this.$messageSuccess('System Tip', 'Save Success')

                    var index = this.mainTableRows.findIndex(f => f.id === data.id);
                    if (index !== -1) {
                        var row = this.mainTableRows[index];
                        row.key = data.key
                        row.group = data.group
                        row.description = data.description
                    } else {
                        this.mainTableRows.push({
                            id: data.id,
                            key: data.key,
                            group: data.group,
                            description: data.description,
                            triggers: [],//初始化子表集合
                        })
                    }
                } else {
                    this.$messageWarn('System Tip', 'Save Fail')
                }
            }).catch((err) => {
                this.$clearBusy();
                console.log(err)
                this.$messageError('System Tip', 'Save Fail')
            })
        },

        newItemModal(jobId) {
            var data = {
                jobId: jobId,
                id: this.$common.getGuid(),//生成GUID作为Key，并且不能编辑
            }
            this.$refs.itemForm.setFormValue(data);
            this.$refs.itemForm.showMyModal();
        },
        editItemModal(jobId, itemId) {
            var mainRow = this.mainTableRows.filter(f => f.id === jobId)[0];
            var index = mainRow.triggers.findIndex(f => f.id === itemId);
            if (index !== -1) {
                var itemRow = mainRow.triggers[index];
                this.$refs.itemForm.setFormValue(itemRow);
                this.$refs.itemForm.showMyModal();
            } else {
                this.$messageError('System Tip', 'NoFound')
            }
        },
        deleteItemRow(jobId, itemId) {
            var mainRow = this.mainTableRows.filter(f => f.id === jobId)[0];
            var index = mainRow.triggers.findIndex(f => f.id === itemId);
            if (index !== -1) {
                this.$messageConfirm("系统提示", "确定要删除吗？", (isConfirm) => {
                    if (isConfirm) {
                        this.$setBusy();
                        this.$axios.get("/api/commandGroup/deleteMyTriggerInfo?id=" + itemId).then((response) => {
                            this.$clearBusy();
                            console.log(response);
                            if (response.data) {
                                mainRow.triggers.splice(index, 1);
                                this.$messageSuccess('System Tip', 'Delete Success')
                            }
                        }).catch((err) => {
                            this.$clearBusy();
                            console.log(err)
                            this.$messageError('System Tip', err)
                        })
                    }
                })
            } else {
                this.$messageError('System Tip', 'NoFound')
            }
        },
        onItemSubmit(data) {
            this.$setBusy();
            this.$axios.post("/api/taskScheduler/saveMyTriggerInfo", data).then((response) => {
                this.$clearBusy();
                console.log(response)
                if (response.data === true) {
                    this.$messageSuccess('System Tip', 'Save Success')

                    var mainRow = this.mainTableRows.filter(f => f.id === data.jobId)[0];
                    var index = mainRow.triggers.findIndex(f => f.id === data.id);
                    if (index !== -1) {
                        var row = mainRow.triggers[index];
                        row.key = data.key
                        row.group = data.group
                        row.description = data.description
                        row.cron = data.cron
                        row.commandGroupId = data.commandGroupId
                    } else {
                        mainRow.triggers.push({
                            jobId: data.jobId,
                            id: data.id,
                            key: data.key,
                            group: data.group,
                            description: data.description,
                            cron: data.cron,
                            commandGroupId: data.commandGroupId,
                        })
                    }
                } else {
                    this.$messageWarn('System Tip', 'Save Fail')
                }
            }).catch((err) => {
                this.$clearBusy();
                console.log(err)
                this.$messageError('System Tip', 'Save Fail')
            })
        },

        startCommandGroupJob(jobId, itemId) {
            this.$axios.get("/api/taskScheduler/startCommandGroupJob?jobId=" + jobId + '&triggerId=' + itemId).then((response) => {
                console.log(response);
                if (response.data === true) {
                    this.$messageSuccess('System Tip', 'Success')
                } else {
                    this.$messageWarn('System Tip', 'Fail')
                }
            }).catch((err) => {
                console.log(err)
                this.$messageError('System Tip', err)
            })
        },
        initSelectData() {
            this.$axios.get("/api/taskScheduler/getCommandGroupSelectList").then((response) => {
                console.log(response);
                this.commandGroupList = response.data;

                var firstForm = this.itemForm[0].form;
                var index_type = firstForm.findIndex(f => f.field === "commandGroupId")
                firstForm[index_type].options = [
                    { text: '请选择', id: -1, disabled: true },
                ]
                this.commandGroupList.forEach(f => firstForm[index_type].options.push(f))
            }).catch((err) => {
                console.log(err)
                this.$messageError('System Tip', err)
            })
        }
    },
    mounted() {
        this.initSelectData();
        this.getMainTable();
    }
}
</script>