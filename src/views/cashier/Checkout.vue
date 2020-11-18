<template>
  <div id="checkout" v-hotkey="keymap">
    <div class="c-top">
      <div class="c-top-title">选择收款方式</div>
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
        <div>应收金额：¥ {{s_amount}}</div>
        <div>已收金额：¥ {{h_amount}}</div>
        <div>找零：¥ {{h_amount - s_amount}}</div>
        <div v-show="weixin_alipay_show">支付条码：<input type="text" id="weixin_alipay" v-model="auth_code"
                                                     @keyup.enter="weixin_alipay" /></div>
      </div>
      <div class="c-bom-right">
        <div class="c-input">
          <input type="text" v-model="h_amount" id="other_pay" @keyup.enter="check_out" />
          <button class="t-button" @click="delete_amount">
            <i class="fa fa-arrow-left delete_end" aria-hidden="true"></i>
          </button>
          <div class="clear"></div>
        </div>
        <div class="c-num-btns">
          <ul class="box">
            <li><a href="#" title="1" @click="change_amount(1)">1</a></li>
            <li><a href="#" title="2" @click="change_amount(2)">2</a></li>
            <li><a href="#" title="3" @click="change_amount(3)">3</a></li>
            <li><a href="#" title="4" @click="change_amount(4)">4</a></li>
            <li><a href="#" title="5" @click="change_amount(5)">5</a></li>
            <li><a href="#" title="6" @click="change_amount(6)">6</a></li>
            <li><a href="#" title="7" @click="change_amount(7)">7</a></li>
            <li><a href="#" title="8" @click="change_amount(8)">8</a></li>
            <li><a href="#" title="9" @click="change_amount(9)">9</a></li>
            <li><a href="#" title="0" @click="change_amount(0)">0</a></li>
            <li><a href="#" title="." @click="change_amount('.')">.</a></li>
            <li><a href="#" title="确认" @click="check_out" class="calc_confirm">确认</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>


    export default {
        name: 'Checkout',
        data() {
            return {
                payment_types: this.$store.state.payment_type_ids,
                s_amount: "",
                h_amount: "",
                payment_type_id: "",
                auth_code: null,
                weixin_alipay_show: false
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
            chose_payment: function (value) {
                this.payment_type_id = value;
                var _type = this.payment_types[value]?this.payment_types[value].payment_type: '';
                if ( _type == 4 || _type == 3 ) {//3:支付宝，4:微信
                    document.getElementById("weixin_alipay").focus();
                }
                else {
                    document.getElementById("other_pay").focus();
                }
            },
            tabKey(){
                var _index = 0;
                var _arry = Object.keys(this.payment_types);
                for ( var key of _arry ) {
                    _index++;
                    if ( key == this.payment_type_id ) {
                        break;
                    }
                }
                if ( _index >= _arry.length ) _index = 0;
                this.chose_payment(_index)
            },
            init: function () {
                var _this = this;
                _this.auth_code = "";
                window.focus();
                this.chose_payment(0)
                _this.s_amount = this.$parent.$data.total_amount;
                _this.h_amount = _this.s_amount;
                for ( var key_id in _this.payment_types ) {
                    var _type = _this.payment_types[key_id].payment_type;
                    if ( _this == 4 || _type == 3 ) {//3:支付宝，4:微信
                        this.weixin_alipay_show = true;
                        return;
                    }
                }
            },
            check_out: function () {
                var _this = this;
                if ( !_this.payment_type_id ) {
                    alert("请先选择收款方式");
                    return;
                }
                if ( Number(this.h_amount) < Number(this.s_amount) ) {
                    if ( confirm("应收金额不够不能提交订单") ) {
                        _this.upload();
                    }
                    else {
                        window.focus();
                        document.getElementById('other_pay').focus();
                    }
                }
                else {
                    _this.upload();
                }
            },
            weixin_alipay: function () {
                var _this = this;
                var out_trade_no = this.$parent.get_no();
                var data = {
                    body: "c8erp零售端支付",
                    out_trade_no: out_trade_no,
                    auth_code: _this.auth_code,
                    total_fee: _this.h_amount * 100
                };
                var name = "wechat",
                  _paytype = _this.payment_types[_this.payment_type_id].payment_type;
                if ( _paytype == 3 )
                    name = "alipay";

                this.$axios({
                    url: "/api/pays?action=" + name,
                    method: "POST",
                    data: JSON.stringify(data)
                }).then(res => {
                    if ( res && res.ok === false ) {
                        _this.auth_code = "";
                        setTimeout(function () {
                            window.focus();
                            document.getElementById("weixin_alipay").focus();
                        }, 1000)
                    }
                    else {
                        this.$parent.$data.no = out_trade_no;
                        _this.to_main();
                    }
                })
            },
            upload: function () {
                var key_id = this.payment_type_id;
                var _type = this.payment_types[key_id].payment_type;
                if ( _type == 4 || _type == 3 ) {//4微信支付
                    document.getElementById("weixin_alipay").focus();
                    return
                }
                this.to_main();
            },
            to_main: function () {
                this.$parent.$data.payment_type_id = this.payment_type_id;
                this.$parent.$data.payment_type_name = this.payment_types[this.payment_type_id].name;
                if ( this.payment_types[this.payment_type_id].payment_type == 1 ) {//1为现金，打开钱箱
                    this.$parent.open_cash_box();
                }
                this.$parent.check_out();
            }
        }
    }
</script>


