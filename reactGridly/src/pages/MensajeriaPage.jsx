import { useState, useEffect } from 'react';
import { getMensajes, getTodosUsuarios, getConversacion, enviarMensajeChat } from '../services/api';
import PanelContactos from '../components/organismos/PanelContactos';
import PanelChat from '../components/organismos/PanelChat';

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

    useEffect(() => {
        if (!miId || isNaN(miId)) return;

        const inicializar = async () => {
            try {
                const usuariosRes = await getTodosUsuarios();
                if (Array.isArray(usuariosRes)) {
                    setTodosUsuarios(usuariosRes.filter(u => u.id !== miId));
                }

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
                        const u = Array.isArray(usuariosRes) ? usuariosRes.find(user => user.id === otroId) : null;
                        return { id: otroId, username: u ? u.username : `usuario_${otroId}`, ultimoMsg };
                    });
                    setMisChats(chatsAgrupados);
                }
            } catch (error) {
                console.error('Error inicializando mensajería:', error);
            }
        };

        inicializar();
    }, [miId]);

    useEffect(() => {
        if (!destinatarioActual) return;

        const cargar = async () => {
            try {
                const data = await getConversacion(miId, destinatarioActual.id);
                if (Array.isArray(data)) setMensajesChat(data);
            } catch (error) {
                console.error('Error al cargar chat:', error);
            }
        };

        cargar();
        const interval = setInterval(cargar, 4000);
        return () => clearInterval(interval);
    }, [destinatarioActual, miId]);

    const handleEnviarMensaje = async (e) => {
        e.preventDefault();
        if (!nuevoMensaje.trim() || !destinatarioActual) return;

        setEnviando(true);
        try {
            await enviarMensajeChat({ texto: nuevoMensaje, remitente_id: miId, destinatario_id: destinatarioActual.id });
            setNuevoMensaje('');
            const data = await getConversacion(miId, destinatarioActual.id);
            if (Array.isArray(data)) setMensajesChat(data);
        } catch (error) {
            console.error(error);
            alert('Error al enviar el mensaje');
        } finally {
            setEnviando(false);
        }
    };

    const listaMostrada = tabActual === 'chats' ? misChats : todosUsuarios;
    const listaFiltrada = Array.isArray(listaMostrada)
        ? listaMostrada.filter(item => (item.username || '').toLowerCase().includes(busqueda.toLowerCase()))
        : [];

    if (!miId || isNaN(miId)) return <div className="block"><p className="p-5 text-center mt-10 text-gray-dark">Inicia sesión para ver tus mensajes.</p></div>;

    return (
        <div className="flex h-[calc(100vh-100px)] my-5 mx-0 rounded-2xl border border-beige bg-white overflow-hidden shadow-sm">
            <PanelContactos
                tabActual={tabActual}
                setTabActual={setTabActual}
                busqueda={busqueda}
                setBusqueda={setBusqueda}
                listaFiltrada={listaFiltrada}
                destinatarioActual={destinatarioActual}
                miId={miId}
                onSelectContacto={setDestinatarioActual}
            />
            <PanelChat
                destinatario={destinatarioActual}
                mensajes={mensajesChat}
                miId={miId}
                nuevoMensaje={nuevoMensaje}
                onNuevoMensajeChange={(e) => setNuevoMensaje(e.target.value)}
                onEnviar={handleEnviarMensaje}
                enviando={enviando}
            />
        </div>
    );
};

export default MensajeriaPage;
