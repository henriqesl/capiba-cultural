import React, { useState, useEffect } from 'react';
import Carousel from '../../components/event/Carousel';
import EventCard from '../../components/event/EventCard'; 
import EventMap from '../../components/event/EventMap';
import Calendar from '../../components/event/Calendar'; // Adicionei esta importação
import api from '../../services/api'; 
import { Bell, Calendar as CalendarIcon, MapPin } from 'lucide-react';

const getFullImageUrl = (relativePath) => {
    if (!relativePath) return undefined; 
    const path = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
    return `http://localhost:3000${path}`; 
};

const generateNextMonths = () => {
    const months = [];
    const today = new Date();
    for (let i = 0; i < 12; i++) {
        const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
        months.push({
            label: d.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase().replace('.', ''),
            fullLabel: d.toLocaleDateString('pt-BR', { month: 'long' }),
            year: d.getFullYear(),
            monthNum: d.getMonth() + 1
        });
    }
    return months;
};

const EventPage = () => {
    // 1. Estados que faltavam ou estavam incompletos
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [monthsList] = useState(generateNextMonths());
    const [eventos, setEventos] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('agenda'); 
    const [reminderIds, setReminderIds] = useState([]);

    // 2. Funções auxiliares de formatação
    const formatDate = (date) => {
        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    const formatDateForApi = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        const ids = JSON.parse(localStorage.getItem('capiba_reminders') || '[]');
        setReminderIds(ids);
    }, [activeTab]);

    useEffect(() => {
        const fetchEventos = async () => {
            setLoading(true);
            try {
                const dataFormatada = formatDateForApi(selectedDate);
                const endpoint = activeTab === 'map' ? '/eventos' : `/eventos?data=${dataFormatada}`; 
                const response = await api.get(endpoint);
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

    // 3. Função de Horário Unificada (Removi a duplicada)
    const getHorarioEvento = (evento) => {
        const dataObj = new Date(evento.data);
        const hora = evento.horario || dataObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        if (activeTab === 'reminders') {
            const dia = dataObj.getDate();
            const mes = dataObj.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase().replace('.', '');
            return `${dia} ${mes} • ${hora}`;
        }
        return hora;
    };

    const displayedEvents = activeTab === 'reminders' 
        ? eventos.filter(e => reminderIds.includes(e.id))
        : eventos;

    const featuredEvents = eventos.filter(e => !e.pequenoPorte).slice(0, 5);
    const carouselDataFinal = featuredEvents.map(evento => ({
        id: evento.id,
        title: evento.nome, 
        time: getHorarioEvento(evento),
        location: evento.local,
        image: getFullImageUrl(evento.imagemUrl), 
    }));

    return (
        <div className="bg-gray-100 min-h-screen pb-24">
            {/* Menu de Abas Fixo */}
            <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
                <div className="max-w-6xl mx-auto px-4 flex">
                    {['agenda', 'reminders', 'map'].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${
                                activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'
                            }`}
                        >
                            {tab === 'agenda' && <CalendarIcon className="w-4 h-4" />}
                            {tab === 'reminders' && <Bell className="w-4 h-4" />}
                            {tab === 'map' && <MapPin className="w-4 h-4" />}
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-6">
                {/* Carrossel: Só aparece na Agenda e se não estiver a carregar */}
                {activeTab === 'agenda' && !loading && carouselDataFinal.length > 0 && (
                    <div className="mb-8">
                        <Carousel events={carouselDataFinal} />
                    </div>
                )}

                {/* Título e Calendário */}
                <div className="flex flex-col items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                        {activeTab === 'map' ? 'Mapa Cultural' : `Agenda: ${formatDate(selectedDate)}`}
                    </h1>
                    {activeTab !== 'map' && (
                        <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                            <Calendar onDateChange={setSelectedDate} />
                        </div>
                    )}
                </div>

                {/* Área de Conteúdo Única (Resolve o problema das "duas barras") */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-500 font-medium">A procurar eventos...</p>
                    </div>
                ) : (
                    <>
                        {activeTab === 'map' ? (
                            <div className="h-[500px] rounded-3xl overflow-hidden shadow-md">
                                <EventMap events={eventos} />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                    <div className="col-span-full text-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                                        <p className="text-gray-500 text-lg">Nenhum evento encontrado.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default EventPage;