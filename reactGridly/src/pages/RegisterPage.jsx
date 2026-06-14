import RegisterForm from "../components/organismos/RegisterForm";
import {Link} from 'react-router-dom';

const RegisterPage = () => {
    return(
        <main className="min-h-screen flex items-center justify-center p-5 bg-[url('../img/bg-auth.jpg')] bg-cover bg-center relative z-0 before:content-[''] before:absolute before:inset-0 before:bg-gray-dark/40 before:backdrop-blur-sm before:-z-10">
            <section className="bg-white/95 p-10 md:p-12 rounded-3xl shadow-2xl w-full max-w-[420px] text-center animate-fade-in-up">
                <div className="flex justify-center mb-5">
                    <div className="w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center text-3xl font-bold font-sans">G</div>
                </div>
                <h1 className="mb-2.5 text-accent text-3xl leading-tight">Únete a Gridly</h1>
                <p className="text-gray-dark text-base mb-8">Crea tu cuenta para Guardar tus ideas favoritas</p>
                <RegisterForm />
                <div className="mt-8 text-sm text-gray-soft">
                    <p>¿Ya tienes una cuenta? <Link to="/login" className="text-accent font-bold hover:underline">Inicia sesión</Link> </p>
                </div>
            </section>
        </main>
    );  
};

export default RegisterPage;