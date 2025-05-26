var yuman = yuman || {};
yuman.vuepage = yuman.vuepage || {};
yuman.vuepage.jobInfo = yuman.vuepage.jobInfo || {};
function initJobInfo(elId) {
    yuman.vuepage.jobInfo = new Vue({
        el: '#' + elId,
        data: {
            title: L("JobInfo"),
            search: {
                name: {
                    name: "name",
                    value: {
                        value: ''
                    },
                    length: 200,
                    title: L("Name"),
                }
            },
            button: {
                search: { name: 'btnsearch', title: L("Search") },
                reset: { name: 'btnreset', title: L("Reset") }
            },
            table: {
                rows: [],
                columns: [
                    { field: "id", title: L("JobInfo.Id"), },
                    { field: "group", title: L("JobInfo.Group"), },
                    { field: "name", title: L("JobInfo.Name"), },
                    { field: "description", title: L("JobInfo.Description"), },
                ],
                page: {
                    pageSize: 10,
                    pageIndex: 1
                },
                pagination: true,
                total: 0,
                hasSelected: true,
                isSelectPage: true,
                selectIds: {
                    ids: []
                },
                toolbar: [
                    {
                        name: 'add',
                        title: L('Add'),
                        css: "btn-success",
                        visiabled: true,
                        onclick: function (tabcom, vm) {
                            vm.addHandle();
                        }
                    }
                ],
                buttons: [
                    {
                        name: 'update',
                        title: L('Edit'),
                        css: "btn-primary",
                        licss: "",
                        visiabled: true,
                        onclick: function (row, index, vm) {
                            vm.editHandle(row);
                        }
                    },
                    {
                        name: 'delete',
                        title: L('Delete'),
                        css: "btn-danger",
                        licss: "",
                        visiabled: true,
                        onclick: function (row, index, vm) {
                            vm.deleteHandle(row);
                        }
                    }
                ]
            },
            pageParam: {},

            addEditModal: {
                isShow: false,
                hasHeader: true,
                title: L("Add"),
                closeTitle: L("Close"),
                saveTitle: L("Save"),
                type: 1
            },
            inputDto: {
                id: "",
                group: "",
                name: "",
                description: "",
            },
        },
        methods: {
            doSearch() {
                for (var key in this.search) {
                    this.pageParam[key] = this.search[key].value.value;
                }
                this.table.page.pageIndex = 1;
                this.$refs.mainTable.clearSelect();
                this.pageChange();
            },
            doReset() {
                for (var key in this.search) {
                    this.search[key].value.value = "";
                }
            },
            pageChange() {
                this.pageList()
            },
            pageList() {
                this.pageParam.skipCount = (this.table.page.pageIndex - 1) * this.table.page.pageSize
                this.pageParam.maxResultCount = this.table.page.pageSize

                yuman.ui.setBusy(
                    "#tableList",
                    yuman.webview.IJobInfoService.GetMianTable(this.pageParam).then(res => {
                        console.log('getMianTable', res);
                        yuman.ui.clearBusy("tableList");
                        this.table.rows = res.items
                        this.table.total = parseInt(res.totalCount);

                        //判断是否全选
                        var rows = this.table.rows
                        var ids = this.$refs.mainTable.ids

                        if (rows.length === 0) {
                            return
                        }
                        this.$refs.mainTable.checkAll = true
                        for (var row in rows) {
                            if (Object.prototype.hasOwnProperty.call(rows, row)) {
                                if (!ids[rows[row].id]) {
                                    this.$refs.mainTable.checkAll = false
                                    break
                                }
                            }
                        }
                    }).catch(error => {
                        console.error("getMianTable错误信息：", error);
                    })
                );

            },
            addHandle() {
                this.inputDto.id = yuman.vueui.guid();
                this.addEditModal.isShow = true;
                this.addEditModal.title = L("Add");
                this.addEditModal.type = 1
            },
            editHandle(row) {
                Object.keys(this.inputDto).forEach(key => {
                    this.inputDto[key] = row[key]
                })
                this.addEditModal.isShow = true;
                this.addEditModal.title = L("Edit");
                this.addEditModal.type = 2
            },
            deleteHandle(row) {
                yuman.message.confirm(L("DeleteConfirm"), (isConfirmed) => {
                    if (isConfirmed) {
                        yuman.ui.setBusy(
                            $('#tableList'),
                            yuman.webview.IJobInfoService.DeleteJobInfo(row.id).then((res) => {
                                yuman.ui.clearBusy("tableList");
                                this.pageList();
                                yuman.message.success(L("DeleteSuccess"), L("SystemTips"));
                            })
                        )
                    }
                });
            },

            saveModal() {
                let inputDto = this.inputDto
                if (this.addEditModal.type == 1) {//新增
                    yuman.ui.setBusy(
                        $('#tableList'),
                        yuman.webview.IJobInfoService.AddJobInfo(inputDto).then((res) => {
                            yuman.ui.clearBusy("tableList");
                            yuman.message.success(L("AddSuccess"), L("SystemTips"));
                            this.closeModal();
                            this.pageList();
                        })
                    )
                } else if (this.addEditModal.type == 2) {//编辑
                    yuman.ui.setBusy(
                        $('#tableList'),
                        yuman.webview.IJobInfoService.EditJobInfo(inputDto).then((res) => {
                            yuman.ui.clearBusy("tableList");
                            yuman.message.success(L("EditSuccess"), L("SystemTips"));
                            this.closeModal();
                            this.pageList();
                        })
                    )
                }
            },
            closeModal() {
                Object.keys(this.inputDto).forEach(key => {
                    this.inputDto[key] = ""
                })
                this.addEditModal.isShow = false;
            }
        },
        mounted: function () {
            console.log(this.title);
            this.pageChange();
        },
    })

    return yuman.vuepage.jobInfo;
}
