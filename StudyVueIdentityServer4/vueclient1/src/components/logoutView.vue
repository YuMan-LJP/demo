<template>
    <div>
        
    </div>
</template>
    
<script>
import {request} from "@/request/request"

export default{
  name: 'logoutView',
  mounted() {
    request({
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        method: 'POST',
        url: '/Account/LogoutApi',
        data: null
    }).then(data=>{
        if (!data) {
            this.$router.push({ path: "/404" });
        } else {
            this.$router.push({ path: "/" });//登出后要跳转的地址
        }
    }).catch(error=>{
        console.log(error)
    })
  }
}
</script>