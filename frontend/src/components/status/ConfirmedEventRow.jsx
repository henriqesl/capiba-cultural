import React from 'react';
import { Calendar, MapPin, CheckCircle2 } from 'lucide-react';

const ConfirmedEventRow = ({ evento, data }) => {
    // Formatação de data amigável (Ex: 17 Dez • 15:30)
    const formatarData = (dataString) => {
        if (!dataString) return "--/--";
        const date = new Date(dataString);
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    // Proteção caso o evento tenha sido deletado do banco mas o check-in exista
    const nomeEvento = evento?.nome || "Evento Removido";
    const localEvento = evento?.local || "Local desconhecido";
    const imagemEvento = evento?.imagemUrl || null;

    return (
        <div className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-l-4 border-transparent hover:border-green-500">
            {/* Ícone ou Imagem Pequena */}
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden border border-gray-200">
                {imagemEvento ? (
                    <img src={imagemEvento} alt={nomeEvento} className="w-full h-full object-cover" />
                ) : (
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                )}
            </div>

            {/* Informações */}
            <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-800 text-sm truncate">{nomeEvento}</h4>
                
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatarData(data)}
                    </span>
                    <span className="flex items-center gap-1 truncate max-w-[120px]">
                        <MapPin className="w-3 h-3" />
                        {localEvento}
                    </span>
                </div>
            </div>

            {/* Status (Sempre Confirmado pois está no histórico) */}
            <div className="text-right">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Confirmado
                </span>
            </div>
        </div>
    );
};

export default ConfirmedEventRow;