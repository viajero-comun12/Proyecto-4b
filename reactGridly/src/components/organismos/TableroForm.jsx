import React, { useState } from 'react';
import { createTablero } from '../../services/api';
import Button from '../atomos/Button';

const TableroForm = ({ onCreated }) => {
    const [nombre, setNombre] = useState('');
    const [secreto, setSecreto] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createTablero({ 
                nombre, 
                secreto, 
                usuario_id: localStorage.getItem('usuario_id') 
            });
            alert('¡Tablero creado!');
            setNombre('');
            onCreated();
        } catch (error) {
            alert('Error al crear tablero');
        }
    };

    return (
        <div className="contenedor-formulario">
            <h2>Crear Nuevo Tablero</h2>
            <form className="form-crear" onSubmit={handleSubmit}>
                <div className="campos-form" style={{ width: '100%' }}>
                    <input className="input-form" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre del tablero" required />
                    <label>
                        <input type="checkbox" checked={secreto} onChange={(e) => setSecreto(e.target.checked)} /> 
                        Mantener secreto
                    </label>
                    <Button type="submit">Crear Tablero</Button>
                </div>
            </form>
        </div>
    );
};
export default TableroForm;