<template>
    <div>
        <!-- <p>链接传过来的值: {{ $route.params.username }}</p> -->
        <h2>Home - 表格的增删改查（json方式存储）</h2>

        <div>
            <b-button-toolbar key-nav aria-label="Toolbar with button groups">
                <b-button-group class="mx-1">
                    <b-button variant="success" @click="showCreateModal">{{ $t("app.create") }}</b-button>
                </b-button-group>
            </b-button-toolbar>
        </div>

        <div>
            <b-table striped hover :fields="tableColumns" :items="tableRows">
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
            </b-table>

            <p>{{ $t("app.total", { "total": tableRows.length }) }}</p>
        </div>

        <b-modal ref="createmodal" hide-footer title="Create New Data" id="createModal">
            <div>
                <b-form @submit="onSubmit" @reset="onReset" v-if="isshowform">
                    <b-form-group id="input-group-1" label="First Name:" label-for="input-1" description="请输入您的性">
                        <b-form-input id="input-1" v-model="form1.first_name" required
                            placeholder="Enter First Name"></b-form-input>
                    </b-form-group>

                    <b-form-group id="input-group-2" label="Last Name:" label-for="input-2">
                        <b-form-input id="input-2" v-model="form1.last_name" required
                            placeholder="Enter Last Name"></b-form-input>
                    </b-form-group>

                    <b-form-group id="input-group-2" label="Age:" label-for="input-2">
                        <b-form-input id="input-2" v-model="form1.age" required type="number"
                            placeholder="Enter Age"></b-form-input>
                    </b-form-group>

                    <b-form-group id="input-group-3" label="Sex:" label-for="input-3">
                        <b-form-select id="input-3" v-model="form1.sex" :options="sexSelectList" value-field="id" text-field="text" required ref="sexSelect"></b-form-select>
                    </b-form-group>

                    <b-form-group id="input-group-4">
                        <b-form-checkbox v-model="form1.isActive" id="checkbox-4">
                            Is Active
                        </b-form-checkbox>
                    </b-form-group>

                    <b-button type="submit" variant="primary">Submit</b-button>
                    <b-button type="reset" variant="danger">Reset</b-button>
                </b-form>
            </div>
            <b-button class="mt-3" variant="outline-danger" block @click="hideCreateModal">Close Me</b-button>
        </b-modal>
    </div>
</template>

<script>
export default {
    name: 'Home',
    data: function () {
        return {
            tableColumns: [
                // A virtual column that doesn't exist in items
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
                    variant: 'danger',// Variant applies to the whole column, including the header and footer
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
                { isActive: true, id: 4, age: 38, first_name: 'Jami', last_name: 'Carney', sex: 'Women', htmlCol: 'This is <i>raw <strong>HTML</strong></i> <span style="color:black">content</span>' }
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