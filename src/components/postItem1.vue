<template>
  <router-link :to="'/detail/'+item.id">
    <!-- 单张图 -->
    <div class="item_one">
      <div class="left">
        <p class="content">{{item.title}}</p>
        <div class="gentie">
          <span>{{item.user.nickname}}</span>
          <span>{{item.comment_length}}跟帖</span>
        </div>
      </div>
      <img :src="$axios.defaults.baseURL+item.cover[0].url" alt />
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
.item_one {
  display: flex;
  padding: 16 / @vw 8 / @vw;
  align-items: center;
  .left {
    flex: 1;
    .content {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .gentie {
      font-size: 14px;
      color: #9799ac;
    }
  }
  img {
    width: 150 / @vw;
    height: 90 / @vw;
    object-fit: cover;
  }
}
</style>