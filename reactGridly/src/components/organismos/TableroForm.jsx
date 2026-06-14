import { useState } from 'react';
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
            console.error(error);
            alert('Error al crear tablero');
        }
    };

    return (
        <div className="max-w-[800px] mx-auto bg-white rounded-2xl p-10 shadow-md">
            <h2>Crear Nuevo Tablero</h2>
            <form className="flex gap-8 mt-5 flex-wrap" onSubmit={handleSubmit}>
                <div className="flex-1 min-w-[300px] flex flex-col gap-5 w-full">
                    <input 
                        className="w-full px-4 py-3 border-2 border-beige rounded-2xl text-base bg-beige-light/50 text-gray-dark transition-all duration-300 focus:outline-none focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/10 placeholder:text-gray-muted" 
                        value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre del tablero" required maxLength={50} 
                    />
                    <label className="flex items-center gap-2 text-gray-dark text-base cursor-pointer">
                        <input type="checkbox" checked={secreto} onChange={(e) => setSecreto(e.target.checked)} className="w-4 h-4 accent-accent" /> 
                        Mantener secreto
                    </label>
                    <Button type="submit" className="bg-gray-dark text-beige border-none py-2.5 px-5 rounded-2xl cursor-pointer font-semibold w-fit transition-all duration-300 hover:bg-gray-mid hover:-translate-y-0.5 hover:shadow-lg">Crear Tablero</Button>
                </div>
            </form>
        </div>
    );
};
export default TableroForm;