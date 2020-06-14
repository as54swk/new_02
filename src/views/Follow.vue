<template>
  <div>
    <div class="nav">
      <span class="iconfont icon-xiazai6" @click="$router.back()"></span>
      <h4>我的关注</h4>
      <span></span>
    </div>
    <div class="followList">
      <div class="list_item" v-for="(item,index) in listData" :key="item.id">
        <img :src="$axios.defaults.baseURL+item.head_img" alt />
        <div class="center">
          <h4>{{item.nickname}}</h4>
          <p>{{moment(item.create_date).format('YYYY-MM-DD')}}</p>
        </div>
        <div class="btn" @click="cancelFollow(item.id,index)">取消关注</div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      token: "",
      listData: [],
      moment
    };
  },
  mounted() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.token = userInfo.token;
    this.loadFollow();
  },
  methods: {
    // 关注用户列表接口
    loadFollow() {
      this.$axios({
        url: "/user_follows",
        method: "get",
        headers: { Authorization: this.token }
      }).then(res => {
        this.listData = res.data.data;
      });
    },
    // 取消关注
    cancelFollow(id, index) {
      this.$axios({
        url: `/user_unfollow/${id}`,
        method: "get",
        headers: { Authorization: this.token }
      }).then(res => {
        // 取消成功后,删除对应数据项,局部刷新
        this.listData.splice(index, 1);
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
.followList {
  .list_item {
    display: flex;
    align-items: center;
    padding: 25 / @vw 15 / @vw;
    border-bottom: 1px solid #b3b3b3;
    img {
      width: 70 / @vw;
      height: 70 / @vw;
      border-radius: 50%;
      object-fit: cover;
    }
    .center {
      flex: 1;
      margin-left: 10 / @vw;
    }
    .btn {
      padding: 5 / @vw 10 / @vw;
      background-color: #e0e0e0;
      border-radius: 20 / @vw;
    }
  }
}
</style>