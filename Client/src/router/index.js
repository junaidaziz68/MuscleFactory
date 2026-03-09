import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import CaloriesCalculator from '../views/CaloriesCalculator.vue'

const routes = [
    {
        path: '/',
        name: 'dashboard',
        component: Dashboard
    },
    {
        path: '/calculator',
        name: 'calculator',
        component: CaloriesCalculator
    },
    {
        path: '/workout-plan',
        name: 'workout-plan',
        component: () => import('../views/WorkoutPlan.vue')
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router
