const colores = ['#956B54', '#323232', '#B8907A', '#4A7C6F', '#8B6F47', '#5C6B7A'];
const getColor = (id) => colores[id % colores.length];
const getInicial = (username) => (username || 'U')[0].toUpperCase();

const ContactItem = ({ item, activo, preview, onClick }) => {
    return (
        <div
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200 border-b border-beige-light ${activo ? 'bg-beige-light' : 'hover:bg-beige/30'}`}
            onClick={onClick}
        >
            <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-lg text-white shrink-0" style={{ background: getColor(item.id) }}>
                {getInicial(item.username)}
            </div>
            <div className="flex-1 overflow-hidden">
                <strong className="block text-sm text-gray-dark">@{item.username}</strong>
                <span className="block text-xs text-gray-muted truncate">{preview}</span>
            </div>
        </div>
    );
};

export default ContactItem;
