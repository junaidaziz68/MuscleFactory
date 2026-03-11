// src/store/auth.js
import { reactive, readonly } from 'vue';

const state = reactive({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
});

const setAuth = (token, user) => {
    state.token = token;
    state.user = user;
    state.isAuthenticated = true;
    localStorage.setItem('token', token);
    if (user) {
        localStorage.setItem('user', JSON.stringify(user));
    }
};

const clearAuth = () => {
    state.token = null;
    state.user = null;
    state.isAuthenticated = false;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

const initAuth = () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
        try {
            state.user = JSON.parse(userStr);
            state.isAuthenticated = true;
        } catch (e) {
            clearAuth();
        }
    } else {
        clearAuth();
    }
};

export const useAuth = () => {
    return {
        state: readonly(state),
        setAuth,
        clearAuth,
        initAuth
    };
};
