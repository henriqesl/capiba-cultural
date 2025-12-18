import React, { useState, useEffect } from 'react';
import Carousel from '../../components/event/Carousel';
import EventCard from '../../components/event/EventCard'; 
import EventMap from '../../components/event/EventMap'; // Certifique-se que este componente existe
import api from '../../services/api'; 
import { Bell, Calendar as CalendarIcon, MapPin } from 'lucide-react';

const getFullImageUrl = (relativePath) => {
    if (!relativePath) return undefined; 
    const path = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
    return `http://localhost:3000${path}`; 
};

// Gera 12 meses
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
    const [monthsList] = useState(generateNextMonths());
    const [selectedMonth, setSelectedMonth] = useState(monthsList[0]);
    const [eventos, setEventos] = useState([]); 
    const [loading, setLoading] = useState(true);
    
    // --- LÓGICA DE ABAS (AGENDA vs LEMBRETES vs MAPA) ---
    const [activeTab, setActiveTab] = useState('agenda'); // 'agenda' | 'reminders' | 'map'
    const [reminderIds, setReminderIds] = useState([]);

    // Carrega IDs do localStorage
    useEffect(() => {
        const ids = JSON.parse(localStorage.getItem('capiba_reminders') || '[]');
        setReminderIds(ids);
    }, [activeTab]);

    // Lógica Principal de Busca
    useEffect(() => {
        const fetchEventos = async () => {
            setLoading(true);
            try {
                // Lógica de endpoint
                let endpoint = '/eventos';
                
                if (activeTab === 'agenda') {
                    const { monthNum, year } = selectedMonth;
                    endpoint = `/eventos?mes=${monthNum}&ano=${year}`;
                } 
                // Se for 'map' ou 'reminders', pegamos tudo (ou filtramos depois)
                // Idealmente 'reminders' buscaria por IDs, mas aqui pegamos tudo e filtramos no front
                
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
    }, [selectedMonth, activeTab]); 

    // Função de formatação de horário (ÚNICA VERSÃO)
    const getHorarioEvento = (evento, isReminderMode) => {
        const dataObj = new Date(evento.data);
        const hora = evento.horario || dataObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        // Se for modo lembrete, mostra a DATA junto com a hora
        if (isReminderMode) {
            const dia = dataObj.getDate();
            const mes = dataObj.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase().replace('.', '');
            return `${dia} ${mes} • ${hora}`;
        }
        
        return hora;
    };

    // FILTRAGEM PARA ABAS
    const displayedEvents = activeTab === 'reminders' 
        ? eventos.filter(e => reminderIds.includes(e.id))
        : eventos;

    // Dados para o Carrossel (Apenas na aba Agenda)
    const featuredEvents = eventos.filter(e => !e.pequenoPorte).slice(0, 5);
    const carouselData = featuredEvents.length > 0 ? featuredEvents : eventos.slice(0, 3);
    const carouselDataFinal = carouselData.map(evento => ({
        id: evento.id,
        title: evento.nome, 
        time: getHorarioEvento(evento, false),
        location: evento.local,
        image: getFullImageUrl(evento.imagemUrl), 
    }));

    return (
        <div className="bg-gray-100 min-h-screen pb-24 md:pb-12">
            <style>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            {/* ABAS */}
            <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
                <div className="max-w-6xl mx-auto px-4 flex">
                    <button 
                        onClick={() => setActiveTab('agenda')}
                        className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'agenda' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        <CalendarIcon className="w-4 h-4" />
                        Agenda
                    </button>
                    <button 
                        onClick={() => setActiveTab('reminders')}
                        className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'reminders' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        <Bell className="w-4 h-4" />
                        Lembretes
                        {reminderIds.length > 0 && (
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full ml-1">
                                {reminderIds.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('map')}
                        className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'map' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        <MapPin className="w-4 h-4" />
                        Mapa
                    </button>
                </div>
            </div>

            {/* SEÇÃO DA AGENDA (Carrossel + Meses) - SÓ APARECE NA ABA AGENDA */}
            {activeTab === 'agenda' && (
                <>
                    <div className="pt-6 pb-2">
                        {carouselDataFinal.length > 0 ? (
                            <Carousel events={carouselDataFinal} />
                        ) : (
                            <div className="text-center text-gray-400 py-6 text-sm">Sem destaques este mês</div>
                        )}
                    </div>

                    <div className="max-w-6xl mx-auto border-t border-gray-200 mb-6 mt-4"></div>

                    {/* MENU DE MESES (STORIES) */}
                    <div className="mb-8 w-full">
                        <div className="px-4 mb-4 flex items-baseline justify-center gap-2">
                            <h2 className="text-xl font-bold text-gray-800 capitalize">
                                {selectedMonth.fullLabel}
                            </h2>
                            <span className="text-sm font-medium text-gray-400">
                                {selectedMonth.year}
                            </span>
                        </div>
                        
                        <div className="flex overflow-x-auto gap-4 px-4 pb-4 snap-x hide-scrollbar w-full xl:justify-center">
                            {monthsList.map((m, index) => {
                                const isSelected = m.label === selectedMonth.label && m.year === selectedMonth.year;
                                return (
                                    <div 
                                        key={index} 
                                        onClick={() => setSelectedMonth(m)}
                                        className="flex flex-col items-center gap-2 cursor-pointer snap-start min-w-[70px]"
                                    >
                                        <div className={`
                                            w-[70px] h-[70px] rounded-full p-[3px] transition-all duration-300
                                            ${isSelected 
                                                ? 'bg-gradient-to-tr from-blue-500 to-cyan-400 shadow-md scale-105' 
                                                : 'bg-gray-200 hover:bg-gray-300'}
                                        `}>
                                            <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center border-[3px] border-white">
                                                <span className={`text-sm font-black tracking-wide ${isSelected ? 'text-blue-600' : 'text-gray-400'}`}>
                                                    {m.label}
                                                </span>
                                            </div>
                                        </div>
                                        <span className={`text-xs font-medium ${isSelected ? 'text-blue-600' : 'text-gray-300'}`}>
                                            {m.year}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}

            {/* CONTEÚDO PRINCIPAL */}
            <div className="px-4 sm:p-8 pt-0">
                
                {/* Título dinâmico */}
                <div className="flex flex-col items-center mb-10">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 capitalize mb-6 text-center">
                        {activeTab === 'reminders' 
                            ? 'Seus Lembretes' 
                            : activeTab === 'map' 
                                ? 'Mapa Cultural'
                                : `Agenda de ${selectedMonth.fullLabel}`
                        }
                    </h1>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3"></div>
                        <p className="text-gray-400 font-medium capitalize">Carregando...</p>
                    </div>
                ) : (
                    <>
                        {/* Aba de Eventos / Lembretes */}
                        {(activeTab === 'agenda' || activeTab === 'reminders') && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                                {displayedEvents.length > 0 ? (
                                    displayedEvents.map((evento) => (
                                        <EventCard 
                                            key={evento.id}
                                            title={evento.nome} 
                                            time={getHorarioEvento(evento, activeTab === 'reminders')} 
                                            location={evento.local} 
                                            href={`#/eventos/${evento.id}`} 
                                            image={getFullImageUrl(evento.imagemUrl)}
                                            className={activeTab === 'reminders' ? 'border-l-4 border-l-green-500' : ''}
                                        />
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                                        {activeTab === 'reminders' ? (
                                            <>
                                                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                                <p className="text-gray-500 text-lg">Nenhum lembrete salvo.</p>
                                                <p className="text-sm text-gray-400">Explore a agenda e adicione eventos!</p>
                                            </>
                                        ) : (
                                            <p className="text-gray-500 text-lg">Nenhum evento encontrado.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Aba de Mapa Cultural */}
                        {activeTab === 'map' && (
                            <div className="max-w-6xl mx-auto w-full h-[500px] bg-gray-200 rounded-3xl overflow-hidden shadow-lg">
                                {/* Verifica se EventMap existe antes de renderizar */}
                                {EventMap ? <EventMap events={eventos} /> : <p className="text-center p-10">Componente de Mapa não encontrado.</p>}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default EventPage;