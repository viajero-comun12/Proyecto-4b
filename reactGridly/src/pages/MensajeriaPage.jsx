import React, { useState, useEffect, useRef } from 'react';
import MainLayout from '../components/templates/MainLayout';
import { getMensajes, getTodosUsuarios, getConversacion, enviarMensajeChat } from '../services/api';
import '../assets/css/Mensajeria.css';

const colores = ['#620096', '#002147', '#e91e8c', '#00897b', '#e65100', '#1565c0'];
const getColor = (id) => colores[id % colores.length];
const getInicial = (username) => (username || 'U')[0].toUpperCase();

const MensajeriaPage = () => {
    const miId = parseInt(localStorage.getItem('usuario_id'));
    
    const [tabActual, setTabActual] = useState('chats');
    const [busqueda, setBusqueda] = useState('');
    const [todosUsuarios, setTodosUsuarios] = useState([]);
    const [misChats, setMisChats] = useState([]);
    
    const [destinatarioActual, setDestinatarioActual] = useState(null);
    const [mensajesChat, setMensajesChat] = useState([]);
    const [nuevoMensaje, setNuevoMensaje] = useState('');
    const [enviando, setEnviando] = useState(false);

    const mensajesEndRef = useRef(null);

    // 1. Cargar Usuarios y Chats al iniciar
    useEffect(() => {
        if (!miId || isNaN(miId)) return;
        
        const inicializar = async () => {
            try {
                // Cargar todos los usuarios de forma segura
                const usuariosRes = await getTodosUsuarios();
                if (Array.isArray(usuariosRes)) {
                    const otrosUsuarios = usuariosRes.filter(u => u.id !== miId);
                    setTodosUsuarios(otrosUsuarios);
                }

                // Cargar mis chats de forma segura
                const mensajesRes = await getMensajes(miId);
                if (Array.isArray(mensajesRes)) {
                    const chatsMap = new Map();
                    mensajesRes.forEach(m => {
                        const otroId = m.remitente_id === miId ? m.destinatario_id : m.remitente_id;
                        if (!chatsMap.has(otroId) || new Date(m.fecha_envio) > new Date(chatsMap.get(otroId).fecha_envio)) {
                            chatsMap.set(otroId, m);
                        }
                    });
                    
                    const chatsAgrupados = Array.from(chatsMap.entries()).map(([otroId, ultimoMsg]) => {
                        // Buscar en el array validado
                        const u = Array.isArray(usuariosRes) ? usuariosRes.find(user => user.id === otroId) : null;
                        return {
                            id: otroId,
                            username: u ? u.username : `usuario_${otroId}`,
                            ultimoMsg: ultimoMsg
                        };
                    });
                    setMisChats(chatsAgrupados);
                }
            } catch (error) {
                console.error("Error inicializando mensajería:", error);
            }
        };

        inicializar();
    }, [miId]);

    // 2. Cargar Conversación
    useEffect(() => {
        if (!destinatarioActual) return;

        const cargar = async () => {
            try {
                const data = await getConversacion(miId, destinatarioActual.id);
                if (Array.isArray(data)) setMensajesChat(data);
            } catch (error) {
                console.error("Error al cargar chat:", error);
            }
        };

        cargar(); 
        const interval = setInterval(cargar, 4000); 
        return () => clearInterval(interval); 
    }, [destinatarioActual, miId]);

    // 3. Auto-scroll
    useEffect(() => {
        mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [mensajesChat]);

    const handleEnviarMensaje = async (e) => {
        e.preventDefault();
        if (!nuevoMensaje.trim() || !destinatarioActual) return;

        setEnviando(true);
        try {
            await enviarMensajeChat({
                texto: nuevoMensaje,
                remitente_id: miId,
                destinatario_id: destinatarioActual.id
            });
            setNuevoMensaje('');
            const data = await getConversacion(miId, destinatarioActual.id);
            if (Array.isArray(data)) setMensajesChat(data);
        } catch (error) {
            alert('Error al enviar el mensaje');
        } finally {
            setEnviando(false);
        }
    };

    const listaMostrada = tabActual === 'chats' ? misChats : todosUsuarios;
    // Validamos que listaMostrada sea un array antes de filtrar
    const listaFiltrada = Array.isArray(listaMostrada) ? listaMostrada.filter(item => 
        (item.username || '').toLowerCase().includes(busqueda.toLowerCase())
    ) : [];

    if (!miId || isNaN(miId)) return <MainLayout><div style={{display: 'block'}}><p style={{ padding: '20px', textAlign: 'center' }}>Inicia sesión para ver tus mensajes.</p></div></MainLayout>;

    return (
        <MainLayout>
            {/* Forzamos display: flex para evitar que el CSS global lo oculte */}
            <div className="layout-mensajeria" style={{ margin: '20px 0', display: 'flex' }}>
                
                <div className="panel-contactos">
                    <div className="panel-contactos-header">
                        <h3>💬 Mensajes</h3>
                        <input 
                            type="search" 
                            className="buscador-contactos" 
                            placeholder="Buscar usuario..." 
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>
                    <div className="tabs-mensajes">
                        <button className={`tab-btn ${tabActual === 'chats' ? 'activo' : ''}`} onClick={() => setTabActual('chats')}>Chats</button>
                        <button className={`tab-btn ${tabActual === 'usuarios' ? 'activo' : ''}`} onClick={() => setTabActual('usuarios')}>Usuarios</button>
                    </div>
                    
                    <div className="lista-panel">
                        {listaFiltrada.length === 0 && (
                            <p style={{ padding: '20px', color: '#8892a0', textAlign: 'center', fontSize: '0.9rem' }}>
                                No hay resultados.
                            </p>
                        )}
                        
                        {listaFiltrada.map(item => {
                            const activo = destinatarioActual && destinatarioActual.id === item.id;
                            const preview = tabActual === 'chats' 
                                ? `${item.ultimoMsg?.remitente_id === miId ? 'Tú: ' : ''}${item.ultimoMsg?.texto || ''}` 
                                : 'Iniciar conversación';

                            return (
                                <div key={item.id} className={`contact-item ${activo ? 'activo' : ''}`} onClick={() => setDestinatarioActual(item)}>
                                    <div className="c-avatar" style={{ background: getColor(item.id) }}>
                                        {getInicial(item.username)}
                                    </div>
                                    <div className="c-info">
                                        <strong>@{item.username}</strong>
                                        <span className="preview">{preview}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="panel-chat">
                    {!destinatarioActual ? (
                        <div className="chat-vacio">
                            <div className="icono-chat">💬</div>
                            <p>Selecciona un chat para empezar</p>
                            <small style={{ color: '#bbb', marginTop: '6px' }}>O busca un usuario en la pestaña "Usuarios"</small>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                            <div className="chat-header">
                                <div className="c-avatar" style={{ background: getColor(destinatarioActual.id), width: '36px', height: '36px', fontSize: '0.95rem' }}>
                                    {getInicial(destinatarioActual.username)}
                                </div>
                                <div className="chat-header-info">
                                    <strong>@{destinatarioActual.username}</strong>
                                </div>
                            </div>

                            <div className="chat-mensajes">
                                {mensajesChat.length === 0 ? (
                                    <p style={{ textAlign: 'center', color: '#ccc', marginTop: '40px' }}>Aún no hay mensajes. ¡Di hola!</p>
                                ) : (
                                    mensajesChat.map((m, index) => {
                                        const esMio = m.remitente_id === miId;
                                        const fechaObj = new Date(m.fecha_envio);
                                        const fechaStr = fechaObj.toLocaleDateString('es-ES');
                                        
                                        const prevMsg = index > 0 ? mensajesChat[index - 1] : null;
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

                            <form className="chat-input-area" onSubmit={handleEnviarMensaje}>
                                <input 
                                    type="text" 
                                    placeholder="Escribe un mensaje..." 
                                    value={nuevoMensaje}
                                    onChange={(e) => setNuevoMensaje(e.target.value)}
                                    required 
                                />
                                <button type="submit" className="btn-enviar-msg" disabled={enviando || !nuevoMensaje.trim()}>
                                    {enviando ? '...' : 'Enviar'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>

            </div>
        </MainLayout>
    );
};

export default MensajeriaPage;