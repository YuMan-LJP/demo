<template>
    <div>
        <el-tree :ref="'myTree'+ guid" :data="dataSource" show-checkbox :node-key="nodekey" default-expand-all :expand-on-click-node="false"
            icon="ArrowRightBold">
            <template #default="{ node, data }">
                <el-card>
                    <template #header>
                        <el-text class="mx-1" type="primary">{{ node.label }}</el-text>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <el-button @click="removeHandle(node, data)" type="danger" icon="Delete" circle size="small" style="float:right;margin-left: 12px;"/>
                        <el-button @click="editHandle(data)" type="success" icon="Edit" circle size="small" style="float:right"/>
                        <el-button @click="appendHandle(data)" type="success" icon="Plus" circle size="small" style="float:right"/>
                    </template>
                    <slot name="treebody" :props=data></slot>
                </el-card>
            </template>
        </el-tree>
    </div>
</template>

<script>
export default {
    name: 'myTree',
    props: {
        nodekey: {
            type: String,
            default: 'id',
        },
        groupId:{
            type: String,
            default: '',
        }
    },
    data() {
        return {
            guid: '',//组件唯一ID，指定ref时多个相同组件才不会搞混

            dataSource: [],
            editTreeItem: null
        }
    },
    methods: {
        appendHandle(data) {
            // const newChild = { id: this.id++, label: 'test' + this.id, children: [] }
            // if (!data.children) {
            //     data.children = []
            // }
            // data.children.push(newChild)
            // this.dataSource = [...this.dataSource]

            this.editTreeItem = data;
            this.$emit('append', { groupId: this.groupId, data });
        },
        editHandle(data){
            this.editTreeItem = data;
            this.$emit('edit', { groupId: this.groupId, data });
        },
        removeHandle(node, data) {
            // const parent = node.parent
            // const children = parent.data.children || parent.data
            // const index = children.findIndex((d) => d.id === data.id)
            // children.splice(index, 1)
            // this.dataSource = [...this.dataSource]

            this.$emit('remove', { groupId: this.groupId, node, data });
            this.refreshDataSource()
        },

        addMain(item){
            this.dataSource.push(item);
        },
        addChild(newChild){
            if (!this.editTreeItem.children) {
                this.editTreeItem.children = []
            }
            this.editTreeItem.children.push(newChild)
            this.refreshDataSource()
            this.editTreeItem = null
        },
        editChild(child){
            var self = this;
            for (var key in child) {
                if(key === 'children'){
                    continue;//只改children以外的字段
                }
                self.editTreeItem[key] = child[key]
            }
            self.refreshDataSource()
            self.editTreeItem = null
        },
        setDataSource(data){
            this.dataSource = data
        },
        getDataSource(){
            return this.dataSource
        },
        getMainCount(){
            return this.dataSource.length
        },
        refreshDataSource(){
            this.dataSource = [...this.dataSource]
        },
    },
    created() {
        this.guid = this.$getGuid();
    },
    mounted() {

    }
}
</script>

<style scoped>
.el-card {
    --el-card-padding: 10px;
}

.el-tree {
    --el-tree-node-content-height: 120px;
}
</style>