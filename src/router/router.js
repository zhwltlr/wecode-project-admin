import { createRouter, createWebHistory } from 'vue-router'

const requireAuth = () => (to, from, next) => {
  const token = localStorage.getItem('token')
  if (token !== '') {
    return next();
  }
  next('/login');
};


const routes = [
  {
    path: '/detail/:camIdx',
    name: 'Detail',
    component: ()=> import('../views/Detail/Detail.vue'),
    beforeEnter: requireAuth()
  },
  {
    path: '/list',
    name: 'List',
    component: ()=> import('../views/List/List.vue'),
    beforeEnter: requireAuth()
  },
  {
    path: '/',
    name: 'Login',
    component: ()=> import('../views/Login/Login.vue'),
  },
  {
    path: '/register/:camIdx?',
    name: 'Register',
    component: ()=> import('../views/Register/Register.vue'),
    beforeEnter: requireAuth()
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})



export default router
