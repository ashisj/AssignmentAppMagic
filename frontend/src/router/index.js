import Vue from 'vue'
import Router from 'vue-router'

import DataUpload from '@/components/DataUpload'
import Home from '@/components/Home'
import CheckOut from '@/components/CheckOut'
import Cart from '@/components/Cart'

Vue.use(Router)

export default new Router({
  mode : 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/addProduct',
      name: 'DataUpload',
      component: DataUpload
    },
    {
      path: '/checkout',
      name: 'CheckOut',
      component: CheckOut
    },
    {
      path: '/cart',
      name: 'Cart',
      component: Cart
    }
  ]
})
