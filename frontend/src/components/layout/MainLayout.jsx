import React from 'react';
import TopNav from './TopNav';
import BottomNav from './BottomNav';

// currentPath serve para 'informar' qual item marcar como ativo
const MainLayout = ({ children, currentPath }) => {
  return (
    <div className="w-full min-h-screen bg-gray-100">
      <TopNav currentPath={currentPath} />

      {/* 'children' será o conteúdo da página */}
      <main>
        {children}
      </main>

      <BottomNav currentPath={currentPath} />
    </div>
  );
};

export default MainLayout;