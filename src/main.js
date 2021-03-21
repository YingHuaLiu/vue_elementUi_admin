import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './plugins/element.js';
import './assets/css/global.css';
import './assets/fonts/iconfont.css';
import axios from 'axios';
import TreeTable from 'vue-table-with-tree-grid';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

Vue.prototype.$http = axios;
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1';
axios.interceptors.request.use(config => {
  // 开启进度条
  NProgress.start();
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
});
axios.interceptors.response.use(config => {
  // 关闭进度条
  NProgress.done();
  return config;
});

Vue.config.productionTip = false;

Vue.component('tree-table', TreeTable);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
