import React, { useRef } from 'react'; // 1. Importamos useRef
import { togglePrivacidad, uploadAvatar, toggleFollowUser } from '../../services/api';
import Button from '../atomos/Button'; 

const UserProfile = ({ usuario, isOwnProfile, onUpdate }) => {
    
    const fileInputRef = useRef(null);
    
    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        await uploadAvatar(usuario.id, formData);
        onUpdate(); 
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
                        <input 
                            type="checkbox" 
                            checked={usuario.es_publico} 
                            onChange={(e) => togglePrivacidad(usuario.id, e.target.checked).then(onUpdate)} 
                        />
                        Perfil Público
                    </label>
                    
                    <input type="file" ref={fileInputRef} hidden onChange={handleAvatarChange} />
                    
                    <Button className="btn-primario" onClick={() => fileInputRef.current.click()}>
                        Cambiar Foto
                    </Button>
                </div>
            ) : (
                <div className="acciones-perfil">
                    <Button className="btn-primario" onClick={() => toggleFollowUser(localStorage.getItem('usuario_id'), usuario.id).then(onUpdate)}>
                        Seguir/Dejar de seguir
                    </Button>
                </div>
            )}
        </section>
    );
};

export default UserProfile;