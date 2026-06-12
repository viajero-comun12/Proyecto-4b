import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router>
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