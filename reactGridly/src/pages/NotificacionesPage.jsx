import React, { useEffect, useState } from 'react';
import MainLayout from '../components/templates/MainLayout';
import NotificationItem from '../components/moleculas/NotificationItem';
import { getNotificaciones } from '../services/api';

const NotificacionesPage = () => {
    const [notificaciones, setNotificaciones] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const usuarioId = localStorage.getItem('usuario_id');
        if (usuarioId) {
            getNotificaciones(usuarioId)
                .then(data => {
                    setNotificaciones(data);
                    setCargando(false);
                })
                .catch(err => {
                    console.error(err);
                    setCargando(false);
                });
        } else {
            setCargando(false);
        }
    }, []);

    return (
        <MainLayout>
            <section className="seccion-app sec-notif" style={{ display: 'block' }}>
                <div className="encabezado-seccion">
                    <h2>Tus Notificaciones</h2>
                </div>
                <div className="lista-notificaciones">
                    {cargando ? (
                        <p style={{ textAlign: 'center', color: '#8892a0' }}>Cargando notificaciones...</p>
                    ) : notificaciones.length > 0 ? (
                        notificaciones.map((n, index) => (
                            <NotificationItem key={index} notif={n} />
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', color: '#8892a0' }}>No tienes notificaciones nuevas.</p>
                    )}
                </div>
            </section>
        </MainLayout>
    );
};
export default NotificacionesPage;