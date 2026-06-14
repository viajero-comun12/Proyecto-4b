const UserInfoCard = ({ profilePic, username, esPublico, isOwnProfile }) => {
    return (
        <>
            <img src={profilePic || 'img/avatar.png'} alt="Avatar" className="w-36 h-36 rounded-full object-cover mx-auto mb-5 block shadow-md border-4 border-white bg-beige-light" />
            <h1 className="text-4xl mb-1">{username}</h1>
            <p className="text-gray-soft text-lg mb-6">@{username}</p>
            
            {!esPublico && !isOwnProfile && <p className="text-gray-muted font-bold">🔒 Perfil Privado</p>}
        </>
    );
};

export default UserInfoCard;
