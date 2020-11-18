<template>
  <div id="ticket">
    <div class="titles"><label>店铺名称：</label><input type="text" v-model="tickets.shop_title" placeholder="店铺名称" />
      <button class="t-button b-yellow" @click="save">保存</button>
    </div>
    <div>
      <pre id="editor"></pre>
    </div>
  </div>
</template>
<script>
    import "../../js/ace/ace.js"

    export default {
        name: 'Ticket',
        data() {
            return {
                tickets: {
                    shop_title: "",
                    template: ""
                },
                session: undefined
            }
        },
        mounted() {
            this.init()
        },
        methods: {
            save() {
                this.tickets.template = this.session.getValue();
                window.localStorage.setItem('ticket_template', JSON.stringify(this.tickets))
            },
            init() {
                var editor = ace.edit("editor");
                editor.setTheme("ace/theme/eclipse");
                this.session = editor.getSession();
                editor.getSession().setMode("ace/mode/python");
                if ( window.localStorage.getItem('ticket_template') ) {
                    this.tickets = JSON.parse(window.localStorage.getItem('ticket_template'))
                    this.session.setValue(this.tickets.template);
                    return
                }
                let template = `from datetime import datetime
printer.set(align=u'center')
printer._raw((u'%s\\n' % shop_title).encode('gb2312'))
printer.set(align=u'left')
printer._raw((u'交易号:\\t%s\\n' % no).encode('gb2312'))
printer._raw((u'收银台:\\t%s\\t' % terminal_code).encode('gb2312'))
printer._raw((u'收银员:\\t%s\\n' % user_name).encode('gb2312'))
printer._raw('================================\\n')
printer._raw(u'商品名称 '.encode('gb2312'))
printer._raw(u'单价\\t'.encode('gb2312'))
printer._raw(u'数量\\t'.encode('gb2312'))
printer._raw(u'金额\\n'.encode('gb2312'))
printer._raw('================================\\n')
for line in product_lines:
    printer._raw(('%s\\n' % line.product_name).encode('gb2312'))
    printer._raw(('\\t %s ' % line.tax_price).encode('gb2312'))
    printer._raw(('\\t%s' % line.quantity).encode('gb2312'))
    printer._raw(('\\t%s\\n' % line.amount).encode('gb2312') )
printer._raw('================================\\n')
printer._raw((u'总计金额: %s\\n' % total_amount).encode('gb2312'))
printer._raw((u'当前会员: %s\\n' % member_name).encode('gb2312'))
printer._raw((u'收款方式: %s\\n' % payment_types.payment_type_name).encode('gb2312'))
printer._raw((u'收款金额: %s\\n' % payment_types.amount).encode('gb2312'))
printer._raw((u'%s\\n' % datetime.now().strftime('%Y年%m月%d日 %H:%M:%S')).encode('gb2312'))
printer.cut()`;
                this.session.setValue(template);
            }
        }
    }
</script>
