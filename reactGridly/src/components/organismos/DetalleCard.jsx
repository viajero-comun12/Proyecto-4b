import { useNavigate } from 'react-router-dom';
import { FaHeart, FaShare } from 'react-icons/fa';
import Button from '../atomos/Button';
import ModalGuardarPin from './ModalGuardarPin';
import ComentarioItem from '../moleculas/ComentarioItem';
import AutorInfo from '../moleculas/AutorInfo';
import { useState } from 'react';

const DetalleCard = ({
    pub,
    liked,
    isAdultUser,
    comentarioTexto,
    enviandoComentario,
    onLike,
    onCompartir,
    onComentar,
    onComentarioChange,
    usuarioId,
}) => {
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);

    const isBlur = pub.is_nsfw && !isAdultUser;

    const handleBack = () => {
        if (document.startViewTransition) {
            document.startViewTransition(() => navigate(-1));
        } else {
            navigate(-1);
        }
    };

    return (
        <main className="contenedor-detalle" style={{ display: 'block', margin: '20px auto' }}>
            <article className="tarjeta-detalle" id="tarjeta-detalle">
                {/* ── Columna imagen ── */}
                <div className="columna-imagen">
                    <Button
                        className="btn-back"
                        onClick={handleBack}
                        style={{
                            position: 'absolute', top: '15px', left: '15px', zIndex: 100,
                            fontSize: '24px', backgroundColor: 'rgba(0,0,0,0.6)', color: 'white',
                            borderRadius: '50%', width: '45px', height: '45px', border: 'none',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                    >←</Button>

                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                        <img
                            id="img-publicacion"
                            src={pub.url_multimedia}
                            alt={pub.titulo}
                            style={{
                                filter: isBlur ? 'blur(20px)' : 'none',
                                width: '100%', height: '100%', objectFit: 'cover',
                                viewTransitionName: `pub-image-${pub.id}`
                            }}
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/800x1000?text=Sin+Imagen'; }}
                        />
                        {isBlur && (
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', padding: '20px', textAlign: 'center' }}>
                                <h3>Contenido NSFW</h3>
                                {!usuarioId
                                    ? <p>Inicia sesión para ver este contenido.</p>
                                    : <p>Debes ser mayor de 18 años para ver este contenido.</p>}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Columna info ── */}
                <div className="columna-info">
                    <div className="acciones-detalle">
                        <div>
                            <Button
                                className="btn-icon"
                                title={liked ? 'Quitar Pin' : 'Guardar como Pin'}
                                onClick={onLike}
                                style={{ transform: liked ? 'scale(1.3)' : 'scale(1)', color: liked ? 'red' : 'inherit' }}
                            ><FaHeart /></Button>
                            <Button className="btn-icon" title="Compartir" onClick={onCompartir}><FaShare /></Button>
                        </div>

                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            <Button className="btn-primario" onClick={() => {
                                if (!usuarioId) { alert('Inicia sesión para guardar pines'); return; }
                                setModalOpen(true);
                            }}>Guardar</Button>
                            <ModalGuardarPin isOpen={modalOpen} onClose={() => setModalOpen(false)} pubId={pub.id} />
                        </div>
                    </div>

                    <h1 className="titulo-detalle">{pub.titulo}</h1>
                    <p className="descripcion-detalle">{pub.descripcion}</p>
                    {pub.tags && <p style={{ color: 'var(--color-morado)', fontSize: '0.85rem', marginTop: '8px' }}>🏷️ {pub.tags}</p>}

                    <AutorInfo autor={pub.autor} usuarioId={pub.usuario_id} fechaCreacion={pub.fecha_creacion} />

                    {/* ── Comentarios ── */}
                    <section className="comentarios" style={{ marginTop: '30px' }}>
                        <h2>Comentarios ({pub.comentarios ? pub.comentarios.length : 0})</h2>

                        <div className="lista-comentarios" style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
                            {(!pub.comentarios || pub.comentarios.length === 0)
                                ? <p style={{ color: '#8892a0', padding: '10px 0' }}>Sé el primero en comentar.</p>
                                : pub.comentarios.map((com, idx) => (
                                    <ComentarioItem key={idx} comentario={com} />
                                ))
                            }
                        </div>

                        <div className="input-comentario-wrapper" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input
                                type="text"
                                className="input-comentario"
                                placeholder={usuarioId ? 'Añadir un comentario...' : 'Inicia sesión para comentar'}
                                value={comentarioTexto}
                                onChange={onComentarioChange}
                                onKeyDown={(e) => e.key === 'Enter' && onComentar()}
                                disabled={!usuarioId || enviandoComentario}
                                maxLength={300}
                                style={{ flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid #ccc' }}
                            />
                            <Button
                                className="btn-primario"
                                onClick={onComentar}
                                disabled={!usuarioId || enviandoComentario || !comentarioTexto.trim()}
                            >
                                {enviandoComentario ? '...' : 'Enviar'}
                            </Button>
                        </div>
                    </section>
                </div>
            </article>
        </main>
    );
};

export default DetalleCard;
