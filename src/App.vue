<template>
  <div id="app">
    <main v-cloak>
      <keep-alive>
        <router-view />
      </keep-alive>
    </main>
  </div>
</template>
<style lang="less">
  @import "./css/main.css";

  [v-cloak] {
    display: none;
  }

  #app, main, #index {
    height: 100%;
    width: 100%;
  }
</style>
