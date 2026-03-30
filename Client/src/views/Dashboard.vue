<template>
    <div class="space-y-8">
      <!-- Header -->
      <header>
        <h2 class="text-3xl font-bold text-zinc-100">Welcome back, {{ userName }}!</h2>
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
          <p v-if="stat.subtext" class="text-xs text-zinc-400 mt-3 font-medium bg-zinc-950 px-2 py-1 rounded-lg border border-zinc-800 shadow-sm inline-block">{{ stat.subtext }}</p>
        </div>
      </div>
  
      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Activity Chart -->
        <div class="lg:col-span-2 bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <div class="flex items-center justify-between mb-6">
            <h4 class="font-bold text-zinc-100">Activity & Progress</h4>
            <select v-model="chartMetric" class="bg-zinc-800 border-none text-zinc-400 text-xs rounded-lg px-2 py-1 focus:ring-1 focus:ring-emerald-500">
              <option value="calories">Calories Consumed</option>
              <option value="weight">Weight Progress</option>
            </select>
          </div>
          <div class="h-[300px] w-full relative">
             <Line v-if="chartData" :data="chartData" :options="chartOptions" />
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
                  <p class="text-lg font-bold text-emerald-400">{{ dailyCals }} / {{ userTargets.tdee }}</p>
              </div>
              <router-link to="/diet-plan" class="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/20">
                Log Meal
            </router-link>
          </div>
        </div>
      </div>
  
      <!-- Today's Schedule -->
      <div class="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <h4 class="font-bold text-zinc-100 mb-6">Today's Schedule</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <template v-for="task in schedule" :key="task.id">
                  <router-link v-if="task.route" :to="task.route" 
                      class="flex items-center gap-4 p-4 bg-zinc-950/50 rounded-xl border border-zinc-800 group hover:border-emerald-500/50 transition-colors cursor-pointer w-full text-left">
                      <div :class="`w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center ${task.bgColor}`">
                          <component :is="task.icon" :class="`w-6 h-6 ${task.color}`" />
                      </div>
                      <div class="flex-1 overflow-hidden">
                          <p class="text-sm font-bold text-zinc-100 truncate">{{ task.title }}</p>
                          <p class="text-xs text-zinc-500 truncate">{{ task.time }} • {{ task.description }}</p>
                      </div>
                      <ArrowRight class="w-4 h-4 flex-shrink-0 text-zinc-700 group-hover:text-emerald-400 transition-colors" />
                  </router-link>
                  
                  <div v-else class="flex items-center gap-4 p-4 bg-zinc-950/50 rounded-xl border border-zinc-800">
                      <div :class="`w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center ${task.bgColor}`">
                          <component :is="task.icon" :class="`w-6 h-6 ${task.color}`" />
                      </div>
                      <div class="flex-1 overflow-hidden">
                          <p class="text-sm font-bold text-zinc-100 truncate">{{ task.title }}</p>
                          <p class="text-xs text-zinc-500 truncate">{{ task.time }} • {{ task.description }}</p>
                      </div>
                  </div>
              </template>
          </div>
          <div class="mt-8 pt-6 border-t border-zinc-800 text-center">
              <router-link to="/workout-plan" class="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
                  Go to full Workout Plan <ArrowRight class="w-4 h-4" />
              </router-link>
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
  import { AuthAPI, FoodAPI, WorkoutAPI, CheckInAPI, WaterAPI, DietAPI } from '../api'
  
  import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
  } from 'chart.js'
  import { Line } from 'vue-chartjs'
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
  )
  
  const todayDate = new Date().toISOString().split('T')[0]
  const foodLogs = ref([])
  const backendWorkouts = ref([]) // State for workouts
  const userName = ref('Athlete')
  const todayWeight = ref('0.0')
  const todayWater = ref(0)
  
  const userTargets = ref({ tdee: 2400, protein: 180, carbs: 250, fats: 70 })
  const dietMeals = ref([])
  const historicalCals = ref([])
  const historicalWeight = ref([])
  const chartLabels = ref([])
  const chartMetric = ref('weight') // Default to weight based on user feedback
  
  onMounted(async () => {
    try {
        const profile = await AuthAPI.getProfile()
        if (profile.user && profile.user.username) {
            userName.value = profile.user.username
        }
    } catch(err) {
        console.warn('Failed to fetch profile:', err)
    }

    try {
        const checkins = await CheckInAPI.getLogs(todayDate)
        if (checkins.weight) todayWeight.value = checkins.weight
    } catch(err) {
        console.warn('Failed to fetch checkins:', err)
    }

    try {
        const water = await WaterAPI.getLogs(todayDate)
        if (water && water.length) {
            todayWater.value = water.reduce((sum, log) => sum + log.amount, 0)
        }
    } catch(err) {
        console.warn('Failed to fetch water:', err)
    }

    try {
      const res = await FoodAPI.getLogs(todayDate)
      foodLogs.value = res
    } catch (err) {
      console.warn('Backend not reachable, using mockup data.')
    }
    
    // Fetch actual data from Koa backend via Vite proxy
    try {
        const workouts = await WorkoutAPI.getWorkouts(todayDate)
        backendWorkouts.value = workouts
    } catch (err) {
        console.error('Failed to fetch workouts from backend:', err)
    }

    // Load saved macro targets from the Calculator
    const savedTargets = localStorage.getItem('userMacroTargets')
    if (savedTargets) {
        try {
            userTargets.value = JSON.parse(savedTargets)
        } catch (e) {
            console.error("Failed to parse saved targets", e)
        }
    }

    try {
        const plans = await DietAPI.getPlans()
        if (plans && plans.length > 0) {
            dietMeals.value = plans[0].meals || []
        }
    } catch (err) {
        console.warn('Failed to fetch diet plans:', err)
    }

    try {
        const past7Days = []
        for (let i = 6; i >= 0; i--) {
            const d = new Date()
            d.setDate(d.getDate() - i)
            past7Days.push(d.toISOString().split('T')[0])
        }
        
        const logsResponses = await Promise.all(
            past7Days.map(date => FoodAPI.getLogs(date).catch(() => []))
        )
        
        const checkinsResponses = await Promise.all(
            past7Days.map(date => CheckInAPI.getLogs(date).catch(() => ({})))
        )
        
        historicalCals.value = logsResponses.map(logs => 
            logs.reduce((sum, log) => sum + log.calories, 0)
        )
        
        // Use todayWeight as fallback for missing past weight entries if it's realistic, or just zero. But line charts drop to 0.
        // Let's propagate last known weight backward/forward or just plot raw. 
        historicalWeight.value = checkinsResponses.map(c => Number(c.weight) || 0)
        
        chartLabels.value = past7Days.map(date => {
            const d = new Date(date)
            return d.toLocaleDateString('en-US', { weekday: 'short' })
        })
    } catch (err) {
        console.warn('Failed to fetch historical data:', err)
    }
  })
  
  const dailyCals = computed(() => {
    return foodLogs.value.reduce((sum, log) => sum + log.calories, 0)
  })
  
  const stats = computed(() => {
    const macrosSum = foodLogs.value.reduce((acc, log) => ({
      p: acc.p + log.protein,
      c: acc.c + log.carbs,
      f: acc.f + log.fats
    }), { p: 0, c: 0, f: 0 })

    return [
      { label: 'Consumed Today', value: dailyCals.value || '0', unit: 'kcal', icon: Utensils, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10', trend: '15', subtext: `P: ${Math.round(macrosSum.p)}g • C: ${Math.round(macrosSum.c)}g • F: ${Math.round(macrosSum.f)}g` },
      { label: 'Calories Burned', value: '1,240', unit: 'kcal', icon: Flame, color: 'text-orange-500', bgColor: 'bg-orange-500/10', trend: '12' },
      { label: 'Water Consumed', value: todayWater.value, unit: 'ml', icon: GlassWater, color: 'text-cyan-500', bgColor: 'bg-cyan-500/10', trend: '5' },
      { label: 'Body Weight', value: todayWeight.value, unit: 'kg', icon: Weight, color: 'text-indigo-500', bgColor: 'bg-indigo-500/10', trend: '0.8' },
    ]
  })
  
  const macros = computed(() => {
    const totals = foodLogs.value.reduce((acc, log) => ({
      p: acc.p + log.protein,
      c: acc.c + log.carbs,
      f: acc.f + log.fats
    }), { p: 0, c: 0, f: 0 })
  
    return [
      { name: 'Protein', current: totals.p, target: userTargets.value.protein, color: 'bg-emerald-500' },
      { name: 'Carbs', current: totals.c, target: userTargets.value.carbs, color: 'bg-indigo-500' },
      { name: 'Fats', current: totals.f, target: userTargets.value.fats, color: 'bg-amber-500' },
    ]
  })
  
  const chartData = computed(() => {
    const isWeight = chartMetric.value === 'weight'
    const color = isWeight ? { bg: 'rgba(99, 102, 241, 0.1)', border: '#6366f1' } : { bg: 'rgba(16, 185, 129, 0.1)', border: '#10b981' }
    
    return {
        labels: chartLabels.value.length ? chartLabels.value : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
        {
            label: isWeight ? 'Body Weight' : 'Calories Consumed',
            backgroundColor: color.bg, 
            borderColor: color.border,
            borderWidth: 3,
            pointBackgroundColor: color.border,
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: color.border,
            fill: true,
            tension: 0.4,
            data: isWeight 
                ? (historicalWeight.value.length && historicalWeight.value.some(w => w > 0) ? historicalWeight.value : [75, 75, 75.2, 75.1, 74.9, 74.8, Number(todayWeight.value) || 74.5])
                : (historicalCals.value.length ? historicalCals.value : [1200, 1900, 1500, 2100, 1800, 2400, dailyCals.value])
        }
        ]
    }
  })

  const chartOptions = computed(() => {
    const isWeight = chartMetric.value === 'weight'
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
        legend: {
            display: false
        },
        tooltip: {
            backgroundColor: '#18181b', // zinc-900
            titleColor: '#e4e4e7', // zinc-200
            bodyColor: '#a1a1aa', // zinc-400
            borderColor: '#27272a', // zinc-800
            borderWidth: 1,
            padding: 12,
            displayColors: false,
            callbacks: {
            label: function(context) {
                return context.parsed.y + (isWeight ? ' kg' : ' kcal');
            }
            }
        }
        },
        scales: {
        y: {
            beginAtZero: !isWeight,
            grid: {
            color: '#27272a', // zinc-800
            drawBorder: false,
            },
            ticks: {
            color: '#71717a', // zinc-500
            stepSize: isWeight ? 1 : 500
            }
        },
        x: {
            grid: {
            display: false,
            drawBorder: false,
            },
            ticks: {
            color: '#71717a', // zinc-500
            }
        }
        }
    }
  })



  const schedule = computed(() => {
    let items = []
    
    // Diet Meals
    dietMeals.value.forEach((meal, i) => {
        items.push({
            id: `meal-${i}`,
            title: meal.name,
            time: 'Meal ' + (i + 1),
            description: meal.calories + ' kcal planned',
            icon: Utensils,
            color: 'text-indigo-400',
            bgColor: 'bg-indigo-400/10',
            order: i,
            route: '/diet-plan'
        })
    })

    // Workouts
    backendWorkouts.value.forEach((wk, i) => {
        items.push({
            id: `wk-${wk.id || i}`,
            title: wk.name,
            time: 'Workout',
            description: 'Scheduled for today',
            icon: Dumbbell,
            color: 'text-emerald-400',
            bgColor: 'bg-emerald-400/10',
            order: 10 + i,
            route: '/workout-plan'
        })
    })
    
    // Hydration
    if (todayWater.value < 3000) {
        items.push({
            id: 'water',
            title: 'Hydration Goal',
            time: 'All Day',
            description: `${todayWater.value}ml / 3000ml`,
            icon: GlassWater,
            color: 'text-cyan-400',
            bgColor: 'bg-cyan-400/10',
            order: 20,
            route: '/tracker'
        })
    }
    
    // Fallback if completely empty
    if (items.length === 0) {
        return [
            { id: 1, title: 'No Schedule', time: 'Rest Day', description: 'Take it easy today.', icon: Activity, color: 'text-emerald-400', bgColor: 'bg-emerald-400/10' },
        ]
    }

    return items.sort((a, b) => a.order - b.order)
  })
  </script>
  