<template>
  <div>
    <h1>Login</h1>
    <el-form :model="form" label-width="auto" style="max-width: 600px;margin: 0 auto;">
      <el-form-item label="User Name">
        <el-input v-model="form.userName" />
      </el-form-item>
      <el-form-item label="Password">
        <el-input v-model="form.password" type="password" placeholder="Please input password" show-password v-on:keyup.enter="login"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">Login</el-button>
        <el-button @click="createOrEditModal.isVisible = true">Register</el-button>
      </el-form-item>
    </el-form>

    <el-dialog v-model="createOrEditModal.isVisible" title="Edit" width="800">
      <el-form :model="form2">
        <el-form-item label="User Name" label-width="140px">
          <el-input v-model="form2.userName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Nick Name" label-width="140px">
          <el-input v-model="form2.nickName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Email" label-width="140px">
          <el-input v-model="form2.email" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Password" label-width="140px">
          <el-input v-model="form2.password" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeModal">{{ $t("app.cancel") }}</el-button>
          <el-button type="success" @click="register">{{ $t("app.confirm") }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
  
<script>
import { ElLoading } from 'element-plus';
export default {
  name: 'Login',
  data() {
    return {
      form: {
        userName: '',
        password: '',
      },
      createOrEditModal: {
        isVisible: false,
        rowId: 0,
      },
      form2: {
        userName: '',
        nickName: '',
        email: '',
        password: '',
        userType: 'general',
      },
    }
  },
  methods: {
    login() {

      let loadingInstance = ElLoading.service({ fullscreen: true });
      this.$post("/api/checkUserPassword", this.form).then((response) => {
        loadingInstance.close();
        if (response.data.isSuccess) {
          if (response.data.data) {
            sessionStorage.setItem('user', JSON.stringify(response.data.data))
            window.location.href = "index.html"
          } else {
            this.$swalError('系统提示', "用户名或密码错误");
          }
        }
        else {
          this.$swalError('系统提示', response.data.error);
        }
      }).catch((err) => {
        loadingInstance.close();
        this.$swalError('系统提示', err);
      })
    },
    register() {
      //数据校验
      if (!this.form2.userName) {
        this.$swalError('系统提示', 'User Name不能为空');
        return;
      }
      if (!this.form2.nickName) {
        this.$swalError('系统提示', 'Nick Name不能为空');
        return;
      }
      if (!this.form2.email) {
        this.$swalError('系统提示', 'Email不能为空');
        return;
      }
      if (!this.form2.password) {
        this.$swalError('系统提示', 'Password不能为空');
        return;
      }

      var inputDto = {
        userName: this.form2.userName,
        nickName: this.form2.nickName,
        email: this.form2.email,
        password: this.form2.password,
        userType: this.form2.userType,
      }
      let loadingInstance = ElLoading.service({ fullscreen: true });
      this.$post("/api/addUser", inputDto).then((response) => {
        loadingInstance.close();
        if (response.data.isSuccess) {
          sessionStorage.setItem('user', JSON.stringify(response.data.data))
          window.location.href = "index.html"
        }
        else {
          this.$swalError('系统提示', response.data.error);
        }
      }).catch((err) => {
        loadingInstance.close();
        this.$swalError('系统提示', err);
      })
    },
    closeModal() {
      this.createOrEditModal.isVisible = false;
      this.form2.userName = ""
      this.form2.nickName = ""
      this.form2.email = ""
      this.form2.password = ""
    }
  },
  mounted() {
    console.log("Login mounted");
  },
}
</script>
  
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  margin: 0px;
}

/* 让sweetalert2提示框显示的最上面，避免被模态框挡住 */
.swal2-container {
  z-index: 10000;
}
</style>
  