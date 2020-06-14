<template>
  <div>
    <div class="head">
      <span class="iconfont icon-new"></span>
      <div class="search" @click="$router.push('/history')">
        <span class="iconfont icon-sousuo"></span>
        <span>搜索新闻</span>
      </div>
      <span @click="$router.push('/personal')" class="iconfont icon-wode"></span>
    </div>
    <!-- 栏目导航 -->
    <van-tabs class="nav_box" v-model="active" sticky @scroll="onScroll">
      <van-tab
        class="nav"
        v-if="item.is_top==1"
        v-for="(item,index) in columns"
        :title="item.name"
        :key="index"
      >
        <van-list
          v-model="item.loading"
          :finished="item.finished"
          finished-text="没有更多了"
          @load="onLoad"
          :immediate-check="false"
        >
          <div v-for="(item,index) in columns[active].list" :key="index">
            <PostItem1 v-if="item.type==1&&item.cover.length==1" :item="item" />
            <PostItem2 v-else-if="item.type==2" :item="item" />
            <PostItem3 v-else :item="item" />
          </div>
        </van-list>
      </van-tab>
      <span class="iconfont icon-nav" @click="$router.push('/category')"></span>
    </van-tabs>
  </div>
</template>

<script>
// 引入文章项组件
import PostItem1 from "../components/postItem1";
import PostItem2 from "../components/postItem2";
import PostItem3 from "../components/postItem3";
export default {
  components: {
    PostItem1,
    PostItem2,
    PostItem3
  },
  name: "index",
  data() {
    return {
      token: "",
      //   栏目数据
      columns: [],
      // 被选中的tab项
      active: 0
    };
  },
  watch: {
    // 监听栏目项
    async active() {
      // 重新请求文章列表
      await this.loadArticleData();
      // 跳转到对应栏目历史高度,需要在文章列表渲染后才能跳转
      window.scrollTo(0, this.columns[this.active].scrollY);
    }
  },
  mounted() {
    this.reload();
  },
  methods: {
    // 初始化页面
    async reload() {
      //   获取本地token
      const { token } = JSON.parse(localStorage.getItem("userInfo")) || {};
      this.token = token;
      // 处理栏目数据,更新到vue中
      const columns = JSON.parse(localStorage.getItem("columns")) || "";
      this.columns = columns;
      // 没有数据情况
      if (!columns) {
        // 重新请求栏目数据,并存入本地
        await this.loadColumns();
        // 处理栏目数据,添加每一页的独立数据
        this.disposeColumnsData();
        // 获取文章列表数据
        this.loadArticleData();
      } else {
        // 本地有数据,判断是否与登录状态匹配(登录->关注,未登录->头条)
        if (
          (token && this.columns[0].name !== "关注") ||
          (!token && this.columns[0].name == "关注")
        ) {
          await this.loadColumns();
          this.disposeColumnsData();
          this.loadArticleData();
        } else {
          this.disposeColumnsData();
          this.loadArticleData();
        }
      }
    },
    // 获取栏目数据:分登录情况和未登录情况
    loadColumns() {
      //  未登录请求参数
      const config = {
        url: "/category",
        method: "get"
      };
      // 登录情况下,增加请求头参数
      if (this.token) {
        config.headers = { Authorization: this.token };
      }
      this.$axios(config).then(res => {
        this.columns = res.data.data;
        // 将栏目数据存入本地,为了后面操作管理栏目页面,相当于全局数据管理
        localStorage.setItem("columns", JSON.stringify(this.columns));
      });
    },
    // 获取文章列表数据,区别登录和未登录情况
    loadArticleData() {
      // 解构出对应栏目需要的数据
      const { loading, finished, pageIndex, id, isLoad } = this.columns[
        this.active
      ];
      // ----------------------------------------------------------------------------
      // 如果finished是vant组件控制的,好像有点问题,现在自己设置一个加载开关,用于控制请求
      if (isLoad) return;
      // if (finished) return;
      this.columns[this.active].isLoad = true;
      // 发起后一页请求,拼接对应栏目新旧数据
      this.columns[this.active].pageIndex++;
      //未登录请求参数
      const config = {
        url: "/post",
        method: "get",
        params: {
          category: id,
          pageIndex,
          pageSize: 5
        }
      };
      // 登录情况下,增加请求头参数
      if (this.token) {
        config.headers = { Authorization: this.token };
      }
      this.$axios(config).then(res => {
        const { data, total } = res.data;
        // 改变vue中的数组中的某项索引的值,视图不会更新
        this.columns[this.active].list = [
          ...this.columns[this.active].list,
          ...data
        ];
        //  更新视图重新赋值或者使用$set
        this.columns = [...this.columns];
        // 处理加载状态,并将数据继续更新在栏目数据中
        this.columns[this.active].loading = false;
        if (this.columns[this.active].list.length == total) {
          this.columns[this.active].finished = true;
        }
        // 当代码流程执行完毕的时候,才打开加载开关,用于下次触底请求
        this.columns[this.active].isLoad = false;
      });
    },
    // 滚动触底事件
    onLoad() {
      this.loadArticleData();
    },
    // 处理栏目数据,给每个栏目加初始list,loading,finished,pageIndex
    disposeColumnsData() {
      this.columns.forEach(item => {
        item.list = [];
        item.loading = false;
        item.finished = false;
        item.pageIndex = 1;
        item.isLoad = false;
        item.scrollY = 0;
      });
    },
    // vant组件自带滚动时候触发事件(浏览器原生方法:window.scrollY,window.scrollTo)
    onScroll(val) {
      // 获取滚动条高度
      const { scrollTop } = val;
      // 因为滚动一进来就触发了事件,但是数据未初始化好,所以需要判断数据是否初始化完成
      if (this.columns.length == 0) return;
      // 更新当前栏目页的滚动高度
      this.columns[this.active].scrollY = scrollTop;
    }
  },
  // 不希望从栏目管理页面回来,页面keep-alive缓存,希望为第一个栏目,而且成功回显栏目增删改
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.path == "/category") {
        vm.active = 0;
        vm.reload();
      }
    });
  }
};
</script>

<style lang="less" scoped>
@vw: 375 / 100vw;
.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10 / @vw 20 / @vw;
  background-color: #ff0000;
  color: #fff;
  .icon-new {
    font-size: 30 / @vw;
    transform: scale(1.8);
  }
  .search {
    padding: 5 / @vw 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 230 / @vw;
    background-color: #f87979;
    // color: #fff;
    border-radius: 20 / @vw;
  }
  .icon-wode {
    font-size: 28 / @vw;
  }
}
.nav_box {
  position: relative;
  // padding-right: 36 / @vw;
  /deep/.van-tabs__wrap {
    background-color: #e4e4e4;
    height: 50 / @vw;
    padding-right: 25 / @vw;
  }
  /deep/ .van-tabs__nav {
    background-color: inherit;
  }
  .icon-nav {
    display: flex;
    align-items: center;
    padding-right: 10 / @vw;
    position: absolute;
    right: 0;
    top: 0;
    font-size: 18 / @vw;
    // padding: 12 / @vw;
    height: 50 / @vw;
    background-color: #e4e4e4;
  }
}
</style>