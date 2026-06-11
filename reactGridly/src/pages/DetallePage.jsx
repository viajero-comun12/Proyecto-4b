import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../components/templates/MainLayout';
import ModalGuardarPin from '../components/organismos/ModalGuardarPin';
import { getPublicacionDetalle, sendComentario, toggleLike, enviarNotificacion } from '../services/api';

import Button from '../components/atomos/Button'; 

const DetallePage = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const usuarioId = localStorage.getItem('usuario_id');
    const myUsername = localStorage.getItem('username') || `Usuario ${usuarioId}`;

    const [pub, setPub] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    
    
    const [liked, setLiked] = useState(false);
    const [comentarioTexto, setComentarioTexto] = useState('');
    const [enviandoComentario, setEnviandoComentario] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const cargarDetalle = async () => {
        try {
            setCargando(true);
            const data = await getPublicacionDetalle(id);
            setPub(data);
            
            
            if (usuarioId && data.likers && data.likers.some(l => l.id == usuarioId)) {
                setLiked(true);
            }
        } catch (err) {
            setError('No se pudo cargar la publicación.');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarDetalle();
    }, [id]);

    const handleLike = async () => {
        if (!usuarioId) return alert("Inicia sesión para dar me gusta");
        try {
            const data = await toggleLike(id, usuarioId);
            setLiked(data.liked);
            
            
            if (data.liked && pub.usuario_id != usuarioId) {
                await enviarNotificacion(pub.usuario_id, `A ${myUsername} le gustó tu publicación "${pub.titulo}".`);
            }
        } catch (error) {
            console.error("Error al dar like", error);
        }
    };

    const handleCompartir = () => {
        navigator.clipboard.writeText(window.location.href)
            .then(() => alert('¡Enlace copiado al portapapeles!'))
            .catch(() => alert('URL: ' + window.location.href));
    };

    const handleComentar = async () => {
        if (!usuarioId) return alert("Debes iniciar sesión para comentar.");
        if (!comentarioTexto.trim()) return;

        setEnviandoComentario(true);
        try {
            await sendComentario(id, comentarioTexto, usuarioId);
            setComentarioTexto(''); // Limpiar input
            
            // Notificar al autor
            if (pub.usuario_id != usuarioId) {
                await enviarNotificacion(pub.usuario_id, `${myUsername} comentó en tu publicación "${pub.titulo}".`);
            }
            
            cargarDetalle(); // Recargar para ver el nuevo comentario
        } catch (error) {
            alert('Error al enviar el comentario');
        } finally {
            setEnviandoComentario(false);
        }
    };

    if (cargando) return <MainLayout><p style={{ padding: '20px' }}>Cargando publicación...</p></MainLayout>;
    if (error) return <MainLayout><p style={{ padding: '20px', color: 'red' }}>{error}</p></MainLayout>;
    if (!pub) return null;

    const isAdult = () => {
        const fn = localStorage.getItem('fecha_nacimiento');
        if (!fn || fn === 'null') return false;
        const dob = new Date(fn);
        const ageDifMs = Date.now() - dob.getTime();
        const ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970) >= 18;
    };
    const isBlur = pub.is_nsfw && !isAdult();

    const fechaFormat = new Date(pub.fecha_creacion).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <MainLayout>
            <main className="contenedor-detalle" style={{ display: 'block', margin: '20px auto' }}>
                <article className="tarjeta-detalle" id="tarjeta-detalle">
                    <div className="columna-imagen">
                        
                        <Button className="btn-back" onClick={() => navigate(-1)} style={{ position: 'absolute', top: '15px', left: '15px', zIndex: 100, fontSize: '24px', backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', borderRadius: '50%', width: '45px', height: '45px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</Button>
                        
                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                            <img 
                                id="img-publicacion" 
                                src={pub.url_multimedia} 
                                alt={pub.titulo}
                                style={{ filter: isBlur ? 'blur(20px)' : 'none', width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/800x1000?text=Sin+Imagen'; }}
                            />
                            {isBlur && (
                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', padding: '20px', textAlign: 'center' }}>
                                    <h3>Contenido NSFW</h3>
                                    {!usuarioId ? (
                                        <p>Inicia sesión para ver este contenido.</p>
                                    ) : (
                                        <p>Debes ser mayor de 18 años para ver este contenido.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="columna-info">
                        <div className="acciones-detalle">
                            <div>
                                
                                <Button 
                                    
                                    className="btn-icon" 
                                    title={liked ? 'Quitar Pin' : 'Guardar como Pin'} 
                                    onClick={handleLike}
                                    style={{ transform: liked ? 'scale(1.3)' : 'scale(1)', color: liked ? 'red' : 'inherit' }}
                                >❤️</Button>
                                <Button className="btn-icon" title="Compartir" onClick={handleCompartir}>🔗</Button>
                            </div>
                            
                            
                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                <Button className="btn-primario" onClick={() => {
                                    if(!usuarioId) { alert("Inicia sesión para guardar pines"); return;}
                                    setModalOpen(true);
                                }}>Guardar</Button>
                                <ModalGuardarPin isOpen={modalOpen} onClose={() => setModalOpen(false)} pubId={id} />
                            </div>
                        </div>

                        <h1 className="titulo-detalle">{pub.titulo}</h1>
                        <p className="descripcion-detalle">{pub.descripcion}</p>
                        {pub.tags && <p style={{ color: 'var(--color-morado)', fontSize: '0.85rem', marginTop: '8px' }}>🏷️ {pub.tags}</p>}

                        <div className="autor" style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'var(--color-morado)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '20px' }}>
                                {pub.autor ? pub.autor.username.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="autor-info">
                                <strong>@{pub.autor ? pub.autor.username : `usuario_${pub.usuario_id}`}</strong>
                                <span style={{ display: 'block', color: '#8892a0', fontSize: '0.85rem' }}>Subido el {fechaFormat}</span>
                            </div>
                        </div>

                        <section className="comentarios" style={{ marginTop: '30px' }}>
                            <h2>Comentarios ({pub.comentarios ? pub.comentarios.length : 0})</h2>

                            <div className="lista-comentarios" style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
                                {(!pub.comentarios || pub.comentarios.length === 0) ? (
                                    <p style={{ color: '#8892a0', padding: '10px 0' }}>Sé el primero en comentar.</p>
                                ) : (
                                    pub.comentarios.map((com, idx) => (
                                        <div key={idx} className="comentario" style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--color-morado)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                                                {com.autor ? com.autor.username.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                            <div className="comentario-texto">
                                                <strong>@{com.autor ? com.autor.username : `usuario_${com.usuario_id}`}</strong>
                                                <span style={{ marginLeft: '8px' }}>{com.texto}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="input-comentario-wrapper" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <input 
                                    type="text" 
                                    className="input-comentario" 
                                    placeholder={usuarioId ? "Añadir un comentario..." : "Inicia sesión para comentar"}
                                    value={comentarioTexto}
                                    onChange={(e) => setComentarioTexto(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleComentar()}
                                    disabled={!usuarioId || enviandoComentario}
                                    style={{ flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid #ccc' }}
                                />
                                
                                <Button 
                                    className="btn-primario" 
                                    onClick={handleComentar} 
                                    disabled={!usuarioId || enviandoComentario || !comentarioTexto.trim()}
                                >
                                    {enviandoComentario ? '...' : 'Enviar'}
                                </Button>
                            </div>
                        </section>
                    </div>
                </article>
            </main>
        </MainLayout>
    );
};

export default DetallePage;