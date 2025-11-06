import React from 'react';
import { ICONS } from '../utils/icons';
import perfil_image from '../assets/foto_perfil.png';

export const Icon = ({ path, className = "w-6 h-6" }) => (
    <svg xmlns={perfil_image} viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d={path} clipRule="evenodd" />
    </svg>
);

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

export const PerfilImage = (img={profile_image}) => {
    <img
        src={perfil_image}
        alt="Foto do perfil de Júnior Cruz"
        className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg transition-all duration-300"
    />
}

