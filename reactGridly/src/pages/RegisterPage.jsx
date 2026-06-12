
import RegisterForm from "../components/organismos/RegisterForm";
import {Link} from 'react-router-dom';

const RegisterPage = () => {
    return(
        <main className="bg-auth" style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <section className="tarjeta-auth">
                <div className="logo-auth">
                    <div className="logo-icono">G</div>
                </div>
                <h1>Unete a Gridly</h1>
                <p className="subtitulo">Crea tu cuenta para Guardar tus ideas favoritasr</p>
                <RegisterForm />
                <div className="auth-links">
                    <p>¿Ya tienes una cuenta? <Link to="/login">Inicia sesion</Link> </p>
                </div>
            </section>
        </main>
    );  
};

export default RegisterPage;