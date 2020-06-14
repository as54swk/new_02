<template>
  <div>
    <div class="iconfont icon-new"></div>
    <van-form @submit="onSubmit">
      <van-field
        v-model="form.username"
        name="手机号"
        label="手机号"
        placeholder="手机号"
        :rules="[{ required: true, message: '请填写手机号' }]"
      />
      <van-field
        v-model="form.password"
        type="password"
        name="密码"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请输入密码' }]"
      />
      <div style="margin: 16px;">
        <van-button class="btn" round block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>
    <div style="margin: 16px;">
      <!-- 点击注册跳转注册页面 -->
      <router-link to="/register">
        <van-button class="btn_register" round block>注册</van-button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
    // 点击登录,调用登录接口
    onSubmit() {
      this.$axios({
        url: "/login",
        method: "post",
        data: this.form
      }).then(res => {
        const { message } = res.data;
        // 登录成功弹窗提示
        this.$toast({
          type: "success",
          message
        });
        // 跳转主页,将数据存入本地
        localStorage.setItem("userInfo", JSON.stringify(res.data.data));
        const { fromUrl } = this.$route.query;
        // 判断是否有fromUrl,有的话,代表从文章详情页过来的
        this.$router.push(fromUrl || "/");
      });
    }
  }
};
</script>
<style lang="less" scoped>
.iconfont {
  height: 30vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30vw;
  color: #cc3300;
}
.btn {
  background-color: #cc3300;
  border: none;
}
// .btn_register{
//   background-color: #fff;
// }
</style>
