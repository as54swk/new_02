<template>
  <router-link :to="'/comments/'+post.id" class="bottom">
    <input type="text" placeholder="写跟帖" />
    <span class="iconfont icon-pinglun">
      <span class="length">{{post.comment_length}}</span>
    </span>
    <span class="iconfont icon-fav-1" @click="handleStart" :class="post.has_star?'active':''"></span>
    <span class="iconfont icon-fenxiang"></span>
  </router-link>
</template>

<script>
export default {
  props: ["post", "token"],
  methods: {
    // 收藏接口
    handleStart() {
      this.$axios({
        url: `/post_star/${this.post.id}`,
        headers: { Authorization: this.token }
      }).then(res => {
        this.$toast.success(res.data.message);
        this.post.has_star = !this.post.has_star;
      });
    }
  }
};
</script>

<style lang='less' scoped>
@vw: 375 / 100vw;
.bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-around;
  height: 50 / @vw;
  align-items: center;
  input {
    min-height: 75%;
    border: none;
    background-color: #d7d7d7;
    border-radius: 20 / @vw;
    padding-left: 8 / @vw;
  }
  .iconfont {
    font-size: 25 / @vw;
  }
  .icon-fav-1 {
    &.active {
      color: red;
    }
  }
  .icon-pinglun {
    position: relative;
    .length {
      position: absolute;
      left: 5 / @vw;
      top: -12 / @vw;
      min-width: 50%;
      background-color: #ff0000;
      color: #fff;
      font-size: 14 / @vw;
      border-radius: 10 / @vw;
      padding: 0 3 / @vw;
    }
  }
}
</style>