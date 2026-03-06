<template>
  <div class="space-y-8 max-w-7xl mx-auto pb-12">
    <!-- Header Area -->
    <header class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h2 class="text-4xl font-black text-white tracking-tight">Today</h2>
        <p class="text-zinc-400 mt-2 font-medium text-lg">{{ todayDisp }}</p>
      </div>
      
      <!-- Custom Toggle -->
      <div class="inline-flex bg-zinc-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-zinc-800 shadow-xl">
        <button v-for="tab in ['Food', 'Workout']" :key="tab"
          @click="activeTab = tab"
          :class="['relative px-8 py-3 text-sm font-bold rounded-xl transition-all duration-300', 
            activeTab === tab 
              ? 'text-white shadow-lg' 
              : 'text-zinc-500 hover:text-zinc-300']"
        >
          <div v-if="activeTab === tab" class="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl -z-10 shadow-[0_0_20px_rgba(124,58,237,0.3)]"></div>
          {{ tab }}
        </button>
      </div>
    </header>

    <!-- FOOD VIEW -->
    <main v-if="activeTab === 'Food'" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <!-- Premium Hero Stats Panel -->
      <section class="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        <div class="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        <div class="relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <!-- Calorie Ring / Main Stat -->
          <div class="flex-shrink-0 flex flex-col items-center justify-center p-6 bg-zinc-950/50 rounded-full ring-4 ring-zinc-800/50 relative w-48 h-48 shadow-inner">
             <div class="absolute inset-2 rounded-full border-[12px] border-zinc-900"></div>
             <!-- Fake SVG ring for visual pop -->
             <svg class="absolute inset-0 w-full h-full -rotate-90 drop-shadow-lg" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" class="stroke-zinc-800" stroke-width="8"></circle>
                <circle cx="50" cy="50" r="40" fill="none" class="stroke-violet-500 transition-all duration-1000" stroke-width="8" stroke-linecap="round" 
                        :stroke-dasharray="`${Math.min((dailySummary.kcal / 2400) * 251, 251)} 251`"></circle>
             </svg>
             <span class="text-4xl font-black text-white relative flex items-baseline gap-1">
               {{ Math.round(dailySummary.kcal) }}
             </span>
             <span class="text-[10px] text-zinc-500 uppercase font-bold tracking-widest relative mt-1 block w-24 text-center leading-tight">/ 2400 kcal</span>
          </div>

          <!-- Macros Row -->
          <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <div class="bg-zinc-900/80 backdrop-blur-sm border border-zinc-700/50 p-6 rounded-2xl flex flex-col justify-center relative overflow-hidden group hover:border-blue-500/30 transition-colors">
              <div class="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <p class="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-2">Protein</p>
              <div class="flex items-end gap-2">
                <span class="text-3xl font-black text-zinc-100">{{ Math.round(dailySummary.p) }}</span>
                <span class="text-sm font-bold text-zinc-600 mb-1">/ 180g</span>
              </div>
            </div>
            
            <div class="bg-zinc-900/80 backdrop-blur-sm border border-zinc-700/50 p-6 rounded-2xl flex flex-col justify-center relative overflow-hidden group hover:border-amber-500/30 transition-colors">
              <div class="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-orange-500 to-amber-400 opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <p class="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-2">Carbs</p>
              <div class="flex items-end gap-2">
                <span class="text-3xl font-black text-zinc-100">{{ Math.round(dailySummary.c) }}</span>
                <span class="text-sm font-bold text-zinc-600 mb-1">/ 250g</span>
              </div>
            </div>

            <div class="bg-zinc-900/80 backdrop-blur-sm border border-zinc-700/50 p-6 rounded-2xl flex flex-col justify-center relative overflow-hidden group hover:border-pink-500/30 transition-colors">
              <div class="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-rose-500 to-pink-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <p class="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-2">Fats</p>
              <div class="flex items-end gap-2">
                <span class="text-3xl font-black text-zinc-100">{{ Math.round(dailySummary.f) }}</span>
                <span class="text-sm font-bold text-zinc-600 mb-1">/ 70g</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Horizontal Meal Blocks (2x2 Grid) -->
      <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="meal in groupedMeals" :key="meal.name" class="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-col transition-all hover:border-violet-500/30 shadow-lg relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-b from-violet-500/5 to-transparent pointer-events-none opacity-0 hover:opacity-100 transition-opacity"></div>
          
          <div class="flex justify-between items-start mb-6 relative z-10">
            <div>
              <h3 class="text-2xl font-bold text-white mb-1">{{ meal.name }}</h3>
              <p class="text-xs font-bold text-zinc-500 uppercase tracking-widest">{{ meal.time }}</p>
            </div>
            <div class="bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-xl shadow-inner">
               <span class="text-sm font-bold text-violet-400">{{ meal.items.reduce((sum, item) => sum + item.calories, 0) }}</span>
               <span class="text-[10px] text-zinc-500 ml-1 uppercase font-bold">Kcal</span>
            </div>
          </div>

          <div class="flex-1 space-y-3 relative z-10">
            <div v-for="item in meal.items" :key="item.id" class="flex items-center justify-between p-4 rounded-2xl bg-zinc-950/50 hover:bg-zinc-800 border border-zinc-800/50 hover:border-zinc-700 transition-colors group">
               <div class="flex items-center gap-4">
                 <div class="w-1.5 h-8 bg-violet-500/30 group-hover:bg-violet-500 rounded-full transition-colors"></div>
                 <div>
                   <p class="font-bold text-zinc-200">{{ item.name }}</p>
                   <p class="text-[10px] text-zinc-500 uppercase mt-0.5 tracking-wider font-bold">{{ item.amount }} {{ item.unit }}</p>
                 </div>
               </div>
               <div class="text-right">
                 <p class="text-sm font-bold text-white mb-0.5">{{ item.calories }} <span class="text-[10px] text-zinc-500 font-normal">kcal</span></p>
                 <div class="flex gap-2 text-[10px] font-bold text-zinc-600 justify-end">
                   <span><span class="text-zinc-400">P</span>{{item.protein}}</span>
                   <span><span class="text-zinc-400">C</span>{{item.carbs}}</span>
                   <span><span class="text-zinc-400">F</span>{{item.fats}}</span>
                 </div>
               </div>
            </div>
            
            <div v-if="meal.items.length === 0" class="h-28 flex items-center justify-center border-2 border-dashed border-zinc-800/80 rounded-2xl bg-zinc-950/30">
               <span class="text-zinc-600 text-sm font-medium">No items logged</span>
            </div>
          </div>

          <button class="mt-5 w-full py-3.5 bg-zinc-800 hover:bg-violet-600 hover:shadow-lg hover:shadow-violet-500/20 text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 relative z-10">
            <Plus class="w-4 h-4" /> Add Food
          </button>
        </div>
      </section>
    </main>

    <!-- WORKOUT VIEW -->
    <main v-else class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <!-- Session Banner -->
      <section class="bg-gradient-to-r from-violet-900 to-indigo-900 rounded-3xl p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-violet-700/50">
        <div class="absolute inset-0 bg-black/20 mix-blend-overlay"></div>
        <div class="relative z-10">
          <p class="text-sm font-bold text-violet-300 uppercase tracking-widest mb-2 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Session Active
          </p>
          <h2 class="text-4xl font-black text-white">Push Workout A</h2>
        </div>
        
        <div class="relative z-10 flex gap-4">
          <div class="bg-zinc-950/40 border border-violet-500/30 backdrop-blur-md px-6 py-3 rounded-2xl flex flex-col items-center justify-center shadow-inner">
            <span class="text-[10px] text-violet-300 uppercase font-black tracking-widest mb-1">Time Elapsed</span>
            <span class="text-2xl font-bold text-white tabular-nums drop-shadow-md">42:15</span>
          </div>
          <button class="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-8 py-3 rounded-2xl font-black text-lg transition-colors shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            FINISH
          </button>
        </div>
      </section>

      <!-- Focus Cards Grid -->
      <section class="space-y-6">
        <div v-for="(exercise, index) in activeWorkout" :key="exercise.name" class="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 lg:p-8 flex flex-col lg:flex-row gap-8 items-start lg:items-center focus-within:ring-2 focus-within:ring-violet-500 transition-shadow shadow-lg">
           
           <div class="w-full lg:w-1/3 flex items-start gap-5">
             <div class="w-14 h-14 rounded-2xl bg-zinc-950 flex items-center justify-center border border-zinc-800 flex-shrink-0 text-violet-400 font-black text-2xl shadow-inner">
               {{ index + 1 }}
             </div>
             <div>
               <h3 class="text-2xl font-bold text-zinc-100 mb-2 leading-tight">{{ exercise.name }}</h3>
               <button class="text-[10px] font-bold text-zinc-500 hover:text-violet-400 uppercase tracking-widest flex items-center gap-1.5 transition-colors">
                 <History class="w-3.5 h-3.5" /> View History
               </button>
             </div>
           </div>

           <div class="w-full lg:w-2/3">
             <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <!-- Set Pills -->
                <div v-for="(s, i) in exercise.sets" :key="s.id" 
                  :class="['p-4 rounded-2xl border-2 transition-all cursor-pointer group shadow-sm', 
                    s.done ? 'bg-violet-500/10 border-violet-500 shadow-[0_0_15px_rgba(124,58,237,0.15)]' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700']"
                  @click="s.done = !s.done"
                >
                  <div class="flex justify-between items-center mb-4">
                    <span class="text-[10px] font-black uppercase text-zinc-500 group-hover:text-zinc-400 transition-colors">Set {{ i + 1 }}</span>
                    <div :class="['w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300', s.done ? 'bg-violet-500 text-white scale-110' : 'bg-zinc-800 text-transparent']">
                       <Check class="w-3 h-3 text-white" />
                    </div>
                  </div>
                  
                  <div class="flex items-end gap-1.5" @click.stop>
                    <input type="number" v-model="s.weight" class="w-16 bg-transparent border-b-2 border-zinc-800 hover:border-zinc-600 focus:border-violet-500 focus:bg-zinc-900 text-2xl font-black text-white text-center outline-none transition-all px-1 rounded-t-sm">
                    <span class="text-zinc-500 text-sm font-bold pb-1.5">kg</span>
                    <span class="text-zinc-700 text-xl font-light mx-1">&times;</span>
                    <input type="number" v-model="s.reps" class="w-12 bg-transparent border-b-2 border-zinc-800 hover:border-zinc-600 focus:border-violet-500 focus:bg-zinc-900 text-2xl font-black text-white text-center outline-none transition-all px-1 rounded-t-sm">
                  </div>
                  <p class="text-[10px] text-zinc-500 mt-4 uppercase tracking-widest font-bold">Prev: <span class="text-zinc-400">{{ s.prev }}</span></p>
                </div>

                <!-- Add Set Button Block -->
                <button class="p-4 rounded-2xl border-2 border-dashed border-zinc-800 hover:border-violet-500 hover:bg-violet-500/5 transition-all text-zinc-500 hover:text-violet-400 flex flex-col items-center justify-center min-h-[140px] gap-2">
                  <Plus class="w-6 h-6" />
                  <span class="text-[10px] font-black uppercase tracking-widest mt-1">Add Set</span>
                </button>
             </div>
           </div>

        </div>
        
        <div v-if="activeWorkout.length === 0" class="flex flex-col items-center justify-center py-16 text-zinc-500 font-medium bg-zinc-900/50 rounded-3xl border-2 border-dashed border-zinc-800">
           <Dumbbell class="w-12 h-12 text-zinc-700 mb-4" />
           <p>No workout data available for today.</p>
           <p class="text-sm mt-1">Head to the Workout Plan creator to get started.</p>
        </div>
      </section>

    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Check, History, Plus, Dumbbell } from 'lucide-vue-next'
import { FoodAPI, WorkoutAPI } from '../api'

const activeTab = ref('Food')
const todayDate = new Date().toISOString().split('T')[0]
const todayDisp = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' })

const foodLogs = ref([])
const activeWorkout = ref([])

onMounted(async () => {
  await fetchFoodLogs()
  await fetchWorkouts()
})

const fetchFoodLogs = async () => {
  try {
    const res = await FoodAPI.getLogs(todayDate)
    foodLogs.value = res
  } catch (err) {
    console.error('Failed to fetch food logs:', err)
  }
}

const fetchWorkouts = async () => {
  try {
    const workouts = await WorkoutAPI.getWorkouts(todayDate)
    if (workouts && workouts.length > 0) {
      const exRes = await WorkoutAPI.getExercises(workouts[0].id)
      activeWorkout.value = exRes.map(ex => ({
        name: ex.name,
        sets: Array.from({ length: ex.sets || 1 }).map((_, i) => ({
          id: i + 1,
          prev: `${ex.weight}kg x ${ex.reps}`,
          weight: ex.weight,
          reps: ex.reps,
          done: false
        }))
      }))
    } else {
      activeWorkout.value = []
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