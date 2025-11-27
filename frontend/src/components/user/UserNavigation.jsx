import React from 'react';
import { Icon } from './UserShared'; // Reutiliza o Icon do Shared
import { ICONS } from '../../utils/icons';

export const NavCard = ({ href, iconPath, title, description }) => (
  <a 
    href={href}
    className="
      flex items-center p-6 bg-white rounded-2xl shadow-lg 
      transition-all duration-300 transform 
      hover:shadow-xl hover:-translate-y-1"
  >
    <div className="p-4 bg-blue-100 rounded-full">
      <Icon path={iconPath} className="w-8 h-8 text-blue-600" />
    </div>
    <div className="ml-5">
      <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
    <Icon path={ICONS.arrowLeft} className="w-6 h-6 text-gray-400 ml-auto transform rotate-180" />
  </a>
);