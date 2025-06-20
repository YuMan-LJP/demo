<template>
    <div>
        <el-container>
            <el-header>
                <h3>Room</h3>
            </el-header>
            <el-main>
                <el-table ref="mainTable" stripe row-key="id" :data="table.rows" :border="parentBorder" style="width: 100%">
                    <el-table-column type="index" width="50" />
                    <el-table-column label="Operations">
                        <template #default="scope">
                            <el-button size="small" type="primary" @click="handleGoToRoom(scope.$index, scope.row)">
                                进入
                            </el-button>
                            <el-button size="small" type="danger" v-if="scope.row.createUserId != curUser.id"
                                @click="handleDelete(scope.$index, scope.row, false)">
                                退出
                            </el-button>
                            <el-button size="small" type="danger" v-if="scope.row.createUserId == curUser.id"
                                @click="handleDelete(scope.$index, scope.row, true)">
                                解散
                            </el-button>
                            <el-button size="small" type="primary" v-if="scope.row.createUserId == curUser.id"
                                @click="handleUpdate(scope.$index, scope.row)">
                                修改
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="Room Name">
                        <template #default="scope">
                            <el-badge :value="scope.row.count" class="item" :offset="[20, 10]"
                                :hidden="scope.row.count == 0">
                                {{ scope.row.name }}
                            </el-badge>
                        </template>
                    </el-table-column>
                    <el-table-column label="Description" prop="description" />
                    <el-table-column label="Create User Name" prop="nickName" />
                </el-table>
            </el-main>
            <el-footer style="display:flex">
                <div>
                    <el-button type="info" @click="pageChange">刷新</el-button>
                </div>
                <div style="margin-left: 5px;">
                    <el-button type="success" @click="handleCreate">创建群聊</el-button>
                </div>
                <div style="margin-left: 5px;">
                    <el-button type="success" @click="handleSearch">添加群聊</el-button>
                </div>
            </el-footer>
        </el-container>

        <el-dialog v-model="createModal.isVisible" title="创建" width="800">
            <div class="mt-4">
                <el-input v-model="createModal.userNameOrEmail" style="max-width: 600px"
                    placeholder="Please input User Name or Email" class="input-with-select">
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
                <el-table ref="searchUserTable" stripe row-key="id" :data="searchUserTable.rows" style="width: 100%"
                    @selection-change="searchUserTableSelectionChange">
                    <el-table-column type="selection" width="55" />
                    <el-table-column type="index" width="50" />
                    <el-table-column label="Nick Name" prop="nickName" />
                    <el-table-column label="Email" prop="email" />
                </el-table>
            </div>

            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="closeCreateModal">{{ $t("app.cancel") }}</el-button>
                    <el-button type="success" @click="createRoom">{{ $t("app.confirm") }}</el-button>
                </div>
            </template>
        </el-dialog>

        <el-dialog v-model="searchModal.isVisible" title="查找群聊" width="800">
            <div class="mt-4">
                <el-input v-model="searchModal.roomName" style="max-width: 600px" placeholder="Please input Room Name"
                    class="input-with-select">
                    <template #append>
                        <el-button icon="Search" @click="searchRoom" />
                    </template>
                </el-input>
            </div>

            <div style="
                    border: 1px solid #03A9F4;
                    border-radius: 10px;
                    margin: 5px;
                    padding: 5px;
                ">
                <el-table ref="searchRoomTable" stripe row-key="id" :data="searchRoomTable.rows" style="width: 100%">
                    <el-table-column type="index" width="50" />
                    <el-table-column label="Operations">
                        <template #default="scope">
                            <el-button size="small" type="success" @click="handleRequest(scope.$index, scope.row)">
                                申请
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="Room Name" prop="name" />
                    <el-table-column label="Description" prop="description" />
                    <el-table-column label="Create User Name" prop="nickName" />
                </el-table>
            </div>

            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="closeSearchModal">关闭</el-button>
                </div>
            </template>
        </el-dialog>

        <el-dialog v-model="requestModal.isVisible" title="申请添加" width="600">
            <el-form :model="requestForm">
                <el-form-item label="Remark" label-width="140px">
                    <el-input v-model="requestForm.remark" autocomplete="off" type="textarea" :rows="2" />
                </el-form-item>
            </el-form>

            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="closeRequestModal">{{ $t("app.cancel") }}</el-button>
                    <el-button type="success" @click="saveData">{{ $t("app.confirm") }}</el-button>
                </div>
            </template>
        </el-dialog>

        <el-dialog v-model="updateModal.isVisible" title="修改群信息" width="600">
            <el-form :model="updateForm">
                <el-form-item label="Room Name" label-width="140px">
                    <el-input v-model="updateForm.name" autocomplete="off" />
                </el-form-item>
                <el-form-item label="Description" label-width="140px">
                    <el-input v-model="updateForm.description" autocomplete="off" type="textarea" :rows="2" />
                </el-form-item>
            </el-form>

            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="closeUpdateModal">{{ $t("app.cancel") }}</el-button>
                    <el-button type="success" @click="updateRoom">{{ $t("app.confirm") }}</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
  
