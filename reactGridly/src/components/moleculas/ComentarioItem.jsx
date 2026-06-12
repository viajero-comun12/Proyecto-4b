const ComentarioItem = ({ comentario }) => {
    const { autor, usuario_id, texto } = comentario;
    const inicial = autor ? autor.username.charAt(0).toUpperCase() : 'U';
    const username = autor ? autor.username : `usuario_${usuario_id}`;

    return (
        <div className="flex gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-white shrink-0 text-sm font-bold">
                {inicial}
            </div>
            <div className="bg-beige-light/60 px-4 py-2.5 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl text-sm">
                <strong className="block mb-0.5 text-gray-dark">@{username}</strong>
                <span className="text-gray-mid">{texto}</span>
            </div>
        </div>
    );
};

export default ComentarioItem;
