import { useEffect, useState } from 'react';
import { getMisTableros, savePinToTablero } from '../../services/api';
import { FaRegFolderOpen } from "react-icons/fa6";

const ModalGuardarPin = ({ isOpen, onClose, pubId }) => {
    const [tableros, setTableros] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
    const [visible, setVisible] = useState(false);

    const cargarTableros = async () => {
        const usuarioId = localStorage.getItem('usuario_id');
        setCargando(true);
        try {
            const data = await getMisTableros(usuarioId);
            setTableros(data);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            cargarTableros();
            setMensaje({ texto: '', tipo: '' });
            requestAnimationFrame(() => setVisible(true));
        } else {
            setVisible(false);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const handleScroll = () => onClose();
        const mainEl = document.querySelector('main.flex-1');
        window.addEventListener('scroll', handleScroll, true);
        if (mainEl) mainEl.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll, true);
            if (mainEl) mainEl.removeEventListener('scroll', handleScroll);
        };
    }, [isOpen, onClose]);

    const handleGuardar = async (tableroId, nombreTablero) => {
        setMensaje({ texto: 'Guardando...', tipo: 'info' });
        try {
            await savePinToTablero(tableroId, pubId);
            setMensaje({ texto: ` ¡Guardado en "${nombreTablero}"!`, tipo: 'exito' });
            setTimeout(onClose, 1500); 
        } catch (error) {
            console.error(error);
            setMensaje({ texto: ` ${error.message}`, tipo: 'error' });
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-[999]" onClick={(e) => { e.stopPropagation(); onClose(); }}></div>
            <div
                className="absolute top-full right-0 mt-2.5 bg-white rounded-xl shadow-xl w-[250px] z-[1000] p-4 text-left border border-beige transition-all duration-300 ease-out"
                style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateY(0)' : 'translateY(-10px)',
                }}
            >
                <h3 className="text-base mb-2.5 text-gray-dark font-bold">Guardar en tablero</h3>
                
                <div className="max-h-[200px] overflow-y-auto">
                    {cargando && <p className="text-gray-muted text-sm">Cargando tableros...</p>}
                    
                    {!cargando && tableros.length === 0 && (
                        <p className="text-gray-muted text-sm">No tienes tableros aún.</p>
                    )}

                    {!cargando && tableros.map(t => (
                        <div key={t.id} className="flex items-center gap-2.5 p-2.5 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-beige-light" onClick={() => handleGuardar(t.id, t.nombre)}>
                            <div className="text-accent"><FaRegFolderOpen /></div>
                            <div>
                                <strong className="text-gray-dark text-sm">{t.nombre}</strong><br/>
                                <small className="text-gray-muted">
                                    {t.publicaciones ? t.publicaciones.length : 0} pines
                                </small>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={`mt-2.5 text-center min-h-[20px] text-sm ${mensaje.tipo === 'error' ? 'text-danger' : mensaje.tipo === 'exito' ? 'text-success' : 'text-gray-muted'}`}>
                    {mensaje.texto}
                </div>
            </div>
        </>
    );
};

export default ModalGuardarPin;