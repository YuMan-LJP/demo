<template>
    <div>
        <el-container>
            <el-header>
                <h3>Contact</h3>
            </el-header>
            <el-main>
                <el-table ref="mainTable" stripe row-key="id" :data="table.rows" :border="parentBorder" style="width: 100%">
                    <el-table-column type="index" width="50" />
                    <el-table-column label="Operations">
                        <template #default="scope">
                            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">
                                {{ $t("app.delete") }}
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="Status">
                        <template #default="scope">
                            <el-icon>
                                <UserFilled :color="scope.row.onlineStatus" />
                            </el-icon>
                        </template>
                    </el-table-column>
                    <el-table-column label="Nick Name" prop="nickName" />
                    <el-table-column label="Email" prop="email" />
                    <el-table-column label="Is Invalid">
                        <template #default="scope">
                            {{ scope.row.isInvalid ? '失效' : '有效' }}
                        </template>
                    </el-table-column>
                </el-table>
            </el-main>
            <el-footer>
                <div style="display:flex">
                    <div>
                        <el-button type="info" @click="pageChange(null)">刷新</el-button>
                    </div>
                    <div style="margin-left: 5px;">
                        <el-button type="success" @click="handleSearch">申请添加好友</el-button>
                    </div>
                </div>
            </el-footer>
        </el-container>

        <el-dialog v-model="searchModal.isVisible" title="查找用户" width="800">
            <div class="mt-4">
                <el-input v-model="searchModal.userNameOrEmail" style="max-width: 600px"
                    placeholder="Please input User Name Or Email" class="input-with-select">
                    <template #append>
                        <el-button icon="Search" @click="searchUser" />
                    </template>
                </el-input>
            </div>

            <div style="
                    border: 1px solid #03A9F4;
                    border-radius: 10px;
                    margin: 5px;
                    padding: 5px;
                ">
                <el-table ref="searchUserTable" stripe row-key="id" :data="searchUserTable.rows" style="width: 100%">
                    <el-table-column type="index" width="50" />
                    <el-table-column label="Operations">
                        <template #default="scope">
                            <el-button size="small" type="success" @click="handleCreate(scope.$index, scope.row)">
                                申请
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="Nick Name" prop="nickName" />
                    <el-table-column label="Email" prop="email" />
                </el-table>
            </div>

            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="closeSearchModal">关闭</el-button>
                </div>
            </template>
        </el-dialog>

        <el-dialog v-model="createModal.isVisible" title="申请添加" width="600">
            <el-form :model="form">
                <el-form-item label="Remark" label-width="140px">
                    <el-input v-model="form.remark" autocomplete="off" type="textarea" :rows="2" />
                </el-form-item>
            </el-form>

            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="closeCreateModal">{{ $t("app.cancel") }}</el-button>
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
            },
            searchUserTable: {
                rows: [],
                disabled: false,
            },
            searchModal: {
                isVisible: false,
                userNameOrEmail: '',
            },
            createModal: {
                isVisible: false,
                userId: null,
            },
            form: {
                remark: '',
            },

            onlineUserIds: []
        }
    },
    methods: {
        handleSearch() {
            this.searchModal.isVisible = true;
        },
        handleCreate(index, row) {
            this.createModal.isVisible = true;
            this.createModal.userId = row.id;
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

        pageChange(callback) {
            var userEntity = JSON.parse(sessionStorage.getItem('user'));

            let loadingInstance = ElLoading.service({ fullscreen: true });
            this.$get(`/api/getContacts?myselfId=${userEntity.id}`).then((response) => {
                loadingInstance.close();
                this.table.rows = response.data.data;
                this.table.total = this.table.rows.length;
                if(callback){
                    callback();
                }
            }).catch((err) => {
                loadingInstance.close();
                this.$swalError('系统提示', err);
            })
        },

        searchUser() {
            if (!this.searchModal.userNameOrEmail) {
                this.$swalError('系统提示', 'User Name Or Email不能为空');
                return;
            }

            let loadingInstance = ElLoading.service({ fullscreen: true });
            this.$get(`/api/getUserByUserNameOrEmail?userNameOrEmail=${this.searchModal.userNameOrEmail}`).then((response) => {
                loadingInstance.close();
                console.log(response.data.data);
                this.searchUserTable.rows = response.data.data;
            }).catch((err) => {
                loadingInstance.close();
                this.$swalError('系统提示', err);
            })
        },

        saveData() {
            if (!this.createModal.userId) {
                this.$swalError('系统提示', '请选择要申请的对象');
                return;
            }
            if (!this.form.remark) {
                this.$swalError('系统提示', 'Remark不能为空');
                return;
            }
            var userEntity = JSON.parse(sessionStorage.getItem('user'));

            var inputDto = {
                sendUserId: userEntity.id,
                receiveUserId: this.createModal.userId,
                remark: this.form.remark,
            };

            let loadingInstance = ElLoading.service({ fullscreen: true });
            this.$post("/api/addRequestByContact", inputDto).then((response) => {
                loadingInstance.close();
                console.log(response)
                if (response.data.isSuccess) {
                    this.$swalSuccess('系统提示', '申请成功！');
                    this.closeCreateModal();
                } else {
                    this.$swalError('系统提示', response.data.error);
                }
            }).catch((err) => {
                loadingInstance.close();
                this.$swalError('系统提示', err);
            })
        },
        closeSearchModal() {
            this.searchModal.isVisible = false;
            this.searchModal.userNameOrEmail = '';
            this.searchUserTable.rows = [];
        },
        closeCreateModal() {
            this.createModal.isVisible = false;
            this.form.remark = ""
        },

        refreshOnlineStatus(rows) {
            rows.forEach(element => {
                if (this.onlineUserIds.findIndex(f => f == element.friendId) !== -1) {
                    element.onlineStatus = 'green'
                } else {
                    element.onlineStatus = 'red'
                }
            })
        },
        getOnlineUserIds(){
            this.$get(`/api/getOnlineUserIds`).then((response) => {
                this.onlineUserIds = response.data.data
                this.refreshOnlineStatus(this.table.rows);
            }).catch((err) => {
                this.$swalError('系统提示', err);
            })
        }
    },
    mounted() {
        console.log("Contact mounted");
        this.pageChange(this.getOnlineUserIds);

        this.$bus.on('refreshOnlineUserIds', (data) => {
            this.onlineUserIds = data
            this.refreshOnlineStatus(this.table.rows);
        })
    },
    beforeUnmount() {
        this.$bus.off('refreshOnlineUserIds');
    }
}
</script>
  