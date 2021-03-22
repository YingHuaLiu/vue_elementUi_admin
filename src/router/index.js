import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../components/Login.vue';
import Home from '../components/Home';
import Welcome from '@/components/Welcome';
import Users from '@/components/User/Users';
import Rights from '@/components/power/Rights';
import Roles from '@/components/power/Roles';
import Cate from '@/components/goods/Cate';
import Params from '@/components/goods/Params';
import List from '@/components/goods/List';
import Add from '@/components/goods/Add';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: List },
      { path: '/goods/add', component: Add }
    ]
  }
];

const router = new VueRouter({
  routes
});

// 挂载路由守卫
router.beforeEach((to, from, next) => {
  // to表示将要访问的路径
  // from表示从哪个路径跳转过来
  // next是一个函数，表示放行
  // next('/path')表示强制跳转到/path
  if(to.path === '/login') {
    return next();
  }
  const tokenStr = window.sessionStorage.getItem('token');
  if(!tokenStr) {
    return next('/login');
  }
  next();
});
export default router;
