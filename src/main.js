import Vue from "vue";
import 'font-awesome/css/font-awesome.css';
import './plugins/axios'
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import 'vue-datetime/dist/vue-datetime.css'
import VueHotkey from 'v-hotkey'

Vue.use(VueHotkey)
Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
