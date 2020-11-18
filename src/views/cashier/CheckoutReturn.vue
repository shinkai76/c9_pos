<template>
  <div id="checkout" v-hotkey="keymap">
    <div class="c-top">
      <div class="c-top-title">选择退款方式</div>
      <div class="c-top-btns" id="tab_chose">
        <div v-for="(type, index) in payment_types">
          <input type="radio" name="payment_type" :value="index" @click="chose_payment(index)" />
          <ul>{{type.name }}</ul>
        </div>
      </div>
      <div class="c-hr"></div>
    </div>
    <div class="c-bottom">
      <div class="c-bom-left">
        <div>退款：¥ {{h_amount}}</div>
      </div>
      <div class="c-bom-right">
        <div class="c-input">
          <input type="text" v-model="h_amount" @keyup.enter="check_out" id="other_pay" />
          <button class="t-button" @click="delete_amount"><i class="fa fa-arrow-left delete_end" aria-hidden="true"></i>
          </button>
          <div class="clear"></div>
        </div>
        <div class="c-num-btns">
          <ul class="box">
            <li><a href="#" title="确认" @click="check_out">确认</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

    export default {
        name: 'CheckoutReturn',
        data() {
            return {
                payment_types: this.$store.state.payment_type_ids,
                s_amount: "",
                h_amount: "",
                payment_type_id: ""
            }
        },
        mounted() {
            this.init()
        },
        computed: {
            keymap () {
                return {
                    'tab': this.tabKey
                }
            }
        },
        methods: {
            change_amount: function (num) {
                this.h_amount += num;
            },
            delete_amount: function () {
                var str = this.h_amount.toString();
                str = str.substring(0, str.length - 1);
                this.h_amount = str;
            },
            tabKey(){
                var inputs = document.getElementById("tab_chose").getElementsByTagName('input');
                var _index = 0;
                var _arry = Object.keys(this.payment_types);
                for ( var key of _arry ) {
                    _index++;
                    if ( key == this.payment_type_id ) {
                        break;
                    }
                }
                if ( _index >= _arry.length ) _index = 0;
                inputs[_index].click();
            },
            init: function () {
                this.h_amount = this.$parent.$data.total_amount;
                var inputs = document.getElementById("tab_chose").getElementsByTagName('input');
                window.focus();
                inputs[0].click();
            },
            check_out: function () {
                var _this = this;
                if ( !_this.payment_type_id ) {
                    alert("请先选择收款方式");
                    return;
                }
                this.$parent.$data.payment_type_id = _this.payment_type_id;
                this.$parent.$data.payment_type_name = this.payment_types[this.payment_type_id].name;
                this.$parent.check_out();

            },
            chose_payment: function (value) {
                this.payment_type_id = value;
                document.getElementById("other_pay").focus();
            }
        }
    }
</script>
<style>
  @import "cashier.css";
</style>
