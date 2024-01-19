<template>
  <div>
      <form>
          <div>
              <label>用户名：</label>
              <input type="text" placeholder="请输入用户名" v-model="username">
          </div>
          <div>
              <label>密码：</label>
              <input type="password" placeholder="请输入密码" v-model="password">
          </div>
          <div>
            <label>记住我：</label>
            <input type="checkbox" v-model="isRemember">
          </div>
      </form>
      <div>
          <button @click="login()">登录</button>
      </div>
  </div>
</template>
  
<script>
 import {request} from "@/request/request"

 export default {
  name: 'loginView',
  data() {
      return {
        username: "",
        password: "",
        isRemember: false,
      };
  },
  methods:{
    login(){

      //截取地址参数，构造ReturnUrl
      let index = this.$route.query.ReturnUrl.indexOf("?");
      let host = this.$route.query.ReturnUrl.substring(0, index + 1);
      host = host.substring(host.indexOf("/connect"));
      let params = this.$route.query.ReturnUrl.substring(index + 1).split("&");

      let ReturnUrl =
        host +
        params
          .map(x => { return x; })
          .join("&");

      var data = {
        Username: this.username,
        Password: this.password,
        RememberLogin: this.isRemember,
        ReturnUrl: ReturnUrl,
      };

      request({
        headers: { 'content-type': 'application/x-www-form-urlencoded' },//表单提交
        method: 'POST',
        url: '/Account/LoginApi',
        data: data
      }).then(data=>{
        if (!data) {
          this.$router.push({ path: "/404" });
        } else {
          window.location = "/api" + data;
        }
      }).catch(error=>{
        console.log(error)
      })
    },
  }
}
</script>