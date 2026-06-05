import React from 'react';
import { togglePrivacidad, uploadAvatar, toggleFollowUser } from '../../services/api';

const UserProfile = ({ usuario, isOwnProfile, onUpdate }) => {
    
    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        await uploadAvatar(usuario.id, formData);
        onUpdate(); // Recarga los datos del padre
    };

    return (
        <section className="info-usuario">
            <img src={usuario.profile_pic || 'img/avatar.png'} alt="Avatar" className="avatar-grande" />
            <h1>{usuario.username}</h1>
            <p className="username">@{usuario.username}</p>
            
            {!usuario.es_publico && !isOwnProfile && <p>🔒 Perfil Privado</p>}

            {isOwnProfile ? (
                <div className="acciones-perfil">
                    <label>
                        <input type="checkbox" checked={usuario.es_publico} onChange={(e) => togglePrivacidad(usuario.id, e.target.checked).then(onUpdate)} />
                        Perfil Público
                    </label>
                    <input type="file" id="avatar-upload" hidden onChange={handleAvatarChange} />
                    <button className="btn-primario" onClick={() => document.getElementById('avatar-upload').click()}>Cambiar Foto</button>
                </div>
            ) : (
                <div className="acciones-perfil">
                    <button className="btn-primario" onClick={() => toggleFollowUser(localStorage.getItem('usuario_id'), usuario.id).then(onUpdate)}>
                        Seguir/Dejar de seguir
                    </button>
                </div>
            )}
        </section>
    );
};
export default UserProfile;