// src/store/index.ts
import { createStore } from 'vuex';
import product from './api/product'
import main from './api/main'
import user from './api/user'
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
    ...product,
    ...main,
    ...user
  },
  getters: {
  }
});
