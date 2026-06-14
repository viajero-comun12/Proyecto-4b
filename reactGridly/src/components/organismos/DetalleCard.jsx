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
        <main className="max-w-[1000px] mx-auto px-5 my-5 block">
            <article className="bg-white rounded-2xl shadow-xl flex overflow-hidden animate-slide-up" id="tarjeta-detalle">
                {/* Image column */}
                <div className="flex-1 bg-beige-light flex items-center justify-center relative">
                    <Button
                        className="absolute top-4 left-4 z-[100] text-2xl bg-gray-dark/60 text-white rounded-full w-11 h-11 border-none cursor-pointer flex items-center justify-center transition-transform duration-300 hover:scale-110 hover:bg-gray-dark/80"
                        onClick={handleBack}
                    >←</Button>

                    <div className="relative w-full h-full">
                        <img
                            id="img-publicacion"
                            src={pub.url_multimedia}
                            alt={pub.titulo}
                            className="w-full h-full object-contain"
                            style={{
                                filter: isBlur ? 'blur(20px)' : 'none',
                                viewTransitionName: `pub-image-${pub.id}`
                            }}
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/800x1000?text=Sin+Imagen'; }}
                        />
                        {isBlur && (
                            <div className="absolute inset-0 flex items-center justify-center flex-col bg-gray-dark/50 text-white p-5 text-center">
                                <h3 className="text-xl font-bold mb-2">Contenido NSFW</h3>
                                {!usuarioId
                                    ? <p>Inicia sesión para ver este contenido.</p>
                                    : <p>Debes ser mayor de 18 años para ver este contenido.</p>}
                            </div>
                        )}
                    </div>
                </div>

                {/* Info column */}
                <div className="w-[450px] p-10 flex flex-col max-md:w-full max-md:p-6">
                    <div className="flex justify-between mb-6">
                        <div className="flex gap-2">
                            <Button
                                className="bg-transparent border-none text-lg cursor-pointer text-gray-dark p-2.5 rounded-full transition-all duration-300 hover:bg-beige-light"
                                title={liked ? 'Quitar Pin' : 'Guardar como Pin'}
                                onClick={onLike}
                                style={{ transform: liked ? 'scale(1.3)' : 'scale(1)', color: liked ? '#D44638' : 'inherit' }}
                            ><FaHeart /></Button>
                            <Button className="bg-transparent border-none text-lg cursor-pointer text-gray-dark p-2.5 rounded-full transition-all duration-300 hover:bg-beige-light" title="Compartir" onClick={onCompartir}><FaShare /></Button>
                        </div>

                        <div className="relative inline-block">
                            <Button className="bg-gradient-to-br from-accent to-accent-light text-white px-6 py-2.5 border-none rounded-full cursor-pointer font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg" onClick={() => {
                                if (!usuarioId) { alert('Inicia sesión para guardar pines'); return; }
                                setModalOpen(true);
                            }}>Guardar</Button>
                            <ModalGuardarPin isOpen={modalOpen} onClose={() => setModalOpen(false)} pubId={pub.id} />
                        </div>
                    </div>

                    <h1 className="text-3xl mb-2.5 leading-tight text-gray-dark">{pub.titulo}</h1>
                    <p className="text-gray-soft mb-6 text-base">{pub.descripcion}</p>
                    {pub.tags && <p className="text-accent text-sm mt-2">🏷️ {pub.tags}</p>}

                    <AutorInfo autor={pub.autor} usuarioId={pub.usuario_id} fechaCreacion={pub.fecha_creacion} />

                    {/* Comments */}
                    <section className="flex-1 flex flex-col mt-8">
                        <h2 className="text-lg mb-5">Comentarios ({pub.comentarios ? pub.comentarios.length : 0})</h2>

                        <div className="flex-1 overflow-y-auto mb-5 max-h-[300px]">
                            {(!pub.comentarios || pub.comentarios.length === 0)
                                ? <p className="text-gray-muted py-2.5">Sé el primero en comentar.</p>
                                : pub.comentarios.map((com, idx) => (
                                    <ComentarioItem key={idx} comentario={com} />
                                ))
                            }
                        </div>

                        <div className="flex gap-2.5 items-end mt-auto">
                            <div className="flex-1 flex flex-col gap-1">
                                <input
                                    type="text"
                                    placeholder={usuarioId ? 'Añadir un comentario...' : 'Inicia sesión para comentar'}
                                    value={comentarioTexto}
                                    onChange={onComentarioChange}
                                    onKeyDown={(e) => e.key === 'Enter' && onComentar()}
                                    disabled={!usuarioId || enviandoComentario}
                                    maxLength={50}
                                    className="w-full px-5 py-3 rounded-full border border-beige-dark/30 text-sm transition-all duration-300 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10"
                                />
                                {usuarioId && (
                                    <span className="text-xs text-gray-muted text-right pr-2">
                                        {comentarioTexto.length}/50
                                    </span>
                                )}
                            </div>
                            <Button
                                className="bg-gradient-to-br from-accent to-accent-light text-white px-5 py-2.5 rounded-full border-none font-bold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
