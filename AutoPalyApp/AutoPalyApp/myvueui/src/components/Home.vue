<template>
    <div>
        <!-- <p>链接传过来的值: {{ $route.params.username }}</p> -->
        <h2>Home - 表格的增删改查demo</h2>

        <div>
            <b-table striped hover ref="selectableTable" selectable :select-mode="selectMode" @row-selected="onRowSelected"
                :fields="tableColumns" :items="tableRows" :current-page="currentPage" :per-page="perPage">
                <template v-slot:cell(selected)="{ rowSelected }">
                    <template v-if="rowSelected">
                        <span aria-hidden="true">&check;</span>
                        <span class="sr-only">Selected</span>
                    </template>
                    <template v-else>
                        <span aria-hidden="true">&nbsp;</span>
                        <span class="sr-only">Not selected</span>
                    </template>
                </template>
                <template v-slot:cell(showDetail)="data">
                    <b-button size="sm" @click="data.toggleDetails" class="mr-2">
                        {{ data.detailsShowing ? '-' : '+' }}
                    </b-button>
                </template>
                <template v-slot:cell(index)="data">
                    {{ data.index + 1 }}
                </template>
                <template v-slot:cell(isActive)="data">
                    {{ data.value ? "已激活" : "未激活" }}
                </template>
                <template v-slot:cell(action)="data">
                    <b-button-group class="mx-1">
                        <b-button variant="info" @click="showEditModal(data.item.id)">{{ $t("app.edit") }}</b-button>
                    </b-button-group>
                    <b-button-group class="mx-1">
                        <b-button variant="danger" @click="deleteRow(data.item.id)">{{ $t("app.delete") }}</b-button>
                    </b-button-group>
                </template>
                <template v-slot:cell(sex)="data">
                    {{ data.value === "Men" ? "男" : "女" }}
                </template>
                <template v-slot:cell(htmlCol)="data">
                    <span v-html="data.value"></span>
                </template>

                <template v-slot:row-details="row">
                    <b-card>
                        <b-row class="mb-2">
                            <b-col sm="2" class="text-sm-right"><b>主表行序号:</b></b-col>
                            <b-col sm="3">{{ row.index }}</b-col>
                            <b-col sm="2" class="text-sm-right"><b>主表行Id:</b></b-col>
                            <b-col sm="3">{{ row.item.id }}</b-col>
                        </b-row>
                    </b-card>
                </template>
            </b-table>

            <div>
                <div class="float-left">
                    <b-button-toolbar key-nav aria-label="Toolbar with button groups">
                        <b-button-group class="mx-1">
                            <b-button variant="success" @click="showCreateModal">{{ $t("app.create") }}</b-button>
                            <b-button variant="primary" @click="selectAllRows">{{ $t("app.selectall") }}</b-button>
                            <b-button variant="secondary" @click="clearSelected">{{ $t("app.unselectall") }}</b-button>
                            <b-dropdown id="dropdown-dropup" dropup :text="$t('app.prepage', { 'number': perPage })"
                                variant="light" class="s-1">
                                <b-dropdown-item href="#" v-for="pageOption in pageOptions"
                                    @click="changePageOption(pageOption)">{{ pageOption }}</b-dropdown-item>
                            </b-dropdown>
                        </b-button-group>
                    </b-button-toolbar>
                </div>
                <div class="float-left">
                    <ul class="list-group list-group-horizontal">
                        <li class="list-group-item">{{ $t("app.selected", { "number": selected.length }) }}</li>
                        <li class="list-group-item">{{ $t("app.pageNo", { "number": currentPage }) }}</li>
                        <li class="list-group-item">{{ $t("app.total", { "total": tableRows.length }) }}</li>
                    </ul>
                </div>
                <div class="float-right">
                    <b-pagination v-model="currentPage" :total-rows="tableRows.length" :per-page="perPage" align="fill"
                        size="m"></b-pagination>
                </div>
            </div>

            <b-row style="clear: both;"></b-row>
            <p>
                Selected Rows:<br>
                {{ selected }}
            </p>
        </div>

        <b-modal ref="createmodal" title="Create New Data" id="createModal" header-bg-variant="dark"
            header-text-variant="light" body-bg-variant="light" body-text-variant="dark" footer-bg-variant="dark"
            footer-text-variant="light">
            <div>
                <b-form @submit="onSubmit" @reset="onReset" v-if="isshowform">
                    <b-form-group id="input-group-1" label="First Name:" label-for="input-1" description="请输入您的姓">
                        <b-form-input id="input-1" v-model="form1.first_name" required
                            placeholder="Enter First Name"></b-form-input>
                    </b-form-group>

                    <b-form-group id="input-group-2" label="Last Name:" label-for="input-2" description="请输入您的名">
                        <b-form-input id="input-2" v-model="form1.last_name" required
                            placeholder="Enter Last Name"></b-form-input>
                    </b-form-group>

                    <b-form-group id="input-group-2" label="Age:" label-for="input-2" description="请输入您的年龄">
                        <b-form-input id="input-2" v-model="form1.age" required type="number"
                            placeholder="Enter Age"></b-form-input>
                    </b-form-group>

                    <b-form-group id="input-group-3" label="Sex:" label-for="input-3">
                        <b-form-select id="input-3" v-model="form1.sex" :options="sexSelectList" value-field="id"
                            text-field="text" required ref="sexSelect"></b-form-select>
                    </b-form-group>

                    <b-form-group id="input-group-4">
                        <b-form-checkbox v-model="form1.isActive" id="checkbox-4">
                            Is Active
                        </b-form-checkbox>
                    </b-form-group>
                </b-form>
            </div>

            <template v-slot:modal-footer>
                <b-button-group size="sm" class="float-right">
                    <b-button type="submit" variant="primary">Submit</b-button>
                    <b-button type="reset" variant="info">Reset</b-button>
                    <b-button type="button" variant="danger" @click="hideCreateModal">Close</b-button>
                </b-button-group>
            </template>
        </b-modal>
    </div>
