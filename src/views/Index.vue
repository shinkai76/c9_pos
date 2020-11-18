<template>
  <div id="index" v-hotkey="indexKeyMap">
    <div class="main-top" id="userinfo">
      <div class="main-logo">C8零售收银系统</div>
      <span class="main-btns" @click="relogin()">退出</span>
      <div class="main-info">
        当前用户：<span>{{ $store.state.user_name }}</span>
      </div>
    </div>
    <div class="main-bottom">
      <div class="main-bottom-left">
        <div
            v-for="(link,index) in tabs"
            @click="current = index"
            :id="'tab-' + tabs.to"
            :class="['link', index == current? 'current-tab': '']"
        >
          <router-link :to="`/index/${link.to}`">{{ link.text }}</router-link>
        </div>
      </div>

      <div class="main-bottom-right">
        <keep-alive>
          <router-view />
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                current: 0,
                id: '',
                show: false,
                showConfirm: false,
                info: "welcome",
                tabs: [
                    {
                        to: 'cashier',
                        text: '收银台'
                    },
                    {
                        to: 'stock',
                        text: '库存'
                    },
                    {
                        to: 'trade',
                        text: '交易'
                    },
                    {
                        to: 'setting',
                        text: '系统设置'
                    }
                ]
            }
        },
        created() {
            this.init()
        },
        computed: {
            indexKeyMap () {
                return {
                    'F1': this.routerChange,
                    'F2': this.routerChange,
                    'F3': this.routerChange,
                    'F4': this.routerChange,
                    'F7': this.relogin,
                }
            }
        },
        mounted() {
            this.tabs.some((tab, index) => {
                if ( this.$route.path.includes(tab.to) ) {
                    this.current = index
                }
            })
        },
        watch: {
            '$route.path':{
                handler(cur){
                    this.tabs.some((tab, index) => {
                        if ( cur.includes(tab.to) ) {
                            this.current = index
                        }
                    })
                }
            }
        },
        methods: {
            routerChange(e){
                let name = ''
                if (e.keyCode == 112) {
                    name = 'cashier'
                }
                if (e.keyCode == 113) {
                    name = 'stock'
                }
                if (e.keyCode == 114) {
                    name = 'cashier'
                }
                if (e.keyCode == 115) {
                    name = 'setting'
                }
                this.$router.push({
                    path: `/index/${name}`,
                    query: { t: +new Date() }
                })
            },
            relogin: function () {
                this.$router.push('/')
                sessionStorage.removeItem('Token')
            },
            init: function () {
                this.get_products()
                this.get_stores()
            },
            get_products: function () {
                this.$axios({
                    url: `/api/products`
                }).then(res => {
                    if ( !res.success ) {
                        return alert('获取商品出错')
                    }
                    let pros = {}
                    res.root.map(item => {
                        pros[item.id] = item.name
                    })
                    this.$store.commit('INIT_PROS', pros)
                })
            },
            get_stores: function () {
                this.$axios({
                    url: `/api/stores`
                }).then(res => {
                    if ( !res.success ) {
                        return alert('获取仓库出错')
                    }
                    let stores = {}
                    res.root.map(item => {
                        stores[item.id] = item.name
                    })
                    this.$store.commit('INIT_STORES', stores)
                })
            }
        }
    }
</script>

<style lang="less">
  @import "../css/main.css";

  .current-tab {
    background-color: #d0d0d0;

    a {
      color: #000;
    }
  }
</style>
