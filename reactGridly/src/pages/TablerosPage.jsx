import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/templates/MainLayout';
import TableroForm from '../components/organismos/TableroForm';
import { getMisTableros } from '../services/api';

const TablerosPage = () => {
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
        cargar();
    }, []);

    return (
        
        <MainLayout>
            
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
                        {tableros.map(t => {
                            // Verificamos si tiene portada, si no, usamos el color morado
                            const tienePortada = t.publicaciones && t.publicaciones.length > 0;
                            const fondo = tienePortada ? `url(${t.publicaciones[0].url_multimedia})` : 'var(--color-morado)';
                            
                            return (
                                <Link to={`/pines?tablero=${t.id}`} key={t.id} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}>
                                    <div 
                                        style={{ 
                                            width: '100%',
                                            height: '200px', 
                                            background: fondo,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            borderRadius: '12px'
                                        }}
                                    ></div>
                                    <div className="info-basica" style={{ padding: '10px 0' }}>
                                        <strong style={{ fontSize: '1.1rem' }}>{t.nombre}</strong>
                                        <p style={{ color: '#8892a0', fontSize: '0.85rem' }}>
                                            {t.publicaciones ? t.publicaciones.length : 0} pines
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </section>
        </MainLayout>
    );
};

export default TablerosPage;