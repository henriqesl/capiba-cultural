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

import { AuthContext } from './context/AuthContext'; 

const App = () => {
    const { authenticated, loading: authLoading } = useContext(AuthContext); 
    const [currentPath, setCurrentPath] = useState(window.location.hash || '#/eventos');
    
    // Dados locais para teste (Caravanas)
    const [caravanas, setCaravanas] = useState([
        { id: 1, nome: "Caravana do Rock", evento: "Show de Rock Nacional", data: "15/11", local: "Allianz Parque", link: "app.com/c/rock", membrosCount: 15, souDono: true },
        { id: 2, nome: "Busão do Jazz", evento: "Festival de Jazz", data: "20/11", local: "Parque Ibirapuera", link: "app.com/c/jazz", membrosCount: 42, souDono: false },
    ]);

    const handleCreateCaravana = (newCaravana) => {
        const newId = caravanas.length > 0 ? Math.max(...caravanas.map(c => c.id)) + 1 : 1;
        const caravanaCompleta = { id: newId, ...newCaravana, membrosCount: 1, souDono: true };
        setCaravanas([caravanaCompleta, ...caravanas]);
        window.location.hash = '#/perfil/caravana'; 
    };

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

    if (authLoading) return <div className="text-center p-20">Carregando...</div>;

    if (!authenticated && mainRoute !== 'login' && mainRoute !== 'registrar') { 
        window.location.hash = '#/login';
        return <LoginPage />;
    }

    const renderPage = () => {
        if (mainRoute === 'registrar') return <RegisterPage />;
        if (mainRoute === 'login') return <LoginPage />;
        
        // --- ROTAS AUTENTICADAS ---

        if (mainRoute === 'ranking') {
            const competitionId = routeParts[1];
            return <RankingPage competitionId={competitionId} />;
        }

        if (mainRoute === 'perfil') {
            const subRoute = routeParts[1];
            if (subRoute === 'ranking') return <RankingPage />;
            if (subRoute === 'editar') return <ProfilePage />;
            if (subRoute === 'caravana') {
                const action = routeParts[2];
                if (action === 'criar') return <CreateCaravanaPage onBack={() => window.location.hash = '#/perfil/caravana'} onCreate={handleCreateCaravana} />;
                if (action === 'detalhes') {
                    const cId = parseInt(routeParts[3]);
                    const carav = caravanas.find(c => c.id === cId);
                    return <CaravanaDetailsPage caravana={carav} onBack={() => window.location.hash = '#/perfil/caravana'} />;
                }
                return <CaravanaPage caravanas={caravanas} />;
            }
            return <UserPage />; 
        }

        // 🚨 CORREÇÃO DA ROTA DE EVENTOS
        if (mainRoute === 'eventos' && routeParts.length > 1) {
            const eventId = parseInt(routeParts[1]); 
            
            // Passamos o ID para a página de detalhes. 
            // Ela mesma deve buscar os dados se 'event' for undefined.
            return (
                <EventDetailPage 
                    eventId={eventId} 
                    onBack={() => window.location.hash = '#/eventos'} 
                />
            );
        }

        switch (mainRoute) {
            case 'eventos': return <EventPage />; 
            case 'capiba': return <CheckInPage />;
            case 'status':  return <StatusPage />;
            default: return <EventPage />;
        }
    };

    const useMainLayout = mainRoute !== 'login' && mainRoute !== 'registrar'; 

    return useMainLayout ? <MainLayout currentPath={currentPath}>{renderPage()}</MainLayout> : renderPage();
};

export default App;