const API_URL = 'http://localhost:8000';

// Función para manejar el login
async function login(event) {
    event.preventDefault();
    
    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;

    const btn = event.target.querySelector('button');
    btn.innerText = 'Cargando...';
    btn.disabled = true;

    try {
        const response = await fetch(`${API_URL}/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: usernameInput, 
                password: passwordInput
            })
        });

        if (response.ok) {
            const data = await response.json();
            // Guardar en sesión
            localStorage.setItem('usuario_id', data.usuario_id);
            localStorage.setItem('username', data.username);
            
            alert('¡Login Exitoso!');
            window.location.href = 'index.html';
        } else {
            const error = await response.json();
            alert(`Error: ${error.detail || 'Credenciales incorrectas'}`);
        }
    } catch (error) {
        console.error(error);
        alert('Error de conexión');
    } finally {
        btn.innerText = 'Iniciar Sesión';
        btn.disabled = false;
    }
}

// Función para manejar el registro
async function register(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const btn = event.target.querySelector('button');
    btn.innerText = 'Creando cuenta...';
    btn.disabled = true;

    try {
        const response = await fetch(`${API_URL}/usuarios/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: nombre, // El backend pide username
                email: email,
                password: password
            })
        });

        if (response.ok) {
            const data = await response.json();
            // Guardar en sesión para autologin
            localStorage.setItem('usuario_id', data.id);
            localStorage.setItem('username', data.username);
            
            alert('¡Registro Exitoso! Ya puedes empezar a subir imágenes.');
            window.location.href = 'index.html';
        } else {
            const error = await response.json();
            alert(`Error: ${error.detail || 'No se pudo registrar'}`);
        }
    } catch (error) {
        console.error(error);
        alert('Error de conexión');
    } finally {
        btn.innerText = 'Registrarse';
        btn.disabled = false;
    }
}

// Función para cerrar sesión
function logout(event) {
    if(event) event.preventDefault();
    localStorage.removeItem('usuario_id');
    localStorage.removeItem('username');
    window.location.href = 'login.html';
}

// Configurar forms si estamos en las páginas
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.onsubmit = login;
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.onsubmit = register;
    }

    // Botones de cerrar sesión
    const btnLogout = document.querySelector('a[href="login.html"]');
    if (btnLogout && btnLogout.innerText.includes('Cerrar')) {
        btnLogout.onclick = logout;
    }
});
