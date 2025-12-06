import React, { useState, useEffect } from 'react';
import Calendar from '../../components/event/Calendar';
import Carousel from '../../components/event/Carousel';
import EventCard from '../../components/event/EventCard'; 
import api from '../../services/api'; // Importar API

const EventPage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [eventos, setEventos] = useState([]); // Estado para eventos reais
    const [loading, setLoading] = useState(true);

    // Buscar eventos do Backend ao carregar a página
    useEffect(() => {
        const fetchEventos = async () => {
            try {
                const response = await api.get('/eventos');
                setEventos(response.data);
            } catch (error) {
                console.error("Erro ao buscar eventos", error);
                alert("Erro ao carregar eventos");
            } finally {
                setLoading(false);
            }
        };

        fetchEventos();
    }, []);

    const formatDate = (date) => {
        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    if (loading) return <div className="p-10 text-center">Carregando eventos...</div>;

    // Filtra eventos (Exemplo: 3 primeiros para destaque)
    const featuredEvents = eventos.slice(0, 3);
    
    return (
        <div className="bg-gray-100 min-h-screen pb-24 md:pb-12">
            
            <div className="pt-8 pb-4">
                {/* Passa eventos reais para o carrossel */}
                <Carousel events={featuredEvents} />
            </div>

            <div className="max-w-6xl mx-auto border-t border-gray-200 mb-8"></div>

            <div className="px-4 sm:p-8 pt-0">
                <div className="flex flex-col items-center mb-10">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 capitalize mb-6 text-center">
                        {selectedDate
                            ? `Agenda: ${formatDate(selectedDate)}`
                            : "Todos os Eventos"}
                    </h1>
                    <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                        <Calendar onDateChange={(date) => setSelectedDate(date)} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                    {eventos.map((event) => (
                        <EventCard 
                            key={event.id}
                            title={event.nome} // Backend usa 'nome', não 'title'
                            time={new Date(event.data).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} 
                            location={event.local} // Backend usa 'local'
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