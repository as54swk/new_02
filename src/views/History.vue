<template>
  <div class="container">
    <div class="head">
      <span class="iconfont icon-xiazai6" @click="$router.back()"></span>
      <div class="search">
        <span class="iconfont icon-sousuo"></span>
        <input v-model="val" type="text" @keyup.enter="getKeyword" />
      </div>
      <span @click="getKeyword">搜索</span>
    </div>
    <div class="clear">
      <h3>历史记录</h3>
      <span @click="clearHistory" class="iconfont icon-guanbi"></span>
    </div>
    <div class="keyword">
      <span v-for="(item,index) in keywords" :key="index">{{item}}</span>
    </div>
    <!-- 搜索出的文章浮层 -->
    <div class="supernatant" v-if="isShow&&list.length>0">
      <div v-for="(item,index) in list" :key="index">
        <PostItem1 v-if="item.type==1&&item.cover.length==1" :item="item" />
        <PostItem2 v-else-if="item.type==2" :item="item" />
        <PostItem3 v-else :item="item" />
      </div>
    </div>
    <div v-if="isShow&&list.length==0" class="emputy">没有找到你想要的文章</div>
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
  name: "history",
  //  历史关键词通过本地存储实现
  data() {
    return {
      keywords: [],
      val: "",
      //   浮层开关
      isShow: false,
      //   搜索到的文章
      list: []
    };
  },
  watch: {
    //   输入框为空时候,隐藏浮层,清空文章
    val() {
      if (this.val == "") {
        this.list = [];
        this.isShow = false;
      }
    }
  },
  mounted() {
    // 初始化关键词数据
    this.keywords = JSON.parse(localStorage.getItem("keywords")) || [];
  },
  methods: {
    //   收集关键词,并调用搜索文章接口
    getKeyword() {
      this.keywords.unshift(this.val);
      //   存入本地
      localStorage.setItem("keywords", JSON.stringify(this.keywords));
      //   搜索文章接口
      this.$axios({
        url: "/post_search",
        method: "get",
        params: { keyword: this.val }
      }).then(res => {
        this.list = res.data.data;
        this.isShow = true;
      });
    },
    // 清除历史记录
    clearHistory() {
      this.keywords = [];
      localStorage.removeItem("keywords");
    }
  },
  // 局部路由守卫
  beforeRouteEnter(to, from, next) {
    //  通过 `vm` 访问组件实例
    next(vm => {
      // 如果是从首页进入搜索页面的,手动关闭浮层,清除val的值
      if (from.path == "/") {
        vm.isShow = false;
        vm.val = "";
      }
    });
  }
};
</script>

<style lang='less' scoped>
@vw: 375 / 100vw;
.container {
  height: 100%;
  position: relative;
  padding: 0 15 / @vw;
}
.head {
  height: 50 / @vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .search {
    margin: 0 20 / @vw;
    flex: 1;
    padding: 5 / @vw 10 / @vw;
    border: 1px solid #b8b8b8;
    border-radius: 20 / @vw;
    display: flex;
    align-items: center;
    input {
      border: none;
      width: 80%;
    }
  }
}
.clear {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.keyword {
  width: 95%;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  span {
    border: 1px solid pink;
    margin: 5 / @vw;
  }
}

.supernatant,
.emputy {
  position: absolute;
  width: 100%;
  left: 0;
  top: 50 / @vw;
  bottom: 0;
  background-color: #fff;
  // 给盒子加滚动条
  overflow-y: auto;
}
</style>