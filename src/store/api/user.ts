import axios from '@/utils/axios';
import store from '@/store/index.js';
import { message } from 'ant-design-vue';
export default {
    //===================管理員登入===================//
    async admin_login({ commit }, payload) {
    const res = await axios.post('/api/admin/login', payload);
    if (!res.error) {
          localStorage.setItem('token',res.ret.data.token)
          return res.ret;
    } else {
          message.error(res.msg);
          return false;
        }
      },
    //===================用戶列表===================//
    async get_user_list({ commit }, payload) {
        const res = await axios.post('/api/admin/users');
        if (!res.error) {
          return res.ret;
        } else {
          message.error(res.msg);
          return false;
        }
  },
    //===================用戶列表===================//
    async get_admin_list({ commit }, payload) {
        const res = await axios.post('/api/admin/admins');
        if (!res.error) {
          return res.ret;
        } else {
          message.error(res.msg);
          return false;
        }
  },
     //===================取得用戶資料===================//
     async get_user_info({ commit }, payload) {
      const res = await axios.post('/api/admin/user-item', payload);
      if (!res.error) {
        return res.ret.data;
      } else {
        message.error(res.msg);
        return false;
      }
    },
    //===================添加列表===================//
    async add_user({ commit }, payload) {
        const res = await axios.post('/api/admin/add-user', payload);
      if (!res.error) {
        message.success('添加成功');
          return res.ret.data;
        } else {
          message.error(res.msg);
          return false;
        }
      },
    //===================編輯用戶===================//
    async edit_user({ commit }, payload) {
        const res = await axios.post('/api/admin/user-edit', payload);
      if (!res.error) {
        message.success('編輯成功');
          return true;
        } else {
          message.error(res.msg);
          return false;
        }
      },
    //===================刪除用戶===================//
    async delete_user({ commit }, payload) {
        const res = await axios.post('/api/admin/user-delete', payload);
      if (!res.error) {
        message.success('刪除成功');
          return true;
        } else {
          message.error(res.msg);
          return false;
        }
      },
    //===================刪除用戶===================//
    async freeze_user({ commit }, payload) {
        const res = await axios.post('/api/admin/user-freeze', payload);
      if (!res.error) {
          return true;
        } else {
          message.error(res.msg);
          return false;
        }
      },
}