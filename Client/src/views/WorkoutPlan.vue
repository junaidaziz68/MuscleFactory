<template>
  <div class="space-y-8">
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-3xl font-bold text-zinc-100">Workout Plan Creator</h2>
        <p class="text-zinc-400 mt-1">Build a custom workout routine tailored to your fitness level.</p>
      </div>
      <div class="flex gap-3">
        <button @click="fetchData" class="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors">
          Refresh Data
        </button>
        <button @click="openRoutineModal" class="px-4 py-2 bg-indigo-500 text-zinc-100 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-600 transition-all">
          Create New Routine
        </button>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Left Column: Workout Splits -->
      <div class="lg:col-span-4 space-y-6">
        <div class="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <h4 class="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Your Routines</h4>
          <div v-if="backendWorkouts.length === 0" class="text-sm text-zinc-500">No routines found. Create one to get started!</div>
          <div class="space-y-3" v-else>
            <div v-for="workout in backendWorkouts" :key="workout.id" 
              class="relative flex group/item">
              <button @click="selectedRoutine = workout.id"
                :class="['flex-1 p-4 rounded-xl border text-left transition-all group', 
                  selectedRoutine === workout.id ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700']">
                <p class="font-bold mb-1">{{ workout.name }}</p>
                <p class="text-xs text-zinc-500 group-hover:text-zinc-400">Date: {{ workout.date.split('T')[0] }}</p>
              </button>
              <div class="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                 <button @click.stop="openRoutineModal(workout)" class="p-1.5 text-zinc-500 hover:text-indigo-400 bg-zinc-900 rounded-md border border-zinc-700 hover:border-indigo-400/50 transition-colors">
                    <Pencil class="w-3.5 h-3.5" />
                 </button>
                 <button @click.stop="deleteRoutine(workout.id)" class="p-1.5 text-zinc-500 hover:text-rose-400 bg-zinc-900 rounded-md border border-zinc-700 hover:border-rose-400/50 transition-colors">
                    <Trash2 class="w-3.5 h-3.5" />
                 </button>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-indigo-500/10 border border-indigo-500/20 p-6 rounded-2xl relative overflow-hidden">
            <h4 class="text-zinc-100 font-bold mb-2">Pro Tip</h4>
            <p class="text-sm text-indigo-300/80 leading-relaxed">
                Consistency is key. Choose a split that fits your schedule, not just your ambition. 3 days of high intensity is better than 5 days of skipping.
            </p>
            <Dumbbell class="absolute -right-4 -bottom-4 w-24 h-24 text-indigo-500/5 rotate-12" />
        </div>
      </div>

      <!-- Right Column: Exercises -->
      <div class="lg:col-span-8">
        <div class="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div class="p-6 border-b border-zinc-800 flex items-center justify-between">
                <h4 class="font-bold text-zinc-100">Workout Details</h4>
                <div class="flex items-center gap-4">
                    <span class="text-xs text-zinc-500" v-if="selectedRoutine">{{ currentExercises.length }} Exercises</span>
                    <button @click="openExerciseModal" class="text-emerald-400 text-sm font-bold hover:underline" v-if="selectedRoutine">+ Add Exercise</button>
                </div>
            </div>
            
            <div class="divide-y divide-zinc-800">
                <div v-if="!selectedRoutine" class="p-8 text-center text-zinc-500 text-sm">
                    Select a routine from the left to view or add exercises.
                </div>
                <div v-else-if="currentExercises.length === 0" class="p-8 text-center text-zinc-500 text-sm">
                    No exercises added to this routine yet. Click "+ Add Exercise" to start!
                </div>
                <div v-for="(ex, index) in currentExercises" :key="index" class="p-6 flex items-center gap-6 group hover:bg-zinc-800/30 transition-colors">
                    <div class="w-12 h-12 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-center text-zinc-500 font-bold group-hover:border-indigo-500/30 transition-all">
                        {{ index + 1 }}
                    </div>
                    <div class="flex-1">
                        <h5 class="font-bold text-zinc-100">{{ ex.name }}</h5>
                        <p class="text-xs text-zinc-500 mt-0.5">Focus: Compound / Isolation</p>
                    </div>
                    <div class="flex items-center gap-8">
                        <div class="text-center">
                            <p class="text-xs text-zinc-600 uppercase font-bold">Sets</p>
                            <p class="text-sm font-bold text-zinc-300">{{ ex.sets }}</p>
                        </div>
                        <div class="text-center">
                            <p class="text-xs text-zinc-600 uppercase font-bold">Reps</p>
                            <p class="text-sm font-bold text-zinc-300">{{ ex.reps }}</p>
                        </div>
                        <div class="text-center">
                            <p class="text-xs text-zinc-600 uppercase font-bold">Weight</p>
                            <p class="text-sm font-bold text-zinc-300">{{ ex.weight }} kg</p>
                        </div>
                    </div>
                    <div class="flex gap-2">
                      <button @click="openExerciseModal(ex)" class="p-2 text-zinc-700 hover:text-emerald-400 transition-colors">
                          <Pencil class="w-4 h-4" />
                      </button>
                      <button @click="deleteExercise(ex.id)" class="p-2 text-zinc-700 hover:text-rose-400 transition-colors">
                          <Trash2 class="w-4 h-4" />
                      </button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>

    <!-- Routine Modal -->
    <div v-if="isRoutineModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div class="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <h3 class="text-xl font-bold text-zinc-100 mb-4">{{ editingRoutineId ? 'Edit Routine' : 'Create New Routine' }}</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-zinc-400 mb-1">Routine Name</label>
            <input v-model="newRoutineName" @keyup.enter="submitRoutine" type="text" placeholder="e.g. Chest Day" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all">
          </div>
        </div>
        <div class="mt-6 flex gap-3 justify-end">
          <button @click="closeRoutineModal" class="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">Cancel</button>
          <button @click="submitRoutine" class="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-zinc-100 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all">{{ editingRoutineId ? 'Save Changes' : 'Create Routine' }}</button>
        </div>
      </div>
    </div>

    <!-- Exercise Modal -->
    <div v-if="isExerciseModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div class="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <h3 class="text-xl font-bold text-zinc-100 mb-4">{{ editingExerciseId ? 'Edit Exercise' : 'Add Exercise' }}</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-zinc-400 mb-1">Exercise Name</label>
            <input v-model="newExerciseForm.name" @keyup.enter="submitExercise" type="text" placeholder="e.g. Bench Press" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all">
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-zinc-400 mb-1">Sets</label>
              <input v-model.number="newExerciseForm.sets" type="number" min="1" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all">
            </div>
            <div>
              <label class="block text-sm font-medium text-zinc-400 mb-1">Reps</label>
              <input v-model.number="newExerciseForm.reps" type="number" min="1" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all">
            </div>
            <div>
              <label class="block text-sm font-medium text-zinc-400 mb-1">Weight (kg)</label>
              <input v-model.number="newExerciseForm.weight" type="number" min="0" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all">
            </div>
          </div>
        </div>
        <div class="mt-6 flex gap-3 justify-end">
          <button @click="closeExerciseModal" class="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">Cancel</button>
          <button @click="submitExercise" class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all">{{ editingExerciseId ? 'Save Changes' : 'Add Exercise' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { Dumbbell, ArrowRight, Trash2, Pencil } from 'lucide-vue-next'
