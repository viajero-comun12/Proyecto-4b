import {useRef, useState, useEffect } from 'react'; // 1. Importamos useRef
import { togglePrivacidad, uploadAvatar, toggleFollowUser, getSeguidos } from '../../services/api';
import Button from '../atomos/Button'; 
import UserInfoCard from '../moleculas/UserInfoCard';

const UserProfile = ({ usuario, isOwnProfile, onUpdate }) => {
    
    const fileInputRef = useRef(null);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        const miId = localStorage.getItem('usuario_id');
        if (!isOwnProfile && miId && usuario) {
            getSeguidos(miId).then(seguidos => {
                setIsFollowing(seguidos.some(s => s.id === usuario.id));
            });
        }
    }, [usuario, isOwnProfile]);

    const handleFollow = async () => {
        await toggleFollowUser(localStorage.getItem('usuario_id'), usuario.id);
        setIsFollowing(!isFollowing);
        onUpdate();
    };
    
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
            <UserInfoCard 
                profilePic={usuario.profile_pic} 
                username={usuario.username} 
                esPublico={usuario.es_publico} 
                isOwnProfile={isOwnProfile} 
            />

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
                    <Button className="btn-primario" onClick={handleFollow}>
                        {isFollowing ? 'Dejar de seguir' : 'Seguir'}
                    </Button>
                </div>
            )}
        </section>
    );
};

export default UserProfile;