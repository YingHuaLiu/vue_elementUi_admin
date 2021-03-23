import Vue from 'vue';
import VueRouter from 'vue-router';

// import Login from '../components/Login.vue';
// import Home from '../components/Home';
// import Welcome from '../components/Welcome';
const Login = () => import(/* webpackChunkName:"Login_Home_Welcome" */'../components/Login.vue');
const Home = () => import(/* webpackChunkName:"Login_Home_Welcome" */'../components/Home.vue');
const Welcome = () => import(/* webpackChunkName:"Login_Home_Welcome" */'../components/Login.vue');

// import Users from '../components/User/Users';
// import Rights from '../components/power/Rights';
// import Roles from '../components/power/Roles';
const Users = () => import(/* webpackChunkName:"Users_Rights_Roles" */'../components/User/Users.vue');
const Rights = () => import(/* webpackChunkName:"Users_Rights_Roles" */'../components/power/Rights.vue');
const Roles = () => import(/* webpackChunkName:"Users_Rights_Roles" */'../components/power/Roles.vue');

// import Cate from '../components/goods/Cate';
// import Params from '../components/goods/Params';
// import List from '../components/goods/List';
// import Add from '../components/goods/Add';
const Cate = () => import(/* webpackChunkName:"Cate_Params_List_Add" */'../components/goods/Cate.vue');
const Params = () => import(/* webpackChunkName:"Cate_Params_List_Add" */'../components/goods/Params.vue');
const List = () => import(/* webpackChunkName:"Cate_Params_List_Add" */'../components/goods/List.vue');
const Add = () => import(/* webpackChunkName:"Cate_Params_List_Add" */'../components/goods/Add.vue');

// import Order from '../components/order/Order';
// import Report from '../components/report/Report';
const Order = () => import(/* webpackChunkName:"Order_Report" */'../components/order/Order.vue');
const Report = () => import(/* webpackChunkName:"Order_Report" */'../components/report/Report.vue');

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
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }
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
