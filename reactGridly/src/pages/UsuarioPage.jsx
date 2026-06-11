import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../components/templates/MainLayout';
import UserProfile from '../components/organismos/UserProfile';
import PinCard from '../components/moleculas/PinCard';
import { getUsuario, getPublicaciones, deletePublicacion } from '../services/api';
import { IoMdNotifications } from "react-icons/io";
import { LuMessageSquareHeart } from "react-icons/lu";
import { RiUserFollowFill } from "react-icons/ri";
import Button from '../components/atomos/Button';


const UsuarioPage = () => {
    const { id } = useParams(); // Obtiene el ID de la URL
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [publicaciones, setPublicaciones] = useState([]);
    const miUsuarioId = localStorage.getItem('usuario_id');

    const cargarDatos = async () => {
        const uid = id || miUsuarioId;
        const userData = await getUsuario(uid);
        const allPubs = await getPublicaciones();
        setUsuario(userData);
        setPublicaciones(allPubs.filter(p => p.usuario_id == uid));
    };

    useEffect(() => { cargarDatosSeguro(); }, [id]);
    const cargarDatosSeguro = async () => {
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
        };

    const handleDelete = async (pubId) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar esta publicación?")) {
            try {
                await deletePublicacion(pubId, miUsuarioId);
                cargarDatosSeguro();
            } catch (error) {
                alert("Error al eliminar la publicación");
            }
        }
    };

    if (!usuario) return <MainLayout>Cargando perfil...</MainLayout>;

    return (
        
        <MainLayout>
            <main className="contenido-principal contenedor-perfil" style={{ display: 'flex', width: '100%', padding: 0 }}>
                <div style={{ flex: 1, padding: '20px' }}>
                    <UserProfile 
                        usuario={usuario} 
                        isOwnProfile={usuario.id == miUsuarioId} 
                        onUpdate={cargarDatos} 
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
        </MainLayout>
    );
};
export default UsuarioPage;