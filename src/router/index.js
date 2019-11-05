import Vue from 'vue'
import Router from 'vue-router'
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading
/* layout */
import Layout from '../views/layout/Layout'

const _import = require('./_import_' + process.env.NODE_ENV)
Vue.use(Router)
export const constantRouterMap = [
  {path: '/login', component: _import('login/index'), hidden: true},
  {path: '/404', component: _import('404'), hidden: true},
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    hidden: true,
    children: [{
      path: 'dashboard', component: _import('dashboard/index')
    }]
  }
]
export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})
export const asyncRouterMap = [
  // {
  //   path: '/system',
  //   component: Layout,
  //   redirect: '/system/article',
  //   name: '功能模块',
  //   meta: {title: '功能模块', icon: 'tree'},
  //   children: [
  //     {
  //       path: 'article',
  //       name: '文章',
  //       component: _import('article/article'),
  //       meta: {title: '文章', icon: 'example'},
  //       menu: 'article'
  //     },
  //   ]
  // },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/',
    name: '',
    meta: {title: '用户权限', icon: 'table'},
    children: [
      {
        path: '', name: '用户列表', component: _import('user/user'), meta: {title: '用户列表', icon: 'user'}, menu: 'user'
      },
      {
        path: 'role',
        name: '权限管理',
        component: _import('user/role'),
        meta: {title: '权限管理', icon: 'password'},
        menu: 'role'
      },
    ]
  },{
    path: '/membership',
    component: Layout,
    name: '',
    meta: {title: '会员管理', icon: 'tree'},
    children: [
      {
        path: 'membership',
        name: '会员信息',
        component: _import('membership/membership'),
        meta: {title: '会员信息', icon: 'example'},
        menu: 'membership'
      }
    ]
  },{
    path: '/set',
    component: Layout,
    name: '',
    meta: {title: '设置', icon: 'tree'},
    children: [
      {
        path: 'set',
        name: '卡类设置',
        component: _import('set/set'),
        meta: {title: '卡类设置', icon: 'example'},
        menu: 'set'
      }
    ]
  },{
    path: '/card',
    component: Layout,
    name: '',
    meta: {title: '卡片操作', icon: 'tree'},
    children: [
      {
        path: '', name: '开卡', component: _import('card/opencard'), meta: {title: '开卡', icon: 'example'}, menu: 'opencard'
      },
      {
        path: 'rechargecard',
        name: '充值',
        component: _import('card/rechargecard'),
        meta: {title: '充值', icon: 'password'},
        menu: 'rechargecard'
      },
    ]
  },
  {path: '*', redirect: '/404', hidden: true}
]
