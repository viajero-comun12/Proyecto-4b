
const NotificationItem = ({ notif }) => {
    return (
        <div className={`flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md ${!notif.leida ? 'bg-beige-light/50 border-l-4 border-accent' : ''}`}>
            <div className="w-11 h-11 bg-gray-dark text-white rounded-full flex justify-center items-center font-bold text-lg shrink-0">N</div>
            <div className="flex-1 text-gray-dark text-sm">{notif.texto}</div>
        </div>
    );
};
export default NotificationItem;