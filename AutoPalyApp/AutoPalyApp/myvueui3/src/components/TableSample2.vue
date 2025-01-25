<template>
    <div>
        <h1>TableSample2</h1>
        <myTable v-bind="mainTable" v-on:pagechange="pageChange" ref="table">

        </myTable>
    </div>
</template>
  
<script>
import myTable from './myComponents/myTable.vue'
export default {
    name: 'TableSample2',
    components: {
        myTable,
    },
    data() {
        return {
            sampleDatas: [
                { id: 1, name: 'Tom1', sex: 'M', age: 18 },
                { id: 2, name: 'Tom2', sex: 'W', age: 34 },
                { id: 3, name: 'Tom3', sex: 'M', age: 25 },
                { id: 4, name: 'Tom4', sex: 'M', age: 43 },
                { id: 5, name: 'Tom5', sex: 'W', age: 75 },
                { id: 6, name: 'Tom6', sex: 'M', age: 38 },
                { id: 7, name: 'Tom7', sex: 'M', age: 46 },
                { id: 8, name: 'Tom8', sex: 'W', age: 86 },
                { id: 9, name: 'Tom9', sex: 'M', age: 25 },
                { id: 10, name: 'Tom10', sex: 'M', age: 18 },
                { id: 11, name: 'Tom11', sex: 'W', age: 28 },
                { id: 12, name: 'Tom12', sex: 'M', age: 37 },
                { id: 13, name: 'Tom13', sex: 'W', age: 47 },
            ],

            mainTable: {
                columns: [//列声明（标题label, 字段名prop, 宽度width, 类型type）
                    { label: 'Name', prop: 'name', type: '' },
                    { label: 'Sex', prop: 'sex', type: '' },
                    { label: 'Age', prop: 'age', type: '' },
                ],
                rows: [],
                total: 0,
                isSelect: true,

                operationButtons: [
                    {
                        title: 'Edit', type: 'primary', onclick(index, row) {
                            console.log(index, row);
                        }, disabled(row) {
                            if (row.sex == "W") {
                                return true;
                            }
                            return false;
                        }
                    },
                    {
                        title: 'Delete', type: 'danger', onclick(index, row) {
                            console.log(index, row);
                        }, disabled(row) {
                            if (row.sex == "W") {
                                return true;
                            }
                            return false;
                        }
                    }
                ],
                footerButtons: [
                    {
                        title: 'Add', type: 'success', onclick() {
                            console.log('Add');
                        }
                    }
                ]
            }
        }
    },
    methods: {
        pageChange(page) {
            console.log("pageChange", page);
            this.mainTable.rows = this.sampleDatas.filter(f => f.id > (page.currentPage - 1) * page.pageSize && f.id <= page.currentPage * page.pageSize);
            this.mainTable.total = this.sampleDatas.length;
        }
    },
    mounted() {
        console.log("TableSample2 mounted");
        this.pageChange({ currentPage: 1, pageSize: 10 });
    },
}
</script>
  