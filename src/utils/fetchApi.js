import axios from '@/utils/axios';
import { message } from 'ant-design-vue';

class FetchApi {
  constructor(url) {
    this.url = url;
    this.currentPage = 1;
    this.lastPage = 1;
  }

  async call(payload = {}) {
    try {
      const response = await axios.post(this.url, {
        ...payload,
        page: this.currentPage,
      });

      const { page, pageSize, total } = response.data.pagination;
      this.lastPage = Math.ceil(total / pageSize);

      if (this.currentPage > this.lastPage) {
        return { success: true, data: null, hasMore: false }; // No more pages
      }
      return {
        success: true,
        data: response.data,
        hasMore: this.currentPage < this.lastPage,
      };
    } catch (err) {
      if (err.response && err.response.data.msg) {
        message.error(err.response.data.msg);
      }
      message.error(err.message);
      return { success: false, error: err, hasMore: false };
    }
  }

  async next(payload = {}) {
    if (this.currentPage < this.lastPage) {
      this.currentPage += 1;
      return this.call(payload);
    } else {
      return { success: true, data: null, hasMore: false }; // No more pages
    }
  }

  async prev(payload = {}) {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
      return this.call(payload);
    } else {
      return { success: true, data: null, hasMore: false }; // No previous pages
    }
  }

  async page(payload = {}, page) {
    if (page > 0 && page <= this.lastPage) {
      this.currentPage = page;
      return this.call(payload);
    } else {
      return {
        success: false,
        error: new Error('Invalid page number'),
        hasMore: false,
      };
    }
  }
}

// 导出一个工厂函数来创建实例
const createFetchApi = (url) => new FetchApi(url);

export { createFetchApi as default };
