// src/services/api.js

const API_URL = 'http://localhost:8000'; // Asegúrate de que este es el puerto de tu FastAPI

// ==========================================
// PUBLICACIONES Y COMENTARIOS
// ==========================================

export const getPublicaciones = async () => {
    const response = await fetch(`${API_URL}/publicaciones/`);
    if (!response.ok) throw new Error('Error al obtener publicaciones');
    return await response.json();
};

export const createPublicacion = async (formData) => {
    const response = await fetch(`${API_URL}/publicaciones/`, {
        method: 'POST',
        body: formData // Fetch añade automáticamente el Content-Type para FormData
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Fallo al subir la publicación');
    }
    return await response.json();
};

export const getPublicacionDetalle = async (id) => {
    const response = await fetch(`${API_URL}/publicaciones/${id}`);
    if (!response.ok) throw new Error('Publicación no encontrada');
    return await response.json();
};

export const sendComentario = async (pubId, texto, usuarioId) => {
    const response = await fetch(`${API_URL}/publicaciones/${pubId}/comentarios/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto, usuario_id: usuarioId })
    });
    if (!response.ok) throw new Error('Error al enviar el comentario');
    return await response.json();
};

// ==========================================
// TABLEROS, NOTIFICACIONES Y MENSAJES
// ==========================================

export const createTablero = async (nombre, secreto, usuarioId) => {
    const response = await fetch(`${API_URL}/tableros/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, secreto, usuario_id: usuarioId })
    });
    if (!response.ok) throw new Error('Error al crear tablero');
    return await response.json();
};

export const getNotificaciones = async (usuarioId) => {
    const response = await fetch(`${API_URL}/usuarios/${usuarioId}/notificaciones/`);
    if (!response.ok) throw new Error('Error al cargar notificaciones');
    return await response.json();
};

export const getMensajes = async (usuarioId) => {
    const response = await fetch(`${API_URL}/mensajes/${usuarioId}`);
    if (!response.ok) throw new Error('Error al cargar mensajes');
    return await response.json();
};

// ==========================================
// USUARIOS Y PERFILES
// ==========================================

export const getUsuario = async (uid) => {
    const response = await fetch(`${API_URL}/usuarios/${uid}`);
    if (!response.ok) throw new Error('Usuario no encontrado');
    return await response.json();
};

export const getSeguidos = async (usuarioId) => {
    const response = await fetch(`${API_URL}/usuarios/${usuarioId}/seguidos`);
    if (!response.ok) throw new Error('Error al obtener seguidos');
    return await response.json();
};



export const updatePrivacidad = async (usuarioId, esPublico) => {
    const response = await fetch(`${API_URL}/usuarios/${usuarioId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ es_publico: esPublico })
    });
    if (!response.ok) throw new Error('Error al actualizar privacidad');
    return await response.json();
};



export const buscarUsuarios = async (query) => {
    const response = await fetch(`${API_URL}/usuarios/buscar?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Error buscando usuarios');
    return await response.json();
};  

// Agregar al final del archivo src/services/api.js

// ==========================================
// SEGUIMIENTO ( FOLLOWS)
// ==========================================

// Verificar si yo sigo a alguien
export const isFollowing = async (followerId, followedId) => {
    const response = await fetch(`${API_URL}/usuarios/${followerId}/is_following/${followedId}`);
    if (!response.ok) throw new Error('Error al verificar seguimiento');
    return await response.json();
};

// Toggle (Seguir / Dejar de seguir)
export const toggleFollow = async (followerId, followedId) => {
    const response = await fetch(`${API_URL}/usuarios/${followerId}/follow/${followedId}`, {
        method: 'POST'
    });
    if (!response.ok) throw new Error('Error al seguir/dejar de seguir');
    return await response.json();
};

// Obtener seguidores de un usuario
export const getSeguidores = async (usuarioId) => {
    const response = await fetch(`${API_URL}/usuarios/${usuarioId}/seguidores`);
    if (!response.ok) throw new Error('Error al obtener seguidores');
    return await response.json();
};


export const togglePrivacidad = async (usuarioId, esPublico) => {
    const response = await fetch(`${API_URL}/usuarios/${usuarioId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ es_publico: esPublico })
    });
    if (!response.ok) throw new Error('Error al actualizar privacidad');
    return await response.json();
};

export const uploadAvatar = async (usuarioId, formData) => {
    const response = await fetch(`${API_URL}/usuarios/${usuarioId}/avatar`, {
        method: 'POST',
        body: formData
    });
    if (!response.ok) throw new Error('Error al subir avatar');
    return await response.json();
};

export const toggleFollowUser = async (miUsuarioId, perfilId) => {
    const response = await fetch(`${API_URL}/usuarios/${miUsuarioId}/follow/${perfilId}`, {
        method: 'POST'
    });
    if (!response.ok) throw new Error('Error al seguir/dejar de seguir');
    return await response.json();
};


export const getMisTableros = async (usuarioId) => {
    const response = await fetch(`${API_URL}/usuarios/${usuarioId}/tableros/`); 
    if (!response.ok) throw new Error('Error al obtener tableros');
    return await response.json();
};