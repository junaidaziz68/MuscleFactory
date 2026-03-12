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
        <button v-for="tab in ['Check-In', 'Workout']" :key="tab"
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

    <!-- CHECK-IN VIEW -->
    <main v-if="activeTab === 'Check-In'" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <!-- Hydration Tracker Panel -->
      <section class="bg-gradient-to-r from-sky-900 to-blue-900 border border-sky-700/50 rounded-3xl p-6 lg:p-8 flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden group">
        <div class="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:250%_250%] opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity"></div>
        <div class="absolute -right-20 -top-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div class="flex items-center gap-6 relative z-10 w-full md:w-1/3">
          <div class="w-16 h-16 rounded-2xl bg-sky-500/20 border border-sky-400/50 flex items-center justify-center text-sky-400 flex-shrink-0 shadow-inner">
            <Droplets class="w-8 h-8" />
          </div>
          <div>
            <h3 class="text-2xl font-black text-white leading-tight">Hydration</h3>
            <p class="text-sm font-bold text-sky-300 uppercase tracking-widest mt-0.5">Daily Goal: 3L</p>
          </div>
        </div>

        <div class="flex-1 w-full relative z-10 space-y-4">
          <div class="flex items-end justify-between font-bold">
            <span class="text-3xl text-white">{{ totalWater }} <span class="text-sm text-sky-300">ml</span></span>
            <span class="text-sm text-sky-400">{{ Math.round((totalWater / 3000) * 100) }}%</span>
          </div>
          <div class="h-3 w-full bg-sky-950 rounded-full overflow-hidden shadow-inner isolate relative">
            <div class="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(6,182,212,0.5)]" 
                 :style="{ width: `${Math.min((totalWater / 3000) * 100, 100)}%` }"></div>
          </div>
        </div>

        <div class="flex gap-3 relative z-10 w-full md:w-auto">
          <button @click="addWater(250)" class="flex-1 md:flex-none px-6 py-3 bg-sky-500 hover:bg-sky-400 text-sky-950 font-black rounded-xl transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
            +250ml
          </button>
          <button @click="addWater(500)" class="flex-1 md:flex-none px-6 py-3 bg-sky-950 border border-sky-500/50 hover:bg-sky-800 text-sky-300 hover:text-white font-black rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
            +500ml
          </button>
        </div>
      </section>

      <!-- Weight & Photos Grid -->
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Weight Card -->
        <div class="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 relative overflow-hidden shadow-xl flex flex-col hover:border-violet-500/30 transition-colors">
           <h3 class="text-2xl font-bold text-white mb-6">Today's Weight</h3>
           <div class="flex items-center gap-4 mb-8">
             <input type="number" step="0.1" v-model="weightInput" class="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 rounded-2xl px-6 py-6 text-5xl font-black text-white outline-none transition-colors text-center" placeholder="0.0">
             <span class="text-2xl font-bold text-zinc-500">kg</span>
           </div>
           
           <div class="mt-auto">
             <button @click="saveWeight" :disabled="isSavingWeight" class="w-full py-4 bg-violet-600 hover:bg-violet-500 text-white font-black rounded-2xl transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] disabled:opacity-50">
               {{ isSavingWeight ? 'Saving...' : 'Log Weight' }}
             </button>
             <p v-if="todayWeight" class="mt-4 text-center text-sm font-bold text-emerald-400 bg-emerald-500/10 py-2 rounded-lg border border-emerald-500/20">Logged: {{ todayWeight }} kg</p>
           </div>
        </div>

        <!-- Photos Card -->
        <div class="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 relative overflow-hidden shadow-xl flex flex-col hover:border-violet-500/30 transition-colors">
           <h3 class="text-2xl font-bold text-white mb-6">Progress Photo</h3>
           
           <div v-if="todayPhotos && todayPhotos.length > 0" class="mb-6 grid grid-cols-2 gap-4">
              <img v-for="photo in todayPhotos" :key="photo" :src="`http://localhost:3000${photo}`" class="rounded-2xl border-2 border-zinc-800 aspect-square object-cover w-full opacity-90 hover:opacity-100 transition-opacity" />
           </div>

           <div v-else class="mb-6 h-48 border-2 border-dashed border-zinc-700 rounded-2xl flex flex-col items-center justify-center text-zinc-500 bg-zinc-950/50">
             <Camera class="w-8 h-8 mb-2 opacity-50" />
             <p class="text-sm font-medium">No photo uploaded today</p>
           </div>
           
           <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*" class="hidden" />
           
           <div class="mt-auto">
             <button @click="$refs.fileInput.click()" :disabled="isUploadingPhoto" class="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-black rounded-2xl transition-all border border-zinc-700 disabled:opacity-50 flex items-center justify-center gap-2">
               <Upload class="w-5 h-5" />
               {{ isUploadingPhoto ? 'Uploading...' : 'Upload New Photo' }}
             </button>
           </div>
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
import { Check, History, Plus, Dumbbell, Droplets, Camera, Upload } from 'lucide-vue-next'
import { WorkoutAPI, WaterAPI, CheckInAPI } from '../api'

const activeTab = ref('Check-In')
const todayDate = new Date().toISOString().split('T')[0]
const todayDisp = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' })

// Data
const activeWorkout = ref([])
const waterLogs = ref([])

const weightInput = ref('')
const todayWeight = ref(null)
const todayPhotos = ref([])

// State flags
const isAddingWater = ref(false)
const isSavingWeight = ref(false)
const isUploadingPhoto = ref(false)

const fileInput = ref(null)

onMounted(async () => {
  await fetchCheckIns()
  await fetchWaterLogs()
  await fetchWorkouts()
})

const fetchCheckIns = async () => {
  try {
    const res = await CheckInAPI.getLogs(todayDate)
    if (res.weight) {
      todayWeight.value = res.weight
      weightInput.value = res.weight
    }
    if (res.photos) {
      todayPhotos.value = res.photos
    }
  } catch (err) {
    console.error('Failed to fetch checkins:', err)
  }
}

const saveWeight = async () => {
  if (!weightInput.value || isSavingWeight.value) return;
  isSavingWeight.value = true;
  try {
    const res = await CheckInAPI.saveWeight({ date: todayDate, weight: Number(weightInput.value) })
    todayWeight.value = res.weight
  } catch (err) {
    console.error('Failed to save weight:', err)
  } finally {
    isSavingWeight.value = false;
  }
}

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file || isUploadingPhoto.value) return;

  isUploadingPhoto.value = true;
  try {
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('date', todayDate);

    const res = await CheckInAPI.uploadPhoto(formData);
    if (res.photo_url) {
      todayPhotos.value.push(res.photo_url);
    }
  } catch (err) {
    console.error('Failed to upload photo:', err)
  } finally {
    isUploadingPhoto.value = false;
    event.target.value = ''; // Reset input
  }
}

const fetchWaterLogs = async () => {
  try {
    const res = await WaterAPI.getLogs(todayDate)
    waterLogs.value = res
  } catch (err) {
    console.error('Failed to fetch water logs:', err)
  }
}

const addWater = async (amount) => {
  if (isAddingWater.value) return;
  isAddingWater.value = true;
  try {
    await WaterAPI.addLog({ date: todayDate, amount })
    await fetchWaterLogs()
  } catch (err) {
    console.error('Failed to add water log:', err)
  } finally {
    isAddingWater.value = false;
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

const totalWater = computed(() => {
  return waterLogs.value.reduce((sum, log) => sum + log.amount, 0)
})
</script>