<template>
  <div id="push_bill"  v-hotkey="keymap">
    <input type="hidden" id="first" />
    <div class="t-table-top">
      <div class="t-table-top-left" id="trade">
        <!--              <tradetable ref="child_table"></tradetable>-->
        <table class="t-table">
          <thead>
          <tr>
            <th v-for="header in trade_data.header_names" :width="header.width">{{ header.name }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(trade, index) in trade_data.trades" @click="d_click(trade, index)"
              :class="{'list-active': index == trade_data.check_item }">
            <th>{{index+1}}</th>
            <th v-for="key in trade_data.show_keys">{{trade[key]}}</th>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="t-table-top-right" id="trade_line">
        <table class="t-table">
          <thead>
          <tr>
            <th v-for="header in tradeline_data.header_names" :width="header.width">{{ header.name }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(trade, index) in tradeline_data.trades">
            <th>{{index+1}}</th>
            <th v-for="key in tradeline_data.show_keys">{{trade[key]}}</th>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="clear"></div>
    </div>
    <div class="t-table-bottom">
      <button class="t-button" @click="delete_bill">删除</button>
      <button class="t-button" @click="confirm">确认</button>
    </div>
  </div>
</template>
<script>


    export default {
        name: 'PushBill',
        data() {
            return {
                trade_data: {
                    trades: [],
                    show_keys: ["no"],
                    header_names: [
                        { name: "序号", width: "5%" },
                        { name: "单号", width: "60%" }
                    ],
                    check_item: 0
                },
                tradeline_data: {
                    trades: [],
                    show_keys: ["name", "quantity", "tax_price"],
                    header_names: [
                        { name: "序号", width: "5%" },
                        { name: "商品", width: "60%" },
                        { name: "数量", width: "10%" },
                        { name: "单价", width: "25%" }
                    ]
                },
                checked_bills: {}

            }
        },
        mounted() {
            this.init()
        },
        computed: {
            keymap () {
                return {
                    'enter': this.confirm,
                    'up': this.upArrowKey,
                    'down': this.downArrowKey,
                    'BackSpace': this.delete_bill
                }
            }
        },
        methods: {
            d_click: function (trade, index) {
                if (!trade) return
                this.tradeline_data.trades = trade.data.lines;
                this.checked_bills = trade;
                this.trade_data.check_item = index;
            },
            upArrowKey(){
                this.trade_data.check_item--;
                if ( this.trade_data.check_item < 0 ) {
                    this.trade_data.check_item = this.trade_data.trades.length - 1;
                }
                this.click_item(this.trade_data.check_item);
            },
            downArrowKey(){
                this.trade_data.check_item++;
                if ( this.trade_data.check_item >= this.trade_data.trades.length ) {
                    this.trade_data.check_item = 0;
                }
                this.click_item(this.trade_data.check_item);
            },
            init: function () {
                this.trade_data.trades = this.$parent.$data.store_bills;
                var _this = this;
                _this.click_item(0);
                window.focus();
                document.getElementById('first').click();
            },
            click_item: function (index) {
                this.d_click(this.trade_data.trades[index], index);
            },
            delete_bill: function () {
                var _this = this;
                if ( this.trade_data.check_item === null ) {
                    alert("请先选中单据");
                    return;
                }
                this.trade_data.trades.splice(this.trade_data.check_item, 1);
                this.$parent.$data.store_bills = this.trade_data.trades;
                this.$parent.$data.bill_push = this.trade_data.trades.length;
                this.tradeline_data.trades = [];
                _this.click_item(0);
            },
            confirm: function () {
                if ( this.trade_data.check_item == null ) {
                    alert("请先选中单据");
                    return;
                }
                this.$parent.$data.products = this.trade_data.trades[this.trade_data.check_item].data.lines;
                let arr_ids = []
                this.$parent.$data.products.map(pro=> {
                    arr_ids.push(pro.id)
                })
                this.$parent.$data.added_pro_ids = arr_ids
                this.$parent.set_total_p();
                this.trade_data.trades.splice(this.trade_data.check_item, 1);
                this.$parent.$data.bill_push = this.trade_data.trades.length;
                this.$parent.hideComponent();
            }
        }
    }
</script>
<style>
  @import "cashier.css";
</style>
