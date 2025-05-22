<template>
    <div>
        <h1>Automatic Group 自动模式-配置组别</h1>

        <myTable v-bind="mainTable" v-on:pagechange="pageChange" v-on:expandChange="expandChange" ref="table">
            <template #expand="props">
                <p>
                    <!-- Id: {{ props.props.row.id }} -->
                    <el-button type="success" @click="addTreeItem(props.props.row.id)"><el-icon size="20"><Plus /></el-icon></el-button>
                    <el-button type="danger" @click="deleteTreeItem(props.props.row.id)"><el-icon size="20"><Delete /></el-icon></el-button>
                    <el-badge :value="treeItemChange[props.props.row.id] ? 'new': ''" class="item" style="margin-left: 12px;">
                        <el-button type="primary" @click="saveTreeItem(props.props.row.id)"><el-icon size="20"><CircleCheck /></el-icon></el-button>
                    </el-badge>
                </p>
                <div>
                    <myTree v-bind="props.props.row.tree" v-on:append="appendTree" v-on:edit="editTree"
                        v-on:remove="removeTree" :ref="'itemTree' + props.props.row.id">
                        <template #treebody="data">
                            <el-scrollbar>
                                <div class="scrollbar-flex-content">
                                    <p>
                                        <el-space wrap size="large">
                                            <!-- Id: {{ data.props.id }} -->
                                            <el-text><el-text tag="b" type="primary">序号: </el-text>{{ data.props.depthIndex }}/{{ data.props.myIndex }}</el-text>
                                            <el-text><el-text tag="b" type="primary">类型: </el-text>{{ commandTypeSelectObj[data.props.type] }}</el-text>
                                            <el-text><el-text tag="b" type="primary">操作: </el-text>{{ operateTypeSelectObj[data.props.operate] }}</el-text>
                                            <el-text><el-text tag="b" type="primary">内容: </el-text>{{ data.props.content }}</el-text>
                                            <el-text><el-text tag="b" type="primary">次数: </el-text>{{ data.props.count }}</el-text>
                                            <el-text><el-text tag="b" type="primary">间隔（秒）: </el-text>{{ data.props.interval }}</el-text>
                                            <el-text><el-text tag="b" type="primary">超时（秒）: </el-text>{{ data.props.timeout }}</el-text>
                                            <el-text><el-text tag="b" type="primary">找不到是否停止: </el-text>{{ data.props.isStop ? "√" : "×" }}</el-text>
                                            <el-text><el-text tag="b" type="primary">取值序号: </el-text>{{ data.props.getIndex }}</el-text>
                                            <el-text><el-text tag="b" type="primary">备注: </el-text>{{ data.props.remark }}</el-text>
                                        </el-space>
                                    </p>
                                </div>
                            </el-scrollbar>
                        </template>
                    </myTree>
                </div>
            </template>
        </myTable>

        <el-dialog v-model="addOrEditModal.isShow" :title="addOrEditModal.title" :before-close="closeAddOrEditModal">
            <el-form :model="form" label-width="auto">
                <el-form-item :label="addOrEditModal.form.id.label">
                    <el-input v-model="addOrEditModal.form.id.value" readonly />
                </el-form-item>
                <el-form-item :label="addOrEditModal.form.name.label">
                    <el-input v-model="addOrEditModal.form.name.value" />
                </el-form-item>
                <el-form-item :label="addOrEditModal.form.appName.label">
                    <el-input v-model="addOrEditModal.form.appName.value" />
                </el-form-item>
                <el-form-item :label="addOrEditModal.form.remark.label">
                    <el-input v-model="addOrEditModal.form.remark.value" type="textarea" />
                </el-form-item>
            </el-form>

            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="closeAddOrEditModal">Cancel</el-button>
                    <el-button type="primary" @click="saveAddOrEdit">Confirm</el-button>
                </div>
            </template>
        </el-dialog>

        <el-dialog v-model="addOrEditTreeModal.isShow" :title="addOrEditTreeModal.title"
            :before-close="closeAddOrEditTreeModal">
            <el-form :model="form" label-width="auto">
                <el-form-item :label="addOrEditTreeModal.form.id.label">
                    <el-input v-model="addOrEditTreeModal.form.id.value" readonly />
                </el-form-item>
                <el-form-item :label="addOrEditTreeModal.form.label.label">
                    <el-input v-model="addOrEditTreeModal.form.label.value" />
                </el-form-item>
                <el-form-item :label="addOrEditTreeModal.form.type.label">
                    <el-select v-model="addOrEditTreeModal.form.type.value">
                        <el-option
                            v-for="item in commandTypeSelectList"
                            :key="item.id"
                            :label="item.text"
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item :label="addOrEditTreeModal.form.operate.label">
                    <el-select v-model="addOrEditTreeModal.form.operate.value">
                        <el-option
                            v-for="item in operateTypeSelectList"
                            :key="item.id"
                            :label="item.text"
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item :label="addOrEditTreeModal.form.content.label">
                    <el-input v-model="addOrEditTreeModal.form.content.value" />
                </el-form-item>
                <el-form-item :label="addOrEditTreeModal.form.count.label">
                    <el-input-number v-model="addOrEditTreeModal.form.count.value" :min="1" :max="100"/>
                </el-form-item>
                <el-form-item :label="addOrEditTreeModal.form.interval.label">
                    <el-input-number v-model="addOrEditTreeModal.form.interval.value" :min="1" :max="60"/>
                </el-form-item>
                <el-form-item :label="addOrEditTreeModal.form.timeout.label">
                    <el-input-number v-model="addOrEditTreeModal.form.timeout.value" :min="1" :max="60"/>
                </el-form-item>
                <el-form-item :label="addOrEditTreeModal.form.isStop.label">
                    <el-checkbox v-model="addOrEditTreeModal.form.isStop.value" />
                </el-form-item>
                <el-form-item :label="addOrEditTreeModal.form.getIndex.label">
                    <el-input-number v-model="addOrEditTreeModal.form.getIndex.value" :min="0" :max="100"/>
                </el-form-item>
                <el-form-item :label="addOrEditTreeModal.form.remark.label">
                    <el-input v-model="addOrEditTreeModal.form.remark.value" type="textarea" />
                </el-form-item>
            </el-form>

            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="closeAddOrEditTreeModal">Cancel</el-button>
                    <el-button type="primary" @click="saveAddOrEditTree">Confirm</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
  
