import axios from 'axios';
import qs from 'qs';
import router from '../router';
import store from '../store';
import { message } from 'ant-design-vue';

// axios.defaults.baseURL = ''  //正式
// axios.defaults.baseURL = 'http://test' //测试

//post请求头
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded;charset=UTF-8';
//设置超时
axios.defaults.timeout = 10000;

axios.interceptors.request.use(
  (config) => {
    // 从LocalStorage中获取token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = token; // 这里的token包含 'Bearer '
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    console.log(response.status);
    if (response.status == 200) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  (error) => {
    if (error.response.status == 401 || error.response.status == 400) {
      message.error('請先登入');
      router.push('/sign');
    }
  }
);
export default {
  post(url, data) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: url,
        data: data instanceof FormData ? data : qs.stringify(data),
      })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  get(url, data) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url,
        params: data,
      })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};
