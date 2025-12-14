import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-start bg-blue-50 rounded-lg p-4">
        <span className="text-2xl mr-3 mt-1">{icon}</span>
        <div>
            <span className="block text-sm font-bold text-blue-800 uppercase">{label}</span>
            <span className="block text-gray-800 text-lg font-medium">{value}</span>
        </div>
    </div>
);

const EventDetailPage = ({ onBack }) => { // onBack geralmente vem de props se for componente filho, ou usamos navegação
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Pega o ID da URL (hash router)
    const getEventId = () => {
        const hash = window.location.hash;
        const parts = hash.split('/');
        return parts[parts.length - 1];
    };
    const eventId = getEventId();

    useEffect(() => {
        const fetchDetalhes = async () => {
            try {
                const response = await api.get(`/eventos/${eventId}`);
                setEvent(response.data);
            } catch (error) {
                console.error("Erro ao carregar detalhes do evento", error);
            } finally {
                setLoading(false);
            }
        };

        if (eventId) {
            fetchDetalhes();
        }
    }, [eventId]);

    // Função de navegação manual se onBack não for fornecido
    const handleBack = () => {
        if (onBack) onBack();
        else window.location.hash = '#/eventos';
    };

    if (loading) {
        return (
            <div className="bg-gray-100 min-h-screen flex items-center justify-center">
                <span className="text-xl font-bold text-gray-500 animate-pulse">Carregando detalhes...</span>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="bg-gray-100 min-h-screen p-8 text-center flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Evento não encontrado</h1>
                <button 
                    onClick={handleBack}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    &larr; Voltar para Agenda
                </button>
            </div>
        );
    }

    // === TRATAMENTO DE DADOS ===
    const dataObj = new Date(event.data);
    const horarioExibicao = dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const dataFormatada = dataObj.toLocaleDateString('pt-BR');
    
    // Lógica para imagem (Se for URL externa ou caminho local)
    // Se a URL começar com http, usa direto. Se não, assume que é upload local (ajustar conforme necessidade)
    const imagemSrc = event.imagemUrl && event.imagemUrl.startsWith('http') 
        ? event.imagemUrl 
        : `https://picsum.photos/seed/${event.id}/800/400`; // Fallback

    // Formatação de Preço
    const precoDisplay = (!event.valor || event.valor === 0) 
        ? "Gratuito" 
        : `R$ ${event.valor.toFixed(2)}`;

    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-8 pb-24">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mt-4 sm:mt-8">
                
                {/* Imagem do Evento */}
                <div className="w-full h-64 sm:h-96 bg-gray-300 flex items-center justify-center relative overflow-hidden group">
                    <img 
                        src={imagemSrc}
                        alt={event.nome}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* Badge de status */}
                    <div className="absolute top-4 right-4 flex gap-2">
                        {event.aoVivo && (
                            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse shadow-md">
                                AO VIVO
                            </span>
                        )}
                        {/* Categoria */}
                        {event.categoria && (
                             <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                                {event.categoria}
                            </span>
                        )}
                    </div>
                </div>

                <div className="p-6 sm:p-10">
                    <button 
                        onClick={handleBack} 
                        className="mb-6 text-blue-600 hover:text-blue-800 font-semibold text-lg flex items-center gap-2 transition-colors"
                    >
                        <span>&larr;</span> Voltar
                    </button>
                    
                    <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-2 leading-tight">
                        {event.nome}
                    </h1>
                    <p className="text-gray-500 text-lg mb-8 flex items-center gap-2">
                        <span>📅</span> {dataFormatada}
                    </p>
                    
                    {/* Grid de Informações */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        <InfoItem icon="🕒" label="Horário" value={horarioExibicao} />
                        <InfoItem icon="📍" label="Local" value={event.local} />
                        
                        {/* Campos que não existem no banco ganham valores padrão */}
                        <InfoItem 
                            icon="🎂" 
                            label="Faixa Etária" 
                            value="Livre" 
                        />
                        <InfoItem 
                            icon="🎟️" 
                            label="Valor" 
                            value={precoDisplay} 
                        />
                        <InfoItem 
                            icon="✅" 
                            label="Acesso" 
                            value="Entrada Livre" 
                        />
                        <InfoItem 
                            icon="👥" 
                            label="Confirmados" 
                            value={`${event.confirmacoes || 0} pessoas`} 
                        />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Sobre o Evento</h2>
                    <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                        {event.descricao}
                    </p>

                    {/* Botão de Ação */}
                    <div className="mt-10">
                        <button 
                            className="w-full sm:w-auto bg-green-600 text-white font-bold py-4 px-8 rounded-xl hover:bg-green-700 transition transform hover:scale-105 shadow-lg"
                            onClick={() => alert("Funcionalidade de Check-in em desenvolvimento!")} // Conectar com CheckInController depois
                        >
                            Confirmar Presença (+10 Capibas)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetailPage;