import ContactItem from '../moleculas/ContactItem';

const PanelContactos = ({ tabActual, setTabActual, busqueda, setBusqueda, listaFiltrada, destinatarioActual, miId, onSelectContacto }) => {
    return (
        <div className="panel-contactos">
            <div className="panel-contactos-header">
                <h3>💬 Mensajes</h3>
                <input
                    type="search"
                    className="buscador-contactos"
                    placeholder="Buscar usuario..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    maxLength={50}
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
                        <ContactItem
                            key={item.id}
                            item={item}
                            activo={activo}
                            preview={preview}
                            onClick={() => onSelectContacto(item)}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default PanelContactos;
