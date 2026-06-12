const AutorInfo = ({ autor, usuarioId, fechaCreacion }) => {
    const username = autor ? autor.username : `usuario_${usuarioId}`;
    const inicial = autor ? autor.username.charAt(0).toUpperCase() : 'U';
    const fechaFormat = new Date(fechaCreacion).toLocaleDateString('es-ES', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className="mt-5 flex items-center gap-3 pb-6 border-b border-beige">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white text-xl font-bold shrink-0">
                {inicial}
            </div>
            <div className="flex flex-col">
                <strong className="text-gray-dark text-base">@{username}</strong>
                <span className="text-gray-muted text-sm">Subido el {fechaFormat}</span>
            </div>
        </div>
    );
};

export default AutorInfo;
