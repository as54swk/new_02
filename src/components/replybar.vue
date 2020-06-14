<template>
  <div>
    <!-- 回复列表 -->
    <div class="replay">
      <!-- 组件自己调用自己(父传子),通过组件自己的name名字,自己调用自己类似递归,需要有终止条件,不然就陷入了死循环.这里用v-if来作为终止条件-->
      <Replybar v-if="data.parent" :data="data.parent" @reply="handleTouch" />
      <div class="replay_top">
        <div class="user">
          <span class="size"></span>
          <span>{{data.user.nickname}}</span>
          <span class="size">{{moment(data.create_date).fromNow()}}</span>
        </div>
        <!-- 直接使用props中的数据传递,这样每个数据都对应自己的子组件 -->
        <span class="size" @click="handleTouch(data)">回复</span>
      </div>
      <p class="content">{{data.content}}</p>
    </div>
  </div>
</template>

<script>
import moment from "moment";
moment.locale("zh-cn");
export default {
  name: "Replybar",
  props: ["data"],
  data() {
    return {
      moment
    };
  },
  mounted() {},
  methods: {
    // 将每条回复子组件的数据传递给回复父页面
    handleTouch(data) {
      this.$emit("reply", data);
    }
  }
};
</script>

<style lang='less' scoped>
@vw: 375 / 100vw;
.replay {
  margin-bottom: 5 / @vw;
  padding: 0 2 / @vw 16 / @vw 2 / @vw;
  border: 1px solid #dfdfdf;
  &_top {
    display: flex;
    justify-content: space-between;
    .user {
      .size {
        font-size: 14 / @vw;
        padding: 0 5 / @vw;
        color: #999;
      }
    }
    .size {
      color: #999;
    }
  }
  .content {
    padding: 10 / @vw;
  }
}
</style>