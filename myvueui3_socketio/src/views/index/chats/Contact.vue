<template>
    <div>
        <el-container>
            <el-header>
                <h3>Contact</h3>
            </el-header>
            <el-main>
                <el-table ref="mainTable" stripe row-key="id" :data="table.rows" :border="parentBorder" style="width: 100%"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" />
                    <el-table-column type="index" width="50" />
                    <el-table-column label="Operations">
                        <template #default="scope">
                            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">
                                {{ $t("app.delete") }}
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="Nick Name" prop="nickName" />
                    <el-table-column label="Email" prop="email" />
                </el-table>
            </el-main>
            <el-footer>
                <div style="display:flex">
                    <el-button type="success" @click="handleAdd">申请添加好友</el-button>
                </div>
            </el-footer>
        </el-container>

        <el-dialog v-model="createModal.isVisible" title="查找用户" width="800">
            <div class="mt-4">
                <el-input v-model="createModal.userNameOrEmail" style="max-width: 600px"
                    placeholder="Please input User Name Or Email" class="input-with-select">
                    <template #append>
                        <el-button icon="Search" @click="searchUser" />
                    </template>
                </el-input>
            </div>

            <div>
                <el-table ref="searchUserTable" stripe row-key="id" :data="searchUserTable.rows" style="width: 100%"
                    @selection-change="handleSelectionChange2">
                    <el-table-column type="selection" width="55" />
                    <el-table-column type="index" width="50" />
                    <el-table-column label="Nick Name" prop="nickName" />
                    <el-table-column label="Email" prop="email" />
                </el-table>
            </div>

            <el-form :model="form">
                <el-form-item label="Remark" label-width="140px">
                    <el-input v-model="form.remark" autocomplete="off" type="textarea" :rows="2" />
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
import { ElLoading } from 'element-plus';
export default {
    name: 'Contact',
    data() {
        return {
            parentBorder: false,
            table: {
                rows: [],
                total: 100,
                disabled: false,
                selectIds: []
            },
            searchUserTable: {
                rows: [],
                disabled: false,
                selectIds: []
            },
            createModal: {
                isVisible: false,
                userNameOrEmail: '',
            },
            form: {
                remark: '',
            },
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
        handleAdd() {
            this.createModal.isVisible = true;
            this.createModal.userNameOrEmail = '';
        },
        handleDelete(index, row) {
            console.log(index, row)

            //特别注意，删除联系人只是单方面在本人这端删除，对方还是有的，只是对方没办法发送消息了
            this.$swalConfirm(this.$t("app.systemTips"), "Are you sure to delete it?", (isConfirmed) => {
                if (isConfirmed) {
                    let loadingInstance = ElLoading.service({ fullscreen: true });
                    this.$post("/api/deleteContact", { id: row.id }).then((response) => {
                        loadingInstance.close();
                        if (response.data.isSuccess) {
                            var index = this.table.rows.findIndex(f => f.id == row.id);
                            this.table.rows.splice(index, 1);
                        }
                        else {
                            this.$swalError('系统提示', response.data.error);
                        }
                    }).catch((err) => {
                        loadingInstance.close();
                        this.$swalError('系统提示', err);
                    })
                }
            })
        },

        pageChange() {
            var userEntity = JSON.parse(sessionStorage.getItem('user'));

            let loadingInstance = ElLoading.service({ fullscreen: true });
            this.$get(`/api/getContacts?myselfId=${userEntity.id}`).then((response) => {
                loadingInstance.close();
                this.table.rows = response.data.data;
                this.table.total = this.table.rows.length;
            }).catch((err) => {
                loadingInstance.close();
                this.$swalError('系统提示', err);
            })
        },

        searchUser() {
            if (!this.createModal.userNameOrEmail) {
                this.$swalError('系统提示', 'User Name Or Email不能为空');
                return;
            }

            let loadingInstance = ElLoading.service({ fullscreen: true });
            this.$get(`/api/getUserByUserNameOrEmail?userNameOrEmail=${this.createModal.userNameOrEmail}`).then((response) => {
                loadingInstance.close();
                console.log(response.data.data);
                this.searchUserTable.rows = response.data.data;
            }).catch((err) => {
                loadingInstance.close();
                this.$swalError('系统提示', err);
            })
        },
        handleSelectionChange2(val) {
            console.log(val)
            this.searchUserTable.selectIds = [];
            for (var i = 0; i < val.length; i++) {
                this.searchUserTable.selectIds.push(val[i].id);
            }
        },

        saveData() {
            if (!this.form.remark) {
                this.$swalError('系统提示', 'Remark不能为空');
                return;
            }
            if (this.searchUserTable.selectIds.length == 0) {
                this.$swalError('系统提示', '请选择要申请的对象');
                return;
            }
            var userEntity = JSON.parse(sessionStorage.getItem('user'));

            var inputDtos = []
            for (var i = 0; i < this.searchUserTable.selectIds.length; i++) {
                inputDtos.push({
                    sendUserId: userEntity.id,
                    receiveUserId: this.searchUserTable.selectIds[i],
                    receiveRoomId: null,
                    type: 'contact',
                    remark: this.form.remark,
                    progress: 'waiting'//进度是等待回复
                });
            }

            let loadingInstance = ElLoading.service({ fullscreen: true });
            this.$post("/api/addRequests", inputDtos).then((response) => {
                loadingInstance.close();
                if (response.data.isSuccess) {
                    this.$swalSuccess('系统提示', '申请成功！');
                    this.closeModal();
                } else {
                    this.$swalError('系统提示', response.data.error);
                }
            }).catch((err) => {
                loadingInstance.close();
                this.$swalError('系统提示', err);
            })
        },
        closeModal() {
            this.createModal.isVisible = false;
            this.form.remark = ""
        }
    },
    mounted() {
        console.log("Contact mounted");
        this.pageChange();
    },
}
</script>
  