import { useState } from 'react';
import FormInput from '../moleculas/FormInput';
import Button from '../atomos/Button';
import { loginUser } from '../../services/authService';


const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [cargando, setCargando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCargando(true);

        try {
            await loginUser(username, password);
            alert('¡Login Exitoso!');
            window.location.href = '/';
        } catch (error) {
            alert(`Error: ${error.message}`);
        } finally {
            setCargando(false);
        }
    };

    return (
        <form className="flex flex-col gap-5 text-left" onSubmit={handleSubmit}>
            <FormInput label="Nombre de Usuario" id="username" type="text" placeholder="Tu usuario" value={username} onChange={(e) => setUsername(e.target.value)} required maxLength={30} />
            <FormInput label="Contraseña" id="password" type="password" placeholder="Tu contraseña segura" value={password} onChange={(e) => setPassword(e.target.value)} required maxLength={60} />
            <Button type="submit" disabled={cargando} className="mt-2.5 w-full bg-gray-dark text-beige py-3.5 rounded-2xl border-none cursor-pointer text-lg font-semibold transition-all duration-300 hover:bg-gray-mid hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50">
                {cargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
        </form>
    );
};

export default LoginForm;