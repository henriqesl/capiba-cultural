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

const App = () => {
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#/login');

  useEffect(() => {
    const handleHashChange = () => setCurrentPath(window.location.hash || '#/login');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []); 

  const renderPage = () => {
    if (currentPath.startsWith('#/evento/')) {
      const eventId = parseInt(currentPath.split('/')[2]);
      const event = EventsData.find(e => e.id === eventId);
      return <EventDetailPage event={event} onBack={() => window.location.hash = '#/eventos'} />;
    }

    switch (currentPath) {
      case '#/eventos': return <EventPage />;
      case '#/capiba':  return <CheckInPage />;
      case '#/status':  return <StatusPage />;
      case '#/perfil':  return <UserPage />;
      case '#/perfil/editar': return <ProfilePage />;
      case '#/perfil/ranking': return <RankingPage />;
      case '#/login':
      default: return <LoginPage />;
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

/*
  [NOTAS DE INTEGRAÇÃO]
  1. Segurança: Hoje o router deixa entrar em qualquer tela.
     Precisamos colocar um `if (!token) irParaLogin()` aqui dentro, senão o usuário vai ver a tela, 
     mas os dados não vão carregar (erro 401 do backend).
  
  2. Dados Iniciais: Ali onde busco `EventsData`, o ideal é fazer uma chamada 
     `GET /eventos` logo que o app abrir pra carregar o calendário real.
*/