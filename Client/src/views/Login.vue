<template>
  <div class="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
    <div class="max-w-md w-full space-y-8 bg-zinc-900 p-8 rounded-2xl shadow-xl border border-zinc-800">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-zinc-100">Sign in to your account</h2>
        <p class="mt-2 text-center text-sm text-zinc-400">
          Or
          <router-link to="/register" class="font-medium text-emerald-500 hover:text-emerald-400 transition-colors">
            create a new account
          </router-link>
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label for="email" class="sr-only">Email address</label>
            <input id="email" name="email" type="email" autocomplete="email" required v-model="email"
                   class="appearance-none relative block w-full px-3 py-3 border border-zinc-700 bg-zinc-800 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                   placeholder="Email address" />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input id="password" name="password" type="password" autocomplete="current-password" required v-model="password"
                   class="appearance-none relative block w-full px-3 py-3 border border-zinc-700 bg-zinc-800 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                   placeholder="Password" />
          </div>
        </div>

        <div>
          <button type="submit" :disabled="isLoading"
                  class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-zinc-900 bg-emerald-500 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="h-5 w-5 text-emerald-600 group-hover:text-emerald-500 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
            </span>
            {{ isLoading ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>
        
        <div v-if="errorMessage" class="text-red-500 text-sm text-center mt-2 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
          {{ errorMessage }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { AuthAPI } from '../api'
import { useAuth } from '../store/auth'

const router = useRouter()
const { setAuth } = useAuth()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
    isLoading.value = true
    errorMessage.value = ''
    try {
        const response = await AuthAPI.login(email.value, password.value)
        setAuth(response.token, response.user)
        router.push('/') // Redirect to dashboard
    } catch (err) {
        errorMessage.value = err.message || 'Failed to login'
    } finally {
        isLoading.value = false
    }
}
</script>
