import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/login/Login.vue";
import Index from "../views/Index.vue";
import Cashier from "../views/cashier/Cashier.vue";
import Setting from "../views/setting/Setting.vue";
import Printer from "../views/setting/Printer.vue";
import Parameter from "../views/setting/Parameter.vue";
import ShortcutKey from "../views/setting/ShortcutKey.vue";
import Ticket from "../views/setting/Ticket.vue";
import Stock from '../views/stock/Stock'
import Trade from "../views/trade/Trade.vue";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "Login",
        component: Login
    },
    {
        path: "/index",
        name: "Index",
        meta: {
            requiresAuth: true
        },
        component: Index,
        children: [
            {
                path: "/",
                redirect: "cashier"
            },
            {
              path: "cashier",
              name: "Cashier",
              component: Cashier
            },
            {
                path: "trade",
                name: "Trade",
                component: Trade
            },
            {
                path: "setting",
                name: "Setting",
                component: Setting,
                children: [
                    {
                        path: "/",
                        redirect: "printer"
                    },
                    {
                        path: "printer",
                        name: "Printer",
                        component: Printer
                    },
                    {
                        path: "parameter",
                        name: "Parameter",
                        component: Parameter
                    },
                    {
                        path: "ticket",
                        name: "Ticket",
                        component: Ticket
                    },
                    {
                        path: "shortcut_key",
                        name: "ShortcutKey",
                        component: ShortcutKey
                    },
                ]
            },
            {
                path: "stock",
                name: "Stock",
                component: Stock
            }

        ]
    }
];

const router = new VueRouter({
    // mode: "history",
    base: process.env.BASE_URL,
    routes
});
router.beforeEach((to, from, next) => {
    if ( to.matched.some(record => record.meta.requiresAuth) ) {
        if ( sessionStorage.getItem('Token') ) {
            next()
            return
        }
        next('/')
    }
    else {
        next()
    }
})
export default router;
