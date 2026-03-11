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
        path: '/diet-plan',
        name: 'diet-plan',
        component: () => import('../views/DietPlan.vue'),
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
    // Check if the current user is authenticated (naive check using localStorage presence for synchronous load)
    const isAuthenticated = !!localStorage.getItem('token')

    // Check if route requires auth
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

    // If the route is login or register and user is already authenticated, send to home
    if ((to.name === 'login' || to.name === 'register') && isAuthenticated) {
        next({ name: 'dashboard' })
    }
    // If route requires auth and user is NOT authenticated, redirect to login
    else if (requiresAuth && !isAuthenticated) {
        next({ name: 'login' })
    }
    else {
        next()
    }
})

export default router
