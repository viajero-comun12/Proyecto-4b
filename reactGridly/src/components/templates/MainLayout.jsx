import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../organismos/Header';
import Sidebar from '../organismos/Sidebar';

const MainLayout = ({ children }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    
    return (
        <>
            <Header toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
            
            <div className="app-container">
                <Sidebar isOpen={isSidebarOpen} />
                
                <main className="contenido-principal">
                    {children ? children : <Outlet />}
                </main>
            </div>
        </>
    );
};
export default MainLayout;