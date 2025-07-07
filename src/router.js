import { createRouter, createWebHistory } from 'vue-router'
import Login from './views/Login.vue'
import Files from './views/Files.vue'

const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/files', name: 'Files', component: Files }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard: require login for /files
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (to.path === '/files' && !isLoggedIn) {
    next({ path: '/' });
  } else {
    next();
  }
});

export default router
