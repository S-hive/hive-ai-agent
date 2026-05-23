import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import StudyChatView from '../views/StudyChatView.vue'
import ManusChatView from '../views/ManusChatView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/study', name: 'study', component: StudyChatView },
    { path: '/manus', name: 'manus', component: ManusChatView },
  ],
})

export default router
