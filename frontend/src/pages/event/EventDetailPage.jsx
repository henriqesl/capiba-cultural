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

const EventDetailPage = ({ eventId, onBack }) => {
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetalhes = async () => {
            try {
                // Busca os detalhes específicos deste ID
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

    if (loading) {
        return (
            <div className="bg-gray-100 min-h-screen flex items-center justify-center">
                <span className="text-xl font-bold text-gray-500">Carregando detalhes...</span>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="bg-gray-100 min-h-screen p-8 text-center flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Evento não encontrado</h1>
                <button 
                    onClick={onBack}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    &larr; Voltar para Agenda
                </button>
            </div>
        );
    }

    // Formatações de dados vindos do Prisma
    const horarioExibicao = event.horario || new Date(event.data).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dataFormatada = new Date(event.data).toLocaleDateString('pt-BR');

    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-8 pb-24">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mt-4 sm:mt-8">
                
                {/* Imagem do Evento (Usa a URL do banco ou Placeholder) */}
                <div className="w-full h-64 sm:h-96 bg-gray-300 flex items-center justify-center relative overflow-hidden">
                    {event.imagemUrl ? (
                        <img 
                            src={event.imagemUrl} 
                            alt={event.nome} 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="text-gray-500 flex flex-col items-center">
                            <span className="text-4xl mb-2">📷</span>
                            <span>Sem imagem disponível</span>
                        </div>
                    )}
                    {/* Badge de status */}
                    <div className="absolute top-4 right-4 flex gap-2">
                        {event.aoVivo && (
                            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse shadow-md">
                                AO VIVO
                            </span>
                        )}
                        {!event.ativo && (
                            <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                                ENCERRADO
                            </span>
                        )}
                    </div>
                </div>

                <div className="p-6 sm:p-10">
                    <button 
                        onClick={onBack} 
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
                    
                    {/* Grid de Informações usando os campos novos do Schema */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        <InfoItem icon="🕒" label="Horário" value={horarioExibicao} />
                        <InfoItem icon="📍" label="Local" value={event.local} />
                        <InfoItem 
                            icon="🎂" 
                            label="Faixa Etária" 
                            value={event.faixaEtaria === 0 ? 'Livre' : `${event.faixaEtaria}+ anos`} 
                        />
                        <InfoItem 
                            icon="🎟️" 
                            label="Valor" 
                            value={event.preco || "Gratuito"} 
                        />
                        <InfoItem 
                            icon={event.precisaInscricao ? "📝" : "✅"} 
                            label="Acesso" 
                            value={event.precisaInscricao ? "Precisa de Inscrição" : "Entrada Livre"} 
                        />
                        <InfoItem 
                            icon="👥" 
                            label="Confirmados" 
                            value={`${event.confirmacoes} pessoas`} 
                        />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Sobre o Evento</h2>
                    <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                        {event.descricao}
                    </p>

                    {/* Botão de Ação (Ex: Comprar ou Inscrever) */}
                    <div className="mt-10">
                        <button className="w-full sm:w-auto bg-green-600 text-white font-bold py-4 px-8 rounded-xl hover:bg-green-700 transition transform hover:scale-105 shadow-lg">
                            {event.precisaInscricao ? "Realizar Inscrição" : "Confirmar Presença"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetailPage;

/*
  [INTEGRAÇÃO]
  Rota: GET /eventos/:id
  
  Dados que o Backend retorna (Evento.js Model):
  - nome -> title
  - data -> time (precisa formatar)
  - local -> location
  - descricao -> description
  
  O QUE FALTA NO BACKEND:
  O layout pede campos que não existem na tabela `eventos`:
  1. `price` (Valor/Preço)
  2. `age` (Faixa Etária)
  3. `needsRegistration` (Se precisa de inscrição)
  4. `imagemUrl` (Foto do evento)
  
  Ação: Precisamos adicionar essas colunas no `schema.prisma` ou remover esses campos da tela por enquanto.
*/