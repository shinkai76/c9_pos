<template>
  <div>
    <div class="t-top" id="search">
      <div class="item">
        <label>开始时间：</label>
        <datetime
            class="theme-orange"
            type="datetime"
            v-model="start_date"
            :phrases="{ok: '确定', cancel: '取消'}"
            :week-start="7"
            format="yyyy/MM/dd HH:mm:ss"
            use24-hour
            auto
        ></datetime>
      </div>
      <div class="item">
        <label>结束时间：</label>
        <datetime
            class="theme-orange"
            type="datetime"
            v-model="end_date"
            :phrases="{ok: '确定', cancel: '取消'}"
            :week-start="7"
            format="yyyy/MM/dd HH:mm:ss"
            use24-hour
            auto
        ></datetime>
      </div>
      <div class="item">
        <label>交易号：</label>
        <input type="text" v-model="no" placeholder="" @keyup.enter="search" />
      </div>
      <div class="item">
        <button class="t-button b-yellow" @click="search">搜索</button>
      </div>
      <div class="item" v-show="show_btn_upload">
        <button class="t-button b-yellow" @click="upload">一键上传</button>
      </div>
      <div class="clear"></div>
    </div>
    <div class="t-middle" id="prices">
      <div class="price-tabs">
        <div>合计总收入</div>
        <div>¥{{ price.total_amount }}</div>
      </div>
      <div class="clear"></div>
    </div>
    <div class="t-bottom" id="trade" style="position: absolute">
      <table class="t-table">
        <thead>
        <tr>
          <th v-for="header in trade_data.header_names" :width="header.width">{{ header.name }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(trade, index) in trade_data.trades" @click="d_click(trade)">
          <th>{{index+1}}</th>
          <th v-for="key in trade_data.show_keys">{{trade[key]}}</th>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="t-mask" id="trade_line" v-show="tradeline.show">
      <div class="t-tips">
        <div>交易号：{{tradeline.trade_data.no}}</div>
        <div>金额：{{tradeline.trade_data.total_amount}}</div>
        <div>日期：{{tradeline.trade_data.created_at}}</div>
      </div>
      <div class="t-close" @click="tradeline.show = false">
        <i class="fa fa-times" aria-hidden="true"></i>
      </div>
      <button style="margin-left: 13px;margin-bottom: 10px;" class="t-button b-yellow" @click="print_bill">补打小票</button>
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
  </div>
</template>
<script>
    import websocket from "../../js/socket"

    import Common from "../../js/common"
    import { Datetime } from 'vue-datetime'

    export default {
        data() {
            return {
                start_date: '',
                end_date: '',
                no: '',
                show_btn_upload: false,
                price: {
                    total_amount: 0
                },
                tradeline_data: {
                    trades: [],
                    show_keys: ["product_name", "quantity", "amount"],
                    header_names: [
                        { name: "序号", width: "5%" },
                        { name: "商品", width: "60%" },
                        { name: "数量", width: "10%" },
                        { name: "金额", width: "25%" }
                    ]
                },
                trade_data: {
                    trades: [],
                    show_keys: ["transaction_type", "no", "total_amount", "created_at"],
                    header_names: [
                        { name: "序号", width: "5%" },
                        { name: "交易类型", width: "10%" },
                        { name: "单号", width: "50%" },
                        { name: "金额", width: "10%" },
                        { name: "时间", width: "25%" }
                    ]
                },
                tradeline: {
                    show: false,
                    trade_data: {}
                }
            }
        },
        components: {
            datetime: Datetime
        },
        mounted() {
            this.init_date()
        },
        methods: {
            search: function () {
                this.online_search();
                this.show_btn_upload = false;
            },
            d_click(trade) {
                this.tradeline_data.trades = trade.data.lines;
                this.tradeline.show = true;
                this.tradeline.trade_data = trade;
            },
            online_search: function () {
                this.$axios({
                    url: "/api/terminal_transactions?action=view&start_date=" + this.start_date + "&end_date=" +
                      this.end_date + "&no=" + this.no
                }).then(res => {
                    var trades = res.root;
                    for ( var _trade of trades ) {
                        _trade.transaction_type = ( _trade.transaction_type ) ? "退货" : "销售";
                    }
                    this.trade_data.trades = trades;
                    this.get_total_price();
                })
            },
            get_total_price: function () {
                var datas = this.trade_data.trades;
                var total_amount = 0;
                for ( var data of datas ) {
                    total_amount += Number(data.total_amount);
                }
                this.price.total_amount = Common.round(total_amount, 2);
            },
            init_date: function () {
                let d = new Date();
                let year = d.getFullYear()
                let mon = d.getMonth()
                let date = d.getDate()
                // 此插件需要使用ISO 8601格式
                this.start_date = new Date(`${ year }/${ mon + 1 }/${ date } 00:00:00`).toISOString()
                this.end_date = new Date(`${ year }/${ mon + 1 }/${ date } 23:59:59`).toISOString()
            },
            upload: function () {
                var _this = this;
                var _upload = function (data, datas, callback) {
                    _this.$axios({
                        url: '/api/terminal_transactions?action=batch',
                        method: 'POST',
                        data: JSON.stringify(data)
                    }).then(() => {
                        c(datas, callback);
                    })
                };
                var c = function (datas, callback) {
                    if ( datas.length > 0 )
                        setTimeout(function () {
                            _upload(datas.pop(), datas, callback);
                        }, 500);
                    else {
                        callback();
                    }
                };
                var batch_upload = function (data) {
                    if ( data.length < 1 ) return;
                    var post_data = [], result;
                    for ( var i = 0; i < data.length; i += 50 ) {
                        post_data.push(data.slice(i, i + 50));
                    }
                    c(post_data, function () {
                        alert("已上传");
                        _this.trade_data.trades = [];
                    });
                };

                batch_upload(_this.trade_data.trades);
            },
            print_bill: function () {
                let ticket
                if ( window.localStorage.getItem('ticket_template') ) {
                    ticket = JSON.parse(window.localStorage.getItem('ticket_template'))
                }
                else {
                    return alert('需要系统配置后才可以打印')
                }
                var pros = [];
                let tradeline_data = this.tradeline_data
                let tradeline = this.tradeline
                for ( var i in tradeline_data.trades ) {
                    let trade = tradeline_data.trades[i]
                    var pro = {};
                    pro.amount = trade.tax_price * trade.quantity;
                    pro.product_id = trade.product_id;
                    pro.tax_price = trade.tax_price;
                    pro.quantity = trade.quantity;
                    pro.product_name = trade.product_name || '';
                    pros.push(pro);
                }
                var payment_obj = tradeline.trade_data.data.payment_types;
                var payment_name_obj = this.$store.state.payment_type_ids[payment_obj.payment_type_id];
                var payment_name = payment_name_obj ? payment_name_obj.name : '';
                var print_data = {};
                print_data.shop_title = ticket.shop_title;
                print_data.terminal_code = this.$store.state.loginInfo.terminal.code;
                print_data.user_name = this.$store.state.loginInfo.name;
                print_data.no = tradeline.trade_data.no;
                print_data.member_name = tradeline.trade_data.member_id + "";
                print_data.total_amount = tradeline.trade_data.total_amount;
                print_data.payment_types = {
                    payment_type_id: payment_obj.payment_type_id,
                    payment_type_name: payment_name,
                    amount: payment_obj.amount
                }
                print_data.product_lines = pros;
                setTimeout(function () {
                    websocket.do_connect(function () {
                        websocket.print_receipt(ticket.template, print_data);
                    });
                }, 1000)
            }
        }
    }


</script>

<style scoped>
  @import "trade.css";
  @import "theme.css";

  #search #trade {
    position: absolute;
    top: 120px;
  }
</style>
