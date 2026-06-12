import { useEffect, useState } from 'react';
import TableroForm from '../components/organismos/TableroForm';
import TableroCard from '../components/moleculas/TableroCard';
import { getMisTableros } from '../services/api';
import { useNavigate } from 'react-router-dom';

const TablerosPage = () => {
    const navigate = useNavigate();
    const [tableros, setTableros] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const cargar = async () => {
        const usuarioId = localStorage.getItem('usuario_id');
        if (!usuarioId) {
            setError('Inicia sesión para ver tus tableros.');
            setCargando(false);
            return;
        }
        try {
            setCargando(true);
            const data = await getMisTableros(usuarioId);
            setTableros(data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Error al conectar con el servidor.');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        cargar();
    }, []);

    return (
        <section className="block animate-fade-in p-5 max-w-[1200px] mx-auto">
            <TableroForm onCreated={cargar} />

            <h2 className="mt-12 mb-6 text-3xl text-gray-dark border-b border-beige pb-4">Mis Tableros</h2>

            {cargando && <p className="text-gray-muted py-5">Cargando tableros...</p>}
            {error && <p className="text-danger font-bold py-5">⚠️ {error}</p>}

            {!cargando && !error && tableros.length === 0 && (
                <p className="text-gray-muted py-5">No tienes tableros aún. ¡Crea el primero arriba!</p>
            )}

            {!cargando && !error && tableros.length > 0 && (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5 mt-5">
                    {tableros.map(t => (
                        <TableroCard
                            key={t.id}
                            tablero={t}
                            onClick={() => navigate(`/pines?tablero=${t.id}`)}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default TablerosPage;
