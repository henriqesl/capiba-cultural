import React from 'react';

const BASE_URL = 'http://localhost:3000'; // OU a URL do seu backend

// 🚨 A prop 'image' deve ser desestruturada aqui!
const EventCard = ({ title, time, location, href, className = '', onClick, image, ...props }) => { 
    
    const Tag = href ? 'a' : 'div';
    
    const imageUrl = image 
        ? image
        : '/placeholder-path.png'; // Caminho para um placeholder estático
        
    const interactProps = href ? { href } : { onClick };

    return (
        <Tag 
            className={`
                w-full bg-white text-gray-800 rounded-xl shadow-lg border border-gray-200 
                p-4 
                flex items-center justify-between
                text-left
                hover:shadow-xl hover:scale-[1.01] transition-all duration-200
                cursor-pointer
                ${className}
            `}
            {...interactProps}
            {...props}
        >
            {/* 1. CONTAINER DA IMAGEM (Substitui o quadrado cinza) */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden shrink-0 ml-0 mr-4 bg-gray-300 flex items-center justify-center">
                {image ? (
                    <img 
                        src={imageUrl} 
                        alt={title} 
                        className="w-full h-full object-cover" 
                    />
                ) : (
                    <span className="text-gray-500 text-xs">Sem Imagem</span>
                )}
            </div>
            
            {/* 2. CONTAINER DO TEXTO */}
            <div className="flex flex-col flex-grow min-w-0">
                <span className='font-bold text-lg sm:text-xl truncate mb-1'>{title}</span>
                <span className='text-sm sm:text-base text-blue-600 font-semibold mb-1'>🕒 {time}</span>
                <span className='text-sm sm:text-base text-gray-500 truncate'>📍 {location}</span>
            </div>
            
            {/* Botão de Detalhes (Opcional, para indicar clique) */}
            <div className="shrink-0 ml-4 text-blue-500 text-2xl font-bold">
                &rarr;
            </div>
        </Tag>
    );
};

export default EventCard;