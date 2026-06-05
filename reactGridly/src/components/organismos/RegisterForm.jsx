import React, { useState } from "react";
import FormInput from "../moleculas/FormInput";
import Button from "../atomos/Button";
import { registerUser  } from "../../services/authService";

const RegisterForm= ()=>{

    // para guardar los valores de los inputs y su estado
    const [nombre, setNombre]= useState('');
    const [email, setEmail]= useState('');
    const [password, setPassword]= useState('');
    const [cargando, setCargando]= useState(false);
    //funcion para que se ejcute con el boton de registrarser
    const handleSubmit = async (e) =>{
        e.preventDefault(); //no se recarga la pagina al presionar enviar
        setCargando(true) //mientras se ejecuta la funcion se pone true
        try{
            await registerUser(nombre,email,password);
            alert('Resgistrado exitosamente');
            window.location.href='/'; //redirigir al inicio de forma temporal
        } catch (error){
            alert (`Error: ${error.message}`)
        } finally {
            setCargando(false);
        }  
    };

    return(
        <form className="auth-form" onSubmit={handleSubmit}>
            <FormInput 
            label="Nombre del usuario"
            id="nombre"
            type="text"
            placeholder="ingrese su nombre"
            value={nombre}
            onChange={(e)=> setNombre(e.target.value)}
            required
            />
            <FormInput 
            label="correo Electrónico" 
            id="email" 
            type="email" 
            placeholder="usuario@ejemplo.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
            />
            <FormInput
            label="Contraseña"
            id="password"
            type="password"
            placeholder="ingrese su contraseña"
            value={password}
            onChange={(e)=> setPassword(e.target.value)}
            required
            />
            <Button type="submit" disabled={cargando}>
                {cargando ? 'Creando la cuenta....' : 'Registrarse'}
            </Button>
        </form>
    );
};
export default RegisterForm;
    
