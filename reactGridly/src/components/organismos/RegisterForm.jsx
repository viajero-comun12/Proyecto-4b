import { useState } from "react";
import FormInput from "../moleculas/FormInput";
import Button from "../atomos/Button";
import { registerUser  } from "../../services/authService";

const RegisterForm= ()=>{

    const [nombre, setNombre]= useState('');
    const [email, setEmail]= useState('');
    const [password, setPassword]= useState('');
    const [fechaNacimiento, setFechaNacimiento]= useState('');
    const [cargando, setCargando]= useState(false);

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setCargando(true)
        try{
            await registerUser(nombre,email,password,fechaNacimiento);
            alert('Resgistrado exitosamente');
            window.location.href='/';
        } catch (error){
            alert (`Error: ${error.message}`)
        } finally {
            setCargando(false);
        }  
    };

    return(
        <form className="flex flex-col gap-5 text-left" onSubmit={handleSubmit}>
            <FormInput label="Nombre del usuario" id="nombre" type="text" placeholder="ingrese su nombre" value={nombre} onChange={(e)=> setNombre(e.target.value)} required maxLength={30} minLength={3} />
            <FormInput label="Correo Electrónico" id="email" type="email" placeholder="usuario@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={100} />
            <FormInput label="Contraseña" id="password" type="password" placeholder="ingrese su contraseña" value={password} onChange={(e)=> setPassword(e.target.value)} required maxLength={60} minLength={6} />
            <FormInput label="Fecha de Nacimiento" id="fecha_nacimiento" type="date" value={fechaNacimiento} onChange={(e)=> setFechaNacimiento(e.target.value)} required />
            <Button type="submit" disabled={cargando} className="mt-2.5 w-full bg-gray-dark text-beige py-3 rounded-2xl border-none cursor-pointer text-lg font-semibold transition-all duration-300 hover:bg-gray-mid hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50">
                {cargando ? 'Creando la cuenta....' : 'Registrarse'}
            </Button>
        </form>
    );
};
export default RegisterForm;
