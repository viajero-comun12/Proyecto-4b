// Función que se ejecuta cuando la página termina de cargar
document.addEventListener('DOMContentLoaded', () => {
    // Si la URL actual requiere auth, auth.js redirigirá si no hay token.
    console.log("Mosaiko API conectada a:", API_URL);
    
    // Logica global para el buscador
    const buscador = document.querySelector('.buscador');
    if (buscador) {
        // Rellenar buscador con query actual si existe
        const urlParams = new URLSearchParams(window.location.search);
        const q = urlParams.get('q');
        if (q) buscador.value = q;
        
        buscador.addEventListener('keypress', (e) => {
            if(e.key === 'Enter') {
                const term = encodeURIComponent(buscador.value.trim());
                if(term) {
                    window.location.href = `explorar.html?q=${term}`;
                } else {
                    window.location.href = `explorar.html`;
                }
            }
        });
    }
    
    if (document.getElementById('feed-inicio')) {
        cargarPublicaciones();
    }
});

// Función para obtener y mostrar las publicaciones desde el backend
async function cargarPublicaciones() {
    const feedInicio = document.getElementById('feed-inicio');
    const usuarioId = localStorage.getItem('usuario_id');
    
    // Obtener parametro q de busqueda (por si se llama desde index.html?q=...)
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q');

    try {
        const respuesta = await fetch(`${API_URL}/publicaciones/`);
        let publicaciones = await respuesta.json();
        
        let seguidos = [];
        if (usuarioId) {
            const resS = await fetch(`${API_URL}/usuarios/${usuarioId}/seguidos`);
            if (resS.ok) seguidos = await resS.json();
        }
        
        // Filtro 1: Privacidad
        publicaciones = publicaciones.filter(pub => {
            const esMio = (pub.usuario_id == usuarioId);
            const esPublico = pub.autor ? pub.autor.es_publico : true;
            const loSigo = seguidos.some(s => s.id == pub.usuario_id);
            return esMio || esPublico || loSigo;
        });
        
        // Filtro 2: Busqueda
        if (q) {
            const query = q.toLowerCase();
            publicaciones = publicaciones.filter(pub => {
                const tituloMatch = pub.titulo.toLowerCase().includes(query);
                const autorMatch = pub.autor && pub.autor.username.toLowerCase().includes(query);
                return tituloMatch || autorMatch;
            });
        }
        
        // Limpiamos el mensaje de "Cargando..."
        feedInicio.innerHTML = '';
        
        if (publicaciones.length === 0) {
            feedInicio.innerHTML = `<p style="text-align: center; width: 100%; color: #8892a0;">${q ? 'No se encontraron resultados para tu búsqueda.' : 'Aún no hay publicaciones. ¡Sé el primero en subir una!'}</p>`;
            return;
        }

        // Recorremos las publicaciones y creamos el HTML
        publicaciones.forEach(pub => {
            const article = document.createElement('article');
            article.className = 'tarjeta-pin';
            article.onclick = () => window.location.href = `detalle.html?id=${pub.id}`;
            
            const randomPadding = [80, 100, 120, 140, 150][Math.floor(Math.random() * 5)];
            
            article.innerHTML = `
                <div class="imagen-wrapper" style="padding-bottom: ${randomPadding}%;">
                    <img src="${pub.url_multimedia}" alt="${pub.titulo}" style="position:absolute; width:100%; height:100%; object-fit:cover;">
                    <div class="pin-overlay">
                        <button class="btn-guardar" onclick="event.stopPropagation(); window.location.href='detalle.html?id=${pub.id}'">Ver detalle</button>
                        <div class="pin-info-hover">
                            <strong>${pub.titulo}</strong>
                            <span>${pub.autor ? '@' + pub.autor.username : '@usuario_' + pub.usuario_id}</span>
                        </div>
                    </div>
                </div>
                <div class="info-basica">
                    <p>${pub.titulo}</p>
                </div>
            `;
            
            feedInicio.appendChild(article);
        });
        
    } catch (error) {
        console.error('Error al cargar publicaciones:', error);
        feedInicio.innerHTML = '<p style="text-align: center; width: 100%; color: red;">Error al conectar con el servidor.</p>';
    }
}

