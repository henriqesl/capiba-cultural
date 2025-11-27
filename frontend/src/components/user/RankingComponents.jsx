import React, { useRef } from 'react';
import { Icon } from './UserShared';
import { ICONS } from '../../utils/icons';

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