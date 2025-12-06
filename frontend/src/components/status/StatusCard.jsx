import React from 'react';

const StatusCard = ({ 
    variant = 'mission', 
    title, 
    description, 
    progress, 
    total, 
    reward, 
    isUnlocked = false 
}) => {
  
  // === VARIAÇÃO: MISSÃO (Com barra de progresso) ===
  if (variant === 'mission') {
    const percentage = Math.min((progress / total) * 100, 100);
    return (
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-xl text-gray-800">{title}</h3>
          {reward && (
            <span className="text-sm bg-blue-600 text-white px-3 py-1 rounded-full font-semibold">
              {reward}
            </span>
          )}
        </div>
        
        {/* Barra de Progresso */}
        <div className="w-full bg-gray-200 rounded-full h-8 mb-2">
          <div 
            className="bg-blue-600 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold transition-all duration-300"
            style={{ width: `${percentage}%` }}
          >
            {progress > 0 && `${progress}/${total}`}
          </div>
        </div>
        
        <p className="text-sm text-gray-500">
          Progresso: {progress} de {total}
        </p>
      </div>
    );
  }

  // === VARIAÇÃO: CONQUISTA (Com ícone de bloqueio/troféu) ===
  if (variant === 'achievement') {
    return (
      <div 
        className={`p-6 rounded-lg shadow-md transition-all hover:shadow-lg ${
          isUnlocked 
            ? 'bg-white border-2 border-blue-600' 
            : 'bg-gray-100 border-2 border-gray-400 opacity-75'
        }`}
      >
        <div className="flex items-start gap-4">
          <span className="text-4xl">
            {isUnlocked ? '🏆' : '🔒'}
          </span>
          <div>
            <h3 className="font-bold text-lg text-gray-800">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default StatusCard;