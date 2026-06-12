import { Link } from 'react-router-dom';
import LoginForm from '../components/organismos/LoginForm';

const LoginPage = () => {
    return (
        <main className="min-h-screen flex items-center justify-center p-5 bg-[url('../img/bg-auth.jpg')] bg-cover bg-center relative z-0 before:content-[''] before:absolute before:inset-0 before:bg-gray-dark/40 before:backdrop-blur-sm before:-z-10">
            <div className="bg-white/95 p-10 md:p-12 rounded-3xl shadow-2xl w-full max-w-[420px] text-center animate-fade-in-up">
                <header className="flex flex-col items-center w-full mb-8">
                    <a href="/" className="flex justify-center mb-5 no-underline" aria-label="Ir al inicio de Gridly">
                        <div className="w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center text-3xl font-bold font-sans" aria-hidden="true">G</div>
                    </a>
                    <h1 className="mb-2.5 text-accent text-3xl leading-tight">Bienvenido a Gridly</h1>
                    <p className="text-gray-dark text-base mb-2">Encuentra nuevas ideas para probar</p>
                </header>

                <LoginForm />

                <div className="mt-8 text-sm text-gray-soft">
                    <p>¿No tienes cuenta? <Link to="/register" className="text-accent font-bold hover:underline">Regístrate aquí</Link></p>
                </div>
            </div>
        </main>
    );
};

export default LoginPage;