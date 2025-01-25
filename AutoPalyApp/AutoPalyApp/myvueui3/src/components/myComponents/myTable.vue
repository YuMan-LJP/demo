<template>
    <div>
        <el-container>
            <el-header>
                <h3>{{ title }}</h3>
            </el-header>

            <el-main>
                <el-table 
                    :ref="'myTable'+ guid" 
                    stripe 
                    row-key="id" 
                    :data="rows" 
                    :border="parentBorder"
                    style="width: 100%" 
                    @select="tableSelect"
                    @select-all="tableSelectAll">
                    <el-table-column type="expand" v-if="isExpand">
                        <template #default="props">
                            <slot name="expand" :props=props></slot>
                        </template>
                    </el-table-column>
                    <el-table-column type="selection" width="55" v-if="isSelect"/>
                    <el-table-column type="index" width="50" />
                    <el-table-column label="Operations" v-if="operationButtons.length>0">
                        <template #default="scope">
                            <el-button size="small" v-for="(item,index) in operationButtons" 
                                :type="item.type" :disabled="getButtonDisabled(item,scope.row)"
                                @click="item.onclick(scope.$index, scope.row)">
                                {{ item.title }}
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column v-for="(column,columnIndex) in columns" :label="column.label" :prop="column.prop" :width="column.width">
                        <template #default="scope" v-if="column.type==='input'">
                            <el-input></el-input>
                        </template>
                    </el-table-column>
                </el-table>
            </el-main>

            <el-footer>
                <div style="display:flex">
                    <el-button v-for="(item,index) in footerButtons" :type="item.type" :disabled="getButtonDisabled(item)" @click="item.onclick">{{ item.title }}</el-button>
                    <el-pagination 
                        v-if="isPagination"
                        v-model:current-page="currentPage" 
                        v-model:page-size="pageSize"
                        :page-sizes="sizes" 
                        size="default" 
                        :disabled="pageDisabled" 
                        :background="true"
                        :layout="pageLayout" 
                        :total="total"
                        @size-change="paginationSizeChange" 
                        @current-change="paginationCurrentChange">
                        <span class="el-pagination__total">{{ $t("app.selectedNumber", { num: selectIds.length }) }}</span>
                    </el-pagination>
                </div>
            </el-footer>
        </el-container>
    </div>
</template>
    
<script>
export default {
    name: 'myTable',
    props: {
        title: {
            type: String,
            default: 'My Table',
        },//标题
        columns: {
            type: Array,
            default: () => ([])
        },//列声明（标题label, 字段名prop, 宽度width, 类型type）
        rows: {
            type: Array,
            default: () => ([])
        },//行声明

        operationButtons: {
            type: Array,
            default: () => ([])
        },//操作列按钮（标题title, 颜色类型type:primary/danger, 是否禁用disabled, 是否隐藏hide, 点击事件onclick(index,row)）
        footerButtons: {
            type: Array,
            default: () => ([])
        },//表格底部按钮（标题title, 颜色类型type:primary/danger, 是否禁用disabled, 是否隐藏hide,, 点击事件onclick()）

        isExpand: {
            type: Boolean,
            default: false
        },//是否展开
        isSelect:{
            type: Boolean,
            default: false
        },//是否出现勾选
        isPagination: {
            type: Boolean,
            default: true
        },//是否显示分页
        isLocalPagination: {
            type: Boolean,
            default: false
        },//是否本地分页

        selectedName:{
            type: String,
            default: 'id',
        },//选中时的字段
        tablePageSize: {
            type: Number,
            default: 10,
        },//每页大小
        total: {
            type: Number,
            default: 0,
        },//总行数
        sizes: {
            type: Array,
            default: () => ([5,10,15,20])
        },
        pageDisabled: {
            type: Boolean,
            default: false,
        },//分页禁用
    },
    data() {
        return {
            guid: '',//组件唯一ID，指定ref时多个相同组件才不会搞混

            //originRows: [],
            pageLayout: 'total, sizes, jumper, prev, pager, next',
            currentPage: 1,
            pageSize: 10,
            selectIds: []//选中行ID
        }
    },
    methods: {
        pageChange(){
            if(this.isLocalPagination){
                //this.rows = this.originRows.slice((page.pageIndex - 1) * page.pageSize, page.pageIndex * page.pageSize)
            }
            this.$emit('pagechange', { pageSize: this.pageSize, currentPage: this.currentPage });
        },
        tableSelect(selection, row){
            var id = row[this.selectedName];
            if(selection.findIndex(f => f[this.selectedName] === id) !== -1){
                //勾选时
                this.selectIds.push(id);
                console.log("勾选", id);
            }else{
                //取消勾选时
                var curIndex = this.selectIds.findIndex(f => f === id)
                if(curIndex !== -1){
                    this.selectIds.splice(curIndex, 1);
                    console.log("取消勾选", id);
                }
            }
        },
        tableSelectAll(selection){
            console.log(selection);
            if(selection.length > 0){
                //勾选时
                for(var i=0;i<selection.length;i++){
                    var id = selection[i][this.selectedName];
                    this.selectIds.push(id);
                    console.log("勾选", id);
                }
            }else{
                //取消勾选时
                for(var i=0;i<selection.length;i++){
                    var id = selection[i][this.selectedName];
                    var curIndex = this.selectIds.findIndex(f => f === id)
                    if(curIndex !== -1){
                        this.selectIds.splice(curIndex, 1);
                        console.log("取消勾选", id);
                    }
                }
            }
        },

        paginationSizeChange(val){
            // console.log(`${val} items per page`)
            // this.$emit("paginationsizechange", val)
            this.pageSize = val;
            this.pageChange();
        },
        paginationCurrentChange(val){
            //console.log(`current page: ${val}`)
            //this.$emit("paginationcurrentchange", val)
            this.pageChange();
        },

        getButtonDisabled(obj, row){
            if(!obj){
                return false;
            }
            if(obj.disabled === undefined){
                return false;
            }
            if(typeof obj.disabled === 'function'){
                return obj.disabled(row)
            }else{
                return obj.disabled
            }
        },
    },
    created() {
        if(!this.columns || this.columns.length === 0){
            throw new Error("参数columns不能为空！")
        }
        this.guid = this.$getGuid();
        this.pageSize = this.tablePageSize;
        if(this.isSelect){
            this.pageLayout = "total, slot, sizes, jumper, prev, pager, next"
        }
    },
    mounted() {

    }
}
</script>