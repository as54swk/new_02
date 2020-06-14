import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 安装vant
import Vant, { Toast } from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);
// 安装axios
import axios from 'axios';
Vue.prototype.$axios = axios;
axios.defaults.baseURL = 'http://127.0.0.1:3000';
Vue.config.productionTip = false

// 响应拦截器,实现后台返回不同状态码的业务
axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  const { message, statusCode } = error.response.data;
  if (statusCode == 403) {
    //  详情页用户未登录,点击关注,发送请求返回的错误状态码
    Toast.fail(message);
    // router可携带详情页参数过去,登录完成后用于跳转到详情页
    router.replace({
      path: '/login',
      query: { fromUrl: app.$route.path }
    })
  }

  return Promise.reject(error);
});

let app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
