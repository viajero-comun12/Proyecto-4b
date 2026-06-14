import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getPublicacionDetalle, sendComentario, toggleLike, enviarNotificacion } from '../services/api';
import DetalleCard from '../components/organismos/DetalleCard';

const DetallePage = () => {
    const { id } = useParams();
    const location = useLocation();
    const usuarioId = localStorage.getItem('usuario_id');
    const myUsername = localStorage.getItem('username') || `Usuario ${usuarioId}`;

    const initialPub = location.state?.pub;
    const [pub, setPub] = useState(initialPub || null);
    const [cargando, setCargando] = useState(!initialPub);
    const [error, setError] = useState(null);

    const [liked, setLiked] = useState(false);
    const [comentarioTexto, setComentarioTexto] = useState('');
    const [enviandoComentario, setEnviandoComentario] = useState(false);

    const [isAdultUser, setIsAdultUser] = useState(false);
    useEffect(() => {
        const fn = localStorage.getItem('fecha_nacimiento');
        if (!fn || fn === 'null') {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsAdultUser(false);
            return;
        }
        const dob = new Date(fn);
        const ageDifMs = Date.now() - dob.getTime();
        const ageDate = new Date(ageDifMs);
        setIsAdultUser(Math.abs(ageDate.getUTCFullYear() - 1970) >= 18);
    }, []);

    const cargarDetalle = async () => {
        try {
            if (!pub) setCargando(true);
            const data = await getPublicacionDetalle(id);
            setPub(data);
            if (usuarioId && data.likers && data.likers.some(l => l.id == usuarioId)) {
                setLiked(true);
            }
        } catch (err) {
            console.error(err);
            setError('No se pudo cargar la publicación.');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        cargarDetalle();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleLike = async () => {
        if (!usuarioId) return alert('Inicia sesión para dar me gusta');
        try {
            const data = await toggleLike(id, usuarioId);
            setLiked(data.liked);
            if (data.liked && pub.usuario_id != usuarioId) {
                await enviarNotificacion(pub.usuario_id, `A ${myUsername} le gustó tu publicación "${pub.titulo}".`);
            }
        } catch (error) {
            console.error('Error al dar like', error);
        }
    };

    const handleCompartir = () => {
        navigator.clipboard.writeText(window.location.href)
            .then(() => alert('¡Enlace copiado al portapapeles!'))
            .catch(() => alert('URL: ' + window.location.href));
    };

    const handleComentar = async () => {
        if (!usuarioId) return alert('Debes iniciar sesión para comentar.');
        if (!comentarioTexto.trim()) return;

        setEnviandoComentario(true);
        try {
            await sendComentario(id, comentarioTexto, usuarioId);
            setComentarioTexto('');
            if (pub.usuario_id != usuarioId) {
                await enviarNotificacion(pub.usuario_id, `${myUsername} comentó en tu publicación "${pub.titulo}".`);
            }
            cargarDetalle();
        } catch (error) {
            console.error(error);
            alert('Error al enviar el comentario');
        } finally {
            setEnviandoComentario(false);
        }
    };

    if (cargando) return <p className="p-10 text-center text-gray-muted">Cargando publicación...</p>;
    if (error) return <p className="p-10 text-center text-danger font-bold">{error}</p>;
    if (!pub) return null;

    return (
        <DetalleCard
            pub={pub}
            liked={liked}
            isAdultUser={isAdultUser}
            comentarioTexto={comentarioTexto}
            enviandoComentario={enviandoComentario}
            onLike={handleLike}
            onCompartir={handleCompartir}
            onComentar={handleComentar}
            onComentarioChange={(e) => setComentarioTexto(e.target.value)}
            usuarioId={usuarioId}
        />
    );
};

export default DetallePage;
