<template>
    <div>
        <el-container>
            <el-header>
                <h3>用户信息</h3>
            </el-header>

            <el-main>
                <el-table ref="multipleTableRef" stripe row-key="id" :data="table.rows" :border="parentBorder"
                    style="width: 100%" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" />
                    <el-table-column type="index" width="50" />
                    <el-table-column label="Operations">
                        <template #default="scope">
                            <el-button size="small" type="primary" @click="handleAddOrEdit(scope.$index, scope.row)">
                                {{ $t("app.edit") }}
                            </el-button>
                            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">
                                {{ $t("app.delete") }}
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="Id" prop="id" />
                    <el-table-column label="User Name" prop="userName" />
                    <el-table-column label="Nick Name" prop="nickName"></el-table-column>
                    <el-table-column label="Email" prop="email" />
                    <el-table-column label="User Type" prop="userType" />
                </el-table>
            </el-main>

            <el-footer>
                <div style="display:flex">
                    <el-button type="success" @click="handleAddOrEdit">{{ $t("app.add") }}</el-button>
                    <el-pagination v-model:current-page="table.currentPage" v-model:page-size="table.pageSize"
                        :page-sizes="table.sizes" size="default" :disabled="table.disabled" :background="true"
                        layout="total, slot, sizes, jumper, prev, pager, next" :total="table.total"
                        @size-change="handleSizeChange" @current-change="handleCurrentChange">
                        <span class="el-pagination__total">{{ $t("app.selectedNumber", { num: table.selectIds.length })
                        }}</span>
                    </el-pagination>
                </div>
            </el-footer>
        </el-container>

        <el-dialog v-model="createOrEditModal.isVisible" title="Edit" width="800">
            <el-form :model="form">
                <el-form-item label="User Name" label-width="140px">
                    <el-input v-model="form.userName" autocomplete="off" />
                </el-form-item>
                <el-form-item label="Nick Name" label-width="140px">
                    <el-input v-model="form.nickName" autocomplete="off" />
                </el-form-item>
                <el-form-item label="Email" label-width="140px">
                    <el-input v-model="form.email" autocomplete="off" />
                </el-form-item>
                <el-form-item label="Password" label-width="140px">
                    <el-input v-model="form.password" autocomplete="off" />
                </el-form-item>
                <el-form-item label="User Type" label-width="140px">
                    <el-select v-model="form.userType" placeholder="请选择">
                        <el-option v-for="item in userTypeSelectItems" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>

            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="closeModal">{{ $t("app.cancel") }}</el-button>
                    <el-button type="success" @click="saveData">{{ $t("app.confirm") }}</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
  
<script>
export default {
    name: 'UserInfo',
    data() {
        return {
            parentBorder: false,
            table: {
                rows: [],
                currentPage: 1,
                pageSize: 5,
                total: 100,
                sizes: [5, 10, 15, 20],
                disabled: false,
                selectIds: []
            },
            createOrEditModal: {
                isVisible: false,
                rowId: 0,
            },
            form: {
                userName: '',
                nickName: '',
                email: '',
                password: '',
                userType: '',
            },
            userTypeSelectItems: [
                { value: 'general', label: 'general' },
                { value: 'admin', label: 'admin' },
            ]
        }
    },
    methods: {
        handleSelectionChange(val) {
            console.log(val)
            this.table.selectIds = [];
            for (var i = 0; i < val.length; i++) {
                this.table.selectIds.push(val[i].id);
            }
        },
        handleAddOrEdit(index, row) {
            console.log(index, row)

            if (row) {
                this.createOrEditModal.rowId = row.id;
                this.form.userName = row.userName
                this.form.nickName = row.nickName
                this.form.email = row.email
                this.form.password = row.password
                this.form.userType = row.userType
            }
            this.createOrEditModal.isVisible = true;
        },
        handleDelete(index, row) {
            this.$swalConfirm(this.$t("app.systemTips"), "Are you sure to delete it?", (isConfirmed) => {
                if (isConfirmed) {
                    this.$postEx("/api/deleteUser", { id: row.id }, (data) => {
                        var index = this.table.rows.findIndex(f => f.id == row.id);
                        this.table.rows.splice(index, 1);
                    })
                }
            })
        },

        handleSizeChange(val) {
            console.log(`${val} items per page`)
            this.table.pageSize = val;
            this.pageChange();
        },
        handleCurrentChange(val) {
            console.log(`current page: ${val}`)
            this.table.currentPage = val;
            this.pageChange();
        },

        pageChange() {
            let limit = this.table.pageSize;
            let offset = (this.table.currentPage - 1) * this.table.pageSize;
            
            this.$getEx(`/api/getUsers?limit=${limit}&offset=${offset}`, (data) => {
                this.table.rows = data.data;
                this.table.total = data.count.count;
            })
        },
        saveData() {
            //数据校验
            if (!this.form.userName) {
                this.$swalError('系统提示', 'User Name不能为空');
                return;
            }
            if (!this.form.nickName) {
                this.$swalError('系统提示', 'Nick 不能为空');
                return;
            }
            if (!this.form.email) {
                this.$swalError('系统提示', 'Email不能为空');
                return;
            }
            if (!this.form.password) {
                this.$swalError('系统提示', 'Password不能为空');
                return;
            }
            if (!this.form.userType) {
                this.$swalError('系统提示', 'User Type不能为空');
                return;
            }

            if (this.createOrEditModal.rowId) {

                var inputDto = {
                    id: this.createOrEditModal.rowId,
                    userName: this.form.userName,
                    nickName: this.form.nickName,
                    email: this.form.email,
                    password: this.form.password,
                    userType: this.form.userType,
                }
                this.$postEx("/api/updateUser", inputDto, (data) => {
                    this.pageChange()//做简单一点直接刷新表格即可
                    this.closeModal();
                    // var mainRow = this.table.rows.filter(f => f.id == this.createOrEditModal.rowId)[0];
                    // mainRow.userName = this.form.userName
                    // mainRow.nickName = this.form.nickName
                    // mainRow.email = this.form.email
                    // mainRow.password = this.form.password
                    // mainRow.userType = this.form.userType
                })
            }
            else {

                var inputDto = {
                    userName: this.form.userName,
                    nickName: this.form.nickName,
                    email: this.form.email,
                    password: this.form.password,
                    userType: this.form.userType,
                }
                this.$post("/api/addUser", inputDto, (data) => {
                    this.pageChange()//做简单一点直接刷新表格即可
                    this.closeModal();
                    // var newRow = {};
                    // //newRow.id = this.$getGuid();//自增Id
                    // newRow.userName = this.form.userName
                    // newRow.nickName = this.form.nickName
                    // newRow.email = this.form.email
                    // newRow.password = this.form.password
                    // newRow.userType = this.form.userType
                    // this.table.rows.push(newRow);
                })
            }
        },
        closeModal() {
            this.createOrEditModal.isVisible = false;
            this.form.userName = ""
            this.form.nickName = ""
            this.form.email = ""
            this.form.password = ""
            this.form.userType = ""
        }
    },
    mounted() {
        console.log("UserInfo mounted");
        this.pageChange()
    },
}
</script>
  