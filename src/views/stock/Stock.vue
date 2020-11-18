<template>
  <div>
    <div class="s-top" id="search">
      <div class="s-search">
        <label>扫码</label>
        <input
            type="text"
            v-model.trim="barcode"
            autofocus
            autocomplete="false"
            @keyup.enter="search"
            @focus="barcode = '' "
            id="focus_barcode"
        />
        <button class="search t-button b-yellow" @click="search">确定</button>
      </div>
    </div>
    <div class="s-table" id="pros_table">
      <table class="t-table">
        <thead>
        <tr>
          <th v-for="header in pros_data.header_names" :width="header.width">{{ header.name }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(product, index) in pros_data.products">
          <th>{{ index+1 }}</th>
          <th v-for="key in pros_data.show_keys">{{ product[key] }}</th>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="s-table" id="pros_stock_table">
      <table class="t-table">
        <thead>
        <tr>
          <th v-for="header in pros_stock_data.header_names" :width="header.width">{{ header.name }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="product in pros_stock_data.products">
          <th v-for="key in pros_stock_data.show_keys">{{ key=='store_id'? storeName(product[key]) : product[key] }}</th>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
    export default {
        data() {
            return {
                barcode: "",
                pros_data: {
                    products: [],
                    show_keys: ["id", "name", "barcode", "measure_unit_id", "on_hand", "r_price"],
                    header_names: [
                        { name: "序号", width: "5%" },
                        { name: "货品id", width: "10%" },
                        { name: "货品名称", width: "35%" },
                        { name: "产品码", width: "20%" },
                        { name: "单位", width: "10%" },
                        { name: "当前库存", width: "10%" },
                        { name: "零售价", width: "10%" }
                    ]
                },
                pros_stock_data: {
                    products: [],
                    show_keys: ["store_id", "on_hand", "wait_in", "wait_out", "available"],
                    header_names: [
                        { name: "仓库名", width: "50%" },
                        { name: "库存数", width: "10%" },
                        { name: "待入", width: "10%" },
                        { name: "待出", width: "10%" },
                        { name: "可卖数", width: "10%" }
                    ]
                }
            }
        },
        activated() {
            document.getElementById('focus_barcode').focus()
        },
        methods: {
            search: function () {
                this.online_search();
                this.barcode_focus();
            },
            online_search: function () {
                if (!this.barcode) {
                    return alert('请先扫描条码')
                }
                this.$axios({
                    url: "/api/products?action=search&store_id=" + this.$store.state.loginInfo.terminal.store_id + "&barcode=" + this.barcode
                }).then(res => {
                    this.pros_data.products = res.root;
                    this.get_on_hand(res.root[0]);
                })
            },
            get_on_hand: function (product) {
                if ( !product ) {
                    this.pros_stock_data.products = [];
                    return;
                }
                this.$axios({
                    url: "/api/products/" + product.id + "?action=on_hands"
                }).then(res => {
                    let products = res.root;
                    for ( let _pro of products ) {
                        _pro.store_name = this.$store.state.stores[_pro.store_id];
                    }
                    this.pros_stock_data.products = products;
                })
            },
            barcode_focus: function () {
                document.getElementById("focus_barcode").focus();
            },
            storeName(id){
                return this.$store.state.stores[id] || ''
            }
        }
    }

</script>

<style>

  @import "stock.css";
</style>
