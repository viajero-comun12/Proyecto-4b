const colores = ['#620096', '#002147', '#e91e8c', '#00897b', '#e65100', '#1565c0'];
const getColor = (id) => colores[id % colores.length];
const getInicial = (username) => (username || 'U')[0].toUpperCase();

const ContactItem = ({ item, activo, preview, onClick }) => {
    return (
        <div
            className={`contact-item ${activo ? 'activo' : ''}`}
            onClick={onClick}
        >
            <div className="c-avatar" style={{ background: getColor(item.id) }}>
                {getInicial(item.username)}
            </div>
            <div className="c-info">
                <strong>@{item.username}</strong>
                <span className="preview">{preview}</span>
            </div>
        </div>
    );
};

export default ContactItem;
