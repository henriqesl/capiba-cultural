import React from 'react';
import { Users, Calendar, MapPin, ArrowRight } from 'lucide-react';
import placeholderImg from '../../assets/profile-placeholder.png';
import DefaultCaravanaImage from '../../assets/caravana_padrao.png';

const BASE_URL_BACKEND = 'http://localhost:3000';

const CaravanaItem = ({ caravana, onClick }) => {
    
    const resolveImageUrl = (path, isAvatar = false) => {
        if (!path) return isAvatar ? placeholderImg : DefaultCaravanaImage;
        if (path.startsWith('http')) return path;
        const cleanPath = path.startsWith('/') ? path.substring(1) : path;
        return `${BASE_URL_BACKEND}/${cleanPath}`;
    };

    const formattedDate = caravana.evento?.data 
        ? new Date(caravana.evento.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) 
        : '--/--';

    const membersCount = caravana.membros?.length || 0;

    return (
        <div onClick={onClick} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all mb-4 relative overflow-hidden group cursor-pointer">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            
            <div className="flex justify-between items-start mb-3 pl-3">
                <div>
                    <h3 className="font-bold text-lg text-gray-800 leading-tight">{caravana.nome}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <MapPin size={12} className="text-red-500" />
                        <span className="truncate max-w-[180px] font-medium">{caravana.evento?.local || "Local a definir"}</span>
                    </div>
                </div>
                
                <div className="flex flex-col items-end">
                    <div className="w-9 h-9 rounded-full border-2 border-white shadow-sm overflow-hidden bg-gray-100" title={`Líder: ${caravana.criador?.nome}`}>
                        <img 
                            src={resolveImageUrl(caravana.criador?.foto, true)} 
                            alt="Criador" 
                            className="w-full h-full object-cover"
                            onError={(e) => e.target.src = placeholderImg}
                        />
                    </div>
                    <span className="text-[9px] text-gray-400 font-bold mt-0.5 uppercase tracking-wide">Líder</span>
                </div>
            </div>

            <div className="pl-3 mt-4 flex justify-between items-end">
                
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg text-blue-700">
                    <Users size={16} />
                    <span className="text-xs font-bold">{membersCount} Membros</span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                        <Calendar size={14} />
                        <span className="text-xs font-bold">{formattedDate}</span>
                    </div>
                    <div className="bg-blue-50 text-blue-600 p-2 rounded-full hover:bg-blue-100 transition-colors">
                        <ArrowRight size={18} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CaravanaItem;