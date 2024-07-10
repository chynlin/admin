
import axios from '@/utils/axios';
import { message } from 'ant-design-vue';
export default {

  //===================获取订单列表==================//
  async getOrderList({ commit }, payload) {
    const res = await axios.post('/api/order/list', payload);
    if (!res.error) {
      
      return res.ret;
    } else {
      message.error(res.msg);
      return false;
    }
  },

  //===================获取订单详情==================//
  async getOrderInfo({ commit }, payload) {
    const res = await axios.post('/api/order/info', payload);
    if (!res.error) {
      
      return res.ret.data;
    } else {
      message.error(res.msg);
      return false;
    }
  },

  //===================更新订单状态==================//
  async setOrderStatus({ commit }, payload) {
    const res = await axios.post('/api/order/update-status', payload);
    if (!res.error) {
      
      return res.ret.data;
    } else {
      message.error(res.msg);
      return false;
    }
  },

  //===================更新物流信息==================//
  async setOrderLogistics({ commit }, payload) {
    const res = await axios.post('/api/order/update-logistics', payload);
    if (!res.error) {
      
      return res.ret.data;
    } else {
      message.error(res.msg);
      return false;
    }
  },

  //===================新增訂單==================//
  async createOrder({ commit }, payload) {
    const res = await axios.post('/api/order/create', payload);
    if (!res.error) {
      message.success('訂單創建成功');
      return res.ret.data;
    } else {
      message.error(res.msg);
      return false;
    }
  },

  //===================修改訂單==================//
  async updateOrder({ commit }, payload) {
    const res = await axios.post('/api/order/update', payload);
    if (!res.error) {
      message.success('訂單更新成功');
      return true;
    } else {
      message.error(res.msg);
      return false;
    }
  },

  //===================刪除訂單==================//
  async deleteOrder({ commit }, payload) {
    const res = await axios.post('/api/order/delete', payload);
    if (!res.error) {
      message.success('訂單刪除成功');
      return true;
    } else {
      message.error(res.msg);
      return false;
    }
  },
}
    