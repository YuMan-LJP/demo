<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>UserName: {{ $route.params.username}}</p>

    <input type="text" v-model="messageText">
    <button v-on:click="showMessage">Test</button>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data: function(){
      return {
          messageText: '',
      }
  },
  methods:{
    showMessage() {
      var text = this._data.messageText;
      console.group(text);
      this.$axios.get("/api/home/ShowMessageBox?msg="+text).then((data)=>{
        console.log(data)
      }).catch((err)=>{
        console.log(err)
      })
    }
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
