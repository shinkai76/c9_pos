var websocket = {
    ws: undefined,
    call_back: {
        get_printers_cb: function () {},
        get_default_printer_cb: function () {},
        set_default_printer_cb: function () {},
        print_logistics_documents_cb: function () {}
    },
    do_connect: function (open_callback) {//连接
        var self = this;
        self.ws = new WebSocket('ws://localhost:10000');
        self.ws.onopen = function (event) {
            // 监听消息
            self.ws.onmessage = function (event) {
                var mess_data = JSON.parse(event.data);
                console.log(mess_data);
                if ( mess_data.errors ) {
                    alert(mess_data.errors);
                    return;
                }
                switch ( mess_data.cmd ) {
                    case 'get_printers':
                        self.call_back.get_printers_cb(mess_data.data);
                        break;
                    case 'get_default_printer':
                        self.call_back.get_default_printer_cb(mess_data.data);
                        break;
                    case 'set_default_printer':
                        self.call_back.set_default_printer_cb(mess_data.data);
                        break;
                    case 'print_logistics_documents':
                        self.call_back.print_logistics_documents_cb(mess_data.data);
                        console.log("已发送至打印机");
                        break;
                }
            }
            // 监听Socket的关闭
            self.ws.onclose = function (event) {
                alert(event);
                console.log('Client notified socket has closed', event);
            };
            if ( open_callback ) open_callback(event);
        };
    },
    get_printers: function () { //获取打印机
        this.ws.send(JSON.stringify({
            "cmd": "get_printers",
            "request_id": 1,
            "version": 1
        }));
    },
    set_default_printer: function (name) { //设置默认打印机
        this.ws.send(JSON.stringify({
            "cmd": "set_default_printer",
            "printer": name,
            "request_id": 1,
            "version": 1
        }));
    },
    get_default_printer: function () {
        this.ws.send(JSON.stringify({
            "cmd": "get_default_printer",
            "request_id": 1,
            "version": 1
        }));
    },
    open_cash_box: function () {
        this.ws.send(JSON.stringify({
            "cmd": "open_cash_box",
            "request_id": 1,
            "version": 1
        }));
    },
    print_receipt: function (template, data) {
        this.ws.send(JSON.stringify({
            cmd: "print_receipt",
            port: "LPT1",
            template: template,
            data: data
        }));
    }
};
export default websocket
