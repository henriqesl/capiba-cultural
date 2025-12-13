import React, { useState, useEffect } from 'react';
import Calendar from '../../components/event/Calendar';
import Carousel from '../../components/event/Carousel';
import EventCard from '../../components/event/EventCard'; 
import api from '../../services/api'; 


const getFullImageUrl = (relativePath) => {
    if (!relativePath) {
        return undefined; 
    }
    // Certifique-se de que a porta 3000 é a correta
    return `http://localhost:3000/${relativePath}`; 
};

const EventPage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [eventos, setEventos] = useState([]); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEventos = async () => {
            try {
                const response = await api.get('/eventos');
                setEventos(response.data);
            } catch (error) {
                console.error("Erro ao buscar eventos", error);
                // Não exibe alerta intrusivo, apenas loga o erro
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

    // Função auxiliar para formatar horário (prioriza o campo 'horario' string, senão formata a data)
    const getHorarioEvento = (evento) => {
        if (evento.horario) return evento.horario;
        return new Date(evento.data).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="text-xl font-bold text-gray-500">Carregando agenda...</div>
            </div>
        );
    }

    // Filtra eventos para o Carrossel (Ex: não são pequeno porte)
    const featuredEvents = eventos.filter(e => !e.pequenoPorte).slice(0, 5);
    
    // Se não tiver destaques suficientes, pega os primeiros
    const carouselData = featuredEvents.length > 0 ? featuredEvents : eventos.slice(0, 3);


   const carouselDataFinal = carouselData.map(evento => ({
        id: evento.id,
        // Mapeia nome do DB para title que o Carousel espera
        title: evento.nome, 
        time: getHorarioEvento(evento),
        location: evento.local,
        // Aplica a URL completa
        image: getFullImageUrl(evento.imagemUrl), 
    }));


    return (
        <div className="bg-gray-100 min-h-screen pb-24 md:pb-12">
            
            <div className="pt-8 pb-4">
                {/* Carrossel com dados reais */}
                <Carousel events={carouselDataFinal} />
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
                    {eventos.map((evento) => (
                        <EventCard 
                            key={evento.id}
                            // Mapeamento Banco -> Componente
                            title={evento.nome} 
                            time={getHorarioEvento(evento)} 
                            location={evento.local} 
                            // Passamos o link com ID para abrir os detalhes
                            href={`#/evento/${evento.id}`}
                            // Opcional: Se você atualizar o EventCard para aceitar imagem
                            image={getFullImageUrl(evento.imagemUrl)}
                            />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EventPage;