<script>
import myTable from '../myComponents/myTable.vue'
import myTree from '../myComponents/myTree.vue'
export default {
    name: 'Automatic_CommandGroup',
    components: {
        myTable,
        myTree
    },
    data() {
        return {
            name: '',

            commandTypeSelectObj: {},
            commandTypeSelectList: [],
            operateTypeSelectObj: {},
            operateTypeSelectList: [],

            treeItemChange: {},//标记树形结构是否发生更改，有更改页面提醒用户注意要保存，key是GroupId，Value是更新次数
            mainTable: {
                columns: [
                    //列声明（标题label, 字段名prop, 宽度width, 类型type）
                    { label: 'Id', prop: 'id', type: '', width: '300' },
                    { label: 'Name', prop: 'name', type: '' },
                    { label: 'App Name', prop: 'appName', type: '' },
                    { label: 'Remark', prop: 'remark', type: '' },
                ],
                rows: [],
                total: 0,
                isExpand: true,
                operationButtons: [
                    {
                        title: 'Edit', type: 'primary', icon: 'Edit', onclick(index, row, self) {
                            self.mainEdit(index, row);
                        }, disabled(row) {
                            if (row.sex == "W") {
                                return true;
                            }
                            return false;
                        }
                    },
                    {
                        title: 'Delete', type: 'danger', icon: 'Delete', onclick(index, row, self) {
                            self.mainDelete(index, row);
                        }, disabled(row) {
                            if (row.sex == "W") {
                                return true;
                            }
                            return false;
                        }
                    }
                ],
                footerButtons: [
                    {
                        title: 'Add', type: 'success', icon: 'Plus', onclick(self) {
                            self.mainAdd();
                        }
                    }
                ]
            },

            addOrEditModal: {
                isShow: false,
                title: '',
                index: -1,
                row: null,
                form: {
                    id: { label: 'Id', value: '', default: '' },
                    name: { label: 'Name', value: '', default: '' },
                    appName: { label: 'AppName', value: '', default: '' },
                    remark: { label: 'Remark', value: '', default: '' },
                }
            },

            addOrEditTreeModal: {
                isShow: false,
                title: '',
                isEdit: false,
                groupId: -1,
                item: null,
                form: {
                    id: { label: 'Id', value: '', default: '' },//自动生成
                    depthIndex: { label: '层数', value: -1, default: -1 },//自动生成
                    myIndex: { label: '序号', value: -1, default: -1 },//自动生成
                    label: { label: '名称', value: '', default: '' },
                    type: { label: '类型', value: 0, default: 0 },
                    operate: { label: '操作', value: 0, default: 0 },
                    content: { label: '内容', value: '', default: '' },
                    count: { label: '次数', value: 1, default: 1 },
                    interval: { label: '间隔（秒）', value: 3, default: 3 },
                    timeout: { label: '超时（秒）', value: 10, default: 10 },
                    isStop: { label: '找不到是否停止', value: true, default: true },
                    getIndex: { label: '取值序号', value: 0, default: 0 },
                    remark: { label: '备注', value: '', default: '' },
                }
            }
        }
    },
    methods: {
        pageChange(page) {
            const loading = this.$myLoading();
            this.$post("/api/commandGroup/getCommandGroupList", { currentPage: page.currentPage, pageSize: page.pageSize }).then((response) => {
                this.mainTable.rows = response.data.items;
                this.mainTable.total = response.data.totalCount;
            }).finally(() => {
                loading.close();
            })
        },

        mainAdd() {
            this.openAddOrEditModal('Add Form');
        },
        mainEdit(index, row) {
            this.openAddOrEditModal('Edit Form', index, row);
        },
        openAddOrEditModal(title, index = -1, row = null) {
            this.addOrEditModal.isShow = true
            this.addOrEditModal.title = title
            this.addOrEditModal.index = index
            this.addOrEditModal.row = row

            if (row) {
                for (var key in row) {
                    if (!this.addOrEditModal.form[key]) {
                        continue;
                    }
                    this.addOrEditModal.form[key].value = row[key]
                }
            } else {
                this.addOrEditModal.form.id.value = this.$getGuid()
            }
        },
        closeAddOrEditModal() {
            this.addOrEditModal.isShow = false
            this.addOrEditModal.title = ''
            this.addOrEditModal.index = -1
            this.addOrEditModal.row = null

            //表单恢复默认值
            for (var key in this.addOrEditModal.form) {
                this.addOrEditModal.form[key].value = this.addOrEditModal.form[key].default
            }
        },
        saveAddOrEdit() {
            var row = {};
            if (this.addOrEditModal.index !== -1) {
                //编辑
                row = this.mainTable.rows.filter(f => f.id === this.addOrEditModal.row.id)[0]
                for (var key in this.addOrEditModal.form) {
                    row[key] = this.addOrEditModal.form[key].value
                }
                row.tree = {
                    groupId: row.id,
                }
            } else {
                //新增
                for (var key in this.addOrEditModal.form) {
                    row[key] = this.addOrEditModal.form[key].value
                }
                row.tree = {
                    groupId: row.id,
                }
            }
            const loading = this.$myLoading();
            this.$post("/api/commandGroup/saveMyCommandGroup", row).then((response) => {
                if (response.data) {
                    this.$swalSuccess(this.$i18n.t('app.systemTips'), '保存成功！');
                    if (this.addOrEditModal.index === -1) {
                        this.mainTable.rows.push(row);
                    }
                    this.closeAddOrEditModal();
                }
            }).finally(() => {
                loading.close();
            })
        },

        mainDelete(index, row) {
            this.$swalConfirm(this.$i18n.t('app.systemTips'), '确定要删除吗？', (isConfirmed) => {
                if (isConfirmed) {
                    const loading = this.$myLoading();
                    this.$get("/api/commandGroup/deleteMyCommandGroup?id=" + row.id).then((response) => {
                        if (response.data) {
                            this.$swalSuccess(this.$i18n.t('app.systemTips'), '删除成功！');
                            this.mainTable.rows.splice(index, 1)
                        }
                    }).finally(() => {
                        loading.close();
                    })
                }
            })
        },


        expandChange(row) {
            var id = row.row.id
            //查询接口获取当前groupId下所有命令
            const loading = this.$myLoading();
            this.$get("/api/commandGroup/getCommandsByGroupId?groupId=" + id).then((response) => {
                if (response.data && response.data.length > 0) {
                    var treeRef = this.$refs['itemTree' + id];
                    if(!treeRef){
                        return;
                    }
                    this.$sortTreeData(response.data, 'myIndex', true)
                    treeRef.setDataSource(response.data);
                }
            }).finally(() => {
                loading.close();
            })
        },
        addTreeItem(groupId) {
            this.openAddOrEditTreeModal('Add Tree Form', groupId);
        },
        saveTreeItem(groupId) {
            var treeDatas = this.$refs['itemTree' + groupId].getDataSource();
            this.$sortTreeData(treeDatas, 'myIndex', true)
            const loading = this.$myLoading();
            this.$post("/api/commandGroup/saveCommands", treeDatas).then((response) => {
                this.$swalSuccess(this.$i18n.t('app.systemTips'), '保存成功！');
                this.treeItemChange[groupId] = 0;
            }).finally(() => {
                loading.close();
            })
        },
        deleteTreeItem(groupId){
            this.$swalConfirm(this.$i18n.t('app.systemTips'), '确定要删除吗？', (isConfirmed) => {
                if (isConfirmed) {
                    const loading = this.$myLoading();
                    this.$get("/api/commandGroup/deleteCommands?groupId=" + groupId).then((response) => {
                        this.$swalSuccess(this.$i18n.t('app.systemTips'), '删除成功！');
                        var treeRef = this.$refs['itemTree' + groupId];
                        if(!treeRef){
                            return;
                        }
                        treeRef.setDataSource([]);
                        this.treeItemChange[groupId] = 0;
                    }).finally(() => {
                        loading.close();
                    })
                }
            })
        },
        appendTree(obj) {
            this.openAddOrEditTreeModal('Add Tree Form', obj.groupId, obj.data);
        },
        editTree(obj) {
            this.openAddOrEditTreeModal('Edit Tree Form', obj.groupId, obj.data, true);
        },
        removeTree(obj) {
            const parent = obj.node.parent
            const children = parent.data.children || parent.data
            const index = children.findIndex((d) => d.id === obj.data.id)
            children.splice(index, 1)

            //如果删除完是空的也this.treeItemChange[groupId] = 0;
        },
        openAddOrEditTreeModal(title, groupId, item = null, isEdit = false) {
            this.addOrEditTreeModal.isShow = true
            this.addOrEditTreeModal.title = title
            this.addOrEditTreeModal.isEdit = isEdit
            this.addOrEditTreeModal.groupId = groupId
            this.addOrEditTreeModal.item = item

            if (isEdit) {
                for (var key in item) {
                    if (!this.addOrEditTreeModal.form[key]) {
                        continue;
                    }
                    this.addOrEditTreeModal.form[key].value = item[key]
                }
            } else {
                this.addOrEditTreeModal.form.id.value = this.$getGuid()
            }
        },
        closeAddOrEditTreeModal() {
            this.addOrEditTreeModal.isShow = false
            this.addOrEditTreeModal.title = ''
            this.addOrEditTreeModal.isEdit = false
            this.addOrEditTreeModal.groupId = -1
            this.addOrEditTreeModal.item = null

            //表单恢复默认值
            for (var key in this.addOrEditTreeModal.form) {
                this.addOrEditTreeModal.form[key].value = this.addOrEditTreeModal.form[key].default
            }
        },
        saveAddOrEditTree() {
            var treeRef = this.$refs['itemTree' + this.addOrEditTreeModal.groupId];
            if (this.addOrEditTreeModal.isEdit) {
                //修改当前节点
                var newChild = {};
                for (var key in this.addOrEditTreeModal.form) {
                    newChild[key] = this.addOrEditTreeModal.form[key].value
                }
                newChild.groupId = this.addOrEditTreeModal.groupId
                treeRef.editChild(newChild);
            }
            else if (this.addOrEditTreeModal.item !== null) {
                //新增子节点
                var newChild = {};
                for (var key in this.addOrEditTreeModal.form) {
                    newChild[key] = this.addOrEditTreeModal.form[key].value
                }
                newChild.groupId = this.addOrEditTreeModal.groupId
                newChild.depthIndex = this.addOrEditTreeModal.item.depthIndex + 1
                newChild.myIndex = this.addOrEditTreeModal.item.children.length
                newChild.children = [];
                treeRef.addChild(newChild);
            } else {
                //新增主节点
                var newChild = {};
                for (var key in this.addOrEditTreeModal.form) {
                    newChild[key] = this.addOrEditTreeModal.form[key].value
                }
                newChild.groupId = this.addOrEditTreeModal.groupId
                newChild.depthIndex = 0;//第一层
                newChild.myIndex = treeRef.getMainCount()
                newChild.children = [];
                treeRef.addMain(newChild)
            }
            this.updateTreeItemChange(this.addOrEditTreeModal.groupId);
            this.closeAddOrEditTreeModal();
        },
        updateTreeItemChange(groupId){
            if (this.treeItemChange[groupId]) {
                this.treeItemChange[groupId]++
            } else {
                this.treeItemChange[groupId] = 1
            }
        },

        getSelectList(){
            this.$get("/api/commandGroup/getCommandTypeSelectList").then((response) => {
                this.commandTypeSelectList = [];
                if(response.data.length > 0){
                    response.data.forEach(element => {
                        this.commandTypeSelectObj[element.id] = element.text
                        this.commandTypeSelectList.push({ id: parseInt(element.id), text: element.text })
                    });
                }else{
                    this.commandTypeSelectObj = {};
                }
            })
            this.$get("/api/commandGroup/getOperateTypeSelectList").then((response) => {
                this.operateTypeSelectList = [];
                if(response.data.length > 0){
                    response.data.forEach(element => {
                        this.operateTypeSelectObj[element.id] = element.text
                        this.operateTypeSelectList.push({ id: parseInt(element.id), text: element.text })
                    });
                }else{
                    this.operateTypeSelectObj = {};
                }
            })
        }
    },
    mounted() {
        this.pageChange({ currentPage: 1, pageSize: 10 });
        this.getSelectList();
    },
}
</script>