import React, { useState } from 'react';
import EventPage from './pages/EventPage'; 
import EventDetailPage from './pages/EventDetailPage'; 

// 1. Importe seus eventos do novo arquivo!
import mockEventsData from './components/EventsData'; 
// (A lista gigante de eventos saiu daqui)

function App() {
    // O resto do código continua exatamente igual
    const [currentView, setCurrentView] = useState('list');
    const [selectedEventId, setSelectedEventId] = useState(null);

    const handleGoToDetails = (eventId) => {
        setSelectedEventId(eventId);
        setCurrentView('details');
        window.scrollTo(0, 0);
    };

    const handleGoBackToList = () => {
        setSelectedEventId(null);
        setCurrentView('list');
    };

    if (currentView === 'list') {
        return (
            <EventPage 
                // 2. Passe os eventos importados para a página
                events={mockEventsData} 
                onEventClick={handleGoToDetails} 
            />
        );
    }

    if (currentView === 'details') {
        // 3. A lógica de busca continua funcionando
        const event = mockEventsData.find(e => e.id === selectedEventId);
        
        return (
            <EventDetailPage 
                event={event} 
                onBack={handleGoBackToList} 
            />
        );
    }
}

export default App;