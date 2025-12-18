import React, { useState, useEffect } from 'react';
import Carousel from '../../components/event/Carousel';
import EventCard from '../../components/event/EventCard'; 
import EventMap from '../../components/event/EventMap';
import Calendar from '../../components/event/Calendar'; 
import api from '../../services/api'; 
import { Bell, Calendar as CalendarIcon, MapPin } from 'lucide-react';

const getFullImageUrl = (relativePath) => {
    if (!relativePath) return undefined; 
    const path = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
    return `http://localhost:3000${path}`; 
};

const formatDateForApi = (date) => date.toISOString().split('T')[0];
const formatDateDisplay = (date) => date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

const EventPage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [eventos, setEventos] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('agenda'); 
    const [reminderIds, setReminderIds] = useState([]);

    useEffect(() => {
        const ids = JSON.parse(localStorage.getItem('capiba_reminders') || '[]');
        setReminderIds(ids);
    }, [activeTab]);

    useEffect(() => {
        const fetchEventos = async () => {
            setLoading(true);
            try {
                const dataFormatada = formatDateForApi(selectedDate);
                const endpoint = activeTab === 'map' 
                    ? '/eventos' 
                    : `/eventos?data=${dataFormatada}`; 
                    
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

    const getHorarioEvento = (evento) => {
        if (evento.horario) return evento.horario;
        if (evento.data) {
            return new Date(evento.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        }
        return '--:--';
    };

    const displayedEvents = activeTab === 'reminders' 
        ? eventos.filter(e => reminderIds.includes(e.id))
        : eventos;

    const carouselDataFinal = eventos
        .filter(e => !e.pequenoPorte)
        .slice(0, 5)
        .map(evento => ({
            id: evento.id,
            title: evento.nome, 
            time: getHorarioEvento(evento),
            location: evento.local,
            image: getFullImageUrl(evento.imagemUrl), 
        }));

    return (
        <div className="bg-gray-100 min-h-screen pb-24 md:pb-12">
            <style>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
                <div className="max-w-6xl mx-auto px-4 flex">
                    <button onClick={() => setActiveTab('agenda')} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'agenda' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}><CalendarIcon className="w-4 h-4" /> Agenda</button>
                    <button onClick={() => setActiveTab('reminders')} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'reminders' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500'}`}><Bell className="w-4 h-4" /> Lembretes {reminderIds.length > 0 && <span className="bg-green-100 text-green-700 text-[10px] px-1.5 py-0.5 rounded-full ml-1">{reminderIds.length}</span>}</button>
                    <button onClick={() => setActiveTab('map')} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'map' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500'}`}><MapPin className="w-4 h-4" /> Mapa</button>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-4 pt-6">
                {activeTab === 'agenda' && carouselDataFinal.length > 0 && <div className="mb-8"><Carousel events={carouselDataFinal} /></div>}

                <div className="flex flex-col items-center mb-8">
                    <h1 className="text-xl sm:text-2xl font-black text-gray-800 uppercase italic tracking-tighter mb-6 text-center">
                        {activeTab === 'reminders' ? 'Meus Lembretes' : activeTab === 'map' ? 'Mapa Cultural de Recife' : `Agenda: ${formatDateDisplay(selectedDate)}`}
                    </h1>
                    {activeTab !== 'map' && (
                        /* CENTRALIZAÇÃO DO CALENDÁRIO AQUI */
                        <div className="bg-white p-2 rounded-3xl shadow-sm border border-gray-100 mx-auto">
                            <Calendar onDateChange={(date) => setSelectedDate(date)} />
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="text-center py-20"><div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div><p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Carregando...</p></div>
                ) : (
                    <>
                        {activeTab === 'map' ? (
                            <div className="rounded-3xl overflow-hidden shadow-lg border border-gray-200 bg-white p-2"><EventMap events={eventos} /></div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {displayedEvents.length > 0 ? displayedEvents.map((evento) => (
                                    /* NAVEGAÇÃO HASH AQUI */
                                    <div key={evento.id} onClick={() => window.location.hash = `#/eventos/${evento.id}`} className="cursor-pointer">
                                        <EventCard id={evento.id} title={evento.nome} time={getHorarioEvento(evento)} location={evento.local} image={getFullImageUrl(evento.imagemUrl)} />
                                    </div>
                                )) : (
                                    <div className="col-span-full text-center py-16 bg-white rounded-[40px] border-2 border-dashed border-gray-200"><p className="text-gray-500 font-bold">Nenhum evento encontrado.</p></div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default EventPage;