<template>
  <div class="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
    <div class="max-w-md w-full space-y-8 bg-zinc-900 p-8 rounded-2xl shadow-xl border border-zinc-800">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-zinc-100">Create your account</h2>
        <p class="mt-2 text-center text-sm text-zinc-400">
          Already have an account?
          <router-link to="/login" class="font-medium text-emerald-500 hover:text-emerald-400 transition-colors">
            Sign in instead
          </router-link>
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="space-y-4">
          <div>
            <label for="username" class="sr-only">Username</label>
            <input id="username" name="username" type="text" autocomplete="username" required v-model="username"
                   class="appearance-none relative block w-full px-3 py-3 border border-zinc-700 bg-zinc-800 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                   placeholder="Username" />
          </div>
          <div>
            <label for="email" class="sr-only">Email address</label>
            <input id="email" name="email" type="email" autocomplete="email" required v-model="email"
                   class="appearance-none relative block w-full px-3 py-3 border border-zinc-700 bg-zinc-800 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                   placeholder="Email address" />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input id="password" name="password" type="password" autocomplete="new-password" required v-model="password"
                   class="appearance-none relative block w-full px-3 py-3 border border-zinc-700 bg-zinc-800 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                   placeholder="Password" />
          </div>
        </div>

        <div>
          <button type="submit" :disabled="isLoading"
                  class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-zinc-900 bg-emerald-500 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isLoading ? 'Creating account...' : 'Create account' }}
          </button>
        </div>
        
        <div v-if="successMessage" class="text-green-500 text-sm text-center mt-2 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
          {{ successMessage }}
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

const router = useRouter()

const username = ref('')
const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const handleRegister = async () => {
    isLoading.value = true
    errorMessage.value = ''
    successMessage.value = ''
    try {
        await AuthAPI.register(username.value, email.value, password.value)
        successMessage.value = 'Account created successfully! Redirecting to login...'
        setTimeout(() => {
            router.push('/login')
        }, 1500)
    } catch (err) {
        errorMessage.value = err.message || 'Failed to register'
    } finally {
        isLoading.value = false
    }
}
</script>
