import React, { useState, useEffect } from 'react';
import Button from '../../components/Button';
import Calendar from '../../components/event/Calendar';
import EventsData from '../../components/event/EventsData';

// --- Componente de Carrossel (Interno para simplificar) ---
const FeaturedCarousel = ({ events }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    // Troca automática de slide a cada 5 segundos
    useEffect(() => {
        if (!events || events.length === 0) return;
        const interval = setInterval(() => {
            setActiveIndex((current) => (current === events.length - 1 ? 0 : current + 1));
        }, 5000);
        return () => clearInterval(interval);
    }, [events]);

    if (!events || events.length === 0) return null;

    const currentEvent = events[activeIndex];

    // URL da imagem (usa placeholder se não existir 'image' no objeto do evento)
    const imageUrl = currentEvent.image || `https://placehold.co/800x400/2563eb/ffffff?text=${encodeURIComponent(currentEvent.title)}`;

    return (
        <div className="w-full max-w-6xl mx-auto mb-10 px-4 sm:px-0">
            <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
                Destaques da Semana
            </h2>
            
            <div className="relative w-full h-64 sm:h-80 bg-gray-900 rounded-2xl shadow-xl overflow-hidden group">
                
                {/* === IMAGEM DE FUNDO === */}
                <img 
                    src={imageUrl} 
                    alt={currentEvent.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* === OVERLAY ESCURO (Para o texto ficar legível) === */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                
                {/* Conteúdo do Slide */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 relative z-10">
                    <h3 className="text-3xl sm:text-4xl font-bold text-white mb-2 leading-tight drop-shadow-lg">
                        {currentEvent.title}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center text-gray-200 text-sm sm:text-base gap-1 sm:gap-4 font-medium drop-shadow-md">
                        <span>🗓️ {currentEvent.time}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>📍 {currentEvent.location}</span>
                    </div>
                    
                    {/* Botão de Ação no Slide */}
                    <a 
                        href={`#/evento/${currentEvent.id}`}
                        className="mt-4 bg-white text-blue-900 font-bold py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors w-fit shadow-lg"
                    >
                        Ver Detalhes
                    </a>
                </div>

                {/* Indicadores (Bolinhas) */}
                <div className="absolute bottom-4 right-4 flex gap-2 z-20">
                    {events.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className={`h-2 rounded-full transition-all duration-300 shadow-sm ${
                                index === activeIndex ? 'bg-yellow-400 w-8' : 'bg-white/50 w-2 hover:bg-white'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- Página Principal ---
const EventPage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const formatDate = (date) => {
        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    // Filtra eventos (Simulação: Pega os 3 primeiros como destaque)
    const featuredEvents = EventsData.slice(0, 3);
    
    // Lista completa de eventos para o grid abaixo
    const listEvents = EventsData; 

    return (
        <div className="bg-gray-100 min-h-screen pb-24 md:pb-12">
            
            {/* Header / Espaçamento Topo */}
            <div className="pt-8 pb-4">
                {/* 1. Slides Automáticos (Destaques com Imagem) */}
                <FeaturedCarousel events={featuredEvents} />
            </div>

            {/* Divisória visual suave */}
            <div className="max-w-6xl mx-auto border-t border-gray-200 mb-8 mx-4"></div>

            <div className="px-4 sm:p-8 pt-0">
                {/* 2. Área de Filtragem e Título */}
                <div className="flex flex-col items-center mb-10">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 capitalize mb-6 text-center">
                        {selectedDate
                            ? `Agenda: ${formatDate(selectedDate)}`
                            : "Todos os Eventos"}
                    </h1>
                    
                    {/* Componente de Calendário */}
                    <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                        <Calendar onDateChange={(date) => setSelectedDate(date)} />
                    </div>
                </div>

                {/* 3. Lista de Eventos (Grid) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                    {listEvents.map((event) => (
                        <Button 
                            key={event.id}
                            variant="event"
                            title={event.title} 
                            time={event.time} 
                            location={event.location} 
                            href={`#/evento/${event.id}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EventPage;