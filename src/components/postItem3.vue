<template>
  <router-link class="item_three" :to="'/detail/'+item.id">
    <p class="top">{{item.title}}</p>
    <div class="center">
      <img
        v-for="(item2,index) in item.cover"
        :src="$axios.defaults.baseURL+item2.url"
        alt
        :key="index"
      />
    </div>
    <p class="bottom">
      <span>{{item.user.nickname}}</span>
      <span>{{item.comment_length}}跟帖</span>
    </p>
  </router-link>
</template>

<script>
export default {
  props: ["item"]
};
</script>

<style lang='less' scoped>
@vw: 375 / 100vw;
.item_three {
  padding: 16 / @vw 8 / @vw;
  .top {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .center {
    display: flex;
    justify-content: space-between;
    img {
      padding: 8 / @vw 0;
      width: 32%;
      height: 90 / @vw;
      object-fit: cover;
    }
  }
  .bottom {
    font-size: 14px;
    color: #9799ac;
  }
}
</style>