</template>

<script>
export default {
    name: 'Home',
    data: function () {
        return {
            currentPage: 1,
            perPage: 5,
            pageOptions: [5, 10, 15],
            selectMode: 'multi',//multi: 每次单击都会选择/取消选择该行，single: 一次只能选择一行，range: 选择任何单击的行，取消选择任何其他行。
            selected: [],
            tableColumns: [
                'selected',
                {
                    key: 'showDetail',
                    label: 'Show Detail',
                },
                'index',
                'action',
                {
                    key: 'isActive',
                    label: 'Active',
                },
                {
                    key: 'id',
                    label: 'ID',
                },
                {
                    key: 'first_name',
                    label: 'First Name',
                    sortable: false
                },
                {
                    key: 'last_name',
                    label: 'Last Name',
                    sortable: true
                },
                {
                    key: 'age',
                    label: 'Person age',
                    sortable: true,
                    formatter: (value, key, item) => {
                        if (30 < value && value < 60) {
                            return value + "（中年人）"
                        }
                        else if (value > 60) {
                            return value + "（老年人）"
                        }
                        return value
                    }
                },
                {
                    key: 'sex',
                    label: 'Sex',
                },
                {
                    key: 'htmlCol',
                    label: 'Html格式文本',
                }
            ],//指定显示需要的字段
            tableRows: [
                { isActive: true, id: 1, age: 40, first_name: 'Dickerson', last_name: 'Macdonald', sex: 'Men', htmlCol: 'This is <i>raw <strong>HTML</strong></i> <span style="color:red">content</span>' },
                { isActive: false, id: 2, age: 21, first_name: 'Larsen', last_name: 'Shaw', sex: 'Women', htmlCol: 'This is <i>raw <strong>HTML</strong></i> <span style="color:blue">content</span>' },
                { isActive: false, id: 3, age: 89, first_name: 'Geneva', last_name: 'Wilson', sex: 'Men', htmlCol: 'This is <i>raw <strong>HTML</strong></i> <span style="color:green">content</span>' },
                { isActive: true, id: 4, age: 38, first_name: 'Jami', last_name: 'Carney', sex: 'Women', htmlCol: 'This is <i>raw <strong>HTML</strong></i> <span style="color:black">content</span>' },
                { isActive: true, id: 5, age: 40, first_name: 'WERWER', last_name: 'SDF', sex: 'Men', htmlCol: 'This is <i>raw <strong>HTML</strong></i> <span style="color:red">content</span>' },
                { isActive: false, id: 6, age: 21, first_name: 'dfg', last_name: 'ertert', sex: 'Women', htmlCol: 'This is <i>raw <strong>HTML</strong></i> <span style="color:blue">content</span>' },
                { isActive: false, id: 7, age: 89, first_name: 'fdg', last_name: '6lkjhkk', sex: 'Men', htmlCol: 'This is <i>raw <strong>HTML</strong></i> <span style="color:green">content</span>' },
                { isActive: true, id: 8, age: 38, first_name: 'fgh', last_name: 'yuiyu', sex: 'Women', htmlCol: 'This is <i>raw <strong>HTML</strong></i> <span style="color:black">content</span>' },
                { isActive: true, id: 9, age: 40, first_name: 'erhfgh', last_name: 'ghjg', sex: 'Men', htmlCol: 'This is <i>raw <strong>HTML</strong></i> <span style="color:red">content</span>' },
                { isActive: false, id: 10, age: 21, first_name: 'yuiy', last_name: 'rty', sex: 'Women', htmlCol: 'This is <i>raw <strong>HTML</strong></i> <span style="color:blue">content</span>' },
                { isActive: false, id: 11, age: 89, first_name: 'ghj', last_name: 'wer', sex: 'Men', htmlCol: 'This is <i>raw <strong>HTML</strong></i> <span style="color:green">content</span>' },
                { isActive: true, id: 12, age: 38, first_name: 'cvbcb', last_name: 'erte', sex: 'Women', htmlCol: 'This is <i>raw <strong>HTML</strong></i> <span style="color:black">content</span>' },
            ],
            form1: {
                id: -1,
                first_name: '',
                last_name: '',
                age: 0,
                sex: '',
                isActive: false,
            },
            sexSelectList: [{ text: '请选择', id: '', disabled: true }, { text: '男', id: 'Men' }, { text: '女', id: 'Women' }],
            isshowform: true,
        }
    },
    methods: {
        changePageOption(num) {
            this.perPage = num;
        },
        onRowSelected(items) {
            this.selected = items
        },
        selectAllRows() {
            this.$refs.selectableTable.selectAllRows()
        },
        clearSelected() {
            this.$refs.selectableTable.clearSelected()
        },
        selectRowByIndex(index) {
            this.$refs.selectableTable.selectRow(index)
        },
        unselectRowByIndex(index) {
            this.$refs.selectableTable.unselectRow(index)
        },

        showCreateModal() {
            this.$refs['createmodal'].show()
        },
        hideCreateModal() {
            this.$refs['createmodal'].hide()
        },
        onSubmit(evt) {
            evt.preventDefault()

            if (this.form1.id !== -1) {
                var index = this.tableRows.findIndex(f => f.id === this.form1.id);
                var row = this.tableRows[index];
                row.id = this.form1.id
                row.first_name = this.form1.first_name
                row.last_name = this.form1.last_name
                row.age = this.form1.age
                row.sex = this.form1.sex
                row.isActive = this.form1.isActive
            } else {
                this.tableRows.push({
                    id: this.tableRows.length + 1,
                    isActive: this.form1.isActive,
                    age: this.form1.age,
                    first_name: this.form1.first_name,
                    last_name: this.form1.last_name,
                    sex: this.form1.sex,
                    htmlCol: 'This is <i>raw <strong>HTML</strong></i> <span style="color:red">content</span>'
                })
            }

            this.hideCreateModal();
        },
        onReset(evt) {
            if (evt) {
                evt.preventDefault()
            }

            this.form1.id = -1
            this.form1.first_name = ""
            this.form1.last_name = ""
            this.form1.age = 0
            this.form1.sex = ''
            this.form1.isActive = false
            this.isshowform = false
            this.$nextTick(() => {
                this.isshowform = true
            })
        },

        showEditModal(id) {
            var index = this.tableRows.findIndex(f => f.id === id);
            if (index !== -1) {
                var row = this.tableRows[index];
                this.form1.id = row.id
                this.form1.first_name = row.first_name
                this.form1.last_name = row.last_name
                this.form1.age = row.age
                this.form1.sex = row.sex
                this.form1.isActive = row.isActive
                this.isshowform = true
                this.showCreateModal()
            } else {
                alert('NoFound')
            }
        },
        deleteRow(id) {
            var index = this.tableRows.findIndex(f => f.id === id);
            if (index !== -1) {
                this.tableRows.splice(index, 1);
            } else {
                alert('NoFound')
            }
        },


    },
    mounted() {
        this.$root.$on('bv::modal::show', (bvEvent, modalId) => {
            console.log('Modal Show', modalId)
            if (modalId === "createModal") {
                //TODO...
            }
        })
        this.$root.$on('bv::modal::hide', (bvEvent, modalId) => {
            console.log('Modal Hide', modalId)
            if (modalId === "createModal") {
                this.onReset();
            }
        })
    }
}
</script>