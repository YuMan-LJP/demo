<template>
    <div>
        <button @click="api">调用API</button>
        <button @click="logout">退出登录</button>
        <pre>{{res}}</pre>
    </div>
</template>
  
<script>
import {oidc} from '@/request/odic.js'

export default {
  name: "MyHome",
  data() {
      return {
          res: "My Home"
      };
  },

  methods: {
    api() {
      var that=this;
      oidc().getUser().then(function(user) {
          var url = "https://localhost:5002/identity";//访问资源服务器获取数据信息
  
          var xhr = new XMLHttpRequest();
          xhr.open("GET", url);
          xhr.onload = function() {
              that.res = (xhr.status, JSON.parse(xhr.responseText))
          };
          xhr.setRequestHeader("Authorization", "Bearer " + user.access_token);
          xhr.send();
      });
    },
    logout() {
      oidc().signoutRedirect();
    }
  },
  mounted() {
      var that=this;
      oidc().getUser().then(function(user) {
          if (user) {
              that.res = ("User logged in", user.profile);
          } else {
              that.res = ("User not logged in");
          }
      });
  }
};
</script>

<style scoped>
</style>