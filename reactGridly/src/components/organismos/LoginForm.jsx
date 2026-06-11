import React, { useState } from 'react';
import FormInput from '../moleculas/FormInput';
import Button from '../atomos/Button';
import { loginUser } from '../../services/authService';


const LoginForm = () => {
    // Estados para guardar los valores
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [cargando, setCargando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCargando(true);

        try {
            // Llamamos a la función de tu authService
            await loginUser(username, password);
            alert('¡Login Exitoso!');
            window.location.href = '/'; // Redirige al inicio temporalmente
        } catch (error) {
            alert(`Error: ${error.message}`);
        } finally {
            setCargando(false);
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            {/* Reutilizamos nuestra molécula FormInput */}
            <FormInput 
                label="Nombre de Usuario" 
                id="username" 
                type="text" 
                placeholder="Tu usuario" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
            />
            
            <FormInput 
                label="Contraseña" 
                id="password" 
                type="password" 
                placeholder="Tu contraseña segura" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
            />
            <Button type="submit" disabled={cargando} style={{ backgroundColor: '#620096', color: 'white', padding: '12px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '1rem', width: '100%', marginTop: '10px' }}>
                {cargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
        </form>
    );
};

export default LoginForm;