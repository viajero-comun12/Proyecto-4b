import React, { useRef, useEffect } from 'react';

const colores = ['#956B54', '#323232', '#B8907A', '#4A7C6F', '#8B6F47', '#5C6B7A'];
const getColor = (id) => colores[id % colores.length];
const getInicial = (username) => (username || 'U')[0].toUpperCase();

const PanelChat = ({ destinatario, mensajes, miId, nuevoMensaje, onNuevoMensajeChange, onEnviar, enviando }) => {
    const mensajesEndRef = useRef(null);

    useEffect(() => {
        mensajesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [mensajes]);

    if (!destinatario) {
        return (
            <div className="flex-1 flex flex-col overflow-hidden bg-white">
                <div className="flex-1 flex flex-col items-center justify-center text-beige-dark">
                    <div className="text-5xl mb-3">💬</div>
                    <p className="text-gray-muted">Selecciona un chat para empezar</p>
                    <small className="text-gray-muted/60 mt-1.5">O busca un usuario en la pestaña &quot;Usuarios&quot;</small>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Header */}
                <div className="px-5 py-3.5 border-b border-beige flex items-center gap-3 bg-white">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0" style={{ background: getColor(destinatario.id) }}>
                        {getInicial(destinatario.username)}
                    </div>
                    <div>
                        <strong className="block text-sm text-gray-dark">@{destinatario.username}</strong>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-2.5 bg-beige-light/20">
                    {mensajes.length === 0 ? (
                        <p className="text-center text-beige-dark mt-10">Aún no hay mensajes. ¡Di hola!</p>
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
                                        <div className="text-center text-xs text-beige-dark my-1.5">
                                            {fechaStr === new Date().toLocaleDateString('es-ES') ? 'Hoy' : fechaStr}
                                        </div>
                                    )}
                                    <div className={`flex items-end gap-2 max-w-[75%] ${esMio ? 'self-end flex-row-reverse' : 'self-start'}`}>
                                        <div className={`px-3.5 py-2 rounded-2xl text-sm leading-relaxed break-words ${esMio ? 'bg-gray-dark text-white rounded-br-sm' : 'bg-beige text-gray-dark rounded-bl-sm'}`}>{m.texto}</div>
                                        <span className="text-[11px] text-gray-muted shrink-0">
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
                <form className="px-5 py-3 border-t border-beige flex gap-2.5 items-center bg-white" onSubmit={onEnviar}>
                    <input
                        type="text"
                        placeholder="Escribe un mensaje..."
                        value={nuevoMensaje}
                        onChange={onNuevoMensajeChange}
                        maxLength={500}
                        required
                        className="flex-1 px-4 py-2.5 rounded-full border border-beige-dark/30 outline-none text-sm bg-beige-light/50 transition-all duration-300 focus:border-accent"
                    />
                    <button type="submit" className="px-5 py-2.5 bg-gray-dark text-white border-none rounded-full cursor-pointer font-bold text-sm transition-opacity duration-200 hover:opacity-85 disabled:opacity-40 disabled:cursor-default" disabled={enviando || !nuevoMensaje.trim()}>
                        {enviando ? '...' : 'Enviar'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PanelChat;
