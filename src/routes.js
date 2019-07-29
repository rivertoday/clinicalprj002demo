import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      component: () => import('@/components/Login.vue'),
      name: '',
      hidden: true //用户自定义属性,主要用来控制本条路由是否显示在菜单中
    },
    {
      path: '/404',
      component: () => import('@/components/404.vue'),
      name: '',
      hidden: true
    },
    {
      path: '/home',
      component: () => import('@/components/Home.vue'),
      name: '',
      iconCls: 'fa fa-address-card',
      leaf: false, //用户自定义属性,用来确定某条菜单是否还有下级菜单
      children: [
        { path: '/home/table', component: () => import('@/components/pages/Table.vue'), name: '数据列表' }
      ]
    },
    // {
    //   path: '/home',
    //   component: () => import('@/components/Home.vue'),
    //   name: '导航二',
    //   iconCls: 'el-icon-message', // 用户自定义属性,图标样式class
    //   leaf:true,
    //   // 路由嵌套参数,vue-router定义的参数
    //   children: [
    //     { path: '/home/form', component: () => import('@/components/views/nav1/Form.vue'), name: 'Form' },
    //     { path: '/home/list', component: () => import('@/components/views/nav1/List.vue'), name: 'List' }
    //   ]
    // },
    {
      path: '/home',
      component: () => import('@/components/Home.vue'),
      name: '测试',
      iconCls: 'fa fa-id-card-o',
      leaf:true,
      children: [
        { path: '/home/vuex', component: () => import('@/components/pages/Vuex.vue'), name: 'Vuex' }
      ]
    },
    {
      path: '/home',
      component: () => import('@/components/Home.vue'),
      name: 'Charts',
      iconCls: 'fa fa-bar-chart',
      leaf: false,
      children: [
        { path: '/home/echarts', component: () => import('@/components/pages/Echarts.vue'), name: '数据分析' }
      ]
    },
    {
      path: '*',
      hidden: true,
      redirect: { path: '/404' }
    }
  ]
})
