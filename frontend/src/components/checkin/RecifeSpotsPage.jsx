import React from 'react';
import { ArrowLeft, MapPin, Landmark, BookOpen, Utensils, Zap, ChevronRight } from 'lucide-react';

// Importação das imagens conforme sua estrutura de pastas
import RicardoBrennandImg from '../../assets/ricardo_brennand.png'; 
import TorreMalakoffImg from '../../assets/torre_malakoff.jpg';
import CaisDoSertaoImg from '../../assets/cais_sertao.png';
import EmbaixadaBonecosGigantesImg from '../../assets/embaixada_bonecos.png';
import MercadoBoaVistaImg from '../../assets/mercado.png';

const culturalSpots = [
    {
        id: 1,
        title: "Instituto Ricardo Brennand (IRB)",
        icon: Landmark,
        value: "+100 Capibas",
        description: "Visite o acervo de arte e história, incluindo a coleção de armaria.",
        imageTag: RicardoBrennandImg 
    },
    {
        id: 2,
        title: "Torre Malakoff",
        icon: MapPin,
        value: "+50 Capibas",
        description: "Observatório Cultural e sede de exposições no coração do Bairro do Recife.",
        imageTag: TorreMalakoffImg
    },
    {
        id: 3,
        title: "Cais do Sertão",
        icon: BookOpen,
        value: "+75 Capibas",
        description: "Museu interativo dedicado à cultura do Sertão nordestino e Luiz Gonzaga.",
        imageTag: CaisDoSertaoImg
    },
    {
        id: 4,
        title: "Embaixada dos Bonecos Gigantes",
        icon: Zap,
        value: "+40 Capibas",
        description: "Confira de perto os famosos bonecos do Carnaval de Olinda/Recife.",
        imageTag: EmbaixadaBonecosGigantesImg
    },
    {
        id: 5,
        title: "Mercado da Boa Vista",
        icon: Utensils,
        value: "+30 Capibas",
        description: "Local de check-in gastronômico com sabores locais.",
        imageTag: MercadoBoaVistaImg
    },
];

// Componente visual para cada local
const SpotCard = ({ id, icon: Icon, title, value, description, imageTag }) => {
    
    // Função para navegar para a página de detalhes
    const handleNavigation = () => {
        window.location.hash = `#/locais/${id}/spots`;
    };

    return (
        <div 
            onClick={handleNavigation}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-4 transition-all hover:shadow-md hover:scale-[1.01] cursor-pointer group"
        >
            {/* 1. LADO ESQUERDO: IMAGEM */}
            {imageTag && (
                <div className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shadow-inner bg-gray-100">
                    <img 
                        src={imageTag} 
                        alt={`Foto de ${title}`} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" 
                    />
                </div>
            )}
            
            {/* 2. LADO DIREITO: TEXTO E INFORMAÇÕES */}
            <div className="flex-1 flex items-start gap-3 min-w-0">
                <div className="p-2.5 bg-purple-50 rounded-xl flex-shrink-0 mt-1">
                    <Icon className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate group-hover:text-purple-600 transition-colors">
                        {title}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5 mb-1">
                        <span className="text-xs font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
                            {value}
                        </span>
                    </div>
                    <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 leading-snug">
                        {description}
                    </p>
                </div>
                
                {/* Indicador de clique */}
                <div className="self-center text-gray-300 group-hover:text-purple-400 transition-colors px-2">
                    <ChevronRight className="w-5 h-5" />
                </div>
            </div>
        </div>
    );
};

// O componente principal
const RecifeSpotsPage = ({ onBack }) => {
    // Caso não venha onBack, volta para a home de eventos
    const handleBack = onBack || (() => window.location.hash = '#/eventos');

    return (
        <div className="w-full bg-gray-50 min-h-screen flex flex-col items-center">
            
            {/* Banner Superior Estilizado */}
            <div className="w-full bg-purple-700 pt-12 pb-20 px-6 flex flex-col items-center text-center">
                <div className="w-full max-w-4xl flex items-center mb-6">
                    <button 
                        onClick={handleBack} 
                        className="p-2.5 text-white hover:bg-white/20 transition-all bg-white/10 rounded-xl backdrop-blur-md border border-white/20"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-black text-white mb-3">
                    Check-in Cultural
                </h1>
                <p className="text-purple-100 text-sm md:text-base max-w-lg opacity-90 leading-relaxed">
                    Explore os tesouros de Recife, registre sua visita e acumule <span className="font-bold text-white">Capibas</span> para trocar por recompensas!
                </p>
            </div>

            {/* Lista de Locais (Sobreposta ao banner) */}
            <main className="w-full max-w-md md:max-w-3xl px-6 -mt-10 pb-20">
                <div className="flex flex-col gap-4">
                    {culturalSpots.map(spot => (
                        <SpotCard
                            key={spot.id}
                            id={spot.id}
                            icon={spot.icon}
                            title={spot.title}
                            value={spot.value}
                            description={spot.description}
                            imageTag={spot.imageTag}
                        />
                    ))}
                </div>

                {/* Info de Rodapé */}
                <div className="mt-10 p-6 bg-white rounded-3xl border border-dashed border-gray-300 flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                        <MapPin className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm">
                        Novos locais são adicionados toda semana.<br/>
                        Mantenha seu GPS ligado ao visitar!
                    </p>
                </div>
            </main>
        </div>
    );
};

export default RecifeSpotsPage;