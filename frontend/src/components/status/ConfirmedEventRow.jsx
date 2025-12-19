import React from 'react';
import { MapPin, Clock } from 'lucide-react';

const ConfirmedEventRow = ({ evento }) => {
    if (!evento) return null;

    const getImageUrl = (url) => {
        if (!url) return "https://via.placeholder.com/150?text=Sem+Foto";

        return url.startsWith('http') ? url : `http://localhost:3000${url.startsWith('/') ? '' : '/'}${url}`;
    };

    return (
        <div className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm items-center hover:border-blue-200 transition-colors">
            
            <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                <img 
                    src={getImageUrl(evento.imagemUrl)} 
                    alt={evento.nome} 
                    className="w-full h-full object-cover" 
                    onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=Erro"; }}
                />
            </div>
            
            <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-800 text-sm sm:text-base truncate">{evento.nome}</h4>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <MapPin size={12} className="shrink-0"/>
                    <span className="truncate">{evento.local}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                    <Clock size={12} className="shrink-0"/>
                    <span>{new Date(evento.data).toLocaleDateString('pt-BR')}</span>
                </div>
            </div>

            <div className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shrink-0 border border-green-200">
                Visitado
            </div>
        </div>
    );
};

export default ConfirmedEventRow;