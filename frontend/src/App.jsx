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

// Importações das páginas de Caravana
import CaravanaPage from './pages/user/CaravanaPage.jsx';
import CaravanaDetailsPage from './pages/user/CaravanaDetailsPage.jsx';
import CreateCaravanaPage from './pages/user/CreateCaravanaPage.jsx'; // Nova página

const App = () => {
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#/eventos');

  // --- 1. ESTADO GLOBAL DAS CARAVANAS ---
  // (Iniciamos com os dados mockados aqui no App)
  const [caravanas, setCaravanas] = useState([
    { 
      id: 1, 
      nome: "Caravana do Rock", 
      evento: "Show de Rock Nacional", 
      data: "15/11", 
      local: "Allianz Parque", 
      link: "app.com/c/rock", 
      membrosCount: 15,
      souDono: true 
    },
    { 
      id: 2, 
      nome: "Busão do Jazz", 
      evento: "Festival de Jazz", 
      data: "20/11", 
      local: "Parque Ibirapuera", 
      link: "app.com/c/jazz", 
      membrosCount: 42,
      souDono: false 
    },
    { 
      id: 3, 
      nome: "Van Cultural", 
      evento: "Peça 'Auto da Compadecida'", 
      data: "05/12", 
      local: "Teatro Municipal", 
      link: "app.com/c/teatro", 
      membrosCount: 4,
      souDono: false 
    },
  ]);

  // Função para criar nova caravana
  const handleCreateCaravana = (newCaravana) => {
    // Cria um ID simples (pega o ultimo ID + 1)
    const newId = caravanas.length > 0 ? Math.max(...caravanas.map(c => c.id)) + 1 : 1;
    
    const caravanaCompleta = {
      id: newId,
      ...newCaravana,
      membrosCount: 1, // Começa com você
      souDono: true    // Você criou
    };

    setCaravanas([caravanaCompleta, ...caravanas]); // Adiciona no topo da lista
    window.location.hash = '#/perfil/caravana'; // Redireciona para a lista
  };
  // -------------------------------------

  useEffect(() => {
    const handleHashChange = () => setCurrentPath(window.location.hash || '#/eventos');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []); 

  const renderPage = () => {
    // Rota: Detalhes de Evento
    if (currentPath.startsWith('#/evento/')) {
      const eventId = parseInt(currentPath.split('/')[2]);
      const event = EventsData.find(e => e.id === eventId);
      return <EventDetailPage event={event} onBack={() => window.location.hash = '#/eventos'} />;
    }

    // Rota: Detalhes da Caravana
    // Agora buscamos a caravana no estado `caravanas` em vez de usar mocks internos
    if (currentPath.startsWith('#/perfil/caravana/') && currentPath.split('/').length > 3) {
      const urlId = currentPath.split('/')[3];
      
      // Verifica se é a rota de CRIAR antes de tentar achar ID
      if (urlId === 'criar') {
        return (
          <CreateCaravanaPage 
            onBack={() => window.location.hash = '#/perfil/caravana'}
            onCreate={handleCreateCaravana}
          />
        );
      }

      // Se não for criar, é um ID numérico
      const caravanaId = parseInt(urlId);
      const caravanaEncontrada = caravanas.find(c => c.id === caravanaId);
      
      return (
        <CaravanaDetailsPage 
          caravana={caravanaEncontrada} // Passamos o objeto inteiro
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
      
      // Rota: Listagem de Caravanas
      // Passamos a lista do estado para a página
      case '#/perfil/caravana': return <CaravanaPage caravanas={caravanas} />;
      
      case '#/login': return <LoginPage />;
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