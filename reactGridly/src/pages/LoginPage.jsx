import React from 'react';
import LoginForm from '../components/organismos/LoginForm';
import {Link} from 'react-router-dom';

const LoginPage = () => {
    return (
        <main className="bg-auth" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="tarjeta-auth">
                <header className="header-auth">
                    <a href="/" className="logo-auth" aria-label="Ir al inicio de Gridly">
                        <div className="logo-icono" aria-hidden="true">G</div>
                    </a>
                    <h1>Bienvenido a Gridly</h1>
                    <p className="subtitulo">Encuentra nuevas ideas para probar</p>
                </header>

            
                <LoginForm />

                <div className="auth-links">
                    <p>¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link></p>
                </div>
            </div>
        </main>
    );
};

export default LoginPage;