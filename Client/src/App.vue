<template>
  <div class="flex h-screen bg-zinc-950 text-zinc-100 font-sans">
    <!-- Sidebar -->
    <aside v-if="state.isAuthenticated" :class="[
      'fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900 border-r border-zinc-800 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
    ]">
      <div class="flex flex-col h-full">
        <div class="p-6 flex items-center gap-3">
          <div class="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Activity class="w-6 h-6 text-zinc-950" />
          </div>
          <h1 class="text-xl font-bold tracking-tight">MuscleFactory</h1>
        </div>

        <nav class="flex-1 px-4 space-y-1">
          <router-link v-for="item in navItems" :key="item.name" :to="item.path"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group hover:bg-zinc-800"
            :class="{ 'bg-zinc-800 text-emerald-400': $route.path === item.path }"
          >
            <component :is="item.icon" class="w-5 h-5 transition-colors" 
              :class="{ 'text-emerald-400': $route.path === item.path, 'text-zinc-400 group-hover:text-zinc-200': $route.path !== item.path }" />
            <span class="font-medium text-sm">{{ item.name }}</span>
          </router-link>
        </nav>

        <div class="p-4 border-t border-zinc-800">
          <div class="flex items-center gap-3 px-3 py-2">
            <div class="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold uppercase truncate">
              {{ state.user?.username?.substring(0, 2) || 'U' }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-medium text-zinc-200 truncate">{{ state.user?.username || 'User' }}</p>
              <p class="text-[10px] text-zinc-500 truncate">{{ state.user?.email || '' }}</p>
            </div>
            <button @click="handleLogout" class="p-2 text-zinc-400 hover:text-red-400 transition-colors ml-auto" title="Log out">
              <LogOut class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Topbar (Mobile) -->
      <header v-if="state.isAuthenticated" class="lg:hidden h-16 flex items-center justify-between px-6 bg-zinc-900/50 backdrop-blur-xl border-b border-zinc-800/50 sticky top-0 z-40">
        <div class="flex items-center gap-3">
          <Activity class="w-6 h-6 text-emerald-500" />
          <span class="font-bold">FitnessPro</span>
        </div>
        <button @click="isSidebarOpen = !isSidebarOpen" class="p-2 text-zinc-400 hover:text-zinc-100 transition-colors">
          <Menu v-if="!isSidebarOpen" class="w-6 h-6" />
          <X v-else class="w-6 h-6" />
        </button>
      </header>

      <main class="flex-1 overflow-y-auto p-6 lg:p-10">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from './store/auth'
import { 
  LayoutDashboard, 
  Calculator, 
  UtensilsCrossed, 
  Dumbbell, 
  CalendarCheck,
  Activity,
  Menu,
  X,
  LogOut
} from 'lucide-vue-next'

const router = useRouter()
const { state, clearAuth, initAuth } = useAuth()
onMounted(() => {
  initAuth()
})

const handleLogout = () => {
    clearAuth()
    router.push('/login')
}

const isSidebarOpen = ref(false)

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Calorie Calculator', path: '/calculator', icon: Calculator },
  { name: 'Workout Plan', path: '/workout-plan', icon: Dumbbell },
]
</script>

<style>
.router-link-active {
  background-color: rgba(24, 24, 27, 1); /* zinc-800 */
}
</style>
