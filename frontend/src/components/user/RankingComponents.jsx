import React, { useRef } from 'react';
import { Icon } from './UserShared';
import { ICONS } from '../../utils/icons';
import { Crown } from 'lucide-react';

export const RankingRow = ({ user, position }) => (
  <div className="flex items-center p-4 bg-white border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-all">
    
    {/* Posição */}
    <div className="w-8 text-center font-bold text-gray-400 text-lg">
      {position}
    </div>

    {/* Avatar + Nome */}
    <div className="flex items-center gap-3 ml-4 flex-1">
      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0 border border-gray-100">
         {/* Placeholder visual com a inicial do nome */}
         <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold">
            {user.nome ? user.nome.charAt(0).toUpperCase() : '?'}
         </div>
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-gray-800 text-sm md:text-base line-clamp-1">
            {user.nome}
        </span>
        {/* Exibe email truncado ou @handle fictício */}
        <span className="text-xs text-gray-400">
            @{user.email.split('@')[0]}
        </span>
      </div>
    </div>

    {/* Pontuação */}
    <div className="font-bold text-blue-600 whitespace-nowrap">
      {user.saldoMoedaCapiba} pts
    </div>
  </div>
);


export const UserPodium = ({ user, position, isWinner = false, delay = 0 }) => {
    // alturas diferentes para simular degraus do pódio
    const heightClass = isWinner ? 'h-40' : 'h-32';
    const colorClass = isWinner ? 'bg-yellow-400' : (position === 2 ? 'bg-gray-300' : 'bg-orange-300');
    const borderClass = isWinner ? 'border-yellow-200' : 'border-white/20';

    return (
        <div 
            className={`flex flex-col items-center justify-end ${isWinner ? '-mt-6 z-10' : ''} animate-fade-in-up`}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="relative mb-2">
                {isWinner && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow-300 animate-bounce">
                        <Crown className="w-6 h-6 fill-current" />
                    </div>
                )}
                
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-4 ${borderClass} shadow-lg overflow-hidden bg-white`}>
                     {/* Placeholder de Imagem */}
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 font-bold text-xl">
                        {user.nome.charAt(0)}
                    </div>
                </div>
                
                <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full ${colorClass} text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm`}>
                    {position}
                </div>
            </div>

            <div className="text-center mb-1">
                <p className="text-white font-bold text-sm md:text-base line-clamp-1 max-w-[80px] md:max-w-[100px]">
                    {user.nome.split(' ')[0]} {/* Só o primeiro nome */}
                </p>
                <p className="text-blue-200 text-xs font-medium">
                    {user.saldoMoedaCapiba} pts
                </p>
            </div>

            {/* Degrau do Pódio Visual */}
            <div className={`w-full ${heightClass} ${colorClass} rounded-t-lg opacity-80 backdrop-blur-sm shadow-inner`}></div>
        </div>
    );
};

// Item da lista de grupos
export const GroupItem = ({ avatarSrc, name, points, rank }) => (
  <div className="flex items-center bg-gray-50 p-4 rounded-xl shadow-sm hover:bg-gray-100 transition-all duration-200">
    <img 
      src={avatarSrc} 
      alt={name} 
      className="w-14 h-14 rounded-full object-cover shrink-0" 
      onError={(e) => { e.target.src='https://placehold.co/64x64/e0e0e0/757575?text=IMG' }}
    />
    <div className="ml-4 grow">
      <p className="text-lg font-bold text-gray-800">{name}</p>
      <p className="text-sm text-gray-500">{points}</p>
    </div>
    <div className="ml-4 text-right shrink-0">
      <span className="text-2xl font-bold text-blue-600">{rank}º</span>
    </div>
  </div>
);

// Barra de Stories das Equipes
export const TeamStories = ({ teams }) => {
    const scrollContainerRef = useRef(null);
  
    const handleScroll = (direction) => {
      if (!scrollContainerRef.current) return;
      const scrollAmount = 150; 
      if (direction === 'prev') {
        scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    };
  
    return (
      <div className="relative w-full mb-8">
        <button 
          onClick={() => handleScroll('prev')}
          className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-md hover:bg-white transition-all md:hidden"
        >
          <Icon path={ICONS.arrowLeft} className="w-6 h-6 text-gray-700" />
        </button>
        
        <div 
          ref={scrollContainerRef}
          className="flex justify-center gap-6 overflow-x-auto pb-2 scroll-smooth md:justify-center"
        >
          {teams.map(team => (
            <img
              key={team.id}
              src={team.src}
              alt={team.alt}
              className="w-16 h-16 rounded-full object-cover shrink-0 border-2 border-white shadow-md cursor-pointer hover:scale-110 transition-transform"
            />
          ))}
        </div>
  
        <button 
          onClick={() => handleScroll('next')}
          className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-md hover:bg-white transition-all md:hidden"
        >
          <Icon path={ICONS.arrowLeft} className="w-6 h-6 text-gray-700 transform rotate-180" />
        </button>
      </div>
    );
};