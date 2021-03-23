import Vue from 'vue';
import App from './App.vue';
import router from './router';
// import './plugins/element.js';
import './assets/css/global.css';
import './assets/fonts/iconfont.css';
import axios from 'axios';
import TreeTable from 'vue-table-with-tree-grid';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor';
// 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'; // import styles
import 'quill/dist/quill.snow.css'; // for snow theme
import 'quill/dist/quill.bubble.css'; // for bubble theme

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

Vue.filter('dateFormat', function (originValue) {
  const date = new Date(originValue);

  const y = date.getFullYear();
  const m = (date.getMonth() + 1 + '').padStart(2, '0');
  const d = (date.getDay() + '').padStart(2, '0');
  const hh = (date.getHours() + '').padStart(2, '0');
  const mm = (date.getMinutes() + '').padStart(2, '0');
  const ss = (date.getSeconds() + '').padStart(2, '0');

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
});

Vue.use(VueQuillEditor);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
