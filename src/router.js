import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login' // 重定向
    },
    {
      path: '/login',
      name: 'Login',
      component: Login // 登录页
    },
    {
      path: '/admin',
      name: 'admin', // 后台页
      component: () => import(/* webpackChunkName: "admin" */ './views/Admin.vue')
    //   children: [
    //     { path: 'goodslist', name: 'goodslist', component: () => import('./views/GoodsList.vue') }
    //   ]
    }
  ]
})
