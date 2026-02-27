const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export const AuthAPI = {
    login: async (email, password) => {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Login failed');
        }
        return response.json();
    },
    register: async (username, email, password) => {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Registration failed');
        }
        return response.json();
    },
    getProfile: async () => {
        const response = await fetch('/api/profile', {
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch profile');
        return response.json();
    }
};

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

export const WorkoutAPI = {
    getWorkouts: async () => {
        const response = await fetch('/api/workouts');
        if (!response.ok) throw new Error(`Error fetching workouts`);
        return response.json();
    },
    createWorkout: async (workout) => {
        const response = await fetch('/api/workouts', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(workout)
        });
        if (!response.ok) throw new Error(`Error creating workout`);
        return response.json();
    },
    getExercises: async () => {
        const response = await fetch('/api/exercises');
        if (!response.ok) throw new Error(`Error fetching exercises`);
        return response.json();
    },
    createExercise: async (exercise) => {
        const response = await fetch('/api/exercises', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(exercise)
        });
        if (!response.ok) throw new Error(`Error creating exercise`);
        return response.json();
    },
    updateWorkout: async (id, workout) => {
        const response = await fetch(`/api/workouts/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(workout)
        });
        if (!response.ok) throw new Error(`Error updating workout`);
        return response.json();
    },
    deleteWorkout: async (id) => {
        const response = await fetch(`/api/workouts/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error(`Error deleting workout`);
        return response.json();
    },
    updateExercise: async (id, exercise) => {
        const response = await fetch(`/api/exercises/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(exercise)
        });
        if (!response.ok) throw new Error(`Error updating exercise`);
        return response.json();
    },
    deleteExercise: async (id) => {
        const response = await fetch(`/api/exercises/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error(`Error deleting exercise`);
        return response.json();
    }
}

export const DietAPI = {
    getPlans: async () => {
        const response = await fetch('/api/diet-plans', {
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Error fetching diet plans');
        return response.json();
    },
    savePlan: async (planData) => {
        const response = await fetch('/api/diet-plans', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(planData)
        });
        if (!response.ok) throw new Error('Error saving diet plan');
        return response.json();
    }
}
