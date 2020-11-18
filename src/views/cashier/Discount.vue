<template>
  <div id="checkout">
    <div class="c-bottom">
      <div class="c-bom-left">
        <div class="c-input">
          <div style="float:left;line-height:45px;margin-left:20px">输入折扣：0.</div>
          <input type="text" v-model="num" id="first" @keyup.enter="confirm" style="width: 30%;" />
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
            <li><a href="#"></a></li>
            <li><a href="#" @click="delete_amount">删除</a></li>
            <li><a href="#" title="确认" @click="confirm" class="calc_confirm">确认</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

    export default {
        name: 'Discount',
        data() {
            return {
                num: ""
            }
        },
        mounted() {
            this.init()
        },
        methods: {
            change_amount: function (num) {
                this.num += num;
            },
            delete_amount: function () {
                this.num = "";
            },
            confirm: function () {
                this.$parent.discount(this.num / 10);
            },
            init: function () {
                window.focus();
                this.num = "";
                document.getElementById("first").focus();
            }
        }
    }
</script>
<style>
  @import "cashier.css";
</style>
