import React from 'react';
import { ArrowLeft, MapPin, Landmark, BookOpen, Utensils, Zap } from 'lucide-react';

// 🚨 Lembrete: Certifique-se de importar as imagens (URLs resolvidas) no topo 
// para que elas apareçam corretamente (ex: import RicardoBrennandImg from '../../assets/ricardo_brennand.png';)
import RicardoBrennandImg from '../../assets/ricardo_brennand.png'; 
import TorreMalakoffImg from '../../assets/torre_malakoff.jpg'
import CaisDoSertaoImg from '../../assets/cais_sertao.png'
import EmbaixadaBonecosGigantesImg from '../../assets/embaixada_bonecos.png'
import MercadoBoaVistaImg from '../../assets/mercado.png'
// import MarcoZeroImg from '../../assets/marco_zero.png'; // Exemplo para as outras fotos

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
        title: "Mercado da Boa Vista (Comida Típica)",
        icon: Utensils,
        value: "+30 Capibas",
        description: "Local de check-in gastronômico com sabores locais.",
        imageTag: MercadoBoaVistaImg
    },
];

// Componente visual para cada local com imagem PADRONIZADA à esquerda
const SpotCard = ({ icon: Icon, title, value, description, imageTag }) => (
    // Removido flex-col sm:flex-row para usar sempre flex row e centralizar itens no eixo
    <div className="bg-white rounded-xl shadow-lg p-4 flex items-center gap-4 transition-shadow hover:shadow-xl">
        
        {/* 1. LADO ESQUERDO: IMAGEM (Padronizado e menor) */}
        {imageTag && (
            <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden shadow-md">
                <img 
                    src={imageTag} 
                    alt={`Foto de ${title}`} 
                    // Garante que a imagem preencha o container e seja cortada se necessário
                    className="w-full h-full object-cover" 
                />
            </div>
        )}
        
        {/* 2. LADO DIREITO: TEXTO E INFORMAÇÕES */}
        <div className="flex-1 flex items-start gap-3">
             <div className="p-3 bg-blue-100 rounded-full flex-shrink-0 mt-1">
                <Icon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-800 truncate">{title}</h3>
                <p className="text-sm font-semibold text-green-600 mt-1 mb-1">{value}</p>
                <p className="text-gray-600 text-sm">{description}</p>
            </div>
        </div>
        
    </div>
);

// O componente principal
const RecifeSpotsPage = ({ onBack }) => {
    return (
        <div className="w-full bg-gray-100 min-h-screen flex flex-col items-center p-4 sm:p-8">
            <div className="w-full max-w-md md:max-w-4xl">
                
                {/* Header/Topo com botão de voltar */}
                <header className="flex items-center gap-4 mb-6">
                    <button 
                        onClick={onBack} 
                        className="p-2 text-gray-500 hover:text-gray-800 transition-all bg-white rounded-full shadow-md"
                        title="Voltar ao Menu"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Check-in Cultural em Recife
                    </h1>
                </header>

                <p className="text-gray-600 mb-6 text-center">
                    Visite os locais abaixo para registrar sua presença e ganhar moedas Capibas!
                </p>

                {/* Lista de Locais */}
                <main className="flex flex-col gap-4">
                    {culturalSpots.map(spot => (
                        <SpotCard
                            key={spot.id}
                            icon={spot.icon}
                            title={spot.title}
                            value={spot.value}
                            description={spot.description}
                            imageTag={spot.imageTag}
                        />
                    ))}
                </main>

            </div>
        </div>
    );
};

export default RecifeSpotsPage;