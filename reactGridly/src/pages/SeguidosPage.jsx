import React, { useEffect, useState } from 'react';
import MainLayout from '../components/templates/MainLayout';
import UserCard from '../components/moleculas/UserCard';
import { getSeguidos } from '../services/api';

const SeguidosPage = () => {
    const [seguidos, setSeguidos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const usuarioId = localStorage.getItem('usuario_id');
        if (usuarioId) {
            getSeguidos(usuarioId)
                .then(data => {
                    setSeguidos(data);
                    setCargando(false);
                })
                .catch(() => setCargando(false));
        }
    }, []);

    return (
        <MainLayout>
            <section className="seccion-app sec-explorar" style={{ display: 'block' }}>
                <div className="encabezado-seccion flex-between">
                    <h2>Personas que Sigues</h2>
                </div>
                
                <div id="lista-seguidos" style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                    {cargando ? <p style={{ textAlign: 'center' }}>Cargando...</p> : 
                     seguidos.length > 0 ? (
                        seguidos.map(usr => <UserCard key={usr.id} user={usr} />)
                     ) : (
                        <p style={{ textAlign: 'center', color: '#8892a0' }}>Aún no sigues a nadie.</p>
                     )}
                </div>
            </section>
        </MainLayout>
    );
};
export default SeguidosPage;