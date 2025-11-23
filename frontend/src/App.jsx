import React, { useState, useEffect } from 'react';

// Layout
import MainLayout from './components/layout/MainLayout.jsx';

// Páginas
import LoginPage from './pages/LoginPage';
import EventPage from './pages/EventPage';
import ProfilePage from './pages/user/ProfilePage.jsx';
import RankingPage from './pages/user/RankingPage.jsx';
import UserPage from './pages/user/UserPage.jsx';
import EventDetailPage from './pages/EventDetailPage.jsx';
import EventsData from './components/EventsData.jsx';
import CheckInPage from './pages/CheckInPage.jsx';

// Componente de Roteamento
const App = () => {
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#/login');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash || '#/login');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []); 

  const renderPage = () => {
    if (currentPath.startsWith('#/evento/')) {
      const eventId = parseInt(currentPath.split('/')[2]);
      const event = EventsData.find(e => e.id === eventId);
      return <EventDetailPage event={event} />;
    }

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
      default:
        return <LoginPage />;
    }
  };

  // Define quais rotas usam o layout principal
  const useMainLayout = 
    currentPath.startsWith('#/eventos') || 
    currentPath.startsWith('#/perfil') || 
    currentPath.startsWith('#/ranking') ||
    currentPath.startsWith('#/evento/'); 

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

export default App;