import React, { useState } from 'react';
import Button from '../components/Button';
import Calendar from '../components/Calendar';
import mockEventsData from '../components/EventsData'; 

const EventPage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const formatDate = (date) => {
        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };
    
    return (
        // O padding-bottom (pb-24) é importante para o BottomNav
        <div className="bg-gray-100 p-4 sm:p-8 pb-24 md:pb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 text-gray-800 capitalize">
                {selectedDate
                    ? `Eventos de ${formatDate(selectedDate)}`
                    : "Evento de Hoje"}
            </h1>

            <div className="flex justify-center mb-10">
                <Calendar onDateChange={(date) => setSelectedDate(date)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                
                {/* 3. Lógica de map (da branch main) mantida */}
                {mockEventsData.map((event) => (
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
    );
};

export default EventPage;