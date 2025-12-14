import React, { useState, useEffect, useContext } from 'react';
import MainLayout from './components/layout/MainLayout.jsx';
import LoginPage from './pages/LoginPage';

import EventPage from './pages/event/EventPage';
import EventDetailPage from './pages/event/EventDetailPage.jsx';

import CheckInPage from './pages/CheckInPage.jsx';
import StatusPage from './pages/StatusPage.jsx';
import RegisterPage from './pages/RegisterPage'; 

import ProfilePage from './pages/user/ProfilePage.jsx';
import RankingPage from './pages/user/RankingPage.jsx';
import UserPage from './pages/user/UserPage.jsx';

import CaravanaPage from './pages/user/CaravanaPage.jsx';
import CaravanaDetailsPage from './pages/user/CaravanaDetailsPage.jsx';
import CreateCaravanaPage from './pages/user/CreateCaravanaPage.jsx';

import { AuthContext, AuthProvider } from './context/AuthContext'; 
import api from './services/api'; // 🚨 IMPORTANTE: Importe sua instância do Axios

import LogoCapiba from './assets/logo_capiba.png';

// 🚨 DADOS DE TESTE (MOCK DATA) PARA EVENTOS
// Este array é apenas para que as rotas de detalhe funcionem enquanto você não implementa a busca na API
// Você precisará substituir isso pela busca real da API no futuro.
const MOCK_EVENTS_DATA = [
    { id: 1, nome: "Show de Rock Nacional", data: "15/11/2023", local: "Allianz Parque", descricao: "Um show épico com as melhores bandas de rock nacional.", imagem: "https://via.placeholder.com/400x200?text=Rock+Show" },
    { id: 2, nome: "Festival de Jazz", data: "20/11/2023", local: "Parque Ibirapuera", descricao: "Noite de muito jazz e improviso no parque.", imagem: "https://via.placeholder.com/400x200?text=Jazz+Festival" },
    { id: 3, nome: "Peça 'Auto da Compadecida'", data: "05/12/2023", local: "Teatro Municipal", descricao: "Adaptação da clássica obra de Ariano Suassuna.", imagem: "https://via.placeholder.com/400x200?text=Teatro" },
    { id: 4, nome: "Campeonato de Skate", data: "10/01/2024", local: "Pista da Pompéia", descricao: "Venha ver os melhores skatistas em ação.", imagem: "https://via.placeholder.com/400x200?text=Skate" },
];


