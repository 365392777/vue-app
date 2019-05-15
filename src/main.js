import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 1.引入element-ui
import ElementUI from 'element-ui'
// 2.引入element-ui样式
import 'element-ui/lib/theme-chalk/index.css'

// 1.引入axios
import axios from 'axios'

// 3.全局注册组件
Vue.use(ElementUI)
Vue.config.productionTip = false
// 2.把axios绑定到vue实例的属性$axios
Vue.prototype.$axios = axios
axios.defaults.withCredentials = true // 想要跨域带上cookies，在全局上添加withCredentials: true

// 设置基准路径
axios.defaults.baseURL = 'http://localhost:8899' // 添加请求默认路径
// 设置导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  }
  if (to.path === '/login' && localStorage.getItem('realname')) {
    next('/admin')
    console.log('你已经登录过,为你跳转到admin')
  }
  if (!localStorage.getItem('uname')) {
    next('/login')
  } else {
    next()
  }
  next()
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
