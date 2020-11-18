<template>
  <div class="key-wrap">
    <div id="key">
      <table class="t-table">
        <thead>
        <tr>
          <th v-for="header in init_data.header_names" :width="header.width">{{ header.name }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(value, key) in init_data.keys">
          <th>{{ key }}</th>
          <th><input type="text" v-model="value.value" @keydown="keydown(key,$event)" /></th>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="buttons" id="save">
      <button class="t-button b-yellow" @click="save_key">保存</button>
    </div>
  </div>
</template>
<script>
    export default {
        name: 'ShortcutKey',
        data() {
            return {
                name: "keys",
                is_store: false,
                init_data: {
                    keys: {
                        "结账": {
                            value: "", key_code: ""
                        },
                        "退货": {
                            value: "", key_code: ""
                        },
                        "数量": {
                            value: "", key_code: ""
                        },
                        "改价": {
                            value: "", key_code: ""
                        },
                        "折扣": {
                            value: "", key_code: ""
                        },
                        "会员": {
                            value: "", key_code: ""
                        },
                        "删行": {
                            value: "", key_code: ""
                        },
                        "删单": {
                            value: "", key_code: ""
                        },
                        "挂单": {
                            value: "", key_code: ""
                        },
                        "钱箱": {
                            value: "", key_code: ""
                        },
                        "默认会员": {
                            value: "", key_code: ""
                        }
                    },
                    header_names: [{ name: "功能", width: "30%" }, { name: "快捷键", width: "70%" }]

                }
            }
        },
        mounted() {
            this.init()
        },
        methods: {
            save_key: function () {
                window.localStorage.setItem('hotkey', JSON.stringify(this.init_data.keys))
                alert('快捷键保存成功')
            },
            init: function () {
                if ( window.localStorage.getItem('hotkey') ) {
                    this.init_data.keys = JSON.parse(window.localStorage.getItem('hotkey'))
                }
            },
            keydown: function (key, event) {
                this.init_data.keys[key].value = event.code;
                this.init_data.keys[key].key_code = event.keyCode;
            }
        }
    }
</script>
<style lang="less">
  .key-wrap {
    overflow-y: auto;
    height: 100%;
  }
</style>