const App = () => {
    const { authenticated, loading: authLoading } = useContext(AuthContext); 
    const [currentPath, setCurrentPath] = useState(window.location.hash || '#/eventos');
    
    // 🚨 NOVO ESTADO PARA EVENTOS
    const [events, setEvents] = useState(MOCK_EVENTS_DATA); // Inicia com os dados de teste
    const [loadingEvents, setLoadingEvents] = useState(false); // Pode mudar para true se for carregar da API

    // ESTADO GLOBAL DAS CARAVANAS ---
    const [caravanas, setCaravanas] = useState([
        { id: 1, nome: "Caravana do Rock", evento: "Show de Rock Nacional", data: "15/11", local: "Allianz Parque", link: "app.com/c/rock", membrosCount: 15, souDono: true },
        { id: 2, nome: "Busão do Jazz", evento: "Festival de Jazz", data: "20/11", local: "Parque Ibirapuera", link: "app.com/c/jazz", membrosCount: 42, souDono: false },
        { id: 3, nome: "Van Cultural", evento: "Peça 'Auto da Compadecida'", data: "05/12", local: "Teatro Municipal", link: "app.com/c/teatro", membrosCount: 4, souDono: false },
    ]);

    // função para criar nova caravana
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

    // 🚨 NOVO: useEffect para carregar eventos da API (opcional, pode ser movido para EventPage)
    // Se você quiser que todos os eventos estejam disponíveis globalmente no App.jsx:
    /*
    useEffect(() => {
        const fetchEvents = async () => {
            setLoadingEvents(true);
            try {
                const response = await api.get('/eventos'); // Sua rota para listar eventos
                setEvents(response.data);
            } catch (error) {
                console.error("Erro ao carregar eventos da API:", error);
                // Opcional: Manter MOCK_EVENTS_DATA se a API falhar
                setEvents(MOCK_EVENTS_DATA); 
            } finally {
                setLoadingEvents(false);
            }
        };

        // Somente carrega se o usuário estiver autenticado e não estiver na tela de login/registro
        if (authenticated && (currentPath !== '#/login' && currentPath !== '#/login/criar')) {
             fetchEvents();
        }
    }, [authenticated, currentPath]); // Depende da autenticação e da rota
    */

    // useEffect para lidar com mudanças de hash
    useEffect(() => {
        const handleHashChange = () => setCurrentPath(window.location.hash || '#/eventos');
        window.addEventListener('hashchange', handleHashChange);
        window.addEventListener('load', handleHashChange); 
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
            window.removeEventListener('load', handleHashChange);
        };
    }, []); 

    // Calcula a ROTA LIMPA
    const route = currentPath.startsWith('#/') ? currentPath.slice(2) : currentPath.startsWith('/') ? currentPath.slice(1) : currentPath;
    const routeParts = route.split('/');
    const mainRoute = routeParts[0];

    // --- LÓGICA DE AUTENTICAÇÃO ---
    if (authLoading) {
        return <div className="text-center p-20 text-xl">Carregando autenticação...</div>;
    }

    if (!authenticated && mainRoute !== 'login' && mainRoute !== 'registrar') { // 🚨 Adicionado 'registrar'
        window.location.hash = '#/login';
        return <LoginPage />;
    }
    // ------------------------------------------

    const renderPage = () => {
        
        // rota: login ou vazia (prioridade para não autenticados)
        if (mainRoute === 'login' || mainRoute === '') {
           const subRoute = routeParts[1];

            // 🔑 Nova Rota: #/login/criar ou #/registrar (se você usar o link do botão)
            if (subRoute === 'criar' || mainRoute === 'registrar') { // 🚨 Ajuste na condição
                return <RegisterPage />;
            }
            
            // Retorna o LoginPage padrão se não houver sub-rota ou se for #/login
            return <LoginPage />;
        }
        
        // --- ROTAS AUTENTICADAS (ABAixo desta linha o usuário é considerado autenticado) ---

        if (mainRoute === 'perfil') {
            const subRoute = routeParts[1];
            
            if (subRoute === 'ranking') {
                return <RankingPage />;
            }
            
            if (subRoute === 'editar') {
                return <ProfilePage />;
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
                // detalhes da Caravana: #/perfil/caravana/detalhes/123
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
                // listagem de Caravanas: #/perfil/caravana
                return <CaravanaPage caravanas={caravanas} />;
            }
            
            return <UserPage />; 
        }

        // 🚨 Rota: detalhes de Evento (ex: #/eventos/1) - CORRIGIDO PARA USAR 'events'
        if (mainRoute === 'eventos' && routeParts.length > 1) {
            const eventId = parseInt(routeParts[1]); 
            const event = events.find(e => e.id === eventId); // 🚨 Agora usa o estado 'events'
            
            if (!event) {
                // Pode retornar uma página de "não encontrado" ou redirecionar
                return <div className="text-center p-4">Evento não encontrado ou ainda carregando.</div>;
            }
            return <EventDetailPage event={event} onBack={() => window.location.hash = '#/eventos'} />;
        }

        switch (mainRoute) {
            case 'eventos': return <EventPage />; // Passa 'events' e 'loadingEvents' se EventPage precisar
            case 'capiba': return <CheckInPage />;
            case 'status':  return <StatusPage />;
            case 'registrar': return <RegisterPage />; // Caso o usuário acesse diretamente #/registrar
            default: return <EventPage />;
        }
    };

    // Use MainLayout se não estiver na rota de login ou rota vazia
    const useMainLayout = mainRoute !== 'login' && mainRoute !== 'registrar' && mainRoute !== ''; // 🚨 Adicionado 'registrar'

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