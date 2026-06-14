import {useRef, useState, useEffect } from 'react';
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
        <section className="text-center mb-12 animate-fade-in">
            <UserInfoCard 
                profilePic={usuario.profile_pic} 
                username={usuario.username} 
                esPublico={usuario.es_publico} 
                isOwnProfile={isOwnProfile} 
            />

            {isOwnProfile ? (
                <div className="flex justify-center gap-4 mt-4">
                    <label className="flex items-center gap-2 text-gray-dark cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={usuario.es_publico} 
                            onChange={(e) => togglePrivacidad(usuario.id, e.target.checked).then(onUpdate)}
                            className="w-4 h-4 accent-accent"
                        />
                        Perfil Público
                    </label>
                    
                    <input type="file" ref={fileInputRef} hidden onChange={handleAvatarChange} />
                    
                    <Button className="bg-gradient-to-br from-accent to-accent-light text-white px-6 py-2.5 rounded-full border-none cursor-pointer font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg" onClick={() => fileInputRef.current.click()}>
                        Cambiar Foto
                    </Button>
                </div>
            ) : (
                <div className="flex justify-center gap-4 mt-4">
                    <Button className="bg-gradient-to-br from-accent to-accent-light text-white px-6 py-2.5 rounded-full border-none cursor-pointer font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg" onClick={handleFollow}>
                        {isFollowing ? 'Dejar de seguir' : 'Seguir'}
                    </Button>
                </div>
            )}
        </section>
    );
};

export default UserProfile;