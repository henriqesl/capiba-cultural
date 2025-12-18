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
import AdminPage from './pages/AdminPage.jsx'; // 🟢 Nova importação
import HomePage from './pages/home/HomePage.jsx';
import { AuthContext } from './context/AuthContext'; 

const App = () => {
    const { authenticated, loading: authLoading } = useContext(AuthContext); 
    const [currentPath, setCurrentPath] = useState(window.location.hash || '#/home');

    // Listener para mudanças de rota via Hash
    useEffect(() => {
        const handleHashChange = () => setCurrentPath(window.location.hash || '#/home');
        window.addEventListener('hashchange', handleHashChange);
        window.addEventListener('load', handleHashChange); 
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
            window.removeEventListener('load', handleHashChange);
        };
    }, []); 

    // Tratamento de Strings de Rota
    const route = currentPath.replace('#/', '').replace('#', '');
    const routeParts = route.split('/');
    const mainRoute = routeParts[0];   // Ex: 'perfil', 'admin'
    const subRoute = routeParts[1];    // Ex: 'caravana'
    const actionRoute = routeParts[2]; // Ex: 'novo' ou ID

    // Tela de Loading Inicial
    if (authLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-white">
                <div className="text-center font-bold text-blue-600 animate-pulse tracking-widest uppercase">
                    Carregando Capiba...
                </div>
            </div>
        );
    }

    // Proteção de Rota (Redirect para Login)
    if (!authenticated && mainRoute !== 'login' && mainRoute !== 'registrar') { 
        window.location.hash = '#/login';
        return <LoginPage />;
    }

    const renderPage = () => {
        // 1. Rotas Públicas/Auth
        if (mainRoute === 'registrar') return <RegisterPage />;
        if (mainRoute === 'login') return <LoginPage />;
        
        // 🟢 2. Rota Admin
        if (mainRoute === 'admin') {
            return <AdminPage />;
        }

        // 3. Rotas de Detalhes de Lugares e Eventos
        if (mainRoute === 'locais' && subRoute) {
            return <PlaceDetailPage placeId={subRoute} onBack={() => window.location.hash = '#/home'} />;
        }
        if (mainRoute === 'eventos' && subRoute) {
            return <EventDetailPage eventId={subRoute} onBack={() => window.location.hash = '#/home'} />;
        }

        // 4. HIERARQUIA DO PERFIL
        if (mainRoute === 'perfil') {
            if (subRoute === 'ranking') return <RankingPage />;
            if (subRoute === 'editar') return <ProfilePage />;
            if (subRoute === 'caravana') {
                if (actionRoute === 'novo') return <CreateCaravanaPage />;
                if (actionRoute) return <CaravanaDetailsPage caravanaId={actionRoute} />;
                return <CaravanaPage />; 
            }
            return <UserPage />;
        }

        // 5. Outras Rotas do Menu Principal
        if (mainRoute === 'ranking') return <RankingPage />;
        if (mainRoute === 'capiba') return <CheckInPage />;
        if (mainRoute === 'status') return <StatusPage />;

        if (mainRoute === 'home') return <HomePage />;

        // Rota Default (Dashboard/Mapa)
        return <HomePage />;
    };

    const useMainLayout = mainRoute !== 'login' && mainRoute !== 'registrar'; 

    return useMainLayout ? (
        <MainLayout currentPath={currentPath}>
            <div className="animate-in fade-in duration-500">
                {renderPage()}
            </div>
        </MainLayout>
    ) : (
        renderPage()
    );
};

export default App;