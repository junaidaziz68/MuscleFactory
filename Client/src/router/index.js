import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import CaloriesCalculator from '../views/CaloriesCalculator.vue'
import { useAuth } from '../store/auth'

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
        component: () => import('../views/WorkoutPlan.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../views/Register.vue')
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {
    const { state } = useAuth()
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth !== false)

    // If the route is login or register and user is already authenticated, send to home
    if ((to.name === 'login' || to.name === 'register') && state.isAuthenticated) {
        next({ name: 'dashboard' })
    }
    // If route doesn't have requiresAuth: false natively (meaning it requires auth by default)
    // We treat all main routes as requiring auth except login and register
    else if (to.name !== 'login' && to.name !== 'register' && !state.isAuthenticated) {
        next({ name: 'login' })
    }
    else {
        next()
    }
})

export default router
