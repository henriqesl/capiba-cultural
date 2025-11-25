import React from 'react';


const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-start bg-blue-50 rounded-lg p-4">
        <span className="text-2xl mr-3 mt-1">{icon}</span>
        <div>
            <span className="block text-sm font-bold text-blue-800 uppercase">{label}</span>
            <span className="block text-gray-800 text-lg font-medium">{value}</span>
        </div>
    </div>
);

const EventDetailPage = ({ event, onBack }) => {

    // Erro
    if (!event) {
        return (
            <div className="bg-gray-100 min-h-screen p-8 text-center">
                <h1 className="text-3xl font-bold mt-10">Evento não encontrado</h1>
                <button 
                    onClick={onBack}
                    className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    &larr; Voltar
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mt-8">
                {/* Imagem Placeholder */}
                <div className="w-full h-72 bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-500">Imagem do Evento</span>
                </div>

                <div className="p-6 sm:p-10">
                    {/* Botão de Voltar */}
                    <button 
                        onClick={onBack} // Chama a função de voltar
                        className="mb-6 text-blue-600 hover:underline font-semibold text-lg"
                    >
                        &larr; Veja todos os eventos
                    </button>
                    
                    {/* Título */}
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">{event.title}</h1>
                    
                
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        <InfoItem icon="🗓️" label="Horário" value={event.time} />
                        <InfoItem icon="📍" label="Local" value={event.location} />
                        <InfoItem icon="🎂" label="Faixa Etária" value={event.age === 0 ? 'Livre' : `${event.age}+ anos`} />
                        <InfoItem icon="🎟️" label="Valor" value={event.price} />
                        <InfoItem 
                            icon={event.needsRegistration ? "✅" : "🎟️"} 
                            label="Inscrição" 
                            value={event.needsRegistration ? "Inscrição prévia" : "Entrada livre"} 
                        />
                    </div>

                    {/* Descrição */}
                    <h2 className="text-3xl font-semibold text-gray-800 mb-4">Sobre o Evento</h2>
                    <p className="text-gray-700 leading-relaxed text-lg">
                        {event.description}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EventDetailPage;