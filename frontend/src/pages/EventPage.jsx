import React from 'react';
import EventButton from '../components/EventButton';

const EventPage = () => {
    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 text-gray-800">
                Evento de Hoje
            </h1>
            
            <div className="
                grid grid-cols-1 md:grid-cols-2 gap-6
                max-w-6xl mx-auto"
            >
                <EventButton 
                    title="Show de Rock Nacional" 
                    time="20:00 - 23:00" 
                    location="Clube Metrópole" 
                />
                <EventButton 
                    title="Festival de Jazz & Blues" 
                    time="18:00 - 22:00" 
                    location="Pátio de São Pedro" 
                />
                <EventButton 
                    title="Peça Teatral 'O Auto da Compadecida'" 
                    time="19:30 - 21:00" 
                    location="Teatro de Santa Isabel" 
                />
                <EventButton 
                    title="Exposição de Arte Moderna" 
                    time="09:00 - 17:00" 
                    location="Instituto Ricardo Brennand" 
                />
                <EventButton 
                    title="Roda de Samba do Grupo Bom Gosto" 
                    time="14:00 - 17:00" 
                    location="Rua da Moeda" 
                />
                <EventButton 
                    title="Exposição de Arte Antiga" 
                    time="09:00 - 17:00" 
                    location="Instituto Francisco Brennand" 
                />
            </div>
        </div>
    );
}

export default EventPage;