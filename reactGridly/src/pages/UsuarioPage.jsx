import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import UserProfile from '../components/organismos/UserProfile';
import PinCard from '../components/moleculas/PinCard';
import { getUsuario, getPublicaciones, deletePublicacion } from '../services/api';
import Button from '../components/atomos/Button';


const UsuarioPage = () => {
    const { id } = useParams();
    const [usuario, setUsuario] = useState(null);
    const [publicaciones, setPublicaciones] = useState([]);
    const miUsuarioId = localStorage.getItem('usuario_id');

    const cargarDatosSeguro = useCallback(async () => {
        try {
            const uid = id || miUsuarioId;
            if (!uid) return;
            
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

    if (!usuario) return <p className="text-center mt-10 text-gray-muted">Cargando perfil...</p>;

    return (
        <main className="flex flex-col w-full max-w-[1200px] mx-auto p-0 animate-fade-in">
            <div className="flex-1 p-5 md:p-10">
                <UserProfile 
                    usuario={usuario} 
                    isOwnProfile={usuario.id == miUsuarioId} 
                    onUpdate={cargarDatosSeguro} 
                />
                <section className="mt-12">
                    <h2 className="text-center text-3xl mb-8 relative inline-block left-1/2 -translate-x-1/2 text-gray-dark after:content-[''] after:block after:w-1/2 after:h-1 after:bg-accent after:mx-auto after:mt-2 after:rounded-full">
                        {usuario.id == miUsuarioId ? "Mis Pines" : "Publicaciones"}
                    </h2>
                    <div className="feed-mosaico">
                        {publicaciones.map(pub => (
                            <div key={pub.id} className="relative group">
                                <PinCard pub={pub} />
                                {usuario.id == miUsuarioId && (
                                    <Button 
                                        onClick={() => handleDelete(pub.id)} 
                                        className="absolute bottom-5 right-4 z-10 bg-danger/90 text-white border-none rounded-lg px-3 py-1.5 text-xs cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-danger"
                                    >
                                        Eliminar
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
};
export default UsuarioPage;