import { WorkoutAPI } from '../api'

const backendWorkouts = ref([])
const backendExercises = ref([])
const selectedRoutine = ref(null)

const fetchData = async () => {
    try {
        const workouts = await WorkoutAPI.getWorkouts()
        backendWorkouts.value = workouts
        if (workouts.length > 0 && !selectedRoutine.value) {
            selectedRoutine.value = workouts[0].id
        }

        const exercises = await WorkoutAPI.getExercises()
        backendExercises.value = exercises
    } catch (err) {
        console.error('Failed to fetch data from backend:', err)
    }
}

onMounted(() => {
    fetchData()
})

// --- Routine Actions ---
const isRoutineModalOpen = ref(false)
const newRoutineName = ref('')
const editingRoutineId = ref(null)

const openRoutineModal = (workout = null) => {
    if (workout && workout.id) {
        editingRoutineId.value = workout.id
        newRoutineName.value = workout.name
    } else {
        editingRoutineId.value = null
        newRoutineName.value = ''
    }
    isRoutineModalOpen.value = true
}

const closeRoutineModal = () => {
    isRoutineModalOpen.value = false
    editingRoutineId.value = null
}

const submitRoutine = async () => {
    if (!newRoutineName.value.trim()) return
    const date = new Date().toISOString().split('T')[0]
    
    try {
        if (editingRoutineId.value) {
            await WorkoutAPI.updateWorkout(editingRoutineId.value, { name: newRoutineName.value, date })
        } else {
            await WorkoutAPI.createWorkout({ name: newRoutineName.value, date })
        }
        await fetchData()
        closeRoutineModal()
    } catch (err) {
        console.error("Failed to save routine:", err)
        window.alert("Failed to save routine.")
    }
}

const deleteRoutine = async (id) => {
    if (!window.confirm("Are you sure you want to delete this routine? All exercises within it will also be deleted.")) return;
    try {
        await WorkoutAPI.deleteWorkout(id)
        if (selectedRoutine.value === id) {
            selectedRoutine.value = null
        }
        await fetchData()
    } catch (err) {
        console.error("Failed to delete routine:", err)
        window.alert("Failed to delete routine.")
    }
}

// --- Exercise Actions ---
const isExerciseModalOpen = ref(false)
const editingExerciseId = ref(null)
const newExerciseForm = reactive({ name: '', sets: 3, reps: 10, weight: 0 })

const openExerciseModal = (exercise = null) => {
    if (!selectedRoutine.value && !exercise) {
        window.alert("Please select a routine first.")
        return
    }
    
    if (exercise && exercise.id) {
        editingExerciseId.value = exercise.id
        newExerciseForm.name = exercise.name
        newExerciseForm.sets = exercise.sets || 3
        newExerciseForm.reps = exercise.reps || 10
        newExerciseForm.weight = exercise.weight || 0
    } else {
        editingExerciseId.value = null
        newExerciseForm.name = ''
        newExerciseForm.sets = 3
        newExerciseForm.reps = 10
        newExerciseForm.weight = 0
    }
    isExerciseModalOpen.value = true
}

const closeExerciseModal = () => {
    isExerciseModalOpen.value = false
    editingExerciseId.value = null
}

const submitExercise = async () => {
    if (!newExerciseForm.name.trim()) return
    const payload = { ...newExerciseForm, workout_id: selectedRoutine.value }
    
    try {
        if (editingExerciseId.value) {
            await WorkoutAPI.updateExercise(editingExerciseId.value, payload)
        } else {
            await WorkoutAPI.createExercise(payload)
        }
        await fetchData()
        closeExerciseModal()
    } catch (err) {
        console.error("Failed to save exercise:", err)
        window.alert("Failed to save exercise.")
    }
}

const deleteExercise = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exercise?")) return;
    try {
        await WorkoutAPI.deleteExercise(id)
        await fetchData()
    } catch (err) {
        console.error("Failed to delete exercise:", err)
        window.alert("Failed to delete exercise.")
    }
}

const currentExercises = computed(() => {
    return backendExercises.value.filter(ex => ex.workout_id === selectedRoutine.value)
})
</script>
  