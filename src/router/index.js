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
  {
    path: '/sign',
    name: 'sign',
    component: () => import('../views/sign.vue')
  },
  {
    path: '/person',
    name: 'person',
    meta: { userAuth: true },//登录鉴权
    component: () => import('../components/personPage.vue')
  },
  {
    path: '/change',
    name: 'change',
    meta: { userAuth: true },//登录鉴权
    component: () => import('../components/userInfoChange.vue')
  },
  {
    path: '/',
    name: 'index',
    component: () => import('../views/index.vue')
  },
  {
    path: '/bookInfo/:id',
    name: 'bookInfo',
    component: () => import('../views/bookInfo.vue')
  },
  {
    path: '/shopManage',
    name: 'shopManage',
    meta: { shopAuth: true },//登录鉴权
    component: () => import('../components/shopManage/shopManage.vue')
  },
  {
    path: '/bookM',
    name: 'bookM',
    meta: { shopAuth: true },//登录鉴权
    component: () => import('../components/shopManage/bookM.vue')
  },
  {
    path: '/orderM',
    name: 'orderM',
    meta: { shopAuth: true },//登录鉴权
    component: () => import('../components/shopManage/orderM.vue')
  },
  {
    path: '/orderInfo/:order_id',
    name: 'orderInfo',
    meta: { shopAuth: true },//登录鉴权
    component: () => import('../components/shopManage/orderInfo.vue')
  },
  {
    path: '/shopIndex/:shop_id',
    name: 'shopIndex',
    component: () => import('../views/shopIndex.vue')
  },
  {
    path: '/adminManage',
    name: 'adminManage',
    meta: { adminAuth: true },//登录鉴权
    component: () => import('../components/admin/adminManage.vue')
  },
  {
    path: '/manageClass',
    name: 'manageClass',
    meta: { adminAuth: true },//登录鉴权
    component: () => import('../components/admin/manageClass.vue')
  },
  {
    path: '/manageMerchant',
    name: 'manageMerchant',
    meta: { adminAuth: true },//登录鉴权
    component: () => import('../components/admin/manageMerchant.vue')
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
    path: '/shopping/:bookid/:num',
    name: 'shopping',
    meta: { userAuth: true },//登录鉴权
    component: () => import('../components/shopping.vue')
  },
  {
    path: '/refundM',
    name: 'refundM',
    meta: { shopAuth: true },//登录鉴权
    component: () => import('../components/shopManage/refundM.vue')
  },
  {
    path: '/refundInfo/:id',
    name: 'refundInfo',
    meta: { shopAuth: true },//登录鉴权
    component: () => import('../components/shopManage/refundInfo.vue')
  },
  {
    path: '/userorder/:orderId',
    name: 'userorder',
    meta: { userAuth: true },//登录鉴权
    component: () => import('../views/userOrder.vue')
  },
  {
    path: '/orderDetail/:orderId',
    name: 'orderDetail',
    meta: { userAuth: true },//登录鉴权
    component: () => import('../views/orderDetail.vue')
  },
  {
    path: '/refund/:bookId',
    name: 'refund',
    meta: { userAuth: true },//登录鉴权
    component: () => import('../views/refund.vue')
  },
  {
    path: '/service/:bookId/:serviceId',
    name: 'service',
    meta: { userAuth: true },//登录鉴权
    component: () => import('../views/service.vue')
  },
  {
    path: '/remark/:bookId',
    name: 'remark',
    meta: { userAuth: true },//登录鉴权
    component: () => import('../views/remark.vue')
  },
  {
    path: '/classSort',
    name: 'classSort',
    component: () => import('../views/classSort.vue')
  },
  {
    path: '/shopInfo',
    name: 'shopInfo',
    meta: { shopAuth: true },
    component: () => import('../components/shopManage/shopInfo.vue')
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
  } else if (to.meta.shopAuth) {
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
  else if (to.meta.adminAuth) {
    if (store.state.role == 2) {
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