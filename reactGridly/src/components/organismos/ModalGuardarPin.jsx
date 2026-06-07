import React, { useEffect, useState } from 'react';
import { getMisTableros, savePinToTablero } from '../../services/api';

const ModalGuardarPin = ({ isOpen, onClose, pubId }) => {
    const [tableros, setTableros] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

    useEffect(() => {
        if (isOpen) {
            cargarTableros();
            setMensaje({ texto: '', tipo: '' });
        }
    }, [isOpen]);

    const cargarTableros = async () => {
        const usuarioId = localStorage.getItem('usuario_id');
        setCargando(true);
        try {
            const data = await getMisTableros(usuarioId);
            setTableros(data);
        } catch (error) {
            setMensaje({ texto: 'Error al cargar tableros', tipo: 'error' });
        } finally {
            setCargando(false);
        }
    };

    const handleGuardar = async (tableroId, nombreTablero) => {
        setMensaje({ texto: 'Guardando...', tipo: 'info' });
        try {
            await savePinToTablero(tableroId, pubId);
            setMensaje({ texto: ` ¡Guardado en "${nombreTablero}"!`, tipo: 'exito' });
            setTimeout(onClose, 1500); // Cierra el modal después de 1.5s
        } catch (error) {
            setMensaje({ texto: ` ${error.message}`, tipo: 'error' });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay activo" onClick={(e) => { if (e.target.classList.contains('modal-overlay')) onClose(); }}>
            <div className="modal-caja">
                <h3> Guardar en tablero</h3>
                
                <div id="lista-tableros-modal" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {cargando && <p style={{ color: '#8892a0' }}>Cargando tableros...</p>}
                    
                    {!cargando && tableros.length === 0 && (
                        <p style={{ color: '#8892a0' }}>No tienes tableros aún.</p>
                    )}

                    {!cargando && tableros.map(t => (
                        <div key={t.id} className="tablero-option" onClick={() => handleGuardar(t.id, t.nombre)}>
                            <div className="t-icono">📌</div>
                            <div>
                                <strong>{t.nombre}</strong><br/>
                                <small style={{ color: '#8892a0' }}>
                                    {t.publicaciones ? t.publicaciones.length : 0} pines
                                </small>
                            </div>
                        </div>
                    ))}
                </div>

                <div id="estado-guardado" style={{ 
                    color: mensaje.tipo === 'error' ? 'red' : mensaje.tipo === 'exito' ? 'green' : '#8892a0',
                    marginTop: '10px', textAlign: 'center', minHeight: '20px', fontSize: '0.85rem'
                }}>
                    {mensaje.texto}
                </div>

                <div className="modal-acciones">
                    <button className="btn-cancelar" onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default ModalGuardarPin;