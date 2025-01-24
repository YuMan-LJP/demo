<template>
    <div>
        <h1>Home</h1>
        <p>Vue3 + element-plus前端开发</p>
        <p>已经封装好了以下组件：</p>
        <ul>
            <li>1.ElementPlus</li>
            <li>2.axios请求</li>
            <li>3.router路由</li>
            <li>4.i18n多语言</li>
            <li>5.sweetalert2样式弹窗</li>
        </ul>
        <p>已搭建好的功能：</p>
        <ul>
            <li>1.路由请求跳转</li>
            <li>2.多语言切换</li>
            <li>3.模板页菜单导航</li>
        </ul>
    </div>
</template>
  
<script>
export default {
    name: 'Home',
    data() {
        return {
        }
    },
    methods: {
    },
    mounted() {
        console.log("Home mounted");
    },
}
</script>
  