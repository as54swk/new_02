<template>
  <div class="setting">
    <div class="setting_item">
      <span>{{title}}</span>
      <div class="right">
        <span>{{name}}</span>
        <span class="iconfont icon-arrow"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["title", "name"]
};
</script>

<style lang="less" scoped>
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