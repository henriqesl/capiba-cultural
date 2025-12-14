import React from 'react';
import { ICONS } from '../../utils/icons'; 


// Wrapper de Ícone genérico (Atomic Component)
export const Icon = ({ path, className = "w-6 h-6" }) => (
     <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
     >
    <path fillRule="evenodd" d={path} clipRule="evenodd" />
     </svg>
);

// Foto de Perfil Padrão (Molecule Component)
// 🔑 CORRIGIDO: Agora o componente aceita a prop 'imageUrl' e a usa.
export const PerfilImage = ({ imageUrl }) => { 
    // Garante que o alt seja dinâmico ou genérico
     return (
    <img
        src={imageUrl} // 🔑 AQUI VAI A URL DINÂMICA (usuário ou placeholder)
        alt="Foto de perfil do usuário"
        className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg transition-all duration-300"
    />
     );
};

// Linha de Informação (Molecule Component)
export const InfoRow = ({ label, value }) => (
    <div className="flex justify-between items-center py-4 border-b border-gray-200 group hover:bg-gray-50 px-2 rounded-lg transition-colors">
    <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-semibold text-gray-800">{value}</p>
    </div>
    <button className="text-gray-400 hover:text-blue-600 transition hover:scale-105 opacity-0 group-hover:opacity-100">
        <Icon path={ICONS.pencil} />
    </button>
     </div>
);

/*
O banco de dados não tem campo para salvar a URL da foto de perfil (veja Usuario.js model).
Por enquanto, vamos usar essa imagem padrão estática mesmo.
*/
// Você pode remover este comentário antigo.