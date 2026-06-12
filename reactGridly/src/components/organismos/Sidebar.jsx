import { SiHomebridge } from "react-icons/si";
import { MdOutlineTravelExplore, MdPublish } from "react-icons/md";
import { FaTableCellsLarge } from "react-icons/fa6";
import { GoPin } from "react-icons/go";
import SidebarMenuItem from '../moleculas/SidebarMenuItem';

const Sidebar = ({ isOpen }) => {
  return (
    <aside className="sidebar-izq" style={{ backgroundColor: '#F6A700', width: isOpen ? '80px' : '0', overflow: 'hidden', transition: 'width 0.3s ease', height: 'auto', minHeight: '100%', position: 'sticky', top: '73px', alignSelf: 'stretch' }}>
      <nav className="menu-lateral" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: isOpen ? '20px 0' : '0' }}>
        <div className="grupo-menu" style={{ display: 'flex', flexDirection: 'column', gap: '30px', opacity: isOpen ? 1 : 0, transition: 'opacity 0.3s ease' }}>
          <SidebarMenuItem icon={SiHomebridge} label="Inicio" to="/" />
          <SidebarMenuItem icon={MdOutlineTravelExplore} label="Explorar" to="/explorar" />
          <SidebarMenuItem icon={FaTableCellsLarge} label="Tableros" to="/tableros" />
          <SidebarMenuItem icon={MdPublish} label="Subir Publicación" to="/publicacion" />
          <SidebarMenuItem icon={GoPin} label="Mis Pines" to="/pines" />
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;