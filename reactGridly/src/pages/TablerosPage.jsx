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
        <>
            <section className="seccion-app sec-crear-tablero" style={{ display: 'block' }}>
                <TableroForm onCreated={cargar} />

                <h2 style={{ marginTop: '30px' }}>Mis Tableros</h2>

                {cargando && <p style={{ color: '#8892a0' }}>Cargando tableros...</p>}
                {error && <p style={{ color: 'red', fontWeight: 'bold' }}>⚠️ {error}</p>}

                {!cargando && !error && tableros.length === 0 && (
                    <p style={{ color: '#8892a0' }}>No tienes tableros aún. ¡Crea el primero arriba!</p>
                )}

                {!cargando && !error && tableros.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginTop: '20px' }}>
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
        </>
    );
};

export default TablerosPage;
