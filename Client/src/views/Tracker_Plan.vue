<template>
    <div class="space-y-8">
      <header class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 class="text-3xl font-bold text-zinc-100">Daily Trackers</h2>
          <p class="text-zinc-400 mt-1">Log your food intake and workout sets for today, {{ todayDisp }}.</p>
        </div>
        <div class="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
          <button v-for="tab in ['Food', 'Workout']" :key="tab"
            @click="activeTab = tab"
            :class="['px-6 py-2 text-sm font-bold rounded-lg transition-all', 
              activeTab === tab ? 'bg-zinc-800 text-emerald-400 shadow-lg' : 'text-zinc-500 hover:text-zinc-300']"
          >
            {{ tab }}
          </button>
        </div>
      </header>
  
      <!-- Food Tracker View -->
      <div v-if="activeTab === 'Food'" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-6">
          <div v-for="meal in groupedMeals" :key="meal.name" class="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div class="p-6 flex items-center justify-between border-b border-zinc-800 bg-zinc-950/30">
              <div class="flex items-center gap-3">
                <span class="text-xs font-bold text-zinc-500 uppercase tracking-widest">{{ meal.time }}</span>
                <h4 class="font-bold text-zinc-100">{{ meal.name }}</h4>
              </div>
              <button class="text-emerald-400 text-sm font-bold hover:underline">+ Add Food</button>
            </div>
            <div class="divide-y divide-zinc-800/50">
              <div v-for="item in meal.items" :key="item.id" class="p-4 flex items-center justify-between group hover:bg-zinc-800/20 transition-colors">
                <div class="flex items-center gap-4">
                  <div class="w-2 h-2 rounded-full bg-emerald-500/50 group-hover:bg-emerald-500 transition-colors"></div>
                  <div>
                    <p class="text-sm font-bold text-zinc-200">{{ item.name }}</p>
                    <p class="text-[10px] text-zinc-500 uppercase tracking-tighter">{{ item.amount }} {{ item.unit }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-6">
                  <div class="hidden sm:flex items-center gap-4">
                    <span class="text-[10px] text-zinc-600 font-bold uppercase">P <span class="text-zinc-400">{{ item.protein }}g</span></span>
                    <span class="text-[10px] text-zinc-600 font-bold uppercase">C <span class="text-zinc-400">{{ item.carbs }}g</span></span>
                    <span class="text-[10px] text-zinc-600 font-bold uppercase">F <span class="text-zinc-400">{{ item.fats }}g</span></span>
                  </div>
                  <div class="w-16 text-right">
                    <span class="text-sm font-bold text-emerald-400">{{ item.calories }}</span>
                    <span class="text-[10px] text-zinc-600 ml-1">kcal</span>
                  </div>
                </div>
              </div>
              <div v-if="meal.items.length === 0" class="p-8 text-center text-zinc-600 text-xs italic">
                  No items logged for {{ meal.name }}
              </div>
            </div>
          </div>
        </div>
  
        <!-- Food Stats -->
        <div class="space-y-6">
          <div class="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
            <h4 class="font-bold text-zinc-100 mb-6">Daily Summary</h4>
            <div class="space-y-6">
              <div class="text-center py-4 bg-zinc-950 rounded-2xl border border-zinc-800 relative overflow-hidden group">
                  <div class="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <p class="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mb-1">Total Calories</p>
                  <p class="text-3xl font-black text-emerald-400">{{ Math.round(dailySummary.kcal) }}</p>
                  <p class="text-[10px] text-zinc-500 mt-1">Goal: 2,400 kcal</p>
              </div>
              
              <div class="space-y-4">
                  <div class="space-y-1.5">
                      <div class="flex justify-between text-xs">
                          <span class="text-zinc-400 font-medium">Protein</span>
                          <span class="text-zinc-100 font-bold">{{ Math.round(dailySummary.p) }}g / 180g</span>
                      </div>
                      <div class="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div class="h-full bg-emerald-500 rounded-full" :style="{ width: `${(dailySummary.p / 180) * 100}%` }"></div>
                      </div>
                  </div>
                  <div class="space-y-1.5">
                      <div class="flex justify-between text-xs">
                          <span class="text-zinc-400 font-medium">Carbs</span>
                          <span class="text-zinc-100 font-bold">{{ Math.round(dailySummary.c) }}g / 250g</span>
                      </div>
                      <div class="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div class="h-full bg-indigo-500 rounded-full" :style="{ width: `${(dailySummary.c / 250) * 100}%` }"></div>
                      </div>
                  </div>
                  <div class="space-y-1.5">
                      <div class="flex justify-between text-xs">
                          <span class="text-zinc-400 font-medium">Fats</span>
                          <span class="text-zinc-100 font-bold">{{ Math.round(dailySummary.f) }}g / 70g</span>
                      </div>
                      <div class="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div class="h-full bg-amber-500 rounded-full" :style="{ width: `${(dailySummary.f / 70) * 100}%` }"></div>
                      </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Workout Tracker View -->
      <div v-else class="space-y-6">
          <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                  <div>
                      <h4 class="font-bold text-zinc-100 text-xl">Current Session: Push A</h4>
                      <p class="text-sm text-zinc-400">Timer: <span class="text-emerald-400 tabular-nums">45:12</span></p>
                  </div>
                  <div class="flex gap-2">
                      <button class="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-xs font-bold text-zinc-300 hover:bg-zinc-700 transition-colors">Discard</button>
                      <button class="px-4 py-2 bg-emerald-500 text-zinc-950 rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all">Finish Workout</button>
                  </div>
              </div>
  
              <div class="space-y-8">
                  <div v-for="exercise in activeWorkout" :key="exercise.name" class="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden border-l-4 border-l-emerald-500">
                      <div class="p-4 border-b border-zinc-800/50 flex items-center justify-between">
                          <h5 class="font-bold text-zinc-100">{{ exercise.name }}</h5>
                          <button class="text-zinc-600 hover:text-zinc-400"><History class="w-4 h-4" /></button>
                      </div>
                      <div class="p-4">
                          <table class="w-full text-left">
                              <thead>
                                  <tr class="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                                      <th class="pb-2 text-center w-12">Set</th>
                                      <th class="pb-2">Previous</th>
                                      <th class="pb-2">kg</th>
                                      <th class="pb-2">Reps</th>
                                      <th class="pb-2 text-center w-12">Done</th>
                                  </tr>
                              </thead>
                              <tbody class="divide-y divide-zinc-800/30">
                                  <tr v-for="s in exercise.sets" :key="s.id" class="group">
                                      <td class="py-3 text-center text-zinc-500 text-xs font-bold">{{ s.id }}</td>
                                      <td class="py-3 text-xs text-zinc-600">{{ s.prev }}</td>
                                      <td class="py-3">
                                          <input type="number" class="w-16 bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-sm text-zinc-200 focus:border-emerald-500/50 outline-none" :value="s.weight">
                                      </td>
                                      <td class="py-3">
                                          <input type="number" class="w-16 bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-sm text-zinc-200 focus:border-emerald-500/50 outline-none" :value="s.reps">
                                      </td>
                                      <td class="py-3 flex justify-center">
                                          <button :class="['w-6 h-6 rounded-md border flex items-center justify-center transition-all', s.done ? 'bg-emerald-500 border-emerald-500 text-zinc-950' : 'bg-zinc-800 border-zinc-700 text-transparent']">
                                              <Check class="w-4 h-4" />
                                          </button>
                                      </td>
                                  </tr>
                              </tbody>
                          </table>
                          <button class="w-full mt-4 py-2 border border-dashed border-zinc-800 rounded-xl text-xs font-bold text-zinc-500 hover:border-zinc-700 hover:text-zinc-400 transition-all">+ Add Set</button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue'
  import { Check, History } from 'lucide-vue-next'
  import { FoodAPI, WorkoutAPI } from '../api'
  
  const activeTab = ref('Food')
  const todayDate = new Date().toISOString().split('T')[0]
  const todayDisp = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })
  
  const foodLogs = ref([])
  const activeWorkout = ref([])
  
  onMounted(async () => {
    await fetchFoodLogs()
    await fetchWorkouts()
  })
  
  const fetchFoodLogs = async () => {
    try {
      const res = await FoodAPI.getLogs(todayDate)
      foodLogs.value = res.data
    } catch (err) {
      console.error('Failed to fetch food logs:', err)
    }
  }
  
  const fetchWorkouts = async () => {
    try {
      const res = await WorkoutAPI.getWorkouts(todayDate)
      const workouts = res.data
      // For simplicity, we just take the first workout Exercises for now
      if (workouts.length > 0) {
        const exRes = await WorkoutAPI.getExercises(workouts[0].id)
        activeWorkout.value = exRes.data
      }
    } catch (err) {
      console.error('Failed to fetch workouts:', err)
    }
  }
  
  const dailySummary = computed(() => {
    return foodLogs.value.reduce((acc, log) => ({
      kcal: acc.kcal + log.calories,
      p: acc.p + log.protein,
      c: acc.c + log.carbs,
      f: acc.f + log.fats
    }), { kcal: 0, p: 0, c: 0, f: 0 })
  })
  
  // Group logs by meal type for display
  const groupedMeals = computed(() => {
    const types = ['Breakfast', 'Lunch', 'Dinner', 'Snack']
    return types.map(type => ({
      name: type,
      time: type === 'Breakfast' ? '08:30 AM' : (type === 'Lunch' ? '01:15 PM' : (type === 'Dinner' ? '07:30 PM' : 'Anytime')),
      items: foodLogs.value.filter(log => log.meal_type === type.toLowerCase())
    }))
  })
  </script>
  