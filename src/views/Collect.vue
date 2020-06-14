<template>
  <div>
    <div class="nav">
      <span class="iconfont icon-xiazai6" @click="$router.back()"></span>
      <h4>我的收藏</h4>
      <span></span>
    </div>
    <div class="list">
      <div v-for="(item,index) in listData" :key="index">
        <!-- 单张图 -->
        <div v-if="item.cover.length==1" class="item_one">
          <div class="left">
            <p class="content">{{item.title}}</p>
            <div class="gentie">
              <span>{{item.user.nickname}}</span>
              <span>{{item.comments.length}}跟帖</span>
            </div>
          </div>
          <img :src="$axios.defaults.baseURL+item.cover[0].url" alt />
        </div>
        <!-- 三张图 -->
        <div v-else class="item_three">
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
            <span>{{item.comments.length}}跟帖</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      token: "",
      listData: []
    };
  },
  mounted() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.token = userInfo.token;
    this.loadCollect();
  },
  methods: {
    // 用户收藏列表接口
    loadCollect() {
      this.$axios({
        url: "/user_star",
        method: "get",
        headers: { Authorization: this.token }
      }).then(res => {
        console.log(res);
        this.listData = res.data.data;
      });
    }
  }
};
</script>

<style lang='less' scoped>
// 设置自适应vw变量
@vw: 375 /100vw;
.nav {
  display: flex;
  justify-content: space-between;
  padding: 15 / @vw;
}
.list {
  .item_one {
    display: flex;
    padding: 8 / @vw;
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
      height: 80 / @vw;
      object-fit: cover;
    }
  }
  .item_three {
    padding: 8 / @vw;
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
}
</style>