<template>
  <!-- 每一个树节点包含：图标部分、名字部分，因为考虑到递归，所以再拆分一个部分，即有树子节点部分childrenTreeNode -->
  <div class="treeNodeItem">
    <!-- 图标和名字部分，设置tabindex="-1"就可设置:focus的样式了 -->
    <div class="iconAndName" tabindex="-1">
      <!-- 有树子节点才去渲染图标 -->
      <div  @click="clickTree">
        <b-icon v-if="item[childrenField]" @click.stop="clickIconFold" :icon="isFold ? 'chevron-right' : 'chevron-down'"></b-icon>
        <span :class="['treeNodeItemName', item[childrenField] ? '' : 'noChildrenIcon']">{{ GetShowText() }}</span>
      </div>
      <div class="treeNodeItemBtn">
        <b-icon icon="eye" class="treenItemBtn" @click="clickTreeDetail"></b-icon>
        <b-icon icon="pencil" class="treenItemBtn" @click="clickTreeEdit"></b-icon>
        <b-icon icon="trash" class="treenItemBtn" @click="clickTreeDelete"></b-icon>
        <b-icon icon="plus" class="treenItemBtn" @click="clickTreeAdd"></b-icon>
      </div>
      <!-- 注意上方几个动态样式的使用，可以去掉看效果，更加直观 -->
    </div>
    <!-- 展开折叠通过display: none来控制，进一步延伸为通过变量isFold来控制 -->
    <div :style="{ display: isFold ? 'none' : 'block', }">
      <!-- 存在子节点就遍历并递归调用自身这个组件 -->
      <template v-if="item[childrenField]">
        <MyTreeItem v-for="(ite, ind) in item[childrenField]" :key="ind" :item="ite" 
          :showTextFun="showTextFun" :expandTree="expandTree"
          :clickNameClose="clickNameClose" v-on="$listeners" v-bind="$attrs"></MyTreeItem>
      </template>
    </div>
  </div>
</template>
  
<script>
export default {
  name: "MyTreeItem",
  props: {
    // 每一个节点的数据
    item: {
      type: Object,
      default: () => {
        return {};
      },
    },
    nameField:{
      type: String,
      default: 'name',
    },
    childrenField:{
      type: String,
      default: 'children',
    },
    showTextFun:{
      type: Function,
      default: undefined,
    },
    expandTree: Boolean, // 默认把树折叠起来
    clickNameClose: Boolean, // 点击树节点名字，也可以折叠展开菜单（本来设置只能点击图标）
  },
  watch: {
    // 监听布尔值变量变化，统一折叠或者展开
    expandTree(newVal) {
      this.isFold = !newVal; // 是否要取反取决于大家定义的变量的布尔值
    },
  },
  data() {
    return {
      isFold: true, // 默认有子节点都折叠起来
    };
  },
  mounted() {
    this.isFold = !this.expandTree; // 是否要取反取决于大家定义的变量的布尔值
  },
  methods: {
    clickIconFold() {
      this.isFold = !this.isFold;
      this.$emit("fold", this.item, this.isFold ? "close" : "open");
    },
    clickTree() {
      // 默认是点击小图标才能关闭，加上clickNameClose为true属性，设置点击树节点name也能关闭
      if (this.clickNameClose) {
        this.clickIconFold();
      }
      this.$emit("clickTree", this.item);
    },
    clickTreeDetail(){
      this.$emit("clickTreeDetail", this.item);
    },
    clickTreeEdit(){
      this.$emit("clickTreeEdit", this.item);
    },
    clickTreeDelete(){
      this.$emit("clickTreeDelete", this.item);
    },
    clickTreeAdd(){
      this.$emit("clickTreeAdd", this.item);
    },
    GetShowText(){
      if(this.showTextFun){
        return this.showTextFun(this.item);
      }
      return this.item[this.nameField];
    },
  },
};
</script>