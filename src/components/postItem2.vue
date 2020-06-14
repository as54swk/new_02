<template>
  <router-link :to="'/video/'+item.id">
    <!-- 单张图 -->
    <div class="item_two">
      <p class="content">{{item.title}}</p>
      <div class="img">
        <img :src="$axios.defaults.baseURL+item.cover[0].url" alt />
        <!-- 遮罩物 -->
        <div class="mask">
          <span class="iconfont icon-shipin"></span>
        </div>
      </div>
      <div class="user">
        <span>{{item.user.nickname}}</span>
        <span>{{item.comment_length}}跟帖</span>
      </div>
    </div>
  </router-link>
</template>

<script>
export default {
  props: ["item"]
};
</script>

<style lang='less' scoped>
@vw: 375 / 100vw;
.item_two {
  padding: 8 / @vw;
  .img {
    position: relative;
    padding: 8 / @vw 0;
    img {
      width: 100%;
      height: 200 / @vw;
      object-fit: cover;
    }
    .mask {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 65 / @vw;
      height: 65 / @vw;
      border-radius: 50%;
      background-color: rgba(73, 74, 75, 0.8);
      .icon-shipin {
        font-size: 26 / @vw;
      }
    }
  }
}
</style>