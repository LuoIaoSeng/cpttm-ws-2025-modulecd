import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import InstructionsView from '@/views/InstructionsView.vue'
import EditorView from '@/views/EditorView.vue'
import PreviewView from '@/views/PreviewView.vue'
import RankView from '@/views/RankView.vue'
import GameView from '@/views/GameView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/instructions',
      name: 'instructions',
      component: InstructionsView
    },
    {
      path: '/editor',
      name: 'editor',
      component: EditorView
    },
    {
      path: '/editor/:useLocalStorage',
      name: 'editor',
      component: EditorView
    },
    {
      path: '/preview',
      name: 'preview',
      component: PreviewView
    },
    {
      path: '/rank',
      name: 'rank',
      component: RankView
    },
    {
      path: '/game',
      name: 'game',
      component: GameView
    }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue'),
    // },
  ],
})

export default router
