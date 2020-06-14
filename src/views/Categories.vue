<template>
  <div>
    <div class="head">
      <span class="iconfont icon-xiazai6" @click="$router.push('/')"></span>
      <h4>栏目管理</h4>
      <span></span>
    </div>
    <p style="padding-left:15px">点击删除以下频道</p>
    <div class="del">
      <span
        class="del_item"
        :class="['关注','头条'].includes(item.name)?'active':''"
        v-for="(item,index) in upArr"
        :key="index"
        @click="delItem(item,index)"
      >{{item.name}}</span>
    </div>
    <p style="padding-left:15px">点击添加以下频道</p>
    <div class="add">
      <span
        @click="addItem(item,index)"
        class="add_item"
        v-for="(item,index) in dowArr"
        :key="index"
      >{{item.name}}</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 总栏目数
      categories: [],
      upArr: [],
      dowArr: []
    };
  },
  mounted() {
    this.getCategories();
  },
  //   页面销毁时候,更新本地存储数据
  destroyed() {
    localStorage.setItem("columns", JSON.stringify(this.categories));
  },
  methods: {
    getCategories() {
      this.categories = JSON.parse(localStorage.getItem("columns"));
      this.upArr = this.categories.filter(item => item.is_top == 1);
      this.dowArr = this.categories.filter(item => item.is_top !== 1);
    },
    delItem(item, index) {
      // 如果是关注或者头条则不操作
      if (["关注", "头条"].includes(item.name)) return;
      // 删除upArr对应频道,并且将选中标识改为0
      this.upArr.splice(index, 1);
      item.is_top = 0;
      //   下面数组增加
      this.dowArr.push(item);
    },
    addItem(item, index) {
      // 删除dowArr对应频道,并且将选中标识改为1
      this.dowArr.splice(index, 1);
      item.is_top = 1;
      //  上面数组增加
      this.upArr.push(item);
    }
  }
};
</script>

<style lang="less" scoped>
@vw: 375 / 100vw;
.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15 / @vw 10 / @vw;
}
.del {
  display: flex;
  flex-wrap: wrap;
  padding: 15 / @vw;
  .del_item {
    padding: 10 / @vw;
    margin-right: 5 / @vw;
    margin-bottom: 8 / @vw;
    border: 1px solid #d0d0d0;
    &.active {
      background-color: #d0d0d0;
    }
  }
}
.add {
  display: flex;
  flex-wrap: wrap;
  padding: 15 / @vw;
  .add_item {
    padding: 10 / @vw;
    margin-right: 5 / @vw;
    margin-bottom: 8 / @vw;
    border: 1px solid #d0d0d0;
  }
}
</style>