// Función para enviar una nueva publicación con imagen al backend
async function crearPublicacion() {
    const btnSubmit = document.getElementById('btn-submit-pub');
    btnSubmit.innerText = 'Subiendo...';
    btnSubmit.disabled = true;

    // Obtener valores del formulario
    const archivoInput = document.getElementById('pub-file');
    const titulo = document.getElementById('pub-titulo').value;
    const descripcion = document.getElementById('pub-desc').value;
    const tags = document.getElementById('pub-tags').value;
    
    const usuarioId = localStorage.getItem('usuario_id');
    if (!usuarioId) {
        alert('Debes iniciar sesión para publicar.');
        window.location.href = 'login.html';
        return;
    }

    // FormData permite enviar archivos e información en la misma petición (multipart/form-data)
    const formData = new FormData();
    formData.append('file', archivoInput.files[0]);
    formData.append('titulo', titulo);
    if (descripcion) formData.append('descripcion', descripcion);
    if (tags) formData.append('tags', tags);
    formData.append('usuario_id', usuarioId); // Obligatorio para nuestro nuevo backend

    try {
        const respuesta = await fetch(`${API_URL}/publicaciones/`, {
            method: 'POST',
            body: formData
            // No se pone 'Content-Type': 'multipart/form-data' aquí, fetch lo añade automáticamente con el boundary
        });

        if (respuesta.ok) {
            alert('¡Publicación creada exitosamente en S3 y Base de Datos!');
            // Limpiar formulario
            document.getElementById('form-crear-pub').reset();
            const preview = document.getElementById('preview-img');
            if (preview) { preview.src = ''; preview.style.display = 'none'; }
            
            // Volver a Inicio
            window.location.href = 'index.html';
        } else {
            const errorData = await respuesta.json();
            alert(`Hubo un error: ${errorData.detail || 'Fallo al subir'}. ¿Quizás no has creado un usuario con ID 1?`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión al subir la publicación.');
    } finally {
        btnSubmit.innerText = 'Publicar';
        btnSubmit.disabled = false;
    }
}

// --- Funciones para Tableros, Notificaciones y Mensajes ---

async function crearTablero() {
    const nombre = document.getElementById('tablero-nombre').value;
    const secreto = document.getElementById('tablero-secreto').checked;
    const usuarioId = localStorage.getItem('usuario_id');
    
    if (!usuarioId) {
        alert("Debes iniciar sesión"); return;
    }
    
    try {
        const res = await fetch(`${API_URL}/tableros/`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ nombre, secreto, usuario_id: usuarioId })
        });
        if (res.ok) {
            alert('¡Tablero Creado!');
            document.getElementById('form-crear-tablero').reset();
            // Llevar a la pestaña de "Pines" (Tablero)
            document.getElementById('nav-pines').checked = true; 
        } else {
            alert('Error al crear tablero');
        }
    } catch(e) { console.error(e); }
}

async function cargarNotificaciones() {
    const contenedor = document.getElementById('lista-notificaciones');
    if(!contenedor) return;
    const usuarioId = localStorage.getItem('usuario_id');
    if(!usuarioId) {
        contenedor.innerHTML = '<p style="text-align:center; padding:20px; color:#8892a0;">Inicia sesión para ver tus notificaciones.</p>';
        return;
    }
    
    try {
        const res = await fetch(`${API_URL}/usuarios/${usuarioId}/notificaciones/`);
        const notifs = await res.json();
        
        contenedor.innerHTML = '';
        if(notifs.length === 0) {
            contenedor.innerHTML = '<p style="text-align:center; padding:20px; color:#8892a0;">No tienes notificaciones nuevas.</p>';
            return;
        }
        
        notifs.forEach(n => {
            contenedor.innerHTML += `
                <div class="notificacion ${n.leida ? '' : 'no-leida'}">
                    <div class="notif-avatar" style="background:var(--color-morado);">N</div>
                    <div class="notif-texto">${n.texto}</div>
                </div>
            `;
        });
    } catch(e) { console.error(e); }
}

async function cargarMensajes() {
    const contenedor = document.getElementById('lista-chats');
    if(!contenedor) return;
    const usuarioId = localStorage.getItem('usuario_id');
    if(!usuarioId) {
        contenedor.innerHTML = '<h3>Mensajes</h3><p style="padding:15px; color:#8892a0;">Inicia sesión.</p>';
        return;
    }
    
    try {
        const res = await fetch(`${API_URL}/mensajes/${usuarioId}`);
        const mensajes = await res.json();
        
        contenedor.innerHTML = '<h3>Mensajes</h3>';
        if(mensajes.length === 0) {
            contenedor.innerHTML += '<p style="padding:15px; color:#8892a0;">No tienes mensajes.</p>';
            return;
        }
        
        mensajes.forEach(m => {
            const elDestinatario = m.remitente_id == usuarioId ? m.destinatario_id : m.remitente_id;
            contenedor.innerHTML += `
                <div class="chat-item">
                    <div class="chat-avatar" style="background:var(--color-azul);">U</div>
                    <div class="chat-info">
                        <strong>@usuario_${elDestinatario}</strong>
                        <p>${m.texto}</p>
                    </div>
                </div>
            `;
        });
    } catch(e) { console.error(e); }
}

// --- Fin ---
