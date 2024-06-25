import axios from '@/utils/axios';
import store from '@/store/index.js';
import { message } from 'ant-design-vue';
export default {
    //===================商品列表===================//
    async get_products_list({ commit }) {
        const res = await axios.post('/api/products/list');
        if (!res.error) {
          return res.ret;
        } else {
          alert(res.msg);
          return false;
        }
      },
    //===================商品詳情===================//
    async get_products_info({ commit }, payload) {
        const res = await axios.post('/api/products/info', payload);
        if (!res.error) {
          return res.ret.data;
        } else {
          alert(res.msg);
          return false;
        }
  },
    //===================添加商品==================//
    async add_product({ commit }, payload) {
      const res = await axios.post('/api/products/create', payload);
    if (!res.error) {
      message.success('添加成功');
        return res.ret.data;
      } else {
        message.error(res.msg);
        return false;
      }
  },
    //===================刪除商品圖片==================//
    async remove_product_image({ commit }, payload) {
      const res = await axios.post('/api/products/delete-image', payload);
    if (!res.error) {
      message.success('刪除成功');
        return res.ret.data;
      } else {
        message.error(res.msg);
        return false;
      }
    },
  //===================編輯商品===================//
  async edit_product({ commit }, payload) {
      const res = await axios.post('/api/products/edit', payload);
    if (!res.error) {
      message.success('編輯成功');
        return true;
      } else {
        message.error(res.msg);
        return false;
      }
    },
    //===================商品刪除===================//
    async delete_product({ commit }, payload) {
        const res = await axios.post('/api/products/delete', payload);
        if (!res.error) {
          return true;
        } else {
          alert(res.msg);
          return false;
        }
      },
    //===================商品上下架===================//
    async set_products_status({ commit }, payload) {
        const res = await axios.post('/api/products/toggle-status', payload);
        if (!res.error) {
          return true;
        } else {
          alert(res.msg);
          return false;
        }
  },
    //===================商品詳情===================//
  async get_product_info({ commit }, payload) {
    const res = await axios.post('/api/products/info', payload);
    if (!res.error) {
        return res.ret.data;
    } else {
        message.error(res.msg);
        return false;
    }
},
    //===================商品分類列表===================//
    async get_products_groups({ commit }) {
        const res = await axios.post('/api/group/list');
        if (!res.error) {
          return res.ret.data;
        } else {
          alert(res.msg);
          return false;
        }
      },
    //===================商品分類===================//
    async get_group_item({ commit },payload) {
        const res = await axios.post('/api/group/item',payload);
        if (!res.error) {
          return res.ret.data;
        } else {
          alert(res.msg);
          return false;
        }
      },
    //===================分類更改===================//
    async edit_group({ commit },payload) {
        const res = await axios.post('/api/group/update',payload);
      if (!res.error) {
        message.success('編輯成功');
          return true;
        } else {
          alert(res.msg);
          return false;
        }
      },
    //===================分類新增===================//
    async create_group({ commit },payload) {
        const res = await axios.post('/api/group/create',payload);
      if (!res.error) {
        message.success('新增成功');
          return true;
        } else {
          alert(res.msg);
          return false;
        }
  },
    //===================刪除分類===================//
  async delete_group({ commit }, payload) {
    const res = await axios.post('/api/group/delete', payload);
    if (!res.error) {
        return true;
    } else {
        message.error(res.msg);
        return false;
    }
},
    
    //===================品牌列表===================//
    async get_brand_list({ commit }, payload) {
      const res = await axios.post('/api/brand/list', payload);
      if (!res.error) {
          return res.ret.data;
      } else {
          message.error(res.msg);
          return false;
      }
  },
  //===================品牌詳情===================//
  async get_brand_info({ commit }, payload) {
      const res = await axios.post('/api/brand/info', payload);
      if (!res.error) {
          return res.ret.data;
      } else {
          message.error(res.msg);
          return false;
      }
  },
  //===================刪除品牌===================//
  async delete_brand({ commit }, payload) {
      const res = await axios.post('/api/brand/delete', payload);
      if (!res.error) {
          return true;
      } else {
          message.error(res.msg);
          return false;
      }
  },
  //===================新增品牌===================//
  async create_brand({ commit }, payload) {
      const res = await axios.post('/api/brand/create', payload);
      if (!res.error) {
          return true;
      } else {
          message.error(res.msg);
          return false;
      }
  },
  //===================編輯品牌===================//
  async update_brand({ commit }, payload) {
      const res = await axios.post('/api/brand/update', payload);
      if (!res.error) {
          return true;
      } else {
          message.error(res.msg);
          return false;
      }
  },
}