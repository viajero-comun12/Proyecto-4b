const TableroCard = ({ tablero, onClick }) => {
    const portada = tablero.publicaciones && tablero.publicaciones.length > 0 ? tablero.publicaciones[0].url_multimedia : null;
    return (
        <article className="tarjeta-pin" style={{ cursor: 'pointer' }} onClick={onClick}>
            <div className="imagen-wrapper" style={{ 
                paddingBottom: '80%', 
                backgroundImage: portada ? `url('${portada}')` : 'none',
                backgroundColor: portada ? 'transparent' : 'var(--color-morado)',
                backgroundSize: 'cover', 
                backgroundPosition: 'center', 
                borderRadius: '12px' 
            }}></div>
            <div className="info-basica">
                <strong>📁 {tablero.nombre}</strong>
                <p style={{ color: '#8892a0', fontSize: '0.85rem' }}>{tablero.publicaciones ? tablero.publicaciones.length : 0} pines</p>
            </div>
        </article>
    );
};

export default TableroCard;
