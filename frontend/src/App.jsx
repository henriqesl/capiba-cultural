import React, { useState, useEffect, useContext } from 'react'; // << Adicionei useContext
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
import RegisterPage from './pages/RegisterPage'; 

// Importações das páginas de Caravana
import CaravanaPage from './pages/user/CaravanaPage.jsx';
import CaravanaDetailsPage from './pages/user/CaravanaDetailsPage.jsx';
import CreateCaravanaPage from './pages/user/CreateCaravanaPage.jsx';

// << NOVO: Importe o AuthContext para que useContext funcione
import { AuthContext, AuthProvider } from './context/AuthContext'; 

import LogoCapiba from './assets/logo_capiba.png';


const App = () => {
    // Adicione a desestruturação do contexto de autenticação
    const { authenticated, loading: authLoading, user } = useContext(AuthContext); 
    const [currentPath, setCurrentPath] = useState(window.location.hash || '#/eventos');

    // --- 1. ESTADO GLOBAL DAS CARAVANAS ---
    const [caravanas, setCaravanas] = useState([
        { id: 1, nome: "Caravana do Rock", evento: "Show de Rock Nacional", data: "15/11", local: "Allianz Parque", link: "app.com/c/rock", membrosCount: 15, souDono: true },
        { id: 2, nome: "Busão do Jazz", evento: "Festival de Jazz", data: "20/11", local: "Parque Ibirapuera", link: "app.com/c/jazz", membrosCount: 42, souDono: false },
        { id: 3, nome: "Van Cultural", evento: "Peça 'Auto da Compadecida'", data: "05/12", local: "Teatro Municipal", link: "app.com/c/teatro", membrosCount: 4, souDono: false },
    ]);

    // Função para criar nova caravana
    const handleCreateCaravana = (newCaravana) => {
        const newId = caravanas.length > 0 ? Math.max(...caravanas.map(c => c.id)) + 1 : 1;
        
        const caravanaCompleta = {
            id: newId,
            ...newCaravana,
            membrosCount: 1, 
            souDono: true 
        };

        setCaravanas([caravanaCompleta, ...caravanas]);
        window.location.hash = '#/perfil/caravana'; 
    };
    // -------------------------------------

    useEffect(() => {
        const handleHashChange = () => setCurrentPath(window.location.hash || '#/eventos');
        window.addEventListener('hashchange', handleHashChange);
        window.addEventListener('load', handleHashChange); // Adicionado 'load' para consistência
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
            window.removeEventListener('load', handleHashChange);
        };
    }, []); 

    // Calcula a ROTA LIMPA
    const route = currentPath.startsWith('#/') ? currentPath.slice(2) : currentPath.startsWith('/') ? currentPath.slice(1) : currentPath;
    const routeParts = route.split('/');
    const mainRoute = routeParts[0];

    // --- LÓGICA DE AUTENTICAÇÃO (Adicionada) ---
    if (authLoading) {
        return <div className="text-center p-20 text-xl">Carregando autenticação...</div>;
    }

    if (!authenticated && mainRoute !== 'login' && mainRoute !== '') {
        window.location.hash = '#/login';
        return <LoginPage />;
    }
    // ------------------------------------------

    const renderPage = () => {
        
        // Rota: Login (Prioridade)
        if (mainRoute === 'login' || mainRoute === '') {
           // Se o usuário está na rota /login, o parâmetro da sub-rota pode ser 'criar'
            const subRoute = routeParts[1];

            // 🔑 Nova Rota: #/login/criar (Se você usar o link do botão)
            if (subRoute === 'criar') {
                 return <RegisterPage />;
            }
            
            // Retorna o LoginPage padrão se não houver sub-rota ou se for #/login
            return <LoginPage />;
        }
        
        // --- ROTAS ANINHADAS DE PERFIL (Caravana e Ranking) ---
        
        if (mainRoute === 'perfil') {
            const subRoute = routeParts[1];
            
            if (subRoute === 'ranking') {
                return <RankingPage />;
            }
            
            if (subRoute === 'editar') {
              return <ProfilePage user={user} />;
            }

            if (subRoute === 'caravana') {
                const caravanaAction = routeParts[2];
                const caravanaIdParam = routeParts[3];

                if (caravanaAction === 'criar') {
                    return (
                        <CreateCaravanaPage 
                            onBack={() => window.location.hash = '#/perfil/caravana'}
                            onCreate={handleCreateCaravana}
                        />
                    );
                }
                // Detalhes da Caravana: #/perfil/caravana/detalhes/123
                if (caravanaAction === 'detalhes' && caravanaIdParam) {
                    const caravanaId = parseInt(caravanaIdParam);
                    const caravanaEncontrada = caravanas.find(c => c.id === caravanaId);
                    return (
                        <CaravanaDetailsPage 
                            caravana={caravanaEncontrada}
                            onBack={() => window.location.hash = '#/perfil/caravana'} 
                        />
                    );
                }
                // Listagem de Caravanas: #/perfil/caravana
                return <CaravanaPage caravanas={caravanas} />;
            }
            
            // Rota: Perfil Base (Se não for sub-rota específica)
            return <UserPage user = {user}/>; 
        }


        // --- Rota: Detalhes de Evento (ex: #/eventos/1)
        if (mainRoute === 'eventos' && routeParts.length > 1) {
            const eventId = parseInt(routeParts[1]); // ID é o segundo item da URL
            const event = EventsData.find(e => e.id === eventId);
            return <EventDetailPage event={event} onBack={() => window.location.hash = '#/eventos'} />;
        }
        
        // --- Roteamento Principal (Rotas de Nível Superior) ---

        switch (mainRoute) {
            case 'eventos': return <EventPage />;
            case 'capiba': return <CheckInPage />; // Antiga rota '#/capiba'
            case 'status':  return <StatusPage />;
            // As rotas 'perfil', 'ranking', 'perfil/editar', 'perfil/caravana' foram tratadas acima
            default: return <EventPage />;
        }
    };

    // Use MainLayout se não estiver na rota de login ou rota vazia
    const useMainLayout = mainRoute !== 'login' && mainRoute !== '';

    return (
        <>
            {useMainLayout ? (
                <MainLayout currentPath={route}>
                    {renderPage()}
                </MainLayout>
            ) : (
                renderPage()
            )}
        </>
    );
};

export default App;