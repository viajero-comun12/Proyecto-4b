import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ExplorarPage from './pages/ExplorarPage';
import NotificacionesPage from './pages/NotificacionesPage';
import UsuarioPage from './pages/UsuarioPage';
import CrearPublicacionPage from './pages/CrearPublicacionPage';
import SeguidosPage from './pages/SeguidosPage';
import TablerosPage from './pages/TablerosPage';
import DetallePage from './pages/DetallePage';
import MensajeriaPage from './pages/MensajeriaPage';
import PinesPage from './pages/PinesPage';
import MainLayout from './components/templates/MainLayout';

const pageTitles = {
  '/': 'Inicio - Gridly',
  '/login': 'Iniciar Sesión - Gridly',
  '/register': 'Registrarse - Gridly',
  '/explorar': 'Explorar - Gridly',
  '/notificaciones': 'Notificaciones - Gridly',
  '/usuario': 'Mi Perfil - Gridly',
  '/publicacion': 'Crear Publicación - Gridly',
  '/seguidos': 'Seguidos - Gridly',
  '/tableros': 'Tableros - Gridly',
  '/mensajes': 'Mensajes - Gridly',
  '/pines': 'Mis Pines - Gridly',
};

const TitleUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (pageTitles[path]) {
      document.title = pageTitles[path];
    } else if (path.startsWith('/detalle/')) {
      document.title = 'Detalle - Gridly';
    } else if (path.startsWith('/usuario/')) {
      document.title = 'Perfil - Gridly';
    } else {
      document.title = 'Gridly';
    }
  }, [location]);

  return null;
};

function App() {
  return (
    <Router>
      <TitleUpdater />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route element={<MainLayout />}>
          <Route path="/explorar" element={<ExplorarPage />} />
          <Route path="/notificaciones" element={<NotificacionesPage />} />
          <Route path="/usuario" element={<UsuarioPage />} />
          <Route path="/usuario/:id" element={<UsuarioPage />} />
          <Route path="/publicacion" element={<CrearPublicacionPage />} />
          <Route path="/seguidos" element={<SeguidosPage />} />
          <Route path="/tableros" element={<TablerosPage />} />
          <Route path="/detalle/:id" element={<DetallePage />} />
          <Route path="/mensajes" element={<MensajeriaPage />} />
          <Route path="/pines" element={<PinesPage />} />
          <Route path="/" element={<HomePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;