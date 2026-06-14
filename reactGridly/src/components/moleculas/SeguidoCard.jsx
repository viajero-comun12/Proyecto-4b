import { Link } from 'react-router-dom';

const SeguidoCard = ({ user }) => {
    const avatar = user.profile_pic || null;
    const inicial = (user.username || 'U')[0].toUpperCase();

    return (
        <Link
            to={`/usuario/${user.id}`}
            className="no-underline text-inherit flex flex-col items-center bg-white rounded-2xl p-6 shadow-md transition-all duration-300 cursor-pointer relative overflow-hidden group hover:-translate-y-1.5 hover:shadow-xl"
        >
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-accent to-beige-dark" />

            {/* Avatar */}
            <div className="w-22 h-22 rounded-full border-3 border-accent p-0.5 mb-3.5 transition-transform duration-300 group-hover:scale-105">
                {avatar ? (
                    <img src={avatar} alt={user.username} className="w-full h-full rounded-full object-cover" />
                ) : (
                    <div className="w-full h-full rounded-full bg-accent flex items-center justify-center text-white text-2xl font-bold">
                        {inicial}
                    </div>
                )}
            </div>

            {/* Username */}
            <strong className="text-base text-gray-dark mb-1">@{user.username}</strong>

            {/* Privacy badge */}
            {!user.es_publico && (
                <span className="text-xs text-gray-muted mb-1.5">🔒 Privado</span>
            )}

            {/* Publication count badge */}
            <span className="mt-2.5 px-3.5 py-1 rounded-full bg-gradient-to-br from-accent to-accent-light text-white text-xs font-semibold">
                {user.publicaciones_count !== undefined ? `${user.publicaciones_count} pines` : 'Ver perfil'}
            </span>
        </Link>
    );
};

export default SeguidoCard;
