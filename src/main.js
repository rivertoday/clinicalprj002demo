import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css'
import router from './routes'
// import Mock from './mock'
import store from './vuex/store'
import Vuex from 'vuex'

// Mock.bootstrap() //使用express作为后端时,要屏蔽Mock.bootstrap()命令,否则axios传出的请求都被mock截获了
Vue.use(ElementUI)
Vue.use(Vuex)
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    sessionStorage.removeItem('user')
  }
  let user = JSON.parse(sessionStorage.getItem('user'))
  if (!user && to.path !== '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})

var vm = new Vue({
  // el:'#root',
  data:{test:'test'},
  router,
  store,
  render: h => h(App)
}).$mount('#app')
global.vm = vm;//调试用,定义全局vm对象
/*
render: function (createElement) {
  return createElement(App);
}
render: function (h) {
  return h(App);
}
render: (h) ==> {
  return h(App);
}
render: (h) ==> h(App)
旧写法
new Vue({
  el: '#root',
  router,
  components: { App }, // App:App的缩写, ES2015+的语法特性
  template: '<App/>'
)}
 */
