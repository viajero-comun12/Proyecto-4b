import React, { useState } from 'react';
import Header from '../organismos/Header';
import Sidebar from '../organismos/Sidebar';

const MainLayout = ({ children }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    
    return (
        <>
            <Header toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
            
            <div className="app-container">
                <Sidebar isOpen={isSidebarOpen} />
                
                <main className="contenido-principal">
                    {children}
                </main>
            </div>
        </>
    );
};
export default MainLayout;