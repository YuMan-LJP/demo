<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>Hello World</p>
    <button @click="test()">测试</button>
    <!-- 增加一个登录按钮 -->
    <button @click="login()">登录</button>
    <hr>
    <router-view></router-view>
  </div>
</template>

<script>
import {request} from "@/request/request"
import {oidc} from '@/request/odic.js'//引入odic方法

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  methods:{
    test(){
      //测试跨域访问
      request('/weatherforecast').then(data=>{
        console.log(data);
      }).catch(error=>{
        console.log(error)
      })
    },
    login(){
      oidc().signinRedirect();//自动跳转到登录页面
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
