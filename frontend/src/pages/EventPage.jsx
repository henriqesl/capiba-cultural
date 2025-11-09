import React, { useState } from 'react';
import EventButton from '../components/EventButton';
import Calendar from '../components/Calendar';
import TopNav from '../components/TopNav';

// A página agora recebe os eventos e a função de clique como props
const EventPage = ({ events, onEventClick }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const formatDate = (date) => {
        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
            <TopNav />
            <br></br>
            <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 text-gray-800 capitalize">
                {selectedDate
                    ? `Eventos de ${formatDate(selectedDate)}`
                    : "Evento de Hoje"}
            </h1>

            <div className="flex justify-center mb-10">
                <Calendar onDateChange={(date) => setSelectedDate(date)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                {/* Agora usamos .map() para criar os botões
                  a partir da prop 'events' 
                */}
                {events.map((event) => (
                    <EventButton 
                        key={event.id}
                        title={event.title} 
                        time={event.time} 
                        location={event.location} 
                        // Passamos a função onEventClick com o ID do evento
                        onClick={() => onEventClick(event.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default EventPage;