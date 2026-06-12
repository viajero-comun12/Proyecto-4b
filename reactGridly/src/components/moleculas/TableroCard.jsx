const TableroCard = ({ tablero, onClick }) => {
    const portada = tablero.publicaciones && tablero.publicaciones.length > 0 ? tablero.publicaciones[0].url_multimedia : null;
    return (
        <article 
            className="break-inside-avoid bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1"
            onClick={onClick}
        >
            <div 
                className="w-full pb-[80%] rounded-t-2xl bg-cover bg-center"
                style={{ 
                    backgroundImage: portada ? `url('${portada}')` : 'none',
                    backgroundColor: portada ? 'transparent' : '#956B54',
                }}
            />
            <div className="px-4 py-3 flex justify-between items-center">
                <strong className="text-gray-dark">📁 {tablero.nombre}</strong>
                <p className="text-gray-muted text-sm">{tablero.publicaciones ? tablero.publicaciones.length : 0} pines</p>
            </div>
        </article>
    );
};

export default TableroCard;
