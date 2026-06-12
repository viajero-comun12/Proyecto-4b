
const NotificationItem = ({ notif }) => {
    return (
        <div className={`notificacion ${notif.leida ? '' : 'no-leida'}`}>
            <div className="notif-avatar" style={{ background: 'var(--color-morado)' }}>N</div>
            <div className="notif-texto">{notif.texto}</div>
        </div>
    );
};
export default NotificationItem;