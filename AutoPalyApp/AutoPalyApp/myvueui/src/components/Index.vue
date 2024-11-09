<template>
    <div>
        <h1>首页</h1>

        <h2>正在运行的任务队列</h2>
        <div>
            罗列全部已启动的任务，并显示进度条，可以根据执行的命令总数，命令设置的间隔时间，和休眠时间，推算出一个大致的进度条
            临时的和定时的，都标注出来
        </div>

        <h2>剩余的暂停的，未开启的队列</h2>
        <div>

        </div>

        <h2>报表</h2>
        <div>汇总全部任务到目前为止运行的总次数，运行总时长，统计报表性质的</div>
    </div>
</template>

<script>
export default {
    name: 'Index',
    data() {
        return {
        }
    },
    methods: {
    },
    mounted() {
    }
}
</script>