<template>
    <div class="max-w-4xl mx-auto space-y-8">
      <header>
        <h2 class="text-3xl font-bold text-zinc-100 text-center">Calorie & Macro Calculator</h2>
        <p class="text-zinc-400 mt-2 text-center">Calculate your personalized daily energy needs and macro targets.</p>
      </header>
  
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <!-- Form Section -->
        <div class="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-xl">
          <div class="space-y-6">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-medium text-zinc-400">Gender</label>
                <div class="flex gap-2 p-1 bg-zinc-950 rounded-xl border border-zinc-800">
                  <button v-for="g in ['Male', 'Female']" :key="g"
                    @click="form.gender = g"
                    :class="['flex-1 py-2 text-sm font-bold rounded-lg transition-all', 
                      form.gender === g ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/10' : 'text-zinc-500 hover:text-zinc-300']"
                  >
                    {{ g }}
                  </button>
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium text-zinc-400">Age</label>
                <input v-model.number="form.age" type="number" 
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all" />
              </div>
            </div>
  
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-medium text-zinc-400">Weight (kg)</label>
                <input v-model.number="form.weight" type="number" step="0.1"
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all" />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium text-zinc-400">Height (cm)</label>
                <input v-model.number="form.height" type="number" 
                  class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all" />
              </div>
            </div>
  
            <div class="space-y-2">
              <label class="text-sm font-medium text-zinc-400">Activity Level</label>
              <select v-model="form.activity" 
                class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all">
                <option v-for="opt in activityLevels" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
            </div>
  
            <div class="space-y-2">
              <label class="text-sm font-medium text-zinc-400">Goal</label>
              <select v-model="form.goal" 
                class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all">
                <option v-for="g in goals" :key="g.value" :value="g.value">{{ g.label }}</option>
              </select>
            </div>
  
            <button @click="calculate" 
              class="w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]">
              Calculate Requirements
            </button>
          </div>
        </div>
  
        <!-- Results Section -->
        <div v-if="results" class="space-y-6">
          <div class="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-xl relative overflow-hidden group">
            <div class="absolute -right-4 -top-4 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all duration-700"></div>
            
            <h4 class="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-2">Daily Calorie Target</h4>
            <div class="flex items-baseline gap-2">
              <span class="text-5xl font-black text-emerald-400 tabular-nums">{{ Math.round(results.tdee) }}</span>
              <span class="text-zinc-500 font-medium">kcal / day</span>
            </div>
            <p class="text-zinc-500 text-sm mt-4 leading-relaxed">
              Based on your {{ form.activity }} activity level, your maintenance calories are {{ Math.round(results.maintenance) }}. 
              Your goal requires a {{ results.offset > 0 ? 'surplus' : 'deficit' }} of {{ Math.abs(results.offset) }} kcal.
            </p>
          </div>
  
          <div class="grid grid-cols-3 gap-4">
            <div v-for="macro in resultMacros" :key="macro.label" 
              class="bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-center">
              <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{{ macro.label }}</p>
              <div class="flex flex-col">
                <span :class="`text-xl font-bold ${macro.color}`">{{ macro.value }}g</span>
                <span class="text-[10px] text-zinc-600">{{ macro.pct }}%</span>
              </div>
            </div>
          </div>
  
          <div class="bg-indigo-500/10 border border-indigo-500/20 p-6 rounded-2xl flex items-start gap-4">
              <div class="p-2 bg-indigo-500 rounded-lg">
                  <Info class="w-5 h-5 text-indigo-950" />
              </div>
              <div>
                  <p class="text-sm font-bold text-indigo-400">Why Macros Matter</p>
                  <p class="text-xs text-indigo-300/70 mt-1 leading-relaxed">
                      Protein is essential for muscle repair, Carbohydrates fuel your workouts, and Fats are vital for hormonal health.
                  </p>
              </div>
          </div>
        </div>
  
        <div v-else class="h-full bg-zinc-900/50 border border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center p-12 text-center text-zinc-500">
          <div class="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
              <Calculator class="w-8 h-8 text-zinc-600" />
          </div>
          <p class="font-medium">Enter your details and click calculate to see your results.</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { Calculator, Info } from 'lucide-vue-next'
  
  const form = ref({
    gender: 'Male',
    age: 25,
    weight: 75,
    height: 180,
    activity: 'moderate',
    goal: 'lose_05'
  })
  
  const results = ref(null)
  
  const activityLevels = [
    { label: 'Sedentary (Office job)', value: 'sedentary' },
    { label: 'Lightly Active (1-2 days/week)', value: 'light' },
    { label: 'Moderately Active (3-5 days/week)', value: 'moderate' },
    { label: 'Very Active (6-7 days/week)', value: 'active' },
    { label: 'Extra Active (Pro athlete)', value: 'extra' },
  ]
  
  const goals = [
    { label: 'Lose Weight (0.5kg/week)', value: 'lose_05' },
    { label: 'Lose Weight (0.25kg/week)', value: 'lose_025' },
    { label: 'Maintain Weight', value: 'maintain' },
    { label: 'Gain Weight (0.25kg/week)', value: 'gain_025' },
    { label: 'Gain Weight (0.5kg/week)', value: 'gain_05' },
  ]
  
  const resultMacros = computed(() => {
    if (!results.value) return []
    const { tdee } = results.value
    return [
      { label: 'Protein', value: Math.round(tdee * 0.3 / 4), pct: 30, color: 'text-emerald-400' },
      { label: 'Carbs', value: Math.round(tdee * 0.45 / 4), pct: 45, color: 'text-indigo-400' },
      { label: 'Fats', value: Math.round(tdee * 0.25 / 9), pct: 25, color: 'text-amber-400' },
    ]
  })
  
  function calculate() {
    // Mifflin-St Jeor Equation
    let bmr = (10 * form.value.weight) + (6.25 * form.value.height) - (5 * form.value.age)
    bmr = form.value.gender === 'Male' ? bmr + 5 : bmr - 161
  
    const multipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      extra: 1.9,
    }
  
    const maintenance = bmr * multipliers[form.value.activity]
    
    const goalOffsets = {
      lose_05: -500,
      lose_025: -250,
      maintain: 0,
      gain_025: 250,
      gain_05: 500,
    }
  
    const offset = goalOffsets[form.value.goal]
    const tdee = maintenance + offset
  
    results.value = {
      bmr,
      maintenance,
      tdee,
      offset
    }
  }
  </script>
  