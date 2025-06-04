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
                    <el-table-column label="User Name" prop="username" />
                    <el-table-column label="Email" prop="email" />
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
                <el-form-item label="Email" label-width="140px">
                    <el-input v-model="form.email" autocomplete="off" />
                </el-form-item>
                <el-form-item label="Password" label-width="140px">
                    <el-input v-model="form.password" autocomplete="off" />
                </el-form-item>
            </el-form>

            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="createOrEditModal.isVisible = false">{{ $t("app.cancel") }}</el-button>
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
            childBorder: false,
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
                email: '',
                password: '',
            }
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
                this.form.userName = row.username
                this.form.email = row.email
                this.form.password = row.password
            }
            this.createOrEditModal.isVisible = true;
        },
        handleDelete(index, row) {
            console.log(index, row)

            this.$swalConfirm(this.$t("app.systemTips"), "Are you sure to delete it?", (isConfirmed) => {
                if (isConfirmed) {
                    this.$post("/api/deleteuser", { id: row.id }).then((response) => {
                        if (response.data.isSuccess) {
                            var index = this.table.rows.findIndex(f => f.id == row.id);
                            this.table.rows.splice(index, 1);
                        }
                        else {
                            this.$swalError('系统提示', response.data.error);
                        }
                    }).catch((err) => {
                        this.$swalError('系统提示', err);
                    })
                }
            })
        },

        handleSizeChange(val) {
            console.log(`${val} items per page`)
        },
        handleCurrentChange(val) {
            console.log(`current page: ${val}`)
        },

        pageChange() {
            let limit = this.table.pageSize;
            let offset = (this.table.currentPage - 1) * this.table.pageSize;
            this.$get(`/api/getusers?limit=${limit}&offset=${offset}`).then((response) => {
                console.log(response.data);
                this.table.rows = response.data.data;
                this.table.total = this.table.rows.length;
            })
        },
        saveData() {
            //数据校验
            if (!this.form.userName) {
                this.$swalError('系统提示', 'User Name不能为空');
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

            if (this.createOrEditModal.rowId) {

                var inputDto = {
                    id: this.createOrEditModal.rowId,
                    username: this.form.userName,
                    email: this.form.email,
                    password: this.form.password
                }
                this.$post("/api/updateuser", inputDto).then((response) => {
                    console.log(response.data);

                    if (response.data.isSuccess) {
                        this.pageChange()//做简单一点直接刷新表格即可
                        this.closeModal();
                        // var mainRow = this.table.rows.filter(f => f.id == this.createOrEditModal.rowId)[0];
                        // mainRow.userName = this.form.userName
                        // mainRow.email = this.form.email
                        // mainRow.password = this.form.password
                    }
                    else {
                        this.$swalError('系统提示', response.data.error);
                    }
                }).catch((err) => {
                    this.$swalError('系统提示', err);
                })
            }
            else {

                var inputDto = {
                    username: this.form.userName,
                    email: this.form.email,
                    password: this.form.password
                }
                this.$post("/api/adduser", inputDto).then((response) => {
                    console.log(response.data);
                    if (response.data.isSuccess) {
                        this.pageChange()//做简单一点直接刷新表格即可
                        this.closeModal();
                        // var newRow = {};
                        // //newRow.id = this.$getGuid();//自增Id
                        // newRow.userName = this.form.userName
                        // newRow.email = this.form.email
                        // newRow.password = this.form.password
                        // this.table.rows.push(newRow);
                    }
                    else {
                        this.$swalError('系统提示', response.data.error);
                    }
                }).catch((err) => {
                    this.$swalError('系统提示', err);
                })
            }
        },
        closeModal(){
            this.createOrEditModal.isVisible = false;
            this.form.userName = ""
            this.form.email = ""
            this.form.password = ""
        }
    },
    mounted() {
        console.log("UserInfo mounted");
        this.pageChange()
    },
}
</script>
  