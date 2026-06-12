
import { Link } from 'react-router-dom';

const UserCard = ({ user }) => {
    const avatar = user.profile_pic || 'https://via.placeholder.com/50';

    return (
        <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4">
                <img src={avatar} className="w-12 h-12 rounded-full object-cover" alt={user.username} />
                <div>
                    <strong className="text-base text-gray-dark">@{user.username}</strong>
                    {!user.es_publico && <span className="text-xs text-gray-muted ml-2">🔒 Privado</span>}
                </div>
            </div>
            <Link to={`/usuario/${user.id}`} className="bg-gradient-to-br from-accent to-accent-light text-white px-4 py-2 rounded-full font-bold text-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                Ver Perfil
            </Link>
        </div>
    );
};
export default UserCard;