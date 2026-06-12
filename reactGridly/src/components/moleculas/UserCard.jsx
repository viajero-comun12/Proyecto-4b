
import { Link } from 'react-router-dom';

const UserCard = ({ user }) => {
    const avatar = user.profile_pic || 'https://via.placeholder.com/50';

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <img src={avatar} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} alt={user.username} />
                <div>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--color-azul)' }}>@{user.username}</strong>
                    {!user.es_publico && <span style={{ fontSize: '0.8rem', color: 'gray', marginLeft: '5px' }}>🔒 Privado</span>}
                </div>
            </div>
            <Link to={`/usuario/${user.id}`} className="btn-primario" style={{ padding: '8px 16px' }}>
                Ver Perfil
            </Link>
        </div>
    );
};
export default UserCard;