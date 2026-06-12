const ComentarioItem = ({ comentario }) => {
    const { autor, usuario_id, texto } = comentario;
    const inicial = autor ? autor.username.charAt(0).toUpperCase() : 'U';
    const username = autor ? autor.username : `usuario_${usuario_id}`;

    return (
        <div className="comentario" style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--color-morado)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                {inicial}
            </div>
            <div className="comentario-texto">
                <strong>@{username}</strong>
                <span style={{ marginLeft: '8px' }}>{texto}</span>
            </div>
        </div>
    );
};

export default ComentarioItem;
