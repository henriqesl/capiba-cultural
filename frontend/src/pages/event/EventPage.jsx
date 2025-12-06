import React, { useState } from 'react';
import Calendar from '../../components/event/Calendar';
import EventsData from '../../components/event/EventsData';
import Carousel from '../../components/event/Carousel';
import EventCard from '../../components/event/EventCard'; 

const EventPage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const formatDate = (date) => {
        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    // Filtra eventos (3 primeiros)
    const featuredEvents = EventsData.slice(0, 3);
    
    // Lista completa de eventos para o grid abaixo
    const listEvents = EventsData; 

    return (
        <div className="bg-gray-100 min-h-screen pb-24 md:pb-12">
            
            {/* Header / Espaçamento Topo */}
            <div className="pt-8 pb-4">
                {/* Slides Automáticos */}
                <Carousel events={featuredEvents} />
            </div>

            {/* Divisória visual suave */}
            <div className="max-w-6xl mx-auto border-t border-gray-200 mb-8"></div>

            <div className="px-4 sm:p-8 pt-0">
                {/* Área de Filtragem e Título */}
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

                {/* Lista de Eventos (Grid) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                    {listEvents.map((event) => (
                        <EventCard 
                            key={event.id}
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

/*
  [INTEGRAÇÃO]
  Rota: GET /eventos (ver arquivo EventoRoutes.Js)
  
  Como integrar:
  - Trocar esse `EventsData` fixo por um `fetch` nessa rota.
  - O backend devolve lista com nome, local e data.
  - Atenção: O backend não tem campo de "Imagem" no banco ainda. Vamos ter que usar imagens genéricas por enquanto.
*/