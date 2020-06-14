<template>
  <div>
    <div class="iconfont icon-new"></div>
    <van-form @submit="onSubmit">
      <van-field
        v-model="form.username"
        placeholder="用户名/手机号"
        :rules="[{pattern, required: true, message: '请填写正确的手机号' }]"
      />
      <van-field
        v-model="form.nickname"
        placeholder="昵称"
        :rules="[{ required: true, message: '请输入昵称' }]"
      />
      <van-field
        v-model="form.password"
        type="password"
        placeholder="密码"
        :rules="[{ required: true, message: '请输入密码' }]"
      />
      <div style="margin: 16px;">
        <van-button class="btn" round block type="info" native-type="submit">注册</van-button>
      </div>
    </van-form>
    <div style="margin: 16px;">
      <router-link to="/login">
        <van-button round block>登录</van-button>
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
        password: "",
        nickname: ""
      },
      pattern: /^[1]([3-9])[0-9]{9}$/
    };
  },
  methods: {
    // 点击注册,调用注册接口
    onSubmit() {
      this.$axios({
        url: "/register",
        method: "post",
        data: this.form
      }).then(res => {
        const { message } = res.data;
        // 注册成功弹窗提示
        this.$toast({
          type: "success",
          message
        });
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
</style>
