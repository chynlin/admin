// src/store/index.ts
import { createStore } from 'vuex';
import product from './api/product'
import main from './api/main'
export default createStore({
  state: {
    mainInfo:{}
  },
  mutations: {
    set_main_info(state, payload) {
      state.mainInfo = payload;
    }
  },
  actions: {
    ...product,
    ...main
  },
  getters: {
  }
});
