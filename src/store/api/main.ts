import axios from '@/utils/axios';
import store from '@/store/index.js';
export default {
//==================取得全局資訊===================//
async get_main_info({ commit }, ) {
    const res = await axios.get('/api/main/info');
        if (!res.error) {
        store.commit('set_main_info', res)
            return res;
        } else {
            alert(res.msg);
            return false;
        }
    },
//==================取得全局資訊===================//
async get_countries_code({ commit }, ) {
    const res = await axios.post('/api/main/country-codes');
        if (!res.error) {
            return res.ret.data;
        } else {
            alert(res.msg);
            return false;
        }
    }
}
   