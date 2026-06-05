// src/services/authService.js

const API_URL = 'http://127.0.0.1:8000';

export const loginUser = async (username, password) => {
    const response = await fetch(`${API_URL}/login/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Credenciales incorrectas');
    }
    
    const data = await response.json();
    
    // Guardamos en localStorage directamente desde el servicio
    localStorage.setItem('usuario_id', data.usuario_id);
    localStorage.setItem('username', data.username);
    
    return data;
};

export const registerUser = async (username, email, password) => {
    const response = await fetch(`${API_URL}/usuarios/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'No se pudo registrar');
    }
    
    const data = await response.json();
    
    // Autologin al registrarse
    localStorage.setItem('usuario_id', data.id);
    localStorage.setItem('username', data.username);
    
    return data;
};

export const logoutUser = () => {
    localStorage.removeItem('usuario_id');
    localStorage.removeItem('username');
    // En React, luego de llamar a esta función, usarás React Router para redirigir al login
};