export const FoodAPI = {
    getLogs: async (date) => {
        return {
            data: [
                { id: 1, name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fats: 3.6 },
                { id: 2, name: 'Rice', calories: 130, protein: 2.7, carbs: 28, fats: 0.3 },
            ]
        }
    }
}
