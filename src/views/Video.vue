<template>
  <div>
    <video
      class="video"
      :poster="$axios.defaults.baseURL+post.cover[0].url"
      :src="$axios.defaults.baseURL+post.content"
      controls="controls"
    ></video>
    <div class="user">
      <div class="author">
        <img :src="$axios.defaults.baseURL+post.user.head_img" alt />
        <span>{{post.user.nickname}}</span>
      </div>
      <span class="follow yes" @click="hanldelAttention" v-if="post.has_follow">已关注</span>
      <span class="follow no" @click="hanldelAttention" v-else>关注</span>
    </div>
    <h5 class="title">{{post.title}}</h5>
    <div class="dianzan" @click="handleDianzan">
      <span class="iconfont icon-z-like" :class="post.has_like?'active':''">
        <span class="wenzi">{{post.like_length}}</span>
      </span>
      <span class="iconfont icon-weixin">微信</span>
    </div>
    <!-- 底部组件 -->
    <Bottombar :post="post" :token="token" />
  </div>
</template>

<script>
import Bottombar from "../components/bottombar";
export default {
  components: {
    Bottombar
  },
  data() {
    return {
      //  文章详情数据
      post: {
        user: {},
        cover: [{}]
      },
      //   令牌
      token: ""
    };
  },
  mounted() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
    this.token = userInfo.token;
    this.loadVideoData();
  },
  methods: {
    loadVideoData() {
      const config = {
        url: `/post/${this.$route.params.id}`,
        method: "get"
      };
      if (this.token) {
        config.headers = { Authorization: this.token };
      }
      this.$axios(config).then(res => {
        this.post = res.data.data;
      });
    },
    // 关注和取消关注两个接口
    hanldelAttention() {
      // 默认关注接口
      const config = {
        url: `/user_follows/${this.post.user.id}`,
        headers: { Authorization: this.token }
      };
      // 如果已经关注,调用取消关注地址
      if (this.post.has_follow) {
        config.url = `/user_unfollow/${this.post.user.id}`;
      }
      this.$axios(config).then(res => {
        this.$toast.success(res.data.message);
        // 更新vue数据
        this.post.has_follow = !this.post.has_follow;
      });
    },
    // 点赞接口
    handleDianzan() {
      this.$axios({
        url: `/post_like/${this.post.id}`,
        headers: { Authorization: this.token }
      }).then(res => {
        if (this.post.has_like) {
          this.post.like_length--;
        } else {
          this.post.like_length++;
        }
        this.$toast.success(res.data.message);
        this.post.has_like = !this.post.has_like;
      });
    }
  }
};
</script>

<style lang='less' scoped>
@vw: 375 / 100vw;
.video {
  // display: block;
  width: 100vw;
  // height: 225 / @vw;  不设置高度,让其自适应
}
.user {
  padding: 5 / @vw 10 / @vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .author {
    display: flex;
    align-items: center;
    img {
      border-radius: 50%;
      margin-right: 8 / @vw;
      width: 35 / @vw;
      height: 35 / @vw;
    }
  }
  .follow {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 8 / @vw;
    height: 32 / @vw;
    width: 70 / @vw;
    border-radius: 15 / @vw;
    font-size: 16 / @vw;
    &.yes {
      border: 1px solid #797979;
    }
    &.no {
      background-color: red;
      color: #fff;
    }
  }
}
.title {
  padding: 15 / @vw 12 / @vw;
}
.dianzan {
  padding: 5 / @vw 8 / @vw;
  background-color: #fff;
  display: flex;
  justify-content: center;
  .icon-z-like {
    padding: 5 / @vw 12 / @vw;
    margin-right: 25 / @vw;
    border: 1px solid #949494;
    border-radius: 20 / @vw;
    &.active {
      color: red;
    }
    .wenzi {
      color: black;
    }
  }
  .icon-weixin {
    padding: 5 / @vw 12 / @vw;
    border: 1px solid #949494;
    border-radius: 20 / @vw;
  }
}
</style>