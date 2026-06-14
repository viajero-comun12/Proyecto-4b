import { SiHomebridge } from "react-icons/si";
import { MdOutlineTravelExplore, MdPublish } from "react-icons/md";
import { FaTableCellsLarge } from "react-icons/fa6";
import { GoPin } from "react-icons/go";
import SidebarMenuItem from '../moleculas/SidebarMenuItem';

const Sidebar = ({ isOpen }) => {
  return (
    <aside className={`bg-beige border-r border-beige-dark/20 sticky top-[60px] self-stretch z-[998] transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'w-20 min-h-full' : 'w-0'}`}>
      <nav className={`flex flex-col items-center ${isOpen ? 'py-5' : 'p-0'}`}>
        <div className={`flex flex-col gap-7 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
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