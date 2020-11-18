<template>
  <div>
    <div id="tabs_change">
      <div class="tabs">
        <div v-for="(link,index) in links" @click="current = index"
             :class="['tab',index == current? 'current-tab': '']">
          <router-link :to="`/index/setting/${link.to}`">{{ link.text }}</router-link>
        </div>
      </div>
      <div class="t-iframe">
          <router-view />
      </div>
    </div>
  </div>
</template>
<script>


    export default {
        name: 'Setting',
        data() {
            return {
                current: 0,
                links: [
                    {
                        text: '打印设置',
                        to: 'printer'
                    },
                    {
                        text: '小票设置',
                        to: 'ticket'
                    },
                    {
                        text: '快捷键设置',
                        to: 'shortcut_key'
                    },
                    {
                        text: '参数设置',
                        to: 'parameter'
                    }
                ]
            }
        },
        mounted() {
            this.links.some((tab, index) => {
                if ( this.$route.path.includes(tab.to) ) {
                    this.current = index
                }
            })
        }
    }
</script>
<style lang="less">
  @import "setting.css";

  .tab {
    cursor: pointer;
    background-color: #e4e4e4;
    padding: 8px 10px;

    a {
      font-size: 18px;
      color: #68788c;
      text-decoration: none;
    }
  }

  .current-tab {
    background-color: #d0d0d0;
    font-weight: bold;
  }
</style>
