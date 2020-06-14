<template>
  <div class="container">
    <div class="head">
      <span class="iconfont icon-xiazai6" @click="$router.back()"></span>
      <h5>精彩跟帖</h5>
      <span></span>
    </div>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :immediate-check="false"
    >
      <!-- 评论列表项 -->
      <div class="comment" v-for="(item,index) in list" :key="index">
        <div class="comment_top">
          <img :src="$axios.defaults.baseURL+item.user.head_img" alt />
          <div class="user">
            <p>{{item.user.nickname}}</p>
            <span>{{moment(item.create_date).fromNow()}}</span>
          </div>
          <span @click="handleReply(item)">回复</span>
        </div>
        <!-- 回复列表组件,将回复的数据传给子组件,如果没有数据就不显示组件 -->
        <Replybar @reply="handleEmit" v-if="item.parent" :data="item.parent" />
        <div class="comment_bottom">{{item.content}}</div>
      </div>
    </van-list>
    <div class="reply_box">
      <van-field
        @keyup.enter="publish"
        v-model="message"
        rows="1"
        autosize
        type="textarea"
        :placeholder="placeholder"
        ref="inputDom"
      />
      <span class="publish" @click="publish">发布</span>
    </div>
  </div>
</template>

<script>
import moment from "moment";
moment.locale("zh-cn");
import Replybar from "../components/replybar";
export default {
  components: {
    Replybar
  },
  data() {
    return {
      // 评论列表
      list: [],
      moment,
      // 分页列表开关
      loading: false,
      finished: false,
      pageIndex: 1,
      pageSize: 4,
      // 回帖框
      message: "",
      //   令牌
      token: "",
      // 回复评论父ID
      parent_id: "",
      // 评论框默认文字
      placeholder: "说点什么..."
    };
  },
  mounted() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
    this.token = userInfo.token;
    this.loadComments();
  },
  methods: {
    // 评论列表接口
    loadComments() {
      this.$axios({
        url: `/post_comment/${this.$route.params.id}`,
        params: {
          // 当前页数
          pageIndex: this.pageIndex,
          // 数据条数
          pageSize: 4
        }
      }).then(res => {
        const { data } = res.data;
        // 分页请求,旧数据与新数据拼接
        this.list = [...this.list, ...data];
        // 改变下一次请求页码
        this.pageIndex++;
        // 加载状态结束
        this.loading = false;
        // 数据全部加载完成,关闭触底事件
        if (data.length < this.pageSize) {
          this.finished = true;
        }
      });
    },
    // 触底事件
    onLoad() {
      this.loadComments();
    },
    // 点击外层回复
    handleReply(item) {
      this.parent_id = item.id;
      this.placeholder = "回复:@" + item.user.nickname;
      // 评论框主动聚焦
      this.$refs.inputDom.focus();
    },
    // 回复评论
    publish() {
      if (this.message == "") {
        this.$toast("请输入内容");
        return;
      }
      this.$axios({
        url: `/post_comment/${this.$route.params.id}`,
        method: "post",
        data: {
          content: this.message,
          parent_id: this.parent_id
        },
        headers: { Authorization: this.token }
      }).then(res => {
        this.$toast.success(res.data.message);
        this.message = "";
        this.placeholder = "说点什么...";
        // 刷新页面,清除列表相关数据
        this.pageIndex = 1;
        this.list = [];
        this.loadComments();
      });
    },
    // 内层回复(递归子组件的回复)
    handleEmit(val) {
      // 调用外层回复方法,修改参数值
      this.handleReply(val);
    }
  }
};
</script>

<style lang='less' scoped>
@vw: 375 / 100vw;
.container {
  padding-bottom: 28px;
}
.head {
  padding: 12 / @vw 15 / @vw;
  display: flex;
  justify-content: space-between;
}
.comment {
  padding: 16 / @vw 20 / @vw 0;
  border: 1px solid #dfdfdf;
  .comment_top {
    padding: 16 / @vw 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    img {
      width: 50 / @vw;
      height: 50 / @vw;
      object-fit: cover;
      border-radius: 50%;
    }
    .user {
      flex: 1;
      margin-left: 8 / @vw;
    }
  }
  .comment_bottom {
    padding: 15 / @vw 0;
  }
}
.reply_box {
  padding: 0 8 / @vw;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center;
  background-color: #fff;
  /deep/.van-field__body {
    padding: 0 8 / @vw;
    border-radius: 15 / @vw;
    background-color: #ededed;
  }
  .publish {
    white-space: nowrap;
    padding: 2 / @vw 5 / @vw;
    margin-right: 2 / @vw;
    border-radius: 12 / @vw;
    background-color: red;
    color: #fff;
    font-size: 15 / @vw;
  }
}
</style>