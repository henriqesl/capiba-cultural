import React, { useState, useEffect } from 'react';
import MainLayout from './components/layout/MainLayout.jsx';
import LoginPage from './pages/LoginPage';
import EventPage from './pages/event/EventPage';
import ProfilePage from './pages/user/ProfilePage.jsx';
import RankingPage from './pages/user/RankingPage.jsx';
import UserPage from './pages/user/UserPage.jsx';
import EventDetailPage from './pages/event/EventDetailPage.jsx';
import EventsData from './components/event/EventsData.jsx';
import CheckInPage from './pages/CheckInPage.jsx';
import StatusPage from './pages/StatusPage.jsx';
import CaravanaPage from './pages/user/CaravanaPage.jsx';
// 1. Importar a nova página de detalhes
import CaravanaDetailsPage from './pages/user/CaravanaDetailsPage.jsx';

const App = () => {
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#/eventos');

  useEffect(() => {
    const handleHashChange = () => setCurrentPath(window.location.hash || '#/eventos');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []); 

  const renderPage = () => {
    // Rota Dinâmica para Eventos
    if (currentPath.startsWith('#/evento/')) {
      const eventId = parseInt(currentPath.split('/')[2]);
      const event = EventsData.find(e => e.id === eventId);
      return <EventDetailPage event={event} onBack={() => window.location.hash = '#/eventos'} />;
    }

    // 2. Rota Dinâmica para Detalhes da Caravana
    // Detecta se a URL começa com #/perfil/caravana/ E tem algo depois (o ID)
    if (currentPath.startsWith('#/perfil/caravana/') && currentPath.split('/').length > 3) {
      const caravanaId = parseInt(currentPath.split('/')[3]); // Pega o ID (ex: 1)
      return (
        <CaravanaDetailsPage 
          id={caravanaId} 
          onBack={() => window.location.hash = '#/perfil/caravana'} 
        />
      );
    }

    switch (currentPath) {
      case '#/eventos': return <EventPage />;
      case '#/capiba':  return <CheckInPage />;
      case '#/status':  return <StatusPage />;
      case '#/perfil':  return <UserPage />;
      case '#/perfil/editar': return <ProfilePage />;
      case '#/perfil/ranking': return <RankingPage />;
      // Esta rota cai na listagem geral de caravanas
      case '#/perfil/caravana': return <CaravanaPage />;
      case '#/login': return <LoginPage />; // Adicionei o return explícito aqui
      default: return <EventPage />;
    }
  };

  const useMainLayout = !['#/login'].includes(currentPath);

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