import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ICONS } from '../../utils/icons';
import { Icon } from '../../components/user/UserShared';
import Carousel from '../../components/event/Carousel'; // Importar o Carrossel
// Importamos os dados de exemplo para o carrossel.
// Quando o backend tiver a rota de "destaques", trocaremos isso por uma chamada à API.
import EventsData from '../../components/event/EventsData';

const HomePage = () => {
    const { user } = useAuth();

    // Seleciona os primeiros 3 eventos para o carrossel de destaque
    const featuredEvents = EventsData.slice(0, 3);

    return (
        <div className="bg-gray-100 min-h-screen pb-24 md:pb-12">
            {/* Cabeçalho de Boas-vindas Personalizado */}
            <section className="bg-blue-600 pt-12 pb-10 px-6 rounded-b-[3rem] shadow-lg text-white">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold animate-fade-in">
                            Olá, {user?.nome?.split(' ')[0] || 'Capiba'}! 👋
                        </h1>
                        <p className="text-blue-100 mt-1 opacity-90">
                            O que vamos explorar hoje no Recife?
                        </p>
                    </div>
                    {user?.fotoUrl && (
                        <img 
                            src={`http://localhost:3000/${user.fotoUrl}`} 
                            alt="Perfil" 
                            className="w-14 h-14 rounded-full border-2 border-white shadow-md object-cover"
                        />
                    )}
                </div>
            </section>

            <div className="max-w-4xl mx-auto px-4 mt-6 space-y-8">
                
                {/* ATALHOS RÁPIDOS (Mantidos pois são úteis na Home) */}
                <section>
                    <div className="grid grid-cols-4 gap-3">
                        <QuickAction href="#/capiba" icon={ICONS.dollar} label="Check-in" color="text-green-600" bg="bg-green-50" />
                        <QuickAction href="#/perfil/caravana" icon={ICONS.user} label="Caravanas" color="text-blue-600" bg="bg-blue-50" />
                        <QuickAction href="#/ranking" icon={ICONS.star} label="Ranking" color="text-yellow-600" bg="bg-yellow-50" />
                        <QuickAction href="#/eventos" icon={ICONS.calendar} label="Agenda" color="text-red-600" bg="bg-red-50" />
                    </div>
                </section>

                {/* NOVO: Carrossel de Destaques (Menor) */}
                <section>
                    {/* Adicionamos a classe 'home-carousel' para aplicar o CSS que criamos */}
                    <div className="home-carousel rounded-2xl overflow-hidden shadow-sm">
                        <Carousel events={featuredEvents} />
                    </div>
                </section>

                {/* Sugestão/Banner Final (Opcional, para preencher o espaço) */}
                <section className="bg-linear-to-r from-blue-500 to-purple-600 p-6 rounded-3xl shadow-md text-white flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-lg">Mapa Cultural Interativo</h3>
                        <p className="text-sm text-blue-100">Descubra o que está a acontecer à sua volta.</p>
                    </div>
                    <a href="#/eventos#map" className="p-3 bg-white text-blue-600 rounded-full shadow-sm hover:scale-110 transition-transform">
                       <Icon path={ICONS.map} className="w-6 h-6" />
                    </a>
                </section>
            </div>
        </div>
    );
};

// Componente auxiliar para os botões de atalho (Estilo mais limpo)
const QuickAction = ({ href, icon, label, color, bg }) => (
    <a href={href} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center gap-2 hover:shadow-md transition-shadow">
        <div className={`p-2.5 ${bg} ${color} rounded-xl`}>
            <Icon path={icon} className="w-5 h-5" />
        </div>
        <span className="text-xs font-medium text-gray-700 leading-tight">{label}</span>
    </a>
);

export default HomePage;