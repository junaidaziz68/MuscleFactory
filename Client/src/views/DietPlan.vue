<template>
    <div class="space-y-8">
      <header class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 class="text-3xl font-bold text-zinc-100">Diet Plan Creator</h2>
          <p class="text-zinc-400 mt-1">Design your ideal nutrition strategy based on your goals.</p>
        </div>
        <div class="flex gap-3">
          <button @click="toggleView" class="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors">
            {{ isViewingSaved ? 'Back to Creator' : 'Saved Plans' }}
          </button>
          <button @click="generatePlan" class="px-4 py-2 bg-emerald-500 text-zinc-950 rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all">
            Generate New Plan
          </button>
        </div>
      </header>
  
      <div v-if="!isViewingSaved" class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Configuration & Targets Sidebar -->
        <div class="lg:col-span-1 space-y-6">
          <div v-if="targetMacros" class="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
            <h3 class="text-sm font-bold text-zinc-100 uppercase tracking-widest mb-1">Target vs Plan</h3>
            <div class="space-y-4">
              <!-- Calories -->
              <div>
                <div class="flex justify-between text-xs font-bold mb-1">
                  <span class="text-zinc-400">Calories</span>
                  <span :class="planTotals.calories > targetMacros.tdee ? 'text-amber-400' : 'text-emerald-400'">
                    {{ planTotals.calories }} / {{ targetMacros.tdee }} kcal
                  </span>
                </div>
                <div class="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden">
                  <div class="h-full rounded-full transition-all duration-500" 
                    :class="planTotals.calories > targetMacros.tdee ? 'bg-amber-400' : 'bg-emerald-400'"
                    :style="`width: ${Math.min(100, (planTotals.calories / targetMacros.tdee) * 100)}%`"></div>
                </div>
              </div>
              
              <!-- Macros Grid -->
              <div class="grid grid-cols-3 gap-2 pt-2">
                <div>
                  <p class="text-[10px] text-zinc-500 uppercase font-bold text-center mb-1">Prot</p>
                  <p class="text-xs font-bold text-center text-zinc-300">{{ planTotals.protein }} / {{ targetMacros.protein }}g</p>
                </div>
                <div>
                  <p class="text-[10px] text-zinc-500 uppercase font-bold text-center mb-1">Carb</p>
                  <p class="text-xs font-bold text-center text-zinc-300">{{ planTotals.carbs }} / {{ targetMacros.carbs }}g</p>
                </div>
                <div>
                  <p class="text-[10px] text-zinc-500 uppercase font-bold text-center mb-1">Fat</p>
                  <p class="text-xs font-bold text-center text-zinc-300">{{ planTotals.fats }} / {{ targetMacros.fats }}g</p>
                </div>
              </div>
            </div>
            
            <div v-if="!targetMacros" class="text-xs text-zinc-500 italic mt-2">
              Visit the Calorie Calculator to set your targets!
            </div>
          </div>

          <div class="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-6">
            <div class="space-y-2">
              <label class="text-xs font-bold text-zinc-500 uppercase tracking-widest">Diet Style</label>
              <select v-model="selectedDiet" class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:ring-1 focus:ring-emerald-500 outline-none">
                <option v-for="diet in diets" :key="diet.id" :value="diet.id">{{ diet.name }}</option>
              </select>
            </div>
  
            <div class="space-y-2">
              <label class="text-xs font-bold text-zinc-500 uppercase tracking-widest">Meals Per Day</label>
              <div class="grid grid-cols-3 gap-2">
                <button v-for="n in [3, 4, 5]" :key="n" 
                  @click="mealsCount = n"
                  :class="['py-2 text-xs font-bold rounded-lg border transition-all', 
                      mealsCount === n ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300']">
                  {{ n }}
                </button>
              </div>
            </div>
  
            <div class="space-y-2">
              <label class="text-xs font-bold text-zinc-500 uppercase tracking-widest">Exclusions</label>
              <div class="flex flex-wrap gap-2">
                <button v-for="ex in exclusions" :key="ex" class="px-2 py-1 bg-zinc-800 text-[10px] text-zinc-400 rounded-md hover:text-zinc-200">
                  + {{ ex }}
                </button>
              </div>
            </div>
  
            <div class="pt-4 border-t border-zinc-800">
              <div class="flex items-center justify-between text-xs mb-3">
                <span class="text-zinc-500">Auto-balance Macros</span>
                <div class="w-8 h-4 bg-emerald-500 rounded-full relative cursor-pointer">
                  <div class="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Meal Plan Display -->
        <div class="lg:col-span-3 space-y-6">
          <div v-for="(meal, index) in currentPlan" :key="index" 
            class="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden group hover:border-zinc-700 transition-all shadow-sm">
            <div class="flex flex-col md:flex-row">
              <div class="p-6 flex-1">
                <div class="flex items-center gap-3 mb-4">
                  <span class="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded uppercase">Meal {{ index + 1 }}</span>
                  <h3 class="font-bold text-zinc-100">{{ meal.name }}</h3>
                </div>
                <ul class="space-y-2">
                  <li v-for="(ingredient, i) in meal.ingredients" :key="i" class="flex items-center gap-2 text-sm text-zinc-400 group/item">
                    <div class="w-1 h-1 bg-zinc-700 rounded-full"></div>
                    <span class="flex-1">
                      {{ ingredient.name || ingredient }}
                      <span v-if="ingredient.cals !== undefined" class="text-xs text-zinc-500 whitespace-nowrap ml-1">
                        ({{ ingredient.cals }}kcal | P:{{ingredient.p}} | C:{{ingredient.c}} | F:{{ingredient.f}})
                      </span>
                    </span>
                    <button @click="removeFood(index, i)" class="text-zinc-600 hover:text-red-400 opacity-0 group-hover/item:opacity-100 transition-opacity flex-shrink-0" title="Remove food">
                      <Trash2 class="w-3.5 h-3.5" />
                    </button>
                  </li>
                </ul>
                <div class="mt-3 flex flex-col gap-2">
                  <input v-model="newFoods[index].name" @keyup.enter="addFood(index)" placeholder="Add a food item..." class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors" />
                  <div class="flex gap-2">
                    <input v-model="newFoods[index].cals" placeholder="kcal" type="number" class="w-16 bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors" />
                    <input v-model="newFoods[index].p" placeholder="P(g)" type="number" class="w-16 bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors" />
                    <input v-model="newFoods[index].c" placeholder="C(g)" type="number" class="w-16 bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors" />
                    <input v-model="newFoods[index].f" placeholder="F(g)" type="number" class="w-16 bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors" />
                    <button @click="addFood(index)" class="flex-1 px-2 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors flex justify-center items-center" title="Add food">
                      <Plus class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div class="bg-zinc-950 p-6 md:w-64 border-t md:border-t-0 md:border-l border-zinc-800 flex flex-col justify-center">
                <div class="grid grid-cols-2 gap-4">
                  <div v-for="macro in meal.macros" :key="macro.label">
                    <p class="text-[10px] text-zinc-600 uppercase font-bold">{{ macro.label }}</p>
                    <p class="text-sm font-bold text-zinc-300">{{ macro.value }}{{ macro.unit }}</p>
                  </div>
                </div>
                <div class="mt-4 pt-4 border-t border-zinc-900 flex items-center justify-between">
                  <div class="flex items-center gap-1 text-emerald-400">
                    <Flame class="w-4 h-4" />
                    <span class="text-sm font-bold">{{ meal.calories }} <span class="text-[10px] text-zinc-600">kcal</span></span>
                  </div>
                  <button class="p-1.5 text-zinc-600 hover:text-zinc-400 transition-colors">
                    <RefreshCw class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-end pt-4" v-if="currentPlan.length > 0">
            <button @click="saveCurrentPlan" :disabled="isSaving" class="px-6 py-3 bg-emerald-500 text-zinc-950 rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all disabled:opacity-50 flex items-center gap-2">
              <span v-if="isSaving" class="w-4 h-4 border-2 border-zinc-900/30 border-t-zinc-900 rounded-full animate-spin"></span>
              {{ isSaving ? 'Saving Plan...' : 'Save Customized Plan' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Saved Plans View -->
      <div v-else class="space-y-8">
        <div v-if="isLoading" class="text-zinc-400 text-center py-8">Loading saved plans...</div>
        <div v-else-if="savedPlans.length === 0" class="text-zinc-400 text-center py-8">No saved plans found. Create one!</div>
        <div v-else class="grid grid-cols-1 gap-6">
          <div v-for="plan in savedPlans" :key="plan.id" class="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-xl font-bold text-zinc-100">{{ plan.name }}</h3>
                <p class="text-sm text-zinc-400">Diet Style: {{ plan.diet_style }} | Meals: {{ plan.meals_count }} | Created: {{ new Date(plan.created_at).toLocaleDateString() }}</p>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <div v-for="(meal, idx) in plan.meals" :key="idx" class="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                    <h4 class="font-bold text-sm text-zinc-200 mb-2">{{ meal.name }}</h4>
                    <p class="text-xs text-zinc-500 mb-2">{{ meal.calories }} kcal</p>
                    <ul class="space-y-1 mb-3">
                        <li v-for="ing in meal.ingredients" :key="ing.name || ing" class="text-xs text-zinc-400 list-disc list-inside">
                          {{ ing.name || ing }}
                          <span v-if="ing.cals !== undefined" class="text-[10px] text-zinc-500">({{ing.cals}}k)</span>
                        </li>
                    </ul>
                    <div class="flex gap-2 text-[10px] uppercase font-bold text-zinc-500">
                        <span v-for="macro in meal.macros" :key="macro.label">{{ macro.label }}: {{ macro.value }}{{ macro.unit }}</span>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue'
  import { Flame, RefreshCw, Plus, Trash2 } from 'lucide-vue-next'
  import { DietAPI } from '../api' // Assuming api is accessible here
  
  const selectedDiet = ref('high_protein')
  const mealsCount = ref(4)

  const isViewingSaved = ref(false)
  const savedPlans = ref([])
  const isSaving = ref(false)
  const isLoading = ref(false)
  
  const targetMacros = ref(null)

  const planTotals = computed(() => {
      let calories = 0, protein = 0, carbs = 0, fats = 0
      currentPlan.value.forEach(meal => {
          calories += Number(meal.calories) || 0
          meal.macros.forEach(macro => {
              if (macro.label === 'Prot') protein += Number(macro.value) || 0
              if (macro.label === 'Carb') carbs += Number(macro.value) || 0
              if (macro.label === 'Fat') fats += Number(macro.value) || 0
          })
      })
      return { calories, protein, carbs, fats }
  })
  
  const diets = [
    { id: 'high_protein', name: 'High Protein / Lean Bulk' },
    { id: 'low_carb', name: 'Low Carb / Keto Friendly' },
    { id: 'mediterranean', name: 'Mediterranean' },
    { id: 'vegan', name: 'Plant Based' },
  ]
  
  const exclusions = ['Sugar', 'Dairy', 'Gluten', 'Nuts']
  
  const plans = {
      high_protein: [
          { name: 'Power Breakfast', ingredients: [ { name: '4 Eggs', cals: 280, p: 24, c: 2, f: 20 }, { name: '50g Oats with Berries', cals: 190, p: 6, c: 33, f: 3 }, { name: '1 Scoop Whey Protein', cals: 120, p: 25, c: 3, f: 1 } ] },
          { name: 'Pre-Workout Lunch', ingredients: [ { name: '200g Grilled Chicken Breast', cals: 330, p: 62, c: 0, f: 7 }, { name: '100g Brown Rice', cals: 110, p: 3, c: 23, f: 1 }, { name: 'Steamed Broccoli', cals: 55, p: 4, c: 11, f: 1 } ] },
          { name: 'Post-Workout Fuel', ingredients: [ { name: '200g Lean Beef', cals: 500, p: 52, c: 0, f: 30 }, { name: '150g Sweet Potato', cals: 130, p: 2, c: 30, f: 0 }, { name: 'Mixed Salad', cals: 20, p: 1, c: 4, f: 0 } ] },
          { name: 'Evening Casein', ingredients: [ { name: '200g Greek Yogurt (0%)', cals: 120, p: 20, c: 8, f: 0 }, { name: 'Handful of Walnuts', cals: 190, p: 4, c: 4, f: 18 }, { name: 'Cinnamon', cals: 5, p: 0, c: 2, f: 0 } ] }
      ],
      low_carb: [
          { name: 'Keto Breakfast', ingredients: [ { name: '3 Eggs', cals: 210, p: 18, c: 2, f: 15 }, { name: 'Half Avocado', cals: 120, p: 1, c: 6, f: 11 }, { name: 'Spinach', cals: 10, p: 1, c: 1, f: 0 } ] },
          { name: 'Light Keto Lunch', ingredients: [ { name: '150g Salmon', cals: 310, p: 30, c: 0, f: 20 }, { name: 'Asparagus', cals: 20, p: 2, c: 4, f: 0 }, { name: '1 tbsp Olive Oil', cals: 120, p: 0, c: 0, f: 14 } ] },
          { name: 'Keto Dinner', ingredients: [ { name: '200g Chicken Thighs', cals: 420, p: 40, c: 0, f: 28 }, { name: 'Cauliflower Rice', cals: 30, p: 2, c: 6, f: 0 }, { name: 'Butter', cals: 100, p: 0, c: 0, f: 11 } ] },
          { name: 'Keto Snack', ingredients: [ { name: 'Handful of Almonds', cals: 160, p: 6, c: 6, f: 14 }, { name: 'Cheese Cubes', cals: 110, p: 7, c: 1, f: 9 } ] },
          { name: 'Late Snack', ingredients: [ { name: '2 Boiled Eggs', cals: 140, p: 12, c: 1, f: 10 }, { name: 'Macadamia Nuts', cals: 200, p: 2, c: 4, f: 21 } ] }
      ],
      mediterranean: [
          { name: 'Greek Yogurt Bowl', ingredients: [ { name: '150g Greek Yogurt', cals: 90, p: 15, c: 6, f: 0 }, { name: 'Honey', cals: 60, p: 0, c: 17, f: 0 }, { name: 'Walnuts', cals: 190, p: 4, c: 4, f: 18 } ] },
          { name: 'Mediterranean Lunch', ingredients: [ { name: 'Grilled Halloumi', cals: 320, p: 20, c: 2, f: 26 }, { name: 'Quinoa', cals: 110, p: 4, c: 20, f: 2 }, { name: 'Cherry Tomatoes', cals: 20, p: 1, c: 4, f: 0 } ] },
          { name: 'Seafood Dinner', ingredients: [ { name: '150g White Fish', cals: 130, p: 28, c: 0, f: 2 }, { name: 'Zucchini Noodles', cals: 30, p: 2, c: 6, f: 0 }, { name: 'Pesto', cals: 130, p: 2, c: 1, f: 13 } ] },
          { name: 'Healthy Snack', ingredients: [ { name: 'Hummus', cals: 170, p: 4, c: 10, f: 14 }, { name: 'Carrot Sticks', cals: 30, p: 1, c: 7, f: 0 } ] },
          { name: 'Fruit Snack', ingredients: [ { name: '1 Picked Apple', cals: 95, p: 1, c: 25, f: 0 }, { name: 'Almond Butter', cals: 190, p: 7, c: 6, f: 17 } ] }
      ],
      vegan: [
          { name: 'Vegan Power Bowl', ingredients: [ { name: 'Tofu Scramble', cals: 180, p: 20, c: 4, f: 10 }, { name: 'Spinach', cals: 10, p: 1, c: 1, f: 0 }, { name: 'Whole Grain Toast', cals: 150, p: 6, c: 28, f: 2 } ] },
          { name: 'Plant Lunch', ingredients: [ { name: 'Lentil Stew', cals: 230, p: 18, c: 40, f: 1 }, { name: 'Sweet Potato', cals: 110, p: 2, c: 26, f: 0 }, { name: 'Kale', cals: 30, p: 2, c: 6, f: 1 } ] },
          { name: 'Vegan Dinner', ingredients: [ { name: 'Tempeh', cals: 320, p: 30, c: 12, f: 18 }, { name: 'Broccoli', cals: 55, p: 4, c: 11, f: 1 }, { name: 'Brown Rice', cals: 110, p: 3, c: 23, f: 1 } ] },
          { name: 'Protein Shake', ingredients: [ { name: 'Pea Protein Isolate', cals: 110, p: 24, c: 1, f: 1 }, { name: 'Almond Milk', cals: 40, p: 1, c: 2, f: 3 }, { name: 'Banana', cals: 105, p: 1, c: 27, f: 0 } ] },
          { name: 'Nuts Snack', ingredients: [ { name: 'Peanuts', cals: 160, p: 7, c: 5, f: 14 }, { name: 'Raisins', cals: 130, p: 1, c: 34, f: 0 } ] }
      ]
  }
  
  const currentPlan = ref([])
  const newFoods = ref([])

  const calculateMealMacros = (meal) => {
      let calories = 0
      let p = 0
      let c = 0
      let f = 0
      meal.ingredients.forEach(ing => {
          if (typeof ing === 'object' && ing.name) {
              calories += Number(ing.cals) || 0
              p += Number(ing.p) || 0
              c += Number(ing.c) || 0
              f += Number(ing.f) || 0
          }
      })
      meal.calories = Math.round(calories)
      meal.macros = [
          { label: 'Prot', value: Math.round(p), unit: 'g' },
          { label: 'Carb', value: Math.round(c), unit: 'g' },
          { label: 'Fat', value: Math.round(f), unit: 'g' }
      ]
  }

  const generatePlan = () => {
      isViewingSaved.value = false
      const basePlan = plans[selectedDiet.value] || plans.high_protein
      // Deep clone to allow editing without mutating the base templates
      currentPlan.value = JSON.parse(JSON.stringify(basePlan.slice(0, mealsCount.value)))
      currentPlan.value.forEach(calculateMealMacros)
      
      newFoods.value = Array.from({ length: currentPlan.value.length }, () => ({
          name: '', cals: '', p: '', c: '', f: ''
      }))
  }

  watch([selectedDiet, mealsCount], () => {
      generatePlan()
  })

  onMounted(() => {
      // Load saved macro targets from the Calculator
      const savedTargets = localStorage.getItem('userMacroTargets')
      if (savedTargets) {
          try {
              targetMacros.value = JSON.parse(savedTargets)
          } catch (e) {
              console.error("Failed to parse saved targets", e)
          }
      }
      generatePlan()
  })

  const addFood = (mealIndex) => {
      const food = newFoods.value[mealIndex]
      if (food && food.name && food.name.trim() !== '') {
          currentPlan.value[mealIndex].ingredients.push({
              name: food.name.trim(),
              cals: Number(food.cals) || 0,
              p: Number(food.p) || 0,
              c: Number(food.c) || 0,
              f: Number(food.f) || 0
          })
          calculateMealMacros(currentPlan.value[mealIndex])
          
          newFoods.value[mealIndex] = { name: '', cals: '', p: '', c: '', f: '' }
      }
  }

  const removeFood = (mealIndex, foodIndex) => {
      currentPlan.value[mealIndex].ingredients.splice(foodIndex, 1)
      calculateMealMacros(currentPlan.value[mealIndex])
  }

  const toggleView = () => {
      isViewingSaved.value = !isViewingSaved.value
      if (isViewingSaved.value && savedPlans.value.length === 0) {
          loadSavedPlans()
      }
  }

  const loadSavedPlans = async () => {
      isLoading.value = true
      try {
          savedPlans.value = await DietAPI.getPlans()
      } catch (err) {
          console.error("Failed to load plans", err)
          alert("Failed to load saved plans")
      } finally {
          isLoading.value = false
      }
  }

  const saveCurrentPlan = async () => {
      isSaving.value = true
      try {
          const selectedDietName = diets.find(d => d.id === selectedDiet.value)?.name || 'Custom'
          const planData = {
              name: `My ${selectedDietName} Plan`,
              diet_style: selectedDiet.value,
              meals_count: mealsCount.value,
              meals: currentPlan.value
          }
          await DietAPI.savePlan(planData)
          alert("Diet plan saved successfully!")
      } catch (err) {
          console.error("Failed to save plan", err)
          alert("Failed to save diet plan. Please make sure you are logged in.")
      } finally {
          isSaving.value = false
      }
  }
  </script>
  