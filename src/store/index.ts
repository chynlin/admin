// src/store/index.ts
import order from './api/order';
import inventory from './api/inventory';
import { createStore } from 'vuex';
import product from './api/product'
import main from './api/main'
import user from './api/user'
import roles from './api/roles'

export default createStore({
  state: {
    mainInfo: {},
    token: ''
  },
  mutations: {
    set_main_info(state, payload) {
      state.mainInfo = payload;
    },
    set_token_key(state, payload) {
      state.token = payload;
    },
  },
  actions: {
    ...order,
    ...inventory,
    ...product,
    ...main,
    ...user,
    ...roles
  },
  getters: {
  }
});
