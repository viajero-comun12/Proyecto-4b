const AutorInfo = ({ autor, usuarioId, fechaCreacion }) => {
    const username = autor ? autor.username : `usuario_${usuarioId}`;
    const inicial = autor ? autor.username.charAt(0).toUpperCase() : 'U';
    const fechaFormat = new Date(fechaCreacion).toLocaleDateString('es-ES', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className="autor" style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'var(--color-morado)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '20px' }}>
                {inicial}
            </div>
            <div className="autor-info">
                <strong>@{username}</strong>
                <span style={{ display: 'block', color: '#8892a0', fontSize: '0.85rem' }}>Subido el {fechaFormat}</span>
            </div>
        </div>
    );
};

export default AutorInfo;
