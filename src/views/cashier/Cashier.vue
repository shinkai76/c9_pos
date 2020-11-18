<template>
  <div id="cashier" v-hotkey="cashierKeyMap">
    <div class="b-top">
      <div class="b-top-left" id="scan_barcode">
        <div class="b-search">
          <label>扫码</label>
          <input
              type="text"
              v-model.trim="barcode"
              autocomplete="false"
              @keyup.enter="search_pro()"
              @focus="barcode = ''"
              id="focus_barcode"
          />
          <label class="under" @click="barcode_search">键盘</label>
        </div>
        <div class="b-pros">
          <div class="b-pros-list" v-for="(product,index) in products" @click="check_list(index)"
               :class="{'list-active': index == check_pro_item}">
            <div class="pros-left">
              <div>{{ product.name }}</div>
              <div>条码：{{ product.barcode }}</div>
              <div>数量：×{{ product.quantity }}</div>
              <div>折后价：¥{{ product.tax_price }}</div>
            </div>
            <div class="pros-right">¥{{product.quantity*product.tax_price}}</div>
          </div>
        </div>
      </div>
      <div class="b-top-right" id="views" v-if="show">
        <div class="right-close" @click="hideComponent()">
          <i class="fa fa-times" aria-hidden="true"></i>
        </div>
        <div :is="component_name" :ref="component_name"></div>
      </div>
      <div class="clear"></div>
    </div>
    <div class="b-bottom" id="actions">
      <div class="b-bottom-left">
        <div class="large">总计：¥ {{total_amount }}</div>
        <div class="large">会员ID：{{member_id}}<span class="m-back" @click="m_back" id="div-default_member">恢复默认</span>
        </div>
        <div>姓名：{{member_info.name}}</div>
        <div>电话：{{member_info.mobile_phone}}</div>
        <div>积分：{{member_info.points}}</div>
      </div>
      <div class="b-bottom-right">
        <div class="btns-list">
          <div class="" @click="checkout" id="div-checkout"
               :class="{'list-active': check_btn_name == btn_names[0]}">结账
          </div>
          <div class="" @click="checkout_return" id="div-checkout_return"
               :class="{'list-active': check_btn_name == btn_names[1]}">退货
          </div>
          <div class="" @click="changePro('quantity')" id="div-change_quantity"
               :class="{'list-active': check_btn_name == btn_names[2]}">数量
          </div>
          <div class="" @click="changePro('tax_price')" id="div-change_price"
               :class="{'list-active': check_btn_name == btn_names[3]}">改价
          </div>
          <div class="" @click="delete_bill" id="div-delete_bill"
               :class="{'list-active': check_btn_name == btn_names[4]}">
            删单
          </div>
          <div class="" @click="delete_line" id="div-delete_line"
               :class="{'list-active': check_btn_name == btn_names[5]}">
            删行
          </div>
        </div>
        <div class="btns-list">
          <div class="" @click="push_bill" id="div-push_bill" :class="{'list-active': check_btn_name == btn_names[6]}">
            挂单({{bill_push}})
          </div>
          <div class="" @click="search_member" id="div-search_member"
               :class="{'list-active': check_btn_name == btn_names[7]}">会员
          </div>
          <div class="" @click="Discount" id="div-discount" :class="{'list-active': check_btn_name == btn_names[8]}">折扣
          </div>
          <!-- <div class="" :class="{'list-active': check_btn_name == btn_names[9]}">库存</div> -->
          <div class="" @click="open_cash_box" id="div-open_cash_box"
               :class="{'list-active': check_btn_name == btn_names[10]}">钱箱
          </div>
          <!-- <div class="" :class="{'list-active': check_btn_name == btn_names[11]}">商品</div> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
    import websocket from "../../js/socket"

    import Common from "../../js/common"
    import ChangeNum from "./ChangeNum"
    import Checkout from "./Checkout"
    import CheckoutReturn from "./CheckoutReturn"
    import Discount from "./Discount"
    import Member from "./Member"
    import PushBill from "./PushBill"

    export default {
        name: 'Cashier',
        data() {
            return {
                barcode: "",
                products: [],
                check_pro_item: null,
                transaction_type: 0,//0表示销售，1表示退货
                payment_type_id: null,//支付类型
                payment_type_name: null,//支付类型
                menu_src: "/",
                show: false,
                total_amount: null,
                member_id: undefined,
                member_info: {
                    name: "",
                    mobile_phone: "",
                    points: ""
                },
                change_key: null,
                btn_names: ["结账", "退货", "数量", "改价", "删单", "删行", "挂单", "会员", "折扣", "库存", "钱箱", "商品"],
                check_btn_name: "",
                bill_push: Common.store_bills.length,
                key_methods: {
                    "结账": "checkout",
                    "退货": "checkout_return",
                    "数量": "change_quantity",
                    "改价": "change_price",
                    "删单": "delete_bill",
                    "删行": "delete_line",
                    "折扣": "discount",
                    "挂单": "push_bill",
                    "会员": "search_member",
                    "钱箱": "open_cash_box",
                    "默认会员": "default_member"
                },
                now_bill: {},
                key_codes: {},
                store_bills: Common.store_bills,
                no: "",
                component_name: '',
                added_pro_ids: []
            }
        },
        components: { ChangeNum, Checkout, CheckoutReturn, Discount, Member, PushBill },
        activated() {
            document.getElementById('focus_barcode').focus()
            if ( this.$store.state.member_id ) {
                this.member_id = this.$store.state.member_id
                this.get_memberinfo()
            }
            let hotkey = window.localStorage.getItem('hotkey')
            if ( hotkey ) {
                this.key_codes = JSON.parse(hotkey)
                window.addEventListener('keyup', this.keyup)
            }
        },
        watch: {
            products: {
                handler(cur) {
                    if ( !cur || !cur.length ) {
                        this.added_pro_ids = []
                    }
                },
                immediate: true
            }
        },
        computed: {
            cashierKeyMap() {
                return {
                    'up': this.upArrowKey,
                    'down': this.downArrowKey,
                    'esc': this.hideComponent
                }
            }
        },
        methods: {
            get_memberinfo: function () {
                this.$axios({
                    url: "/api/members/" + this.member_id
                }).then(res => {
                    if ( res ) {
                        const { name, mobile_phone, points } = res
                        this.member_info = {
                            name,
                            mobile_phone,
                            points
                        }
                    }
                }).catch(() => {
                    alert('获取会员信息出错')
                })
            },
            m_back: function () {
                this.member_id = this.$store.state.member_id;
                var products = this.products;
                for ( var index = 0; index < products.length; index++ ) {
                    products[index].tax_price = products[index].r_price || 0;
                }
                this.set_total_p();
                this.get_memberinfo();
            },
            change_btn: function (name) {
                this.check_btn_name = name;
            },
            changeComponent: function (name) {
                this.component_name = name;
                this.show = true;
            },
            checkout: function () {
                this.transaction_type = 0;
                this.change_btn(this.btn_names[0]);
                this.changeComponent("Checkout")
            },
            checkout_return: function () {
                this.transaction_type = 1;
                this.change_btn(this.btn_names[1]);
                this.changeComponent("CheckoutReturn");
            },
            changePro: function (key) {
                if ( this.check_pro_item === null ) {
                    alert("请先选中商品");
                    return;
                }
                var key_name = {
                    "quantity": this.btn_names[2],
                    "tax_price": this.btn_names[3]
                };
                this.change_btn(key_name[key]);
                this.change_key = key;
                this.changeComponent("ChangeNum");
            },
            delete_line: function () {
                if ( this.check_pro_item === null ) {
                    alert("请先选中商品");
                    return;
                }
                this.change_btn(this.btn_names[5]);
                this.products.splice(this.check_pro_item, 1);
                this.added_pro_ids.splice(this.check_pro_item, 1)
                if ( this.check_pro_item = this.products.length ) {
                    this.check_pro_item = 0;
                }
                this.set_total_p();
                this.barcode_focus();
            },
            delete_bill: function () {
                this.change_btn(this.btn_names[4]);
                if ( confirm("确认删除订单吗？") ) {
                    this.products = [];
                    this.added_pro_ids = [];
                    this.set_total_p();
                    this.barcode_focus();
                }
                else {
                    this.barcode_focus();
                }
            },
            Discount: function () {
                this.change_btn(this.btn_names[8]);
                this.changeComponent("Discount");
            },
            push_bill: function () {
                var _this = this;
                _this.change_btn(this.btn_names[6]);
                this.now_bill = {};
                if ( this.products.length > 0 ) {
                    var now_bill = this.get_store_bill();
                    this.store_bills.push(now_bill);
                    _this.bill_push = this.store_bills.length;
                    this.products = [];
                    this.added_pro_ids = [];
                    this.set_total_p();
                    this.barcode_focus();
                }
                else {
                    _this.changeComponent("PushBill");
                }
            },
            search_member: function () {
                this.change_btn(this.btn_names[7]);
                this.changeComponent("Member");
            },
            open_cash_box: function () {
                websocket.do_connect(function () {
                    websocket.open_cash_box();
                });
            },
            hideComponent: function () {
                this.show = false;
                window.focus();
                this.barcode_focus();
            },
            check_list: function (index) {
                this.check_pro_item = index;
            },
            change_pro: function (key, value) {
                this.products[this.check_pro_item][key] = value;
                this.set_total_p();
                this.hideComponent();
            },
            set_total_p: function () {
                var total_p = 0;
                for ( var i in this.products ) {
                    total_p += this.products[i].tax_price * this.products[i].quantity;
                }
                this.total_amount = total_p;
            },
            discount: function (discount) {
                for ( var i in this.products ) {
                    this.products[i].tax_price = Common.round(this.products[i].tax_price * discount, 2);
                }
                this.set_total_p();
                this.hideComponent();
            },
            search_pro: function () {
                if ( !this.barcode ) return;
                this.online_search_pro();
            },
            online_search_pro: function () {
                this.$axios({
                    url: "/api/products?barcode=" + this.barcode
                }).then(res => {
                    var pro = res.root[0];
                    this.add_product(pro);
                })
                this.barcode = ''
            },
            add_product: function (pro) {
                if ( !pro ) {
                    alert("没有对应的商品，请重试");
                    this.barcode_focus()
                    return;
                }
                pro.product_id = pro.id;
                pro.tax_price = pro.r_price || 0;
                pro.quantity = 1;
                //会员检查--开始
                if ( this.member_id && this.$store.state.member_id != this.member_id ) {
                    pro.tax_price = pro.sale_price_a;
                }
                //会员检查--结束
                if ( this.added_pro_ids.includes(pro.id) ) {
                    this.products[this.added_pro_ids.indexOf(pro.id)].quantity++
                }
                else {
                    this.added_pro_ids.push(pro.id)
                    this.products.push(pro);
                }
                this.set_total_p();
                this.barcode_focus();
                this.check_pro_item = this.products.length - 1;
            },
            barcode_focus: function () {
                window.focus();
                this.barcode = "";
                document.getElementById("focus_barcode").focus();
            },
            barcode_search: function () {
                this.change_key = "barcode";
                this.changeComponent("ChangeNum");
            },
            check_out: function () {
                this.get_now_bill();
                this.online_check();
                this.no = "";
                this.barcode_focus();
            },
            online_check: function () {
                if ( !this.now_bill.member_id ) {
                    alert("请先在【收银台-会员】中设置会员信息或在【系统设置-参数设置】中设置默认会员");
                    return;
                }
                this.$axios({
                    url: '/api/terminal_transactions',
                    method: 'POST',
                    data: JSON.stringify(this.now_bill)
                }).then(res => {
                    if ( res.id ) {
                        if ( !this.printCheck() ) return alert('需要系统配置后才可以打印')
                        this.print();
                        this.products = [];
                        this.added_pro_ids = [];
                        this.m_back();
                        this.show = false;
                        this.barcode_focus();
                    }
                    else {
                        alert(res.statusText);
                    }
                })
            },
            printCheck() {
                return window.localStorage.getItem('ticket_template')
            },
            print: function () {
                let ticket = JSON.parse(window.localStorage.getItem('ticket_template'))
                var print_data = {};
                print_data.shop_title = ticket.shop_title;
                print_data.terminal_code = this.$store.state.loginInfo.terminal.code;
                print_data.user_name = this.$store.state.loginInfo.name;
                print_data.no = this.now_bill.no;
                print_data.member_name = this.now_bill.member_id + "";
                print_data.total_amount = this.now_bill.total_amount;
                print_data.payment_types = this.now_bill.data.payment_types;
                print_data.product_lines = this.now_bill.data.lines;
                setTimeout(function () {
                    websocket.do_connect(function () {
                        websocket.print_receipt(ticket.template, print_data);
                    });
                }, 1000)
            },
            get_no: function () {
                var no = "";
                no += Common.insert_zero(this.$store.state.loginInfo.department_id, 3);//部门ID（三位，不足用0补齐）
                no += Common.insert_zero(this.$store.state.loginInfo.terminal.code, 2);//设备编码（二位，不足用0补齐）

                var date = new Date();
                var year = date.getFullYear() + "";
                year = year.substr(year.length - 2, 2);
                var month = Common.insert_zero(date.getMonth() + 1, 2);
                var day = Common.insert_zero(date.getDate(), 2);

                no += year + month + day //YYMMDD（年月日)

                var hour = Common.insert_zero(date.getHours(), 2);
                var minutes = Common.insert_zero(date.getMinutes(), 2);
                var seconds = Common.insert_zero(date.getSeconds(), 2);

                no += hour + minutes + seconds; //HHMMSS（时分秒）
                return no;
            },
            get_now_bill: function () {
                this.now_bill.transaction_type = this.transaction_type;
                this.now_bill.terminal_id = this.$store.state.loginInfo.terminal.id;
                if ( this.no ) {
                    this.now_bill.no = this.no;
                }
                else {
                    this.now_bill.no = this.get_no();
                }
                this.now_bill.total_amount = this.total_amount;
                this.now_bill.member_id = Number(this.member_id);
                this.now_bill.data = {};
                var pros = [];
                for ( var i in this.products ) {
                    var pro = {};
                    pro.amount = this.products[i].tax_price * this.products[i].quantity;
                    pro.product_id = this.products[i].product_id;
                    pro.tax_price = this.products[i].tax_price;
                    pro.quantity = this.products[i].quantity;
                    pro.product_name = this.products[i].name;
                    pros.push(pro);
                }
                this.now_bill.data.lines = pros;
                this.now_bill.data.payment_types = {
                    payment_type_id: Number(this.payment_type_id),
                    payment_type_name: this.payment_type_name,
                    amount: this.total_amount
                }
            },
            get_store_bill: function () {
                var store_bill = {};
                var date = new Date();
                var hour = Common.insert_zero(date.getHours(), 2);
                var minutes = Common.insert_zero(date.getMinutes(), 2);
                var seconds = Common.insert_zero(date.getSeconds(), 2);
                var no = hour + minutes + seconds; //HHMMSS（时分秒）
                store_bill.no = "挂单" + no;
                store_bill.total_amount = this.total_amount;
                store_bill.data = {};
                store_bill.data.lines = this.products;
                return store_bill;
            },
            upArrowKey() {
                this.check_pro_item--;
                if ( this.check_pro_item < 0 ) {
                    this.check_pro_item = this.products.length - 1;
                }
            },
            downArrowKey() {
                this.check_pro_item++;
                if ( this.check_pro_item >= this.products.length ) {
                    this.check_pro_item = 0;
                }
            },
            keyup: function (e) {
                for ( var key in this.key_codes ) {
                    if ( e.keyCode == this.key_codes[key].key_code ) {
                        document.getElementById('div-' + this.key_methods[key]).click();
                        break;
                    }
                }
            }
        },
        deactivated() {
            this.show = false // 销毁组件，否则这个组件绑定的快捷键在其他页面还是会被触发
            window.removeEventListener('keyup', this.keyup)
        }
    }
</script>
<style>
  @import "cashier.css";
</style>
