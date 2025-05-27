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
                hasExtend: true,
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
            detailTables: {},//是一个对象，key是主表Id，Value是一个对象；Value有products集合和detailTable一个表格对象
            detailTableButtons: [
                {
                    name: 'update',
                    title: L('Edit'),
                    css: "btn-primary",
                    licss: "",
                    visiabled: true,
                    onclick: function (row, index, vm) {
                        vm.$root.editTriggerHandle(row);
                    }
                },
                {
                    name: 'delete',
                    title: L('Delete'),
                    css: "btn-danger",
                    licss: "",
                    visiabled: true,
                    onclick: function (row, index, vm) {
                        vm.$root.deleteTriggerHandle(row);
                    }
                }
            ],

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

            addEditTriggerModal: {
                isShow: false,
                hasHeader: true,
                title: L("Add"),
                closeTitle: L("Close"),
                saveTitle: L("Save"),
                type: 1,
                isRunForever: false,
            },
            inputTriggerDto: {
                jobInfoId: "",
                id: "",
                group: "",
                name: "",
                description: "",
                triggerType: 0,
                cron: '',
                interval: '',
                intervalUnit: 0,
                runCount: 0,
            },

            triggerTypeSelect: {
                name: 'selectTriggerType',
                value: { value: "" },
                datas: [],
                length: 200,
                multiple: false,
                allowClear: false,
                title: L("TriggerInfo.TriggerType"),
                label: L("TriggerInfo.TriggerType")
            },
            intervalUnitSelect: {
                name: 'selectIntervalUnit',
                value: { value: "" },
                datas: [],
                length: 100,
                multiple: false,
                allowClear: false,
                title: L("TriggerInfo.IntervalUnit"),
                label: L("TriggerInfo.IntervalUnit")
            }
        },
        methods: {
            doSearch() {
                for (var key in this.search) {
                    this.pageParam[key] = this.search[key].value.value;
                }
                this.table.page.pageIndex = 1;
                this.$refs.mainTable.clearSelect();
                this.$refs.mainTable.shrinkAll();
                this.detailTables = {}
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
                    yuman.webview.IJobInfoService.GetMianTableAsync(this.pageParam).then(res => {
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
                            yuman.webview.IJobInfoService.DeleteJobInfoAsync(row.id).then((res) => {
                                yuman.ui.clearBusy("tableList");
                                if (res) {
                                    this.pageList();
                                    yuman.message.success(L("DeleteSuccess"), L("SystemTips"));
                                }
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
                        yuman.webview.IJobInfoService.AddJobInfoAsync(inputDto).then((res) => {
                            yuman.ui.clearBusy("tableList");
                            if (res) {
                                yuman.message.success(L("AddSuccess"), L("SystemTips"));
                                this.closeModal();
                                this.pageList();
                            }
                        })
                    )
                } else if (this.addEditModal.type == 2) {//编辑
                    yuman.ui.setBusy(
                        $('#tableList'),
                        yuman.webview.IJobInfoService.EditJobInfoAsync(inputDto).then((res) => {
                            yuman.ui.clearBusy("tableList");
                            if (res) {
                                yuman.message.success(L("EditSuccess"), L("SystemTips"));
                                this.closeModal();
                                this.pageList();
                            }
                        })
                    )
                }
            },
            closeModal() {
                Object.keys(this.inputDto).forEach(key => {
                    this.inputDto[key] = ""
                })
                this.addEditModal.isShow = false;
            },

            setExtend(index) {
                this.initDetailTable(index, true);
            },
            initDetailTable(rindex, isNeedLoading) {
                var self = this;
                var rowId = this.table.rows[rindex].id;

                return new Promise((resolve, reject) => {
                    if (!this.detailTables[rowId] || !this.detailTables[rowId].rows) {
                        if (isNeedLoading) yuman.ui.setBusy($("#detailTable" + rindex));

                        yuman.webview.IJobInfoService.GetTriggerInfosByJobIdAsync(rowId).then((resdata) => {
                            var obj = {
                                rows: resdata,
                                columns: [
                                    { field: "id", title: L("TriggerInfo.Id"), },
                                    { field: "group", title: L("TriggerInfo.Group"), },
                                    { field: "name", title: L("TriggerInfo.Name"), },
                                    { field: "description", title: L("TriggerInfo.Description"), },
                                    {
                                        field: "triggerType", title: L("TriggerInfo.TriggerType"),
                                        formatter: function (value, row, index, vm) {
                                            var getIndex = vm.$root.triggerTypeSelect.datas.findIndex(f => f.id == value)
                                            if (getIndex !== -1) {
                                                return vm.$root.triggerTypeSelect.datas[getIndex].text
                                            }
                                            return value;
                                        }
                                    },
                                    {
                                        field: "triggerRule", title: L("TriggerInfo.TriggerRule"),
                                        formatter: function (value, row, index, vm) {
                                            if (row.triggerType == 0) {
                                                var getIndex = vm.$root.intervalUnitSelect.datas.findIndex(f => f.id == row.intervalUnit)
                                                if (getIndex !== -1) {
                                                    return row.interval + vm.$root.intervalUnitSelect.datas[getIndex].text + '(' + (row.runCount == -1 ? '∞' : row.runCount) + ')'
                                                }
                                            } else if (row.triggerType == 1) {
                                                return row.cron
                                            }
                                            return "";
                                        }
                                    },
                                ],
                                total: 0,
                                toolbar: [],
                                pagination: false,//子表没有分页，也没有勾选
                                hasSelected: false,//主子表勾选实现会非常麻烦，尽量避开这种设计
                                isSelectPage: false,
                                selectIds: { ids: [] },
                            }
                            self.$set(self.detailTables, rowId, obj);
                            if (isNeedLoading) yuman.ui.clearBusy($("#detailTable" + rindex));
                            resolve();
                        }).catch((error) => {
                            if (isNeedLoading) yuman.ui.clearBusy($("#detailTable" + rindex));
                            resolve();
                        })
                    }
                    resolve();
                })
            },
            addTriggerItem(index) {
                var jobInfoId = this.table.rows[index].id;
                this.inputTriggerDto.jobInfoId = jobInfoId;
                this.inputTriggerDto.id = yuman.vueui.guid();
                this.inputTriggerDto.triggerType = 0;
                this.addEditTriggerModal.isShow = true;
                this.addEditTriggerModal.title = L("Add");
                this.addEditTriggerModal.type = 1
            },
            editTriggerHandle(row) {
                Object.keys(this.inputTriggerDto).forEach(key => {
                    this.inputTriggerDto[key] = row[key]
                })
                this.addEditTriggerModal.isShow = true;
                this.addEditTriggerModal.title = L("Edit");
                this.addEditTriggerModal.type = 2
                this.addEditTriggerModal.isRunForever = this.inputTriggerDto.runCount == -1;
                this.$refs.selectTriggerType.selected(this.inputTriggerDto.triggerType);
                if (this.inputTriggerDto.triggerType == 0 && this.inputTriggerDto.intervalUnit !== null) {
                    this.$refs.selectIntervalUnit.selected(this.inputTriggerDto.intervalUnit);
                }
            },
            deleteTriggerHandle(row) {
                yuman.message.confirm(L("DeleteConfirm"), (isConfirmed) => {
                    if (isConfirmed) {
                        yuman.ui.setBusy(
                            $('#tableList'),
                            yuman.webview.IJobInfoService.DeleteTriggerInfoAsync(row.id).then((res) => {
                                yuman.ui.clearBusy("tableList");
                                if (res) {
                                    yuman.message.success(L("DeleteSuccess"), L("SystemTips"));
                                    var deleteIndex = this.detailTables[row.jobInfoId].rows.findIndex(f => f.id === row.id);
                                    if (deleteIndex !== -1) {
                                        this.detailTables[row.jobInfoId].rows.splice(deleteIndex, 1);
                                        var rindex = this.table.rows.findIndex(f => f.id == row.jobInfoId)
                                        this.$refs['detailTable' + rindex].refresh();//手动刷新一下子表，不然子表的值不会变（因为triggerRule这个值实际没有，只是作为表格列声明而已）
                                    }
                                }
                            })
                        )
                    }
                });
            },
            saveTriggerModal() {
                let inputTriggerDto = this.inputTriggerDto
                try {
                    inputTriggerDto.triggerType = parseInt(inputTriggerDto.triggerType);
                    inputTriggerDto.intervalUnit = inputTriggerDto.triggerType == 0 ? parseInt(inputTriggerDto.intervalUnit) : null;
                    inputTriggerDto.runCount = inputTriggerDto.triggerType == 0 ? parseInt(inputTriggerDto.runCount) : null;
                }
                catch (ex) { console.log(ex) }
                if (this.addEditTriggerModal.type == 1) {//新增
                    yuman.ui.setBusy(
                        $('#tableList'),
                        yuman.webview.IJobInfoService.AddTriggerInfoAsync(inputTriggerDto).then((res) => {
                            yuman.ui.clearBusy("tableList");
                            if (res) {
                                yuman.message.success(L("AddSuccess"), L("SystemTips"));
                                this.detailTables[inputTriggerDto.jobInfoId].rows.push(this.deepCopy(this.inputTriggerDto));
                                var rindex = this.table.rows.findIndex(f => f.id == this.inputTriggerDto.jobInfoId)
                                this.$refs['detailTable' + rindex].refresh();//手动刷新一下子表，不然子表的值不会变（因为triggerRule这个值实际没有，只是作为表格列声明而已）
                                this.closeTriggerModal();
                            }
                        })
                    )
                } else if (this.addEditTriggerModal.type == 2) {//编辑
                    yuman.ui.setBusy(
                        $('#tableList'),
                        yuman.webview.IJobInfoService.EditTriggerInfoAsync(inputTriggerDto).then((res) => {
                            yuman.ui.clearBusy("tableList");
                            if (res) {
                                yuman.message.success(L("EditSuccess"), L("SystemTips"));
                                var updateIndex = this.detailTables[inputTriggerDto.jobInfoId].rows.findIndex(f => f.id === inputTriggerDto.id);
                                if (updateIndex !== -1) {
                                    this.detailTables[inputTriggerDto.jobInfoId].rows[updateIndex] = this.deepCopy(this.inputTriggerDto);
                                    var rindex = this.table.rows.findIndex(f => f.id == this.inputTriggerDto.jobInfoId)
                                    this.$refs['detailTable' + rindex].refresh();//手动刷新一下子表，不然子表的值不会变（因为triggerRule这个值实际没有，只是作为表格列声明而已）
                                }
                                this.closeTriggerModal();
                            }
                        })
                    )
                }
            },
            closeTriggerModal() {
                Object.keys(this.inputTriggerDto).forEach(key => {
                    this.inputTriggerDto[key] = ""
                })
                this.addEditTriggerModal.isShow = false;
                this.addEditTriggerModal.isRunForever = false;
            },

            triggerTypeChange() {
                this.inputTriggerDto.triggerType = this.triggerTypeSelect.value.value;
            },
            intervalUnitChange() {
                this.inputTriggerDto.intervalUnit = this.intervalUnitSelect.value.value;
            },
            isRunForeverChange() {
                if (this.addEditTriggerModal.isRunForever) {
                    this.inputTriggerDto.runCount = -1;
                } else {
                    this.inputTriggerDto.runCount = 1;
                }
            },

            deepCopy(obj) {
                return JSON.parse(JSON.stringify(obj));
            }
        },
        mounted: function () {
            console.log(this.title);
            this.pageChange();
            yuman.webview.IJobInfoService.GetTriggerTypeSelectAsync().then((res) => { this.triggerTypeSelect.datas = res })
            yuman.webview.IJobInfoService.GetIntervalUnitSelectAsync().then((res) => { this.intervalUnitSelect.datas = res })
        },
    })

    return yuman.vuepage.jobInfo;
}
