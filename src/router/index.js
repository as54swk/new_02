import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('../views/Index')
  },
  {
    path: '/login',
    component: () => import('../views/Login')
  },
  {
    path: '/register',
    component: () => import('../views/Register')
  },
  {
    path: '/personal',
    component: () => import('../views/Personal'),
    // 需要验证令牌的页面添加元信息
    meta: {
      authority: true
    }
  },
  {
    path: '/edit',
    component: () => import('../views/Edit'),
    meta: {
      authority: true
    }
  },
  {
    path: '/follow',
    component: () => import('../views/Follow'),
    meta: {
      authority: true
    }
  },
  {
    path: '/collect',
    component: () => import('../views/Collect'),
    meta: {
      authority: true
    }
  },
  {
    path: '/category',
    component: () => import('../views/Categories')
  },
  {
    path: '/history',
    component: () => import('../views/History')
  },
  {
    path: '/detail/:id?',
    component: () => import('../views/Detail')
  },
  {
    path: '/video/:id?',
    component: () => import('../views/Video')
  },
  {
    path: '/comments/:id?',
    component: () => import('../views/Comments')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
// 路由守卫,登录页,注册页,首页直接访问,其他页面需要验证token
router.beforeEach((to, from, next) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
  // 个人中心页,关注页等这种需要验证令牌才能访问
  if (to.meta.authority) {
    userInfo.token ? next() : next('/login');
  } else {
    next();
  }
})
export default router
