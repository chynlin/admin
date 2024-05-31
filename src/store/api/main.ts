import axios from '@/utils/axios';
import store from '@/store/index.js';
export default {
//==================取得全局資訊===================//
async get_main_info() {
    const res = await axios.get('/api/main/info');
        if (!res.error) {
        store.commit('set_main_info', res)
            return res;
        } else {
            alert(res.msg);
            return false;
        }
    }
}
   