<template>
  <div>
    <div class="head">
      <span @click="$router.back()" class="iconfont icon-xiazai6"></span>
      <h5>编辑资料</h5>
      <span></span>
    </div>
    <div class="userImg">
      <img class="img" :src="$axios.defaults.baseURL+userDetail.head_img" alt />
      <!-- 上传图片vant组件 -->
      <van-uploader class="upload" :after-read="afterRead" />
    </div>
    <!-- 父传子,使用属性传值 -->
    <SetBar @click.native="showNickname=true" title="昵称" :name="userDetail.nickname" />
    <SetBar @click.native="showPassword=true" title="密码" name="******" />
    <SetBar @click.native="showGender=true" title="性别" :name="userDetail.gender" />
    <!-- 修改昵称弹出框,因为这里有多个弹出框,所以确认按钮事件@confirm单独写 -->
    <van-dialog v-model="showNickname" title="修改昵称" show-cancel-button @confirm="editNickname">
      <van-field v-model="userInfo.nickname" />
    </van-dialog>
    <!-- 修改密码弹出框 -->
    <van-dialog v-model="showPassword" title="修改密码" show-cancel-button @confirm="editPassword">
      <van-field type="password" v-model="userDetail.password" />
    </van-dialog>
    <!-- 修改性别上拉框 -->
    <van-action-sheet
      close-on-click-action
      v-model="showGender"
      :actions="actions"
      @select="onSelect"
    />
  </div>
</template>

<script>
// 导入组件
import SetBar from "../components/setBar";
export default {
  components: {
    SetBar
  },
  data() {
    return {
      userInfo: {
        id: "",
        token: "",
        nickname: ""
      },
      userDetail: {},
      // 昵称弹出框开关
      showNickname: false,
      // 密码弹出框开关
      showPassword: false,
      // 性别弹出框开关
      showGender: false,
      // 性别选项卡
      actions: [{ name: "男" }, { name: "女" }]
    };
  },
  mounted() {
    // 从本地获取用户的id
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.userInfo.id = userInfo.user.id;
    this.userInfo.token = userInfo.token;
    this.userInfo.nickname = userInfo.user.nickname;
    // 获取用户信息,回显到页面
    this.loadUserInfo();
  },
  methods: {
    // 用户信息接口
    loadUserInfo() {
      this.$axios({
        url: `/user/${this.userInfo.id}`,
        method: "GET",
        headers: { Authorization: this.userInfo.token }
      }).then(res => {
        const { gender } = res.data.data;
        this.userDetail = res.data.data;
        this.userDetail.gender = ["女", "男"].splice(gender, 1).join("");
      });
    },
    // 点击修改头像事件:上传图片功能&编辑图片
    async afterRead(file) {
      // 此时可以自行将文件上传至服务器,file.file才是图片真正的信息
      // 图片上传需使用formdata
      const formData = new FormData();
      formData.append("file", file.file);
      // 上传图片成功后再使用编辑图片接口
      const res = await this.uploadImg(formData);
      // 获取图片后台地址=>编辑图片
      const head_img = res.data.data.url;
      // 编辑图片接口
      this.editWays({ head_img: head_img });
    },
    // 上传图片接口-> 上传图片成功后再使用编辑图片接口
    uploadImg(formData) {
      return this.$axios({
        url: "/upload",
        method: "post",
        data: formData,
        headers: { Authorization: this.userInfo.token }
      });
    },
    // 编辑功能(图片,密码,昵称,性别)
    editWays(obj) {
      this.$axios({
        url: `/user_update/${this.userInfo.id}`,
        method: "post",
        headers: { Authorization: this.userInfo.token },
        data: obj
      }).then(res => {
        this.userDetail.head_img = res.data.data.head_img;
        // 编辑成功弹出框
        this.$toast.success("修改成功");
      });
    },
    // 修改姓名
    editNickname() {
      this.editWays({ nickname: this.userInfo.nickname });
      // 更新昵称数据
      this.userDetail.nickname = this.userInfo.nickname;
    },
    // 修改密码
    editPassword() {
      this.editWays({ password: this.userDetail.password });
    },
    // 点击性别按钮,上拉选择性别
    onSelect(item) {
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      this.editWays({ gender: item.name });
      this.userDetail.gender = item.name;
    }
  }
};
</script>

<style lang="less" scoped>
.head {
  padding: 0 5vw;
  display: flex;
  height: 7vh;
  align-items: center;
  justify-content: space-between;
}
.userImg {
  position: relative;
  margin: 5vw 0;
  padding-left: 5vw;
  display: flex;
  justify-content: center;
  .upload {
    position: absolute;
    opacity: 0;
  }
  .img {
    width: 25vw;
    height: 25vw;
    object-fit: cover;
    border-radius: 50%;
  }
}
.setting {
  padding-left: 5vw;
  &_item {
    display: flex;
    align-items: center;
    padding: 3vw 3vw 3vw 0;
    border-bottom: 1px solid #e5e5e5;
    justify-content: space-between;
  }
}
</style>