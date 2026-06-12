const UserInfoCard = ({ profilePic, username, esPublico, isOwnProfile }) => {
    return (
        <>
            <img src={profilePic || 'img/avatar.png'} alt="Avatar" className="avatar-grande" />
            <h1>{username}</h1>
            <p className="username">@{username}</p>
            
            {!esPublico && !isOwnProfile && <p style={{ color: '#8892a0', fontWeight: 'bold' }}>🔒 Perfil Privado</p>}
        </>
    );
};

export default UserInfoCard;
