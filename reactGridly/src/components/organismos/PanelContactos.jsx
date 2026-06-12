import ContactItem from '../moleculas/ContactItem';

const PanelContactos = ({ tabActual, setTabActual, busqueda, setBusqueda, listaFiltrada, destinatarioActual, miId, onSelectContacto }) => {
    return (
        <div className="w-[300px] min-w-[260px] border-r border-beige flex flex-col overflow-hidden bg-white">
            <div className="px-4 pt-4 pb-2.5 border-b border-beige">
                <h3 className="mb-2.5 text-lg font-bold text-gray-dark">💬 Mensajes</h3>
                <input
                    type="search"
                    className="w-full px-3 py-2 rounded-full border border-beige-dark/30 text-sm bg-beige-light/50 outline-none transition-all duration-300 focus:border-accent placeholder:text-gray-muted"
                    placeholder="Buscar usuario..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    maxLength={50}
                />
            </div>
            <div className="flex border-b border-beige">
                <button className={`flex-1 py-2.5 text-sm border-none bg-transparent cursor-pointer font-semibold transition-all duration-200 border-b-3 ${tabActual === 'chats' ? 'text-accent border-b-accent border-b-[3px]' : 'text-gray-muted border-b-transparent border-b-[3px]'}`} onClick={() => setTabActual('chats')}>Chats</button>
                <button className={`flex-1 py-2.5 text-sm border-none bg-transparent cursor-pointer font-semibold transition-all duration-200 border-b-3 ${tabActual === 'usuarios' ? 'text-accent border-b-accent border-b-[3px]' : 'text-gray-muted border-b-transparent border-b-[3px]'}`} onClick={() => setTabActual('usuarios')}>Usuarios</button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {listaFiltrada.length === 0 && (
                    <p className="p-5 text-gray-muted text-center text-sm">
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
