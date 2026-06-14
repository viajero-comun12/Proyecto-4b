import { useEffect, useState } from 'react';
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
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCargando(false);
        }
    }, []);

    return (
        <section className="block animate-fade-in max-w-[800px] mx-auto py-10 px-5">
            <div className="mb-8 border-b border-beige pb-4">
                <h2 className="text-3xl text-gray-dark">Tus Notificaciones</h2>
            </div>
            <div className="flex flex-col gap-4">
                {cargando ? (
                    <p className="text-center text-gray-muted py-5">Cargando notificaciones...</p>
                ) : notificaciones.length > 0 ? (
                    notificaciones.map((n, index) => (
                        <NotificationItem key={index} notif={n} />
                    ))
                ) : (
                    <p className="text-center text-gray-muted py-5">No tienes notificaciones nuevas.</p>
                )}
            </div>
        </section>
    );
};
export default NotificacionesPage;
