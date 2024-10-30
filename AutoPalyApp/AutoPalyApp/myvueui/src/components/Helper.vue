<template>
    <div>
        <h1>帮助页</h1>

        <p>举例各种样例方法的实现</p>

        <div>
            <b-button variant="info" @click="testEventTrigger">测试事件方法</b-button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Helper',
    data() {
        return {
        }
    },
    methods: {
        testEventTrigger() {
            this.$common.event.trigger("name111", '测试数据');//触发事件
        },
    },
    mounted() {
        //订阅事件
        this.$common.event.on("name111", (data) => {
            this.$messageConfirm("系统提示", data, (isConfirm) => {
                if (isConfirm) {
                    this.$toastr.s('测试消息', '系统通知');

                    this.$setBusy();

                    setTimeout(() => {
                        this.$clearBusy();
                    }, 3000);
                }
            })
        })

        //测试方法：vue编译把发布文件放到wwwroot，启动后端，访问Hepler页面，然后浏览器发送请求http://localhost:5000/api/TaskScheduler/TestApi，这边就可以收到订阅消息了
        this.$common.event.on("vueMessageEvent", (data) =>{
            if(data.Arg1){
                console.log(data.Arg1)
            }
            if(data.Arg2){
                console.log(data.Arg2)
            }
            if(data.arg3){
                console.log(data.arg3)
            }
        })
    }
}
</script>