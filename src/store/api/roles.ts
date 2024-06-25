import axios from '@/utils/axios';
import store from '@/store/index.js';
import { message } from 'ant-design-vue';
export default {
    //===================角色列表===================//
    async get_roles_list({ commit }, payload) {
        const res = await axios.post('/api/roles/list', payload);
        if (!res.error) {
            return res.ret.data;
        } else {
            message.error(res.msg);
            return false;
        }
    },
    //===================角色詳情===================//
    async get_role_item({ commit }, payload) {
        const res = await axios.post('/api/roles/item', payload);
        if (!res.error) {
            return res.ret.data;
        } else {
            message.error(res.msg);
            return false;
        }
    },
    //===================刪除角色===================//
    async delete_roles({ commit }, payload) {
        const res = await axios.post('/api/roles/delete', payload);
        if (!res.error) {
            return true;
        } else {
            message.error(res.msg);
            return false;
        }
    },
    //===================新增角色===================//
    async create_roles({ commit }, payload) {
        const res = await axios.post('/api/roles/create', payload);
        if (!res.error) {
            return true;
        } else {
            message.error(res.msg);
            return false;
        }
    },
    //===================編輯角色===================//
    async update_roles({ commit }, payload) {
        const res = await axios.post('/api/roles/update', payload);
        if (!res.error) {
            return true;
        } else {
            message.error(res.msg);
            return false;
        }
    },
}

