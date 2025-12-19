import React, { useRef } from "react";
import { Icon } from "./UserShared";
import { ICONS } from "../../utils/icons";
import { Crown } from "lucide-react";

// 🟢 CORREÇÃO: Importar a imagem em vez de usar string
// Certifique-se que a imagem existe em src/assets/profile-placeholder.png
// Se não existir, use uma URL pública como fallback
import placeholderImg from "../../assets/profile-placeholder.png"; 

// Fallback de segurança caso a importação falhe ou a imagem não exista
const FALLBACK_URL = "https://via.placeholder.com/150/e2e8f0/94a3b8?text=User";

const getAvatarUrl = (avatarPath) => {
  if (!avatarPath) return placeholderImg || FALLBACK_URL;
  
  return avatarPath.startsWith('http') 
    ? avatarPath 
    : `http://localhost:3000${avatarPath.startsWith('/') ? '' : '/'}${avatarPath}`;
};

export const RankingRow = ({ user, position }) => {
  const avatarSrc = getAvatarUrl(user.avatar);

  return (
    <div className="flex items-center p-4 bg-white border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-all">
      <div className="w-8 text-center font-bold text-gray-400 text-lg">
        {position}
      </div>

      <div className="flex items-center gap-3 ml-4 flex-1">
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0 border border-gray-100">
          <img 
            src={avatarSrc} 
            alt={user.name} 
            className="w-full h-full object-cover"
            // Se der erro, tenta o importado, se falhar, vai pro url online
            onError={(e) => {
                if (e.target.src !== placeholderImg) {
                    e.target.src = placeholderImg;
                } else {
                    e.target.src = FALLBACK_URL;
                }
            }} 
          />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-gray-800 text-sm md:text-base line-clamp-1">
            {user.name}
          </span>
          
          <span className="text-xs text-gray-400">
            {user.email ? `@${user.email.split("@")[0]}` : ''}
          </span>
        </div>
      </div>

      <div className="font-bold text-blue-600 whitespace-nowrap">
        {user.saldoMoedaCapiba} pts
      </div>
    </div>
  );
};

export const UserPodium = ({ user, position, isWinner = false, delay = 0 }) => {
  const heightClass = isWinner ? "h-40" : "h-32";
  const colorClass = isWinner
    ? "bg-yellow-400"
    : position === 2
      ? "bg-gray-300"
      : "bg-orange-300";
  const borderClass = isWinner ? "border-yellow-200" : "border-white/20";

  const avatarSrc = getAvatarUrl(user.avatar);

  return (
    <div
      className={`flex flex-col items-center justify-end ${isWinner ? "-mt-6 z-10" : ""} animate-fade-in-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative mb-2">
        {isWinner && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow-300 animate-bounce">
            <Crown className="w-6 h-6 fill-current" />
          </div>
        )}

        <div
          className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-4 ${borderClass} shadow-lg overflow-hidden bg-white`}
        >
          <img 
            src={avatarSrc} 
            alt={user.name} 
            className="w-full h-full object-cover"
            onError={(e) => e.target.src = placeholderImg || FALLBACK_URL}
          />
        </div>

        <div
          className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full ${colorClass} text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm`}
        >
          {position}
        </div>
      </div>

      <div className="text-center mb-1">
        <p className="text-white font-bold text-sm md:text-base line-clamp-1 max-w-[80px] md:max-w-[100px]">
          {user.name ? user.name.split(" ")[0] : "Usuário"} 
        </p>
        <p className="text-blue-200 text-xs font-medium">
          {user.saldoMoedaCapiba} pts
        </p>
      </div>

      <div
        className={`w-full ${heightClass} ${colorClass} rounded-t-lg opacity-80 backdrop-blur-sm shadow-inner`}
      ></div>
    </div>
  );
};

export const GroupItem = ({ avatarSrc, name, points, rank }) => (
  <div className="flex items-center bg-gray-50 p-4 rounded-xl shadow-sm hover:bg-gray-100 transition-all duration-200">
    <img
      src={getAvatarUrl(avatarSrc)} 
      alt={name}
      className="w-14 h-14 rounded-full object-cover shrink-0"
      onError={(e) => {
        e.target.src = placeholderImg || FALLBACK_URL;
      }}
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

export const TeamStories = ({ teams }) => {
  const scrollContainerRef = useRef(null);

  const handleScroll = (direction) => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 150;
    if (direction === "prev") {
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    } else {
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full mb-8">
      <button
        onClick={() => handleScroll("prev")}
        className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-md hover:bg-white transition-all md:hidden"
      >
        <Icon path={ICONS.arrowLeft} className="w-6 h-6 text-gray-700" />
      </button>

      <div
        ref={scrollContainerRef}
        className="flex justify-center gap-6 overflow-x-auto pb-2 scroll-smooth md:justify-center"
      >
        {teams.map((team) => (
          <img
            key={team.id}
            src={getAvatarUrl(team.src)} 
            alt={team.alt}
            className="w-16 h-16 rounded-full object-cover shrink-0 border-2 border-white shadow-md cursor-pointer hover:scale-110 transition-transform"
            onError={(e) => e.target.src = placeholderImg || FALLBACK_URL}
          />
        ))}
      </div>

      <button
        onClick={() => handleScroll("next")}
        className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-md hover:bg-white transition-all md:hidden"
      >
        <Icon
          path={ICONS.arrowLeft}
          className="w-6 h-6 text-gray-700 transform rotate-180"
        />
      </button>
    </div>
  );
};