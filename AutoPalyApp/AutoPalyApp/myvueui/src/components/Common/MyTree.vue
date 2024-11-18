<template>
  <div class="my-tree-wrap">
    <!-- 有数据渲染没数据提示暂无数据 -->
    <div v-if="treeData.length > 0">
      <!-- 初次循环，组件内再次递归循环，即可实现递归树效果 -->
      <MyTreeItem v-for="(item, index) in treeData" :key="index" :item="item" 
        :nameField="nameField"
        :childrenField="childrenField"
        :showTextFun="showTextFun"
        :expandTree="expandTree"
        :clickNameClose="clickNameClose" v-on="$listeners" v-bind="$attrs">
      </MyTreeItem>
    </div>
    <span class="noData" v-else>暂无数据</span>
  </div>
</template>
  
<script>
import MyTreeItem from "./MyTreeItem";
export default {
  name: "MyTree",
  components: { MyTreeItem },
  props: {
    // 树组件需要的数据数组
    treeData: {
      type: Array,
      default: () => {
        return [];
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
    expandTree: Boolean, // 是否统一展开或关闭
    iconName: String, // 树组件的小图标
    clickNameClose: Boolean, // 点击树节点名字也能关闭树节点菜单
  },
};
</script>