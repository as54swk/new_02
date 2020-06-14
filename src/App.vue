<template>
  <div id="app">
    <!-- keep-alive包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们 -->
    <!-- include需要指定缓存哪个页面的组件,取页面组件的name值 -->
    <!-- 如果不想要这种缓存结果,使用局部路由守卫手动处理 -->
    <keep-alive include="index,history">
      <router-view />
    </keep-alive>
  </div>
</template>

<style lang="less">
// 根组件里面设置公共样式
// 导入字体图标,@import是css原生引入写法
@import url("//at.alicdn.com/t/font_1712207_xnjb13c4fk.css");
body,
html,
#app {
  height: 100%;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
a {
  color: inherit;
  text-decoration: none;
}
a:hover {
  color: inherit;
}
li {
  list-style: none;
}
i,
em {
  font-style: normal;
}
</style>
