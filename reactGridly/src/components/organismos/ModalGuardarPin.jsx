import React, { useEffect, useState } from 'react';
import { getMisTableros, savePinToTablero } from '../../services/api';
import Button from '../atomos/Button';

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
        <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 999 }} onClick={(e) => { e.stopPropagation(); onClose(); }}></div>
            <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '10px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', width: '250px', zIndex: 1000, padding: '15px', textAlign: 'left' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '10px', color: 'var(--color-azul)' }}>Guardar en tablero</h3>
                
                <div id="lista-tableros-modal" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {cargando && <p style={{ color: '#8892a0', fontSize: '0.9rem' }}>Cargando tableros...</p>}
                    
                    {!cargando && tableros.length === 0 && (
                        <p style={{ color: '#8892a0', fontSize: '0.9rem' }}>No tienes tableros aún.</p>
                    )}

                    {!cargando && tableros.map(t => (
                        <div key={t.id} className="tablero-option" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', cursor: 'pointer', transition: 'background-color 0.2s ease' }} onClick={() => handleGuardar(t.id, t.nombre)} onMouseOver={e => e.currentTarget.style.backgroundColor = '#f4f3ec'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                            <div className="t-icono">📌</div>
                            <div>
                                <strong style={{ color: 'var(--color-azul)' }}>{t.nombre}</strong><br/>
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
            </div>
        </>
    );
};

export default ModalGuardarPin;