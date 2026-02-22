<template>
    <div class="space-y-8">
      <!-- Header -->
      <header>
        <h2 class="text-3xl font-bold text-zinc-100">Welcome back, John!</h2>
        <p class="text-zinc-400 mt-1">Here's your fitness overview for today.</p>
      </header>
  
      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="stat in stats" :key="stat.label" 
          class="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl hover:border-emerald-500/50 transition-colors group">
          <div class="flex items-center justify-between mb-4">
            <div :class="`p-2.5 rounded-xl ${stat.bgColor}`">
              <component :is="stat.icon" :class="`w-5 h-5 ${stat.color}`" />
            </div>
            <span class="text-xs font-medium text-emerald-400 flex items-center gap-1">
              <TrendingUp class="w-3 h-3" /> +{{ stat.trend }}%
            </span>
          </div>
          <p class="text-zinc-400 text-sm font-medium">{{ stat.label }}</p>
          <div class="flex items-baseline gap-2 mt-1">
            <h3 class="text-2xl font-bold text-zinc-100">{{ stat.value }}</h3>
            <span class="text-zinc-500 text-xs">{{ stat.unit }}</span>
          </div>
        </div>
      </div>
  
      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Activity Chart -->
        <div class="lg:col-span-2 bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <div class="flex items-center justify-between mb-6">
            <h4 class="font-bold text-zinc-100">Activity & Progress</h4>
            <select class="bg-zinc-800 border-none text-zinc-400 text-xs rounded-lg px-2 py-1 focus:ring-1 focus:ring-emerald-500">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <div class="h-[300px] w-full flex items-center justify-center text-zinc-600 bg-zinc-950/50 rounded-xl border border-dashed border-zinc-800">
             <!-- Placeholder for Chart.js -->
             <p>Chart Rendering Area (Chart.js)</p>
          </div>
        </div>
  
        <!-- Daily Macros -->
        <div class="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <h4 class="font-bold text-zinc-100 mb-6">Daily Macros</h4>
          <div class="space-y-6">
            <div v-for="macro in macros" :key="macro.name">
              <div class="flex justify-between text-sm mb-2">
                <span class="text-zinc-400 font-medium">{{ macro.name }}</span>
                <span class="text-zinc-100 font-bold">{{ macro.current }}g / {{ macro.target }}g</span>
              </div>
              <div class="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div :class="`h-full rounded-full ${macro.color}`" :style="{ width: `${(macro.current / macro.target) * 100}%` }"></div>
              </div>
            </div>
          </div>
          <div class="mt-8 pt-6 border-t border-zinc-800 flex justify-between items-center">
              <div>
                  <p class="text-xs text-zinc-500">Total Calories</p>
                  <p class="text-lg font-bold text-emerald-400">1,840 / 2,400</p>
              </div>
              <button class="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/20">
                  Log Meal
              </button>
          </div>
        </div>
      </div>
  
      <!-- Today's Schedule -->
      <div class="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <h4 class="font-bold text-zinc-100 mb-6">Today's Schedule</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="task in schedule" :key="task.id" 
                  class="flex items-center gap-4 p-4 bg-zinc-950/50 rounded-xl border border-zinc-800 group hover:border-zinc-700 transition-colors">
                  <div :class="`w-12 h-12 rounded-xl flex items-center justify-center ${task.bgColor}`">
                      <component :is="task.icon" :class="`w-6 h-6 ${task.color}`" />
                  </div>
                  <div class="flex-1">
                      <p class="text-sm font-bold text-zinc-100">{{ task.title }}</p>
                      <p class="text-xs text-zinc-500">{{ task.time }} • {{ task.description }}</p>
                  </div>
                  <ArrowRight class="w-4 h-4 text-zinc-700 group-hover:text-zinc-300 transition-colors" />
              </div>
          </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue'
  import { 
    Flame, 
    Target, 
    Weight, 
    Timer,
    TrendingUp,
    ArrowRight,
    Utensils,
    Dumbbell,
    GlassWater,
    Activity
  } from 'lucide-vue-next'
  import { FoodAPI, WorkoutAPI } from '../api' // Imports updated
  
  const todayDate = new Date().toISOString().split('T')[0]
  const foodLogs = ref([])
  const backendWorkouts = ref([]) // State for workouts
  
  onMounted(async () => {
    try {
      const res = await FoodAPI.getLogs(todayDate)
      foodLogs.value = res.data
    } catch (err) {
      console.warn('Backend not reachable, using mockup data.')
    }
    
    // Fetch actual data from Koa backend via Vite proxy
    try {
        const workouts = await WorkoutAPI.getWorkouts()
        backendWorkouts.value = workouts
    } catch (err) {
        console.error('Failed to fetch workouts from backend:', err)
    }
  })
  
  const dailyCals = computed(() => {
    return foodLogs.value.reduce((sum, log) => sum + log.calories, 0)
  })
  
  const stats = computed(() => [
    { label: 'Calories Burned', value: '1,240', unit: 'kcal', icon: Flame, color: 'text-orange-500', bgColor: 'bg-orange-500/10', trend: '12' },
    { label: 'Avg Pulse', value: '72', unit: 'bpm', icon: Activity, color: 'text-rose-500', bgColor: 'bg-rose-500/10', trend: '5' },
    { label: 'Body Weight', value: '78.5', unit: 'kg', icon: Weight, color: 'text-indigo-500', bgColor: 'bg-indigo-500/10', trend: '0.8' },
    { label: 'Consumed Today', value: dailyCals.value || '0', unit: 'kcal', icon: Utensils, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10', trend: '15' },
  ])
  
  const macros = computed(() => {
    const totals = foodLogs.value.reduce((acc, log) => ({
      p: acc.p + log.protein,
      c: acc.c + log.carbs,
      f: acc.f + log.fats
    }), { p: 0, c: 0, f: 0 })
  
    return [
      { name: 'Protein', current: totals.p, target: 180, color: 'bg-emerald-500' },
      { name: 'Carbs', current: totals.c, target: 250, color: 'bg-indigo-500' },
      { name: 'Fats', current: totals.f, target: 70, color: 'bg-amber-500' },
    ]
  })
  
  const schedule = computed(() => {
    if (backendWorkouts.value.length > 0) {
        return backendWorkouts.value.map((wk, index) => ({
            id: wk.id || index,
            title: wk.name,
            time: new Date(wk.date).toLocaleDateString(),
            description: 'Workout from Backend',
            icon: Dumbbell,
            color: 'text-emerald-400',
            bgColor: 'bg-emerald-400/10'
        }))
    }
    return [
        { id: 1, title: 'Upper Body Workout', time: '08:00 AM', description: 'Strength Training', icon: Dumbbell, color: 'text-emerald-400', bgColor: 'bg-emerald-400/10' },
        { id: 2, title: 'High Protein Lunch', time: '01:00 PM', description: 'Chicken & Quinoa', icon: Utensils, color: 'text-indigo-400', bgColor: 'bg-indigo-400/10' },
        { id: 3, title: 'Hydration Goal', time: 'All Day', description: '3.5L / 4L', icon: GlassWater, color: 'text-cyan-400', bgColor: 'bg-cyan-400/10' },
    ]
  })
  </script>
  