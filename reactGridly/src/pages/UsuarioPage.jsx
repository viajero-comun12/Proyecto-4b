import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../components/templates/MainLayout';
import UserProfile from '../components/organismos/UserProfile';
import PinCard from '../components/moleculas/PinCard';
import { getUsuario, getPublicaciones } from '../services/api';


const UsuarioPage = () => {
    const { id } = useParams(); // Obtiene el ID de la URL
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

    if (!usuario) return <MainLayout>Cargando perfil...</MainLayout>;

    return (
        
        <MainLayout>
            <main className="contenido-principal contenedor-perfil">
                <UserProfile 
                    usuario={usuario} 
                    isOwnProfile={usuario.id == miUsuarioId} 
                    onUpdate={cargarDatos} 
                />
                <section className="mis-publicaciones">
                    <h2>{usuario.id == miUsuarioId ? "Mis Pines" : "Publicaciones"}</h2>
                    <div className="feed-mosaico">
                        {publicaciones.map(pub => <PinCard key={pub.id} pub={pub} />)}
                    </div>
                </section>
            </main>
        </MainLayout>
    );
};
export default UsuarioPage;