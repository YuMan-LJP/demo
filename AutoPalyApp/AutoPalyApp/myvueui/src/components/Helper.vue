<template>
    <div>
        <h1>帮助页</h1>

        <p>举例各种样例方法的实现</p>

        <div>
            <b-button variant="info" @click="testEventTrigger">测试事件方法</b-button>
        </div>

        <div>
            <div class="treeBox">
                <MyTree :treeData="treeData" :expandTree="expandTree" @fold="fold" @clickTree="clickTree" clickNameClose></MyTree>
            </div>
        </div>
    </div>
</template>

<script>
import MyTree from "./Common/MyTree"
export default {
    name: 'Helper',
    components: { MyTree },
    data() {
        return {
            treeData: [
                {
                    name: "中国",
                    eng: "China",
                    children: [
                        {
                            name: "北京",
                            eng: "Beijing",
                        },
                        {
                            name: "上海",
                            eng: "Shanghai",
                            children: [
                                {
                                    name: "闵行区",
                                    eng: "Minhang",
                                },
                                {
                                    name: "静安区",
                                    eng: "Jingan",
                                },
                            ],
                        },
                    ],
                },
                {
                    name: "美国",
                    eng: "American",
                    children: [
                        {
                            name: "纽约",
                            eng: "NewYork",
                            children: [
                                {
                                    name: "曼哈顿区",
                                    eng: "ManHattan",
                                },
                                {
                                    name: "皇后区",
                                    eng: "Queen",
                                },
                                {
                                    name: "布鲁克林区",
                                    eng: "Brooklyn",
                                },
                            ],
                        },
                        {
                            name: "华盛顿",
                            eng: "Washington",
                        },
                    ],
                },
            ],
            expandTree: true,
        }
    },
    methods: {
        testEventTrigger() {
            this.$common.event.trigger("name111", '测试数据');//触发事件
        },
        testSubmitData() {
            //举例代码：
            let formData = new FormData();
            formData.append('files', '你的文件')
            formData.append('groupData', JSON.stringify('要提交的数据对象'))

            this.$setBusy();
            this.$axios.post("/api/...接口地址", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'//application/json
                }
            }).then((response) => {
                this.$clearBusy();
                console.log(response)
                if (response.data === true) {
                    this.$messageSuccess('System Tip', 'Save Success')
                } else {
                    this.$messageWarn('System Tip', 'Save Fail')
                }
            }).catch((err) => {
                this.$clearBusy();
                console.log(err)
                this.$messageError('System Tip', 'Save Fail')
            })
        },

        fold(params, key) {
            console.log("fold", params, key);
        },
        clickTree(params) {
            console.log("clickTree", params);
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

        //测试方法：vue编译把发布文件放到wwwroot，启动后端，访问Hepler页面，然后浏览器发送请求http://localhost:5000/api/home/TestApi，这边就可以收到订阅消息了
        this.$common.event.on("vueMessageEvent", (data) => {
            if (data.Arg1) {
                console.log(data.Arg1)
            }
            if (data.Arg2) {
                console.log(data.Arg2)
            }
            if (data.arg3) {
                console.log(data.arg3)
            }
        })
    }
}
</script>