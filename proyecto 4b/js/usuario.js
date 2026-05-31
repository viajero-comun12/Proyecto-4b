
document.addEventListener('DOMContentLoaded', () => {
    const usuarioId = localStorage.getItem('usuario_id');
    
    if (!usuarioId) {
        alert("Debes iniciar sesión para ver tu perfil");
        window.location.href = 'login.html';
        return;
    }

    cargarPerfil(usuarioId);
    cargarMisPublicaciones(usuarioId);
});

async function cargarPerfil(usuarioId) {
    try {
        const respuesta = await fetch(`${API_URL}/usuarios/${usuarioId}`);
        if (!respuesta.ok) throw new Error('Usuario no encontrado');
        
        const usuario = await respuesta.json();
        
        document.querySelector('.info-usuario h1').innerText = usuario.username;
        document.querySelector('.info-usuario .username').innerText = `@${usuario.username}`;
        
        if (usuario.profile_pic) {
            document.querySelector('.avatar-grande').src = usuario.profile_pic;
        }
        
    } catch (error) {
        console.error(error);
        alert('Error al cargar datos del usuario');
    }
}

async function cargarMisPublicaciones(usuarioId) {
    const contenedor = document.getElementById('user-publicaciones');
    
    try {
        const respuesta = await fetch(`${API_URL}/publicaciones/`);
        const publicaciones = await respuesta.json();
        
        contenedor.innerHTML = '';
        
        // Filtramos solo las que pertenecen a este usuario
        // Nota: en una app real, la API debería tener un endpoint GET /usuarios/{id}/publicaciones
        const misPubs = publicaciones.filter(pub => pub.usuario_id == usuarioId);
        
        if (misPubs.length === 0) {
            contenedor.innerHTML = '<p style="text-align:center; color:#8892a0;">No tienes pines guardados o subidos.</p>';
            return;
        }
        
        misPubs.forEach(pub => {
            const article = document.createElement('article');
            article.className = 'tarjeta-pin';
            article.onclick = () => window.location.href = `detalle.html?id=${pub.id}`;
            
            const randomPadding = [80, 100, 120, 140, 150][Math.floor(Math.random() * 5)];
            
            article.innerHTML = `
                <div class="imagen-wrapper" style="padding-bottom: ${randomPadding}%;">
                    <img src="${pub.url_multimedia}" alt="${pub.titulo}" style="position:absolute; width:100%; height:100%; object-fit:cover;">
                    <div class="pin-overlay">
                        <button class="btn-guardar" onclick="event.stopPropagation(); alert('¡Guardado!')">Guardado</button>
                        <div class="pin-info-hover">
                            <strong>${pub.titulo}</strong>
                            <span>@usuario_${pub.usuario_id}</span>
                        </div>
                    </div>
                </div>
                <div class="info-basica">
                    <p>${pub.titulo}</p>
                </div>
            `;
            
            contenedor.appendChild(article);
        });
        
    } catch (error) {
        console.error(error);
        contenedor.innerHTML = '<p style="color:red;">Error al cargar tus publicaciones</p>';
    }
}

async function subirAvatar(input) {
    if(!input.files[0]) return;
    
    const usuarioId = localStorage.getItem('usuario_id');
    if(!usuarioId) return;
    
    const formData = new FormData();
    formData.append('file', input.files[0]);
    
    // Mostramos estado de carga
    document.querySelector('.avatar-grande').style.opacity = '0.5';
    
    try {
        const respuesta = await fetch(`${API_URL}/usuarios/${usuarioId}/avatar`, {
            method: 'POST',
            body: formData
        });
        
        if (respuesta.ok) {
            const data = await respuesta.json();
            document.querySelector('.avatar-grande').src = data.profile_pic;
            alert('¡Foto de perfil actualizada con éxito!');
        } else {
            alert('Error al actualizar foto de perfil');
        }
    } catch(error) {
        console.error(error);
        alert('Error de conexión');
    } finally {
        document.querySelector('.avatar-grande').style.opacity = '1';
    }
}
