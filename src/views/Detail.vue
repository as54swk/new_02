<template>
  <div class="container">
    <div class="head">
      <span class="iconfont icon-xiazai6" @click="$router.back()"></span>
      <span class="iconfont icon-new"></span>
      <span class="follow yes" @click="hanldelAttention" v-if="post.has_follow">已关注</span>
      <span class="follow no" @click="hanldelAttention" v-else>关注</span>
    </div>
    <h3 class="title">{{post.title}}</h3>
    <div class="author">
      <span>{{post.user.nickname}}</span>
      <span>{{moment(post.user.create_date).format('YYYY-MM-DD')}}</span>
    </div>
    <div class="content" v-html="post.content"></div>
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
import moment from "moment";
// 导入底部跟帖组件
import Bottombar from "../components/bottombar";
export default {
  components: {
    Bottombar
  },
  //   页面分登录未登录2种情况,当用户未登录想关注的时候,需登录才能操作,可通过响应拦截器,拦截未登录的状态码,进行页面跳转登录页实现
  data() {
    return {
      //  文章详情数据
      post: {
        user: {}
      },
      //   令牌
      token: "",
      moment
    };
  },
  mounted() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
    this.token = userInfo.token;
    this.loadDetail();
  },
  methods: {
    //   文章详情接口分为带token和不带token
    loadDetail() {
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
    // 收藏接口
    // handleStart() {
    //   this.$axios({
    //     url: `/post_star/${this.post.id}`,
    //     headers: { Authorization: this.token }
    //   }).then(res => {
    //     this.$toast.success(res.data.message);
    //     this.post.has_star = !this.post.has_star;
    //   });
    // }
  }
};
</script>

<style lang='less' scoped>
@vw: 375 / 100vw;
.container {
  padding-bottom: 50 / @vw;
}
.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8 / @vw;
  .icon-new {
    flex: 1;
    font-size: 50 / @vw;
    margin-left: 8 / @vw;
  }
  .follow {
    margin-right: 8 / @vw;
    text-align: center;
    padding: 3 / @vw;
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
  padding: 0 8 / @vw;
}
.author {
  padding: 5 / @vw 8 / @vw;
  font-size: 16 / @vw;
  color: #a59ea8;
  span:nth-child(1) {
    padding-right: 8 / @vw;
  }
}
.content {
  // 不是本页面原生的标签或类型,都可以通过deep来访问
  /deep/ img {
    width: 100%;
  }
}
.content,
.dianzan,
.bottom {
  padding: 5 / @vw 8 / @vw;
  background-color: #fff;
}
.dianzan {
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