import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import { Message } from "element-ui";
Vue.use(VueRouter)


const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login.vue')
  },
  // {
  //   path: '/sign',
  //   name: 'sign',
  //   component: () => import('../views/sign.vue')
  // },
  {
    path: '/person',
    name: 'person',
    meta: { userAuth: true },//登录鉴权
    component: () => import('../components/personPage.vue')
  },
  {
    path: '/collection',
    name: 'collection',
    meta: { userAuth: true },//登录鉴权
    component: () => import('../components/collection.vue')
  },
  {
    path: '/',
    name: 'index',
    component: () => import('../views/index.vue')
  },
  {
    path: '/bookInfo/:reference_num',
    name: 'bookInfo',
    component: () => import('../views/bookInfo.vue')
  },
  {
    path: '/adminManage',
    name: 'adminManage',
    meta: { adminAuth: true },//登录鉴权
    component: () => import('../components/admin/adminManage.vue')
  },
  {
    path: '/manageViolate',
    name: 'manageViolate',
    meta: { adminAuth: true },//登录鉴权
    component: () => import('../components/admin/manageViolate.vue')
  },
  {
    path: '/manageBook',
    name: 'manageBook',
    meta: { adminAuth: true },//登录鉴权
    component: () => import('../components/admin/manageBook.vue')
  },
  {
    path: '/manageUser',
    name: 'manageUser',
    meta: { adminAuth: true },//登录鉴权
    component: () => import('../components/admin/manageUser.vue')
  },
  {
    path: '/manageOrder',
    name: 'manageOrder',
    meta: { adminAuth: true },//登录鉴权
    component: () => import('../components/admin/manageOrder.vue')
  },
  {
    path: '/dataVisual',
    name: 'dataVisual',
    meta: { adminAuth: true },//登录鉴权
    component: () => import('../components/admin/dataVisual.vue')
  },
  {
    path: '/classSort',
    name: 'classSort',
    component: () => import('../views/classSort.vue')
  },
  {
    path: '/categorySearch/:categoryId',
    name: 'categorySearch',
    component: () => import('../views/categorySearch.vue')
  },
  {
    path: '/searchBook',
    name: 'searchBook',
    component: () => import('../views/searchBook.vue')
  },
]
const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  //to.meta.auth 表示需要做登鉴权
  //不需要的 可以直接next
  if (to.meta.userAuth) {
    //store.state.token 表示已经登录 可以直接next
    //没有登录 跳转到/login 并携带参数redirect 方便登录后直接跳转到to.path
    if (store.state.role == 0) {
      next();
    }
    else if (store.state.role == 1) {
      next();
    } else {
      next({
        path: '/login',
        query: { redirect: to.path }
      })
      Message("请登录后再试")
    }
  } 
  else if (to.meta.adminAuth) {
    if (store.state.role == 1) {
      next();
    } else {
      next({
        path: '/',
        query: { redirect: to.path }
      })
      Message("无权限访问")
    }
  }
  else {
    next();
  }
})

export default router