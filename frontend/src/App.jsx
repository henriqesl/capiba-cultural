import React, { useState, useEffect } from 'react';

// Layout
import MainLayout from './components/layout/MainLayout.jsx';

// Páginas
import LoginPage from './pages/LoginPage';
import EventPage from './pages/EventPage';
import ProfilePage from './pages/user/ProfilePage';
import RankingPage from './pages/user/RankingPage.jsx';
import UserPage from './pages/user/UserPage.jsx'; 

// Componente de Roteamento
const App = () => {
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#/login');

  useEffect(() => {
    // Função para atualizar o estado com base no hash
    const handleHashChange = () => {
      setCurrentPath(window.location.hash || '#/login');
    };

    // Ouve mudanças no hash
    window.addEventListener('hashchange', handleHashChange);

    // Limpa o listener ao desmontar
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []); 

  // Função para renderizar a página correta
  const renderPage = () => {
    switch (currentPath) {
      case '#/eventos':
        return <EventPage />;
      case '#/perfil':
        return <UserPage />; 
      case '#/perfil/editar':
        return <ProfilePage />;
      case '#/ranking':
        return <RankingPage />; 
      case '#/login':
        return <LoginPage />;
    }
  };

  // Define se a página atual deve ter o 'layout' 
  const useMainLayout = 
    currentPath.startsWith('#/eventos') || 
    currentPath.startsWith('#/perfil') || 
    currentPath.startsWith('#/ranking');

  // Renderiza a página com ou sem o MainLayout
  return (
    <>
      {useMainLayout ? (
        <MainLayout currentPath={currentPath}>
          {renderPage()}
        </MainLayout>
      ) : (
        renderPage()
      )}
    </>
  );
};

export default App