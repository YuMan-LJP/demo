<template>
  <div class="hello">
    <h1>{{ msg }}</h1>

    <div>
      <el-text>{{ name }}</el-text>
      <el-input class="input" type="text" v-model="name"></el-input>
      <el-button class="button" type="primary" @click="testBtn">测试请求</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      name: '',
    }
  },
  methods: {
    testBtn() {
      this.$get("/api/getusers").then((response) => {
        console.log(response.data);
      }).catch(() => {
      })
    }
  },
  setup(){
    console.log("setup，相当于beforeCreate 和 created");
  },
  beforeMount() {
    // 在挂载开始之前被调用：相关的 render 函数首次被调用。
    console.log("beforeMount");
  },
  mounted() {
    // 组件挂载时调用
    console.log("mounted");
  },
  beforeUpdate() {
    // 数据更新时调用，发生在虚拟 DOM 打补丁之前。这里适合在更新之前访问现有的 DOM，比如手动移除已添加的事件监听器。
    console.log("beforeUpdate");
  },
  updated () {
    // 由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。
    console.log("updated");
  },
  beforeUnmount(){
    // 在卸载组件实例之前调用。在这个阶段，实例仍然是完全正常的。
    console.log("beforeUnmount");
  },
  unmounted () {
    // 卸载组件实例后调用。调用此钩子时，组件实例的所有指令都被解除绑定，所有事件侦听器都被移除，所有子组件实例被卸载。
    console.log("unmounted");
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
