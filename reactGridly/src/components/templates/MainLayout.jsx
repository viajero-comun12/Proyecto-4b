import React from 'react';
import Header from '../organismos/Header';
import Sidebar from '../organismos/Sidebar';

const MainLayout = ({ children }) => {
    return (
        <>
            <Header />
            <div className="app-container">
                <main className="contenido-principal">
                    {children}
                </main>
            </div>
        </>
    );
};
export default MainLayout;