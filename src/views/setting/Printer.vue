<template>
  <div id="printer">
    <div>
      <div class="title">选择打印机</div>
      <table class="t-table">
        <thead>
        <tr>
          <th v-for="header in printer_data.header_names" :width="header.width">
            {{ header.name }}
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(printer, index) in printer_data.printers" @click="d_click(index)"
            :class="{'list-active': index == printer_data.check_item }">
          <th>{{index+1}}</th>
          <th>{{printer.name}}</th>
          <th>{{printer.default_printer}}</th>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="buttons">
      <button class="t-button b-yellow" @click="set_default">设置为默认</button>
    </div>
  </div>
</template>
<script>
    import websocket from "../../js/socket"

    export default {
        name: 'Printer',
        data() {
            return {
                check_printer: null,
                default_printer: null,
                printers: [],
                printer_data: {
                    printers: [],
                    check_item: null,
                    header_names: [
                        { name: "序号", width: "5%" },
                        { name: "打印机", width: "85%" },
                        { name: "设置", width: "10%" }
                    ]
                }
            }
        },
        mounted() {
            this.init()
        },
        methods: {
            d_click: function (index) {
                this.printer_data.check_item = index;
                this.check_printer = this.printer_data.printers[index];
            },
            set_default: function () {
                let _this = this;
                let name = _this.check_printer.name;
                if ( name ) {
                    websocket.call_back.set_default_printer_cb = function () {
                        _this.default_printer = name;
                        _this.get_printers(_this.printers);
                    }
                    websocket.set_default_printer(name);
                }
            },
            get_printers: function (data) {
                var default_printer = this.default_printer;
                var printers = data || [];
                this.printers = printers;
                var _data = [];
                for ( var printer of printers ) {
                    var _printer = { name: printer };
                    _printer.default_printer = ( printer == default_printer ) ? "是" : "否";
                    _data.push(_printer);
                }
                this.printer_data.printers = _data;
            },
            init: function () {
                let _this = this;
                websocket.do_connect(function () {
                    websocket.call_back.get_printers_cb = _this.get_printers;
                    websocket.call_back.get_default_printer_cb = function (data) {
                        _this.default_printer = data;
                        websocket.get_printers();
                    };
                    websocket.get_default_printer();
                });
            }
        }
    }

</script>
