import React, { useState, useEffect } from 'react';

// Layout
import MainLayout from './components/layout/MainLayout.jsx';

// Páginas
import LoginPage from './pages/LoginPage';
import EventPage from './pages/event/EventPage';
import ProfilePage from './pages/user/ProfilePage.jsx';
import RankingPage from './pages/user/RankingPage.jsx';
import UserPage from './pages/user/UserPage.jsx';
import EventDetailPage from './pages/event/EventDetailPage.jsx';
import EventsData from './components/event/EventsData.jsx';
import CheckInPage from './pages/CheckInPage.jsx';
import StatusPage from './pages/StatusPage.jsx';
import CaravanaPage from './pages/user/CaravanaPage.jsx'

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
      return <EventDetailPage event={event} onBack={() => window.location.hash = '#/eventos'} />;
    }

    switch (currentPath) {
      case '#/eventos':
        return <EventPage />;
      case '#/capiba':
        return <CheckInPage />;
      case '#/status':
        return <StatusPage />;
      case '#/perfil':
        return <UserPage />;
      case '#/perfil/editar':
        return <ProfilePage />;
      case '#/perfil/ranking':
        return <RankingPage />;
      case '#/perfil/caravana':
        return <CaravanaPage />;
      case '#/login':
      default:
        return <LoginPage />;
    }
  };

  // Define quais rotas usam o layout principal
  const useMainLayout = 
    currentPath.startsWith('#/eventos') || 
    currentPath.startsWith('#/evento/') ||
    currentPath.startsWith('#/perfil') || 
    currentPath.startsWith('#/capiba') ||
    currentPath.startsWith('#/status');

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