<script>
import { ElLoading } from 'element-plus';
import { useRouter } from 'vue-router'
export default {
    setup() {
        const router = useRouter()//特别注意useRouter只能在setup里面引入，否则会是undefined
        return {
            router
        }
    },
    name: 'Room',
    data() {
        return {
            curUser: null,
            parentBorder: false,
            table: {
                rows: [],
                total: 100,
                disabled: false,
            },
            searchUserTable: {
                rows: [],
                disabled: false,
                selectIds: []
            },
            searchRoomTable: {
                rows: [],
                disabled: false,
            },
            searchModal: {
                isVisible: false,
                roomName: '',
            },
            createModal: {
                isVisible: false,
                userNameOrEmail: '',
            },
            createForm: {
                remark: '',
            },
            requestModal: {
                isVisible: false,
                room: null,
            },
            requestForm: {
                remark: '',
            },

            updateModal: {
                isVisible: false,
                roomId: null,
            },
            updateForm: {
                name: '',
                description: ''
            }
        }
    },
    methods: {
        pageChange() {
            let loadingInstance = ElLoading.service({ fullscreen: true });
            this.$get(`/api/getRooms?myselfId=${this.curUser.id}`).then((response) => {
                loadingInstance.close();
                this.table.rows = response.data.data;
                this.table.total = this.table.rows.length;
            }).catch((err) => {
                loadingInstance.close();
                this.$swalError('系统提示', err);
            })
        },
        handleDelete(index, row, isDeleteRoom) {
            if (isDeleteRoom) {
                this.$swalConfirm(this.$t("app.systemTips"), "确定要解散吗？", (isConfirmed) => {
                    if (isConfirmed) {
                        let loadingInstance = ElLoading.service({ fullscreen: true });
                        this.$post("/api/deleteRoom", { id: row.id }).then((response) => {
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
            }
            else {
                this.$swalConfirm(this.$t("app.systemTips"), "确定要退出吗？", (isConfirmed) => {
                    if (isConfirmed) {
                        let loadingInstance = ElLoading.service({ fullscreen: true });
                        this.$post("/api/quitRoom", { id: row.id, userId: this.curUser.id }).then((response) => {
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
            }
        },
        handleGoToRoom(index, row) {
            this.$get(`/api/getRooms?myselfId=${this.curUser.id}`).then((response) => {
                if (response.data.data.findIndex(f => f.id == row.id) === -1) {
                    this.$swalError('系统提示', '当前群聊已解散！请重新刷新当前页面！');
                    return
                }
                //路由跳转到ChatRoom，并将当前房间Id传过去
                this.router.push({ path: "/chatRoom", query: { roomId: row.id } })
            }).catch((err) => {
                this.$swalError('系统提示', err);
            })
        },
        handleUpdate(index, row){
            this.updateModal.isVisible = true;
            this.updateModal.roomId = row.id;
            this.updateForm.name = row.name;
            this.updateForm.description = row.description;
        },

        //创建房间
        handleCreate() {
            this.createModal.isVisible = true;
            this.createModal.userNameOrEmail = '';
            this.searchUser()//默认查这个用户的联系人
        },
        searchUser() {
            //当没有输入查询条件时，就是查当前用户所有的联系人
            let loadingInstance = ElLoading.service({ fullscreen: true });
            this.$get(`/api/getUserByUserNameOrEmail?userNameOrEmail=${this.createModal.userNameOrEmail}&myselfId=${this.curUser.id}`).then((response) => {
                loadingInstance.close();
                this.searchUserTable.rows = response.data.data;
            }).catch((err) => {
                loadingInstance.close();
                this.$swalError('系统提示', err);
            })
        },
        searchUserTableSelectionChange(val) {
            this.searchUserTable.selectIds = [];
            for (var i = 0; i < val.length; i++) {
                this.searchUserTable.selectIds.push(val[i].id);
            }
        },
        createRoom() {
            var inputDto = {
                myselfId: this.curUser.id,
                friendIds: this.searchUserTable.selectIds
            };
            let loadingInstance = ElLoading.service({ fullscreen: true });
            this.$post("/api/addRoom", inputDto).then((response) => {
                loadingInstance.close();
                if (response.data.isSuccess) {
                    this.$swalSuccess('系统提示', '创建成功！');
                    this.closeCreateModal();
                    this.pageChange();
                } else {
                    this.$swalError('系统提示', response.data.error);
                }
            }).catch((err) => {
                loadingInstance.close();
                this.$swalError('系统提示', err);
            })
        },
        closeCreateModal() {
            this.createModal.isVisible = false;
            this.createModal.userNameOrEmail = '';
            this.searchUserTable.rows = [];
        },


        //申请加入房间
        handleSearch() {
            this.searchModal.isVisible = true;
        },
        searchRoom() {
            if (!this.searchModal.roomName) {
                this.$swalError('系统提示', 'Room Name不能为空');
                return;
            }

            let loadingInstance = ElLoading.service({ fullscreen: true });
            this.$get(`/api/getRoomByName?name=${this.searchModal.roomName}`).then((response) => {
                loadingInstance.close();
                console.log(response.data.data);
                this.searchRoomTable.rows = response.data.data;
            }).catch((err) => {
                loadingInstance.close();
                this.$swalError('系统提示', err);
            })
        },
        closeSearchModal() {
            this.searchModal.isVisible = false;
            this.searchModal.roomName = '';
            this.searchRoomTable.rows = [];
        },

        handleRequest(index, row) {
            this.requestModal.isVisible = true;
            this.requestModal.room = row;
        },
        saveData() {
            if (!this.requestModal.room) {
                this.$swalError('系统提示', '请选择要申请的群聊');
                return;
            }
            if (!this.requestForm.remark) {
                this.$swalError('系统提示', 'Remark不能为空');
                return;
            }

            var inputDto = {
                sendUserId: this.curUser.id,
                receiveUserId: this.requestModal.room.createUserId,
                receiveRoomId: this.requestModal.room.id,
                remark: this.requestForm.remark,
            };

            let loadingInstance = ElLoading.service({ fullscreen: true });
            this.$post("/api/addRequestByRoom", inputDto).then((response) => {
                loadingInstance.close();
                console.log(response)
                if (response.data.isSuccess) {
                    this.$swalSuccess('系统提示', '申请成功！');
                    this.closeRequestModal();
                } else {
                    this.$swalError('系统提示', response.data.error);
                }
            }).catch((err) => {
                loadingInstance.close();
                this.$swalError('系统提示', err);
            })
        },
        closeRequestModal() {
            this.requestModal.isVisible = false;
            this.requestForm.remark = ""
        },

        closeUpdateModal(){
            this.updateModal.isVisible = false;
            this.updateModal.roomId = null;
            this.updateForm.name = ""
            this.updateForm.description = ""
        },
        updateRoom(){
            var inputDto = {
                roomId: this.updateModal.roomId,
                name: this.updateForm.name,
                description: this.updateForm.description
            };
            let loadingInstance = ElLoading.service({ fullscreen: true });
            this.$post("/api/updateRoom", inputDto).then((response) => {
                loadingInstance.close();
                if (response.data.isSuccess) {
                    this.$swalSuccess('系统提示', '修改成功！');
                    this.closeUpdateModal();
                    this.pageChange();
                } else {
                    this.$swalError('系统提示', response.data.error);
                }
            }).catch((err) => {
                loadingInstance.close();
                this.$swalError('系统提示', err);
            })
        }
    },
    mounted() {
        console.log("Room mounted");
        this.curUser = JSON.parse(sessionStorage.getItem('user'));
        this.pageChange();
    },
}
</script>
  