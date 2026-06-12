import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../organismos/Header';
import Sidebar from '../organismos/Sidebar';

const MainLayout = ({ children }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    
    return (
        <>
            <Header toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
            
            <div className="flex flex-1 overflow-hidden w-full min-h-[calc(100vh-60px)]">
                <Sidebar isOpen={isSidebarOpen} />
                
                <main className="flex-1 overflow-y-auto p-5 md:p-8 bg-gradient-to-br from-surface to-beige-light/30 min-w-0">
                    {children ? children : <Outlet />}
                </main>
            </div>
        </>
    );
};
export default MainLayout;