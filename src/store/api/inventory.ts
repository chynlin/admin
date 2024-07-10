
import axios from '@/utils/axios';
import { message } from 'ant-design-vue';
export default {

  //===================获取库存列表==================//
  async getInventoryList({ commit }, payload) {
    const res = await axios.post('/api/inventory/list', payload);
    if (!res.error) {
      return res.ret.data;
    } else {
      message.error(res.msg);
      return false;
    }
  },

  //===================獲取庫存變動歷史==================//
  async getInventoryHistory({ commit }, payload) {
    const res = await axios.post('/api/inventory/history', payload);
    if (!res.error) {
      
      return res.ret.data;
    } else {
      message.error(res.msg);
      return false;
    }
  },

  //===================产品入库==================//
  async setInventoryIn({ commit }, payload) {
    const res = await axios.post('/api/inventory/in', payload);
    if (!res.error) {
      message.success('設定成功');
      return res.ret.data;
    } else {
      message.error(res.msg);
      return false;
    }
  },

  //===================产品出库==================//
  async setInventoryOut({ commit }, payload) {
    const res = await axios.post('/api/inventory/out', payload);
    if (!res.error) {
      message.success('設定成功');
      return res.ret.data;
    } else {
      message.error(res.msg);
      return false;
    }
  },

  

  //===================取得庫存警告閥值==================//
  async getInventoryThresholds({ commit }, payload) {
    const res = await axios.post('/api/inventory/thresholds', payload);
    if (!res.error) {
      return res.ret.data;
    } else {
      message.error(res.msg);
      return false;
    }
  },

  //===================設置庫存警告閥值==================//
  async setInventoryThreshold({ commit }, payload) {
    const res = await axios.post('/api/inventory/set-stock-threshold', payload);
    if (!res.error) {
      message.success('库存预警阈值设置成功');
      return res.ret.data;
    } else {
      message.error(res.msg);
      return false;
    }
  },
}
    