<template>
  <div>
    <!-- 头部 -->
    <div class="head" @click="$router.push('/edit')">
      <img :src="$axios.defaults.baseURL+userDetail.head_img" alt />
      <div class="userInfo">
        <span
          class="iconfont"
          :class="['icon-xingbienv','icon-xingbienan'].splice(userDetail.gender,1).join('')"
        ></span>
        <span>{{userDetail.nickname}}</span>
        <div class="time">{{ moment(userDetail.create_date).format('YYYY-MM-DD')}}</div>
      </div>
      <span class="iconfont icon-arrow"></span>
    </div>
    <!-- 用户设置 -->
    <div class="setting">
      <div
        class="setting_item"
        v-for="(item,index) in setData"
        :key="index"
        @click="$router.push(item.path)"
      >
        <span>{{item.title}}</span>
        <div>
          <span>{{item.content}}</span>
          <span class="iconfont icon-arrow"></span>
        </div>
      </div>
      <!-- 退出按钮 -->
      <div class="setting_item" @click="handleExit">
        <span>退出</span>
        <div>
          <span></span>
          <span class="iconfont icon-arrow"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 安装moment
import moment from "moment";
export default {
  data() {
    return {
      setData: [
        { title: "我的关注", content: "关注的用户", path: "/follow" },
        { title: "我的跟帖", content: "跟帖/回复", path: "/" },
        { title: "我的收藏", content: "文章/视频", path: "/collect" }
      ],
      //   用户信息
      userInfo: {},
      userDetail: {},
      moment
    };
  },
  mounted() {
    // 获取本地存储信息
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    // 更新到vue中
    this.userInfo = userInfo;
    // 用户详情回显
    this.loadUserInfo();
  },
  methods: {
    //   用户详情接口
    loadUserInfo() {
      this.$axios({
        url: `/user/${this.userInfo.user.id}`,
        method: "get",
        headers: { Authorization: this.userInfo.token }
      }).then(res => {
        this.userDetail = res.data.data;
      });
    },
    // 退出功能
    handleExit() {
      this.$dialog
        .confirm({
          title: "确定退出?"
        })
        .then(() => {
          this.$router.replace("/login");
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang='less' scoped>
.head {
  padding: 10vw 5vw;
  display: flex;
  align-items: center;
  img {
    width: 25vw;
    height: 25vw;
    object-fit: cover;
    border-radius: 50%;
  }
  .userInfo {
    margin-left: 2vw;
    flex: 1;
    .icon-xingbienv {
      &::before {
        color: #ff3ec9;
      }
    }
    .icon-xingbienan {
      &::before {
        color: #72b8eb;
      }
    }
    .time {
      padding-top: 1vw;
    }
  }
}
.setting {
  padding-left: 5vw;
  &_item {
    padding: 3vw 5vw 3vw 0;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #e4e4e4;
  }
}
</style>