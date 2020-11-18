<template>
  <div class="s-top" id="search">
    <div class="c-member-input"><label>会员</label>
      <input type="text" v-model="key" @keyup.enter="search" autofocus placeholder="卡号/姓名/电话" />
      <button class="t-button" style="float:none;padding: 5px 8px;margin-left: 10px" @click="search">搜索</button>
    </div>
    <div class="c-hr"></div>
    <div class="c-member">
      <div>会员id：{{member.id }}</div>
      <div>卡号：{{member.card_no }}</div>
      <div>姓名：{{member.name}}</div>
      <div>联系电话：{{member.mobile_phone}}</div>
      <div>当前积分：{{member.points}}</div>
      <div class="clear"></div>
    </div>
    <button class="t-button" @click="confirm" id="confirm">确认</button>
  </div>

</template>
<script>

    export default {
        name: 'Member',
        data() {
            return {
                key: "",
                member: {
                    card_no: "",
                    name: "",
                    id: "",
                    mobile_phone: "",
                    points: ""
                }
            }
        },
        mounted() {
            this.init()
        },
        methods: {
            search: function () {
                this.online_search()
            },
            online_search: function () {
                this.$axios({
                    url: "/api/members?name__icontains__or__card_no__icontains__or__mobile_phone__icontains=" + this.key
                }).then(res => {
                    this.member = res.root[0];
                    document.getElementById("confirm").focus();
                })
            },
            confirm: function () {
                if ( this.member.id ) {
                    this.$parent.$data.member_id = this.member.id;
                    this.$parent.$data.member_info = this.member;
                    this.$parent.barcode_focus();
                    this.$parent.$data.show = false;
                    var products = this.$parent.$data.products;
                    if ( this.member.id && this.member.id != this.$store.state.member_id ) {
                        for ( var index = 0; index < products.length; index++ ) {
                            products[index].tax_price = products[index].sale_price_a;
                        }
                    }
                    this.$parent.set_total_p();
                }
            },
            init: function () {
                window.focus();
                this.key = "";
            }
        }
    }
</script>
<style>
  @import "cashier.css";
  #confirm {
    margin: 20px 0 0 20px;
  }
</style>
