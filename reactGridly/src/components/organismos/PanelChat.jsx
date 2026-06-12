import React, { useRef, useEffect } from 'react';

const colores = ['#620096', '#002147', '#e91e8c', '#00897b', '#e65100', '#1565c0'];
const getColor = (id) => colores[id % colores.length];
const getInicial = (username) => (username || 'U')[0].toUpperCase();

const PanelChat = ({ destinatario, mensajes, miId, nuevoMensaje, onNuevoMensajeChange, onEnviar, enviando }) => {
    const mensajesEndRef = useRef(null);

    useEffect(() => {
        mensajesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [mensajes]);

    if (!destinatario) {
        return (
            <div className="panel-chat">
                <div className="chat-vacio">
                    <div className="icono-chat">💬</div>
                    <p>Selecciona un chat para empezar</p>
                    <small style={{ color: '#bbb', marginTop: '6px' }}>O busca un usuario en la pestaña &quot;Usuarios&quot;</small>
                </div>
            </div>
        );
    }

    return (
        <div className="panel-chat">
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                {/* Header */}
                <div className="chat-header">
                    <div className="c-avatar" style={{ background: getColor(destinatario.id), width: '36px', height: '36px', fontSize: '0.95rem' }}>
                        {getInicial(destinatario.username)}
                    </div>
                    <div className="chat-header-info">
                        <strong>@{destinatario.username}</strong>
                    </div>
                </div>

                {/* Mensajes */}
                <div className="chat-mensajes">
                    {mensajes.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#ccc', marginTop: '40px' }}>Aún no hay mensajes. ¡Di hola!</p>
                    ) : (
                        mensajes.map((m, index) => {
                            const esMio = m.remitente_id === miId;
                            const fechaObj = new Date(m.fecha_envio);
                            const fechaStr = fechaObj.toLocaleDateString('es-ES');
                            const prevMsg = index > 0 ? mensajes[index - 1] : null;
                            const prevFechaStr = prevMsg ? new Date(prevMsg.fecha_envio).toLocaleDateString('es-ES') : '';
                            const mostrarSeparador = fechaStr !== prevFechaStr;

                            return (
                                <React.Fragment key={m.id || index}>
                                    {mostrarSeparador && (
                                        <div className="separador-fecha">
                                            {fechaStr === new Date().toLocaleDateString('es-ES') ? 'Hoy' : fechaStr}
                                        </div>
                                    )}
                                    <div className={`burbuja-wrapper ${esMio ? 'mia' : 'suya'}`}>
                                        <div className={`burbuja ${esMio ? 'mia' : 'suya'}`}>{m.texto}</div>
                                        <span className="burbuja-hora">
                                            {fechaObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </React.Fragment>
                            );
                        })
                    )}
                    <div ref={mensajesEndRef} />
                </div>

                {/* Input */}
                <form className="chat-input-area" onSubmit={onEnviar}>
                    <input
                        type="text"
                        placeholder="Escribe un mensaje..."
                        value={nuevoMensaje}
                        onChange={onNuevoMensajeChange}
                        maxLength={500}
                        required
                    />
                    <button type="submit" className="btn-enviar-msg" disabled={enviando || !nuevoMensaje.trim()}>
                        {enviando ? '...' : 'Enviar'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PanelChat;
