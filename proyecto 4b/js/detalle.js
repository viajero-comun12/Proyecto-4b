
document.addEventListener('DOMContentLoaded', () => {
    // Obtener el ID de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const pubId = urlParams.get('id');

    if (!pubId) {
        alert("Publicación no encontrada");
        window.location.href = 'index.html';
        return;
    }

    cargarDetalle(pubId);
});

async function cargarDetalle(id) {
    try {
        const respuesta = await fetch(`${API_URL}/publicaciones/${id}`);
        if (!respuesta.ok) {
            throw new Error('Publicación no encontrada');
        }
        
        const pub = await respuesta.json();
        
        // Actualizar la interfaz con los datos
        document.title = `${pub.titulo} | Gridly`;
        document.querySelector('.titulo-detalle').innerText = pub.titulo;
        document.querySelector('.descripcion-detalle').innerText = pub.descripcion || '';
        document.querySelector('.columna-imagen img').src = pub.url_multimedia;
        
        // Autor
        const username = pub.autor ? `@${pub.autor.username}` : `@usuario_${pub.usuario_id}`;
        document.querySelector('.autor-info strong').innerText = username;
        
        // Fecha
        const fecha = new Date(pub.fecha_creacion).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
        document.querySelector('.autor-info span').innerText = `Subido el ${fecha}`;
        
        // Limpiar comentarios de prueba y cargar los reales
        const contenedorComentarios = document.querySelector('.lista-comentarios');
        contenedorComentarios.innerHTML = '';
        
        document.querySelector('.comentarios h2').innerText = `Comentarios (${pub.comentarios.length})`;
        
        pub.comentarios.forEach(com => {
            const div = document.createElement('div');
            div.className = 'comentario';
            div.innerHTML = `
                <img src="img/avatar.png" alt="Usuario" class="avatar-comentario"
                     onerror="this.src='data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2236%22 height=%2236%22 viewBox=%220 0 36 36%22%3E%3Crect width=%2236%22 height=%2236%22 fill=%22%23ccc%22/%3E%3C/svg%3E';">
                <div class="comentario-texto">
                    <strong>${com.autor ? '@' + com.autor.username : '@usuario_' + com.usuario_id}</strong>
                    ${com.texto}
                </div>
            `;
            contenedorComentarios.appendChild(div);
        });
        
        // Configurar formulario de comentarios
        const inputComentario = document.querySelector('.input-comentario');
        inputComentario.onkeypress = (e) => {
            if (e.key === 'Enter') {
                enviarComentario(id, inputComentario.value);
            }
        };
        
    } catch (error) {
        console.error(error);
        alert("Ocurrió un error al cargar la publicación");
    }
}

async function enviarComentario(pubId, texto) {
    if (!texto.trim()) return;
    
    const usuarioId = localStorage.getItem('usuario_id');
    if (!usuarioId) {
        alert("Debes iniciar sesión para comentar");
        window.location.href = 'login.html';
        return;
    }
    
    try {
        const respuesta = await fetch(`${API_URL}/publicaciones/${pubId}/comentarios/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ texto: texto, usuario_id: usuarioId })
        });
        
        if (respuesta.ok) {
            document.querySelector('.input-comentario').value = '';
            cargarDetalle(pubId); // Recargar para ver el nuevo comentario
        } else {
            alert('Error al enviar el comentario');
        }
    } catch(error) {
        console.error(error);
        alert('Error de conexión');
    }
}
