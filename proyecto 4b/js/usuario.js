let miUsuarioId = null;
let perfilId = null;
let isOwnProfile = false;
let perfilData = null;

document.addEventListener('DOMContentLoaded', () => {
    miUsuarioId = localStorage.getItem('usuario_id');
    if (!miUsuarioId) {
        alert("Debes iniciar sesión para ver perfiles");
        window.location.href = 'login.html';
        return;
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    perfilId = urlParams.get('id') || miUsuarioId;
    isOwnProfile = (perfilId == miUsuarioId);

    if(isOwnProfile) {
        document.getElementById('acciones-propias').style.display = 'flex';
        document.querySelector('.mis-publicaciones h2').textContent = "Mis Pines Guardados y Subidas";
    } else {
        document.getElementById('acciones-ajenas').style.display = 'flex';
        document.querySelector('.mis-publicaciones h2').textContent = "Publicaciones";
        checkFollowStatus();
    }

    cargarPerfil(perfilId);
});

async function checkFollowStatus() {
    try {
        const res = await fetch(`${API_URL}/usuarios/${miUsuarioId}/seguidos`);
        const seguidos = await res.json();
        const follows = seguidos.some(s => s.id == perfilId);
        const btn = document.getElementById('btn-seguir');
        if(follows) {
            btn.textContent = "Dejar de Seguir";
            btn.style.backgroundColor = "var(--color-gris)";
            btn.style.color = "var(--color-fondo)";
        } else {
            btn.textContent = "Seguir";
            btn.style.backgroundColor = "var(--color-morado)";
            btn.style.color = "white";
        }
    } catch(e) { console.error(e); }
}

async function toggleFollow() {
    try {
        const res = await fetch(`${API_URL}/usuarios/${miUsuarioId}/follow/${perfilId}`, { method: 'POST' });
        if(res.ok) {
            checkFollowStatus();
        }
    } catch(e) { console.error(e); }
}

async function togglePrivacidad() {
    const pub = document.getElementById('es-publico-check').checked;
    try {
        await fetch(`${API_URL}/usuarios/${miUsuarioId}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ es_publico: pub })
        });
        alert(`Tu perfil ahora es ${pub ? 'Público' : 'Privado'}`);
    } catch(e) { console.error(e); alert("Error al cambiar privacidad"); }
}

async function cargarPerfil(uid) {
    try {
        const respuesta = await fetch(`${API_URL}/usuarios/${uid}`);
        if (!respuesta.ok) throw new Error('Usuario no encontrado');
        
        perfilData = await respuesta.json();
        
        document.querySelector('.info-usuario h1').innerText = perfilData.username;
        document.querySelector('.info-usuario .username').innerText = `@${perfilData.username}`;
        
        if (perfilData.profile_pic) {
            document.querySelector('.avatar-grande').src = perfilData.profile_pic;
        }
        
        if (isOwnProfile) {
            document.getElementById('es-publico-check').checked = perfilData.es_publico;
        }
        
        if (!perfilData.es_publico && !isOwnProfile) {
            document.getElementById('privacidad-badge').style.display = 'block';
            
            // Check if following, if not, block posts
            const resF = await fetch(`${API_URL}/usuarios/${miUsuarioId}/seguidos`);
            const seguidos = await resF.json();
            const follows = seguidos.some(s => s.id == perfilId);
            
            if(!follows) {
                document.getElementById('user-publicaciones').innerHTML = '<p style="text-align:center; color:#8892a0; width:100%;">Este perfil es privado. Síguelo para ver sus publicaciones.</p>';
                return;
            }
        }
        
        cargarMisPublicaciones(uid);
    } catch (error) {
        console.error(error);
        alert('Error al cargar datos del usuario');
    }
}

async function cargarMisPublicaciones(uid) {
    const contenedor = document.getElementById('user-publicaciones');
    try {
        const respuesta = await fetch(`${API_URL}/publicaciones/`);
        const publicaciones = await respuesta.json();
        contenedor.innerHTML = '';
        
        const misPubs = publicaciones.filter(pub => pub.usuario_id == uid);
        
        if (misPubs.length === 0) {
            contenedor.innerHTML = '<p style="text-align:center; color:#8892a0; width:100%;">No hay publicaciones.</p>';
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
                        <button class="btn-guardar" onclick="event.stopPropagation(); window.location.href='detalle.html?id=${pub.id}'">Ver detalle</button>
                    </div>
                </div>
                <div class="info-basica"><p>${pub.titulo}</p></div>
            `;
            contenedor.appendChild(article);
        });
        
    } catch (error) {
        contenedor.innerHTML = '<p style="color:red; width:100%;">Error al cargar publicaciones</p>';
    }
}

async function subirAvatar(input) {
    if(!input.files[0]) return;
    const formData = new FormData();
    formData.append('file', input.files[0]);
    document.querySelector('.avatar-grande').style.opacity = '0.5';
    try {
        const respuesta = await fetch(`${API_URL}/usuarios/${miUsuarioId}/avatar`, {
            method: 'POST', body: formData
        });
        if (respuesta.ok) {
            const data = await respuesta.json();
            document.querySelector('.avatar-grande').src = data.profile_pic;
            alert('¡Foto de perfil actualizada!');
        }
    } catch(error) {
        console.error(error);
    } finally {
        document.querySelector('.avatar-grande').style.opacity = '1';
    }
}
