<template>
    <div>
        <el-container>
            <el-container>
                <el-header>
                    <p>总进度</p>
                    <el-progress :percentage="percentage" :stroke-width="15" striped striped-flow />
                </el-header>

                <el-main>
                    <el-tree :data="dataSource" show-checkbox node-key="id" default-expand-all :expand-on-click-node="false"
                        icon="ArrowRightBold">
                        <template #default="{ node, data }">
                            <el-card>
                                <template #header>
                                    <el-text class="mx-1" type="primary">{{ node.label }}</el-text>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <el-button @click="append(data)" type="success" icon="Plus" circle size="small"/>
                                    <el-button @click="remove(node, data)" type="danger" icon="Delete" circle size="small"/>
                                </template>
                                <span>{{ node.label }}</span>
                            </el-card>
                        </template>
                    </el-tree>
                </el-main>
            </el-container>

            <el-aside width="300px">
                <h5>日志窗口</h5>
                <el-timeline>
                    <el-timeline-item v-for="(timeline, index) in timelines" :timestamp="timeline.timestamp" placement="top"
                        :type="timeline.type">
                        {{ timeline.text }}
                    </el-timeline-item>
                </el-timeline>
            </el-aside>
        </el-container>
    </div>
</template>

<script>
export default {
    name: 'Sample1',
    data() {
        return {
            percentage: 10,
            id: 100,
            dataSource: [
                {
                    id: 1,
                    label: 'Level one 1',
                    children: [
                        {
                            id: 4,
                            label: 'Level two 1-1',
                            children: [
                                {
                                    id: 9,
                                    label: 'Level three 1-1-1',
                                },
                                {
                                    id: 10,
                                    label: 'Level three 1-1-2',
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 2,
                    label: 'Level one 2',
                    children: [
                        {
                            id: 5,
                            label: 'Level two 2-1',
                        },
                        {
                            id: 6,
                            label: 'Level two 2-2',
                        },
                    ],
                },
                {
                    id: 3,
                    label: 'Level one 3',
                    children: [
                        {
                            id: 7,
                            label: 'Level two 3-1',
                        },
                        {
                            id: 8,
                            label: 'Level two 3-2',
                        },
                    ],
                },
            ],
            timelines: [
                { timestamp: '2025-02-15 15:01:01', type: 'info', text: '启动模拟器：xxx，端口：xxx' },
                { timestamp: '2025-02-15 15:01:01', type: 'primary', text: 'Tom committed 2018/4/3 20:46 sdf sdfsdfsdfsd sdfsdfwe sdfsd' },
                { timestamp: '2025-02-15 15:01:01', type: 'danger', text: '异常：sdfsdfsd' },
                { timestamp: '2025-02-15 15:01:01', type: 'success', text: 'Tom committed 2018/4/2 20:46' }
            ]
        }
    },
    methods: {
        append(data) {
            const newChild = { id: this.id++, label: 'test' + this.id, children: [] }
            if (!data.children) {
                data.children = []
            }
            data.children.push(newChild)
            this.dataSource = [...this.dataSource]
        },
        remove(node, data) {
            const parent = node.parent
            const children = parent.data.children || parent.data
            const index = children.findIndex((d) => d.id === data.id)
            children.splice(index, 1)
            this.dataSource = [...this.dataSource]
        }
    },
    mounted() {
        console.log("Sample1 mounted");
    },
}
</script>

<style scoped>
.el-card {
    --el-card-padding: 10px;
}

.el-tree {
    --el-tree-node-content-height: 100px;
}
</style>