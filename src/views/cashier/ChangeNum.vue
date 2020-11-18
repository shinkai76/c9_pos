<template>
  <div id="checkout">
    <div class="c-bottom">
      <div class="c-bom-left">
        <div class="c-input">
          <input
              type="text"
              v-model.trim="num"
              :placeholder="name"
              autofocus
              id="num"
              @keyup.enter="confirm"
          />
          <button class="t-button" @click="delete_one"><i class="fa fa-arrow-left delete_end" aria-hidden="true"></i>
          </button>
          <div class="clear"></div>
        </div>
        <div class="c-num-btns">
          <ul class="box num_box">
            <li><a href="#" title="1" @click="change_amount(1)">1</a></li>
            <li><a href="#" title="2" @click="change_amount(2)">2</a></li>
            <li><a href="#" title="3" @click="change_amount(3)">3</a></li>
            <li><a href="#"></a></li>
            <li><a href="#" title="4" @click="change_amount(4)">4</a></li>
            <li><a href="#" title="5" @click="change_amount(5)">5</a></li>
            <li><a href="#" title="6" @click="change_amount(6)">6</a></li>
            <li><a href="#"></a></li>
            <li><a href="#" title="7" @click="change_amount(7)">7</a></li>
            <li><a href="#" title="8" @click="change_amount(8)">8</a></li>
            <li><a href="#" title="9" @click="change_amount(9)">9</a></li>
            <li><a href="#" title="退格" @click="delete_amount">清空</a></li>
            <li><a href="#" title="00" @click="change_amount('00')">00</a></li>
            <li><a href="#" title="0" @click="change_amount(0)">0</a></li>
            <li><a href="#" title="." @click="change_amount('.')">.</a></li>
            <li><a href="#" title="确认" @click="confirm" class="calc_confirm">确认</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: 'ChangeNum',
        data() {
            return {
                num: "",
                name: "数量"
            }
        },
        methods: {
            init: function () {
                var _name = {
                    "quantity": "数量",
                    "tax_price": "价格",
                    "barcode": "产品码"
                };
                this.num = "";
                this.name = "请输入" + _name[this.$parent.$data.change_key];
                window.focus();
                document.getElementById("num").focus();
            },
            delete_one: function () {
                var num = this.num + "";
                this.num = num.substr(0, num.length - 1)
            },
            change_amount: function (num) {
                this.num += num;
            },
            delete_amount: function () {
                this.num = "";
            },
            confirm: function () {
                if ( !this.num ) return;
                if ( this.$parent.$data.change_key == "barcode" ) {
                    this.$parent.$data.barcode = this.num;
                    this.$parent.search_pro();
                    return;
                }
                this.$parent.change_pro(this.$parent.$data.change_key, this.num);
                this.num = ''
            }
        }
    }
</script>
<style>
  @import "cashier.css";
</style>
