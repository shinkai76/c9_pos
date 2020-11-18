import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate"

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        stores: {},
        products: {},
        user_name: '',
        set_of_book: '',
        payment_type_ids: undefined,
        loginInfo: undefined,
        member_id: undefined
    },
    mutations: {
        INIT_USER_INFO(state, value) {
            state.loginInfo = value
            state.payment_type_ids = value.terminal.payment_type_ids
            state.user_name = value.name
            state.set_of_book = value.set_of_book
            try {
                state.member_id = JSON.parse(window.localStorage.getItem('parameter')).member_id.value
            } catch {
                state.member_id = undefined
            }
        },
        INIT_STORES(state, value) {
            state.stores = value
        },
        INIT_PROS(state, value) {
            state.products = value
        }
    },
    actions: {},
    modules: {},
    plugins: [createPersistedState()]
});
