import React, { useState, useEffect } from 'react';
import Calendar from '../../components/event/Calendar';
import Carousel from '../../components/event/Carousel';
import EventCard from '../../components/event/EventCard'; 
import api from '../../services/api'; 
import { Bell, Calendar as CalendarIcon } from 'lucide-react';

const getFullImageUrl = (relativePath) => {
    if (!relativePath) return undefined; 
    const path = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
    return `http://localhost:3000${path}`; 
};

const formatDateForApi = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const EventPage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [eventos, setEventos] = useState([]); 
    const [loading, setLoading] = useState(true);
    
    // --- LÓGICA DE ABAS (AGENDA vs LEMBRETES) ---
    const [activeTab, setActiveTab] = useState('agenda'); // 'agenda' | 'reminders'
    const [reminderIds, setReminderIds] = useState([]);

    // Carrega IDs salvos ao iniciar ou mudar aba
    useEffect(() => {
        const ids = JSON.parse(localStorage.getItem('capiba_reminders') || '[]');
        setReminderIds(ids);
    }, [activeTab]);

    useEffect(() => {
        const fetchEventos = async () => {
            setLoading(true);
            try {
                // Se a aba for 'reminders', precisamos de uma estratégia para buscar esses eventos.
                // Como sua API atual filtra por Data, e não por lista de IDs, vamos fazer o seguinte:
                // 1. Na aba 'agenda', busca por data normalmente.
                // 2. Na aba 'reminders', vamos buscar a data atual (ou idealmente, precisaríamos de um endpoint /eventos/meus).
                //    Para simplificar sem mexer no backend agora: vamos buscar os eventos da data selecionada
                //    e filtrar localmente. (Nota: Em produção, o ideal é um endpoint GET /eventos?ids=1,2,3)
                
                const dataFormatada = formatDateForApi(selectedDate);
                const response = await api.get(`/eventos?data=${dataFormatada}`);
                setEventos(response.data);
            } catch (error) {
                console.error("Erro ao buscar eventos", error);
                setEventos([]);
            } finally {
                setLoading(false);
            }
        };

        fetchEventos();
    }, [selectedDate, activeTab]);

    const formatDate = (date) => {
        return date.toLocaleDateString("pt-BR", {
            day: "2-digit", month: "long", year: "numeric",
        });
    };

    const getHorarioEvento = (evento) => {
        if (evento.horario) return evento.horario;
        if (evento.data) return new Date(evento.data).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        return '--:--';
    };

    // --- FILTRAGEM ---
    // Na aba 'reminders', só mostra o que está no localStorage
    // IMPORTANTE: Como estamos buscando só os eventos DO DIA (pela API),
    // os lembretes só vão aparecer se você selecionar a data correta no calendário.
    const displayedEvents = activeTab === 'reminders' 
        ? eventos.filter(e => reminderIds.includes(e.id))
        : eventos;

    // Dados para o Carrossel (Apenas na aba Agenda)
    const featuredEvents = eventos.filter(e => !e.pequenoPorte).slice(0, 5);
    const carouselData = featuredEvents.length > 0 ? featuredEvents : eventos.slice(0, 3);
    const carouselDataFinal = carouselData.map(evento => ({
        id: evento.id,
        title: evento.nome, 
        time: getHorarioEvento(evento),
        location: evento.local,
        image: getFullImageUrl(evento.imagemUrl), 
    }));

    return (
        <div className="bg-gray-100 min-h-screen pb-24 md:pb-12">
            
            {/* Seletor de Abas */}
            <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
                <div className="max-w-6xl mx-auto px-4 flex">
                    <button 
                        onClick={() => setActiveTab('agenda')}
                        className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'agenda' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        <CalendarIcon className="w-4 h-4" />
                        Agenda Geral
                    </button>
                    <button 
                        onClick={() => setActiveTab('reminders')}
                        className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'reminders' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        <Bell className="w-4 h-4" />
                        Meus Lembretes
                        {reminderIds.length > 0 && (
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                                {reminderIds.length}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Carrossel (Apenas na Agenda) */}
            {activeTab === 'agenda' && (
                <div className="pt-8 pb-4">
                    {carouselDataFinal.length > 0 ? (
                        <Carousel events={carouselDataFinal} />
                    ) : (
                        <div className="text-center text-gray-400 py-10">Sem destaques hoje</div>
                    )}
                </div>
            )}

            <div className="max-w-6xl mx-auto border-t border-gray-200 mb-8 mt-4"></div>

            <div className="px-4 sm:p-8 pt-0">
                <div className="flex flex-col items-center mb-10">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 capitalize mb-6 text-center">
                        {activeTab === 'reminders' ? 'Lembretes (nesta data)' : `Agenda: ${formatDate(selectedDate)}`}
                    </h1>
                    
                    {/* Calendário sempre visível para navegar nas datas */}
                    <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                        <Calendar onDateChange={(date) => setSelectedDate(date)} />
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12 animate-pulse text-gray-400 font-bold">Carregando...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                        {displayedEvents.length > 0 ? (
                            displayedEvents.map((evento) => (
                                <EventCard 
                                    key={evento.id}
                                    title={evento.nome} 
                                    time={getHorarioEvento(evento)} 
                                    location={evento.local} 
                                    href={`#/eventos/${evento.id}`} 
                                    image={getFullImageUrl(evento.imagemUrl)}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                                {activeTab === 'reminders' ? (
                                    <>
                                        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500 text-lg">Nenhum lembrete para esta data.</p>
                                        <p className="text-sm text-gray-400">Navegue pelo calendário ou adicione eventos da Agenda Geral.</p>
                                    </>
                                ) : (
                                    <p className="text-gray-500 text-lg">Nenhum evento encontrado para esta data.</p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventPage;