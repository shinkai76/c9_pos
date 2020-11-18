<template>
  <div id="key">
    <div class="left">
      <ol>
        <li class="item">
          <span>默认会员：</span>
          <div class="block">
            <input type="text" v-model="keys.member_id.name" @keyup.enter="openMember">
            <i class="fa fa-search" @click="openMember"></i>
          </div>
        </li>
      </ol>
      <div class="buttons" id="save">
        <button class="t-button b-yellow" @click="save_key">保存</button>
      </div>
    </div>
    <div class="right">
      <ul class="results" v-if="showSearch">
        <li v-for="item in items" @click="select(item)">{{ item.name }}</li>
      </ul>
      <span v-if="showSearch&&!items.length">无结果</span>
    </div>
  </div>
</template>
<script>
    export default {
        name: 'Parameter',
        data() {
            return {
                keys: {
                    "member_id": {
                        value: "",
                        name: ""
                    }
                },
                showSearch: false,
                items: [],
                header_names: [{ name: "项目", width: "30%" }, { name: "默认值", width: "70%" }]
            }
        },
        mounted() {
            this.init()
        },
        methods: {
            save_key: function () {
                window.localStorage.setItem('parameter', JSON.stringify(this.keys))
                this.items = []
                this.showSearch = false
                alert('已保存，重新登录系统后生效')
            },
            init: function () {
                if ( window.localStorage.getItem('parameter') )
                    this.keys = JSON.parse(window.localStorage.getItem('parameter'))
            },
            openMember() {
                this.showSearch = true
                this.$axios({
                    url: '/api/members',
                    params: {
                        'name__icontains__or__card_no__icontains__or__mobile_phone__icontains': this.keys.member_id.name
                    }
                }).then(res => {
                    this.items = []
                    if ( res.success ) {
                        this.items = res.root
                    }
                })
            },
            select(item) {
                this.keys.member_id.name = item.name
                this.keys.member_id.value = item.id
            }
        }
    }
</script>
<style lang="less" scoped>
  #key {
    display: flex;

    .left, .right {
      width: 50%;
    }

    .results {
      list-style: none;
      height: 300px;
      overflow-y: auto;
      background-color: #f1f1f1;

      li {
        font-size: 18px;
        margin: 7px 0;
        cursor: pointer;
      }
    }
  }

  .item .block {
    input[type='text'] {
      font-size: 16px;
    }

    .fa {
      font-size: 20px;
      margin-left: 6px;
      color: #5375b5;
    }
  }
</style>
