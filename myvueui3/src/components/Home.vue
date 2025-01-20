<template>
    <div>
        <el-container>
            <el-header>
                <h3>Table样例</h3>
            </el-header>

            <el-main>
                <el-table ref="multipleTableRef" stripe row-key="id" :data="tableData" :border="parentBorder"
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
                            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
                                Edit
                            </el-button>
                            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">
                                Delete
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
                <el-button @click="testSetCheck">测试：设置指定行勾选</el-button>
                <el-button @click="testSetNotCheck">测试：设置指定行取消勾选</el-button>
                <el-button @click="testGetAllCheck">测试：获取所有选中行</el-button>
            </el-footer>
        </el-container>
    </div>
</template>
  
<script>
export default {
    name: 'Home',
    data() {
        return {
            parentBorder: false,
            childBorder: false,
            tableData: [
                {
                    id: 1,
                    date: '2016-05-03',
                    name: 'Tom',
                    state: 'California',
                    city: 'San Francisco',
                    address: '3650 21st St, San Francisco',
                    zip: 'CA 94114',
                    family: [
                        {
                            name: 'Jerry',
                            state: 'California',
                            city: 'San Francisco',
                            address: '3650 21st St, San Francisco',
                            zip: 'CA 94114',
                        },
                        {
                            name: 'Spike',
                            state: 'California',
                            city: 'San Francisco',
                            address: '3650 21st St, San Francisco',
                            zip: 'CA 94114',
                        },
                        {
                            name: 'Tyke',
                            state: 'California',
                            city: 'San Francisco',
                            address: '3650 21st St, San Francisco',
                            zip: 'CA 94114',
                        },
                    ],
                },
                {
                    id: 2,
                    date: '2016-05-02',
                    name: 'Tom',
                    state: 'California',
                    city: 'San Francisco',
                    address: '3650 21st St, San Francisco',
                    zip: 'CA 94114',
                    family: [
                        {
                            name: 'Jerry',
                            state: 'California',
                            city: 'San Francisco',
                            address: '3650 21st St, San Francisco',
                            zip: 'CA 94114',
                        },
                        {
                            name: 'Spike',
                            state: 'California',
                            city: 'San Francisco',
                            address: '3650 21st St, San Francisco',
                            zip: 'CA 94114',
                        },
                        {
                            name: 'Tyke',
                            state: 'California',
                            city: 'San Francisco',
                            address: '3650 21st St, San Francisco',
                            zip: 'CA 94114',
                        },
                    ],
                },
                {
                    id: 3,
                    date: '2016-05-04',
                    name: 'Tom',
                    state: 'California',
                    city: 'San Francisco',
                    address: '3650 21st St, San Francisco',
                    zip: 'CA 94114',
                    family: [
                        {
                            name: 'Jerry',
                            state: 'California',
                            city: 'San Francisco',
                            address: '3650 21st St, San Francisco',
                            zip: 'CA 94114',
                        },
                        {
                            name: 'Spike',
                            state: 'California',
                            city: 'San Francisco',
                            address: '3650 21st St, San Francisco',
                            zip: 'CA 94114',
                        },
                        {
                            name: 'Tyke',
                            state: 'California',
                            city: 'San Francisco',
                            address: '3650 21st St, San Francisco',
                            zip: 'CA 94114',
                        },
                    ],
                },
                {
                    id: 4,
                    date: '2016-05-01',
                    name: 'Tom',
                    state: 'California',
                    city: 'San Francisco',
                    address: '3650 21st St, San Francisco',
                    zip: 'CA 94114',
                    family: [
                        {
                            name: 'Jerry',
                            state: 'California',
                            city: 'San Francisco',
                            address: '3650 21st St, San Francisco',
                            zip: 'CA 94114',
                        },
                        {
                            name: 'Spike',
                            state: 'California',
                            city: 'San Francisco',
                            address: '3650 21st St, San Francisco',
                            zip: 'CA 94114',
                        },
                        {
                            name: 'Tyke',
                            state: 'California',
                            city: 'San Francisco',
                            address: '3650 21st St, San Francisco',
                            zip: 'CA 94114',
                        },
                    ],
                },
                {
                    id: 5,
                    date: '2016-05-08',
                    name: 'Tom',
                    state: 'California',
                    city: 'San Francisco',
                    address: '3650 21st St, San Francisco',
                    zip: 'CA 94114',
                    family: [
                        {
                            name: 'Jerry',
                            state: 'California',
                            city: 'San Francisco',
                            address: '3650 21st St, San Francisco',
                            zip: 'CA 94114',
                        },
                        {
                            name: 'Spike',
                            state: 'California',
                            city: 'San Francisco',
                            address: '3650 21st St, San Francisco',
                            zip: 'CA 94114',
                        },
                        {
                            name: 'Tyke',
                            state: 'California',
                            city: 'San Francisco',
                            address: '3650 21st St, San Francisco',
                            zip: 'CA 94114',
                        },
                    ],
                },
                {
                    id: 6,
                    date: '2016-05-06',
                    name: 'Tom',
                    state: 'California',
                    city: 'San Francisco',
                    address: '3650 21st St, San Francisco',
                    zip: 'CA 94114',
                    family: [
                        {
                            name: 'Jerry',
                            state: 'California',
                            city: 'San Francisco',
                            address: '3650 21st St, San Francisco',
                            zip: 'CA 94114',
                        },
                        {
                            name: 'Spike',
                            state: 'California',
                            city: 'San Francisco',
                            address: '3650 21st St, San Francisco',
                            zip: 'CA 94114',
                        },
                        {
                            name: 'Tyke',
                            state: 'California',
                            city: 'San Francisco',
                            address: '3650 21st St, San Francisco',
                            zip: 'CA 94114',
                        },
                    ],
                },
                {
                    id: 7,
                    date: '2016-05-07',
                    name: 'Tom',
                    state: 'California',
                    city: 'San Francisco',
                    address: '3650 21st St, San Francisco',
                    zip: 'CA 94114',
                    family: [
                        {
                            name: 'Jerry',
                            state: 'California',
                            city: 'San Francisco',
                            address: '3650 21st St, San Francisco',
                            zip: 'CA 94114',
                        },
                        {
                            name: 'Spike',
                            state: 'California',
                            city: 'San Francisco',
                            address: '3650 21st St, San Francisco',
                            zip: 'CA 94114',
                        },
                        {
                            name: 'Tyke',
                            state: 'California',
                            city: 'San Francisco',
                            address: '3650 21st St, San Francisco',
                            zip: 'CA 94114',
                        },
                    ],
                },
            ]
        }
    },
    methods: {
        handleSelectionChange(val) {
            console.log(val)
        },
        handleEdit(index, row) {
            console.log(index, row)
        },
        handleDelete(index, row) {
            console.log(index, row)
        },

        testSetCheck() {
            //(row: any, selected?: boolean, ignoreSelectable = true) => void
            this.$refs["multipleTableRef"].toggleRowSelection(this.tableData[0], true)
        },
        testSetNotCheck() {
            this.$refs["multipleTableRef"].toggleRowSelection(this.tableData[0], false)
        },
        testGetAllCheck() {
            console.log(this.$refs["multipleTableRef"].getSelectionRows());
        }
    },
    mounted() {
        console.log("Home mounted");
    },
}
</script>
  