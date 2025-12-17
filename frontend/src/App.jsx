import React, { useState, useEffect, useContext } from 'react';
import MainLayout from './components/layout/MainLayout.jsx';
import LoginPage from './pages/LoginPage';
import EventPage from './pages/event/EventPage';
import EventDetailPage from './pages/event/EventDetailPage.jsx';
import PlaceDetailPage from './pages/event/PlaceDetailPage.jsx'; 
import CheckInPage from './pages/CheckInPage.jsx';
import StatusPage from './pages/StatusPage.jsx';
import RegisterPage from './pages/RegisterPage'; 
import ProfilePage from './pages/user/ProfilePage.jsx';
import RankingPage from './pages/user/RankingPage.jsx';
import UserPage from './pages/user/UserPage.jsx';
import CaravanaPage from './pages/user/CaravanaPage.jsx';
import CaravanaDetailsPage from './pages/user/CaravanaDetailsPage.jsx';
import CreateCaravanaPage from './pages/user/CreateCaravanaPage.jsx';
import { AuthContext } from './context/AuthContext'; 

const App = () => {
    const { authenticated, loading: authLoading } = useContext(AuthContext); 
    const [currentPath, setCurrentPath] = useState(window.location.hash || '#/eventos');
    
    const [caravanas, setCaravanas] = useState([
        { id: 1, nome: "Caravana do Rock", evento: "Show de Rock Nacional", data: "15/11", local: "Allianz Parque", link: "app.com/c/rock", membrosCount: 15, souDono: true },
    ]);

    useEffect(() => {
        const handleHashChange = () => setCurrentPath(window.location.hash || '#/eventos');
        window.addEventListener('hashchange', handleHashChange);
        window.addEventListener('load', handleHashChange); 
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
            window.removeEventListener('load', handleHashChange);
        };
    }, []); 

    const route = currentPath.replace('#/', '').replace('#', '');
    const routeParts = route.split('/');
    const mainRoute = routeParts[0];

    if (authLoading) return <div className="text-center p-20 font-bold text-purple-600 uppercase tracking-widest">Carregando Capiba...</div>;

    if (!authenticated && mainRoute !== 'login' && mainRoute !== 'registrar') { 
        window.location.hash = '#/login';
        return <LoginPage />;
    }

    const renderPage = () => {
        if (mainRoute === 'registrar') return <RegisterPage />;
        if (mainRoute === 'login') return <LoginPage />;
        
        // --- ROTAS DE DETALHES (LOGICA DE DESVIO) ---

        // 1. Locais Oficiais (Seja vindo do Mapa ou da Lista de Spots)
        if (mainRoute === 'locais' && routeParts.length > 1) {
            const placeId = routeParts[1]; 
            const origin = routeParts[2]; // 'mapa' ou 'spots'
            return (
                <PlaceDetailPage 
                    placeId={placeId} 
                    onBack={() => window.location.hash = origin === 'spots' ? '#/capiba' : '#/eventos'} 
                />
            );
        }

        // 2. Eventos Comunitários
        if (mainRoute === 'eventos' && routeParts.length > 1) {
            const eventId = routeParts[1]; 
            return (
                <EventDetailPage 
                    eventId={eventId} 
                    onBack={() => window.location.hash = '#/eventos'} 
                />
            );
        }

        // --- OUTRAS ROTAS ---
        if (mainRoute === 'ranking') return <RankingPage />;
        if (mainRoute === 'perfil') return <UserPage />;
        if (mainRoute === 'capiba') return <CheckInPage />;
        if (mainRoute === 'status') return <StatusPage />;

        return <EventPage />; // Default
    };

    const useMainLayout = mainRoute !== 'login' && mainRoute !== 'registrar'; 

    return useMainLayout ? (
        <MainLayout currentPath={currentPath}>
            {renderPage()}
        </MainLayout>
    ) : renderPage();
};

export default App;