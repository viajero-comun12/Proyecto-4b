import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import UserProfile from '../components/organismos/UserProfile';
import PinCard from '../components/moleculas/PinCard';
import { getUsuario, getPublicaciones, deletePublicacion } from '../services/api';
import Button from '../components/atomos/Button';


const UsuarioPage = () => {
    const { id } = useParams(); // Obtiene el ID de la URL
    const [usuario, setUsuario] = useState(null);
    const [publicaciones, setPublicaciones] = useState([]);
    const miUsuarioId = localStorage.getItem('usuario_id');




    const cargarDatosSeguro = useCallback(async () => {
        try {
            const uid = id || miUsuarioId;
            if (!uid) return; // Si no hay ID, no intentes cargar nada
            
            const userData = await getUsuario(uid);
            const allPubs = await getPublicaciones();
            setUsuario(userData);
            setPublicaciones(allPubs.filter(p => p.usuario_id == uid));
        } catch (err) {
            console.error("Error cargando perfil:", err);
        }
    }, [id, miUsuarioId]);

    useEffect(() => { 
        // eslint-disable-next-line react-hooks/set-state-in-effect
        cargarDatosSeguro(); 
    }, [cargarDatosSeguro]);

    const handleDelete = async (pubId) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar esta publicación?")) {
            try {
                await deletePublicacion(pubId, miUsuarioId);
                cargarDatosSeguro();
            } catch (error) {
                console.error(error);
                alert("Error al eliminar la publicación");
            }
        }
    };

    if (!usuario) return <>Cargando perfil...</>;

    return (
        
        <>
            <main className="contenido-principal contenedor-perfil" style={{ display: 'flex', width: '100%', padding: 0 }}>
                <div style={{ flex: 1, padding: '20px' }}>
                    <UserProfile 
                        usuario={usuario} 
                        isOwnProfile={usuario.id == miUsuarioId} 
                        onUpdate={cargarDatosSeguro} 
                    />
                    <section className="mis-publicaciones">
                        <h2>{usuario.id == miUsuarioId ? "Mis Pines" : "Publicaciones"}</h2>
                        <div className="feed-mosaico">
                            {publicaciones.map(pub => (
                                <div key={pub.id} style={{ position: 'relative' }}>
                                    <PinCard pub={pub} />
                                    {usuario.id == miUsuarioId && (
                                        <Button onClick={() => handleDelete(pub.id)} style={{ position: 'absolute', bottom: 10, right: 10, background: 'red', color: 'white', border: 'none', borderRadius: '5px', padding: '5px', zIndex: 10, cursor: 'pointer' }}>Eliminar</Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
};
export default UsuarioPage;
