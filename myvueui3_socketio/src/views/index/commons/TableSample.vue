<template>
    <div>
        <el-container>
            <el-header>
                <h3>Table样例</h3>
            </el-header>

            <el-main>
                <el-table ref="multipleTableRef" stripe row-key="id" :data="table.rows" :border="parentBorder"
                    style="width: 100%" @selection-change="handleSelectionChange">
                    <el-table-column type="expand">
                        <template #default="props">
                            <div m="4">
                                <p m="t-0 b-2">State: {{ props.row.state }}</p>
                                <p m="t-0 b-2">City: {{ props.row.city }}</p>
                                <p m="t-0 b-2">Address: {{ props.row.address }}</p>
                                <p m="t-0 b-2">Zip: {{ props.row.zip }}</p>
                                <h3>Family</h3>
                                <el-table :data="props.row.family" :border="childBorder">
                                    <el-table-column label="Name" prop="name" />
                                    <el-table-column label="State" prop="state" />
                                    <el-table-column label="City" prop="city" />
                                    <el-table-column label="Address" prop="address" />
                                    <el-table-column label="Zip" prop="zip" />
                                </el-table>
                            </div>
                        </template>
                    </el-table-column>
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
                    <el-table-column label="Date" prop="date" />
                    <el-table-column label="Name" width="180">
                        <template #default="scope">
                            <el-popover effect="light" trigger="hover" placement="top" width="auto">
                                <template #default>
                                    <div>name: {{ scope.row.name }}</div>
                                    <div>address: {{ scope.row.address }}</div>
                                </template>
                                <template #reference>
                                    <el-tag>{{ scope.row.name }}</el-tag>
                                </template>
                            </el-popover>
                        </template>
                    </el-table-column>
                </el-table>
            </el-main>

            <el-footer>
                <div style="display:flex">
                    <el-button type="success" @click="handleAddOrEdit">{{ $t("app.add") }}</el-button>
                    <el-pagination v-model:current-page="table.currentPage" v-model:page-size="table.pageSize"
                        :page-sizes="table.sizes" size="default" :disabled="table.disabled" :background="true"
                        layout="total, slot, sizes, jumper, prev, pager, next" :total="table.total"
                        @size-change="handleSizeChange" @current-change="handleCurrentChange">
                        <span class="el-pagination__total">{{ $t("app.selectedNumber", { num:table.selectIds.length }) }}</span>
                    </el-pagination>
                </div>
            </el-footer>
        </el-container>

        <el-dialog v-model="createOrEditModal.isVisible" title="Edit" width="800">
            <el-form :model="form">
                <el-form-item label="Date" label-width="140px">
                    <el-date-picker v-model="form.date" type="date" placeholder="Pick a Date" format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD" />
                </el-form-item>
                <el-form-item label="Name" label-width="140px">
                    <el-input v-model="form.name" autocomplete="off" />
                </el-form-item>
                <el-form-item label="State" label-width="140px">
                    <el-input v-model="form.state" autocomplete="off" />
                </el-form-item>
                <el-form-item label="City" label-width="140px">
                    <el-input v-model="form.city" autocomplete="off" />
                </el-form-item>
                <el-form-item label="Address" label-width="140px">
                    <el-input v-model="form.address" autocomplete="off" />
                </el-form-item>
                <el-form-item label="Zip" label-width="140px">
                    <el-input v-model="form.zip" autocomplete="off" />
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
import tableSampleData from './tableSample.json'

export default {
    name: 'TableSample',
    data() {
        return {
            parentBorder: false,
            childBorder: false,
            table: {
                rows: tableSampleData,
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
                date: '',
                name: '',
                state: '',
                city: '',
                address: '',
                zip: '',
                family: []
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
                this.form.date = row.date
                this.form.name = row.name
                this.form.state = row.state
                this.form.city = row.city
                this.form.address = row.address
                this.form.zip = row.zip
            }
            this.createOrEditModal.isVisible = true;
        },
        handleDelete(index, row) {
            console.log(index, row)

            this.$swalConfirm(this.$t("app.systemTips"), "Are you sure to delete it?", (isConfirmed) => {
                if (isConfirmed) {
                    var index = this.table.rows.findIndex(f => f.id == row.id);
                    this.table.rows.splice(index, 1);
                }
            })
        },

        handleSizeChange(val) {
            console.log(`${val} items per page`)
        },
        handleCurrentChange(val) {
            console.log(`current page: ${val}`)
        },

        testSetCheck() {
            //测试：设置指定行勾选
            //(row: any, selected?: boolean, ignoreSelectable = true) => void
            this.$refs["multipleTableRef"].toggleRowSelection(this.table.rows[0], true)
        },
        testSetNotCheck() {
            //测试：设置指定行取消勾选
            this.$refs["multipleTableRef"].toggleRowSelection(this.table.rows[0], false)
        },
        testGetAllCheck() {
            //测试：获取所有选中行
            console.log(this.$refs["multipleTableRef"].getSelectionRows());
        },

        saveData() {
            if (this.createOrEditModal.rowId) {
                var mainRow = this.table.rows.filter(f => f.id == this.createOrEditModal.rowId)[0];
                mainRow.date = this.form.date
                mainRow.name = this.form.name
                mainRow.state = this.form.state
                mainRow.city = this.form.city
                mainRow.address = this.form.address
                mainRow.zip = this.form.zip
            }
            else {
                var newRow = {};
                newRow.id = this.$getGuid();
                newRow.date = this.form.date
                newRow.name = this.form.name
                newRow.state = this.form.state
                newRow.city = this.form.city
                newRow.address = this.form.address
                newRow.zip = this.form.zip
                newRow.family = [];
                this.table.rows.push(newRow);
            }

            this.createOrEditModal.isVisible = false;
            this.form.date = ""
            this.form.name = ""
            this.form.state = ""
            this.form.city = ""
            this.form.address = ""
            this.form.zip = ""
        }
    },
    mounted() {
        console.log("TableSample mounted");
    },
}
</script>
  