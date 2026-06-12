import { Link } from 'react-router-dom';

const SeguidoCard = ({ user }) => {
    const avatar = user.profile_pic || 'https://via.placeholder.com/120';
    const inicial = (user.username || 'U')[0].toUpperCase();

    return (
        <Link
            to={`/usuario/${user.id}`}
            className="seguido-card"
            style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'white',
                borderRadius: '16px',
                padding: '24px 16px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(98,0,150,0.18)';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
            }}
        >
            {/* Decorative gradient top bar */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '5px',
                background: 'linear-gradient(90deg, #620096, #F6A700)',
            }} />

            {/* Avatar */}
            <div style={{
                width: '90px', height: '90px', borderRadius: '50%',
                border: '3px solid #620096',
                padding: '3px',
                marginBottom: '14px',
                transition: 'transform 0.3s ease',
            }}>
                {user.profile_pic ? (
                    <img
                        src={avatar}
                        alt={user.username}
                        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                    />
                ) : (
                    <div style={{
                        width: '100%', height: '100%', borderRadius: '50%',
                        backgroundColor: '#620096', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontSize: '2rem', fontWeight: 'bold'
                    }}>
                        {inicial}
                    </div>
                )}
            </div>

            {/* Username */}
            <strong style={{ fontSize: '1.05rem', color: 'var(--color-azul)', marginBottom: '4px' }}>
                @{user.username}
            </strong>

            {/* Privacy badge */}
            {!user.es_publico && (
                <span style={{ fontSize: '0.75rem', color: '#8892a0', marginBottom: '6px' }}>🔒 Privado</span>
            )}

            {/* Publication count */}
            <span style={{
                marginTop: '10px',
                padding: '5px 14px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #620096, #8a2be2)',
                color: 'white',
                fontSize: '0.8rem',
                fontWeight: '600',
            }}>
                {user.publicaciones_count !== undefined ? `${user.publicaciones_count} pines` : 'Ver perfil'}
            </span>
        </Link>
    );
};

export default SeguidoCard;
