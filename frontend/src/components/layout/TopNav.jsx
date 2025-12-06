import React from 'react';
// 1. Importando os ícones da Lucide
import { Home, Calendar, CircleStar, Star, User } from 'lucide-react';

// 2. NavItem agora recebe 'icon' (o componente) em vez de 'iconPath'
// Note o uso de "icon: Icon" na desestruturação para podermos usar como <Icon /> no JSX
const NavItem = ({ href, icon: Icon, label, active = false }) => {
    const activeClass = active ? 'text-white border-b-2 border-white' : 'text-gray-300 border-b-2 border-transparent';
    
    return (
        <a href={href} className={`flex items-center gap-2 py-4 px-2 transition hover:scale-105 hover:text-white ${activeClass} transition-all duration-200`}>
            {/* 3. Renderiza o componente do ícone diretamente */}
            <Icon className="w-5 h-5" />
            <span className="text-sm font-medium">{label}</span>
        </a>
    );
};

const TopNav = ({ currentPath }) => {
    return (
        <nav className="hidden md:flex w-full bg-blue-600 border-b border-gray-200 py-2">
            <div className="flex justify-around items-center w-full max-w-4xl mx-auto px-4">
                {/* 4. Passando os componentes importados diretamente nas props */}
                <NavItem 
                    href="#/home" 
                    icon={Home} 
                    label="Início" 
                    active={currentPath === '#/home'} 
                />
                <NavItem 
                    href="#/eventos" 
                    icon={Calendar} 
                    label="Agenda" 
                    active={currentPath === '#/eventos'} 
                />
                <NavItem 
                    href="#/capiba" 
                    icon={CircleStar} 
                    label="Capiba" 
                    active={currentPath === '#/capiba'} 
                />
                <NavItem 
                    href="#/status" 
                    icon={Star} 
                    label="Status" 
                    active={currentPath === '#/status'} 
                />
                <NavItem 
                    href="#/perfil" 
                    icon={User} 
                    label="Perfil" 
                    active={currentPath.startsWith('#/perfil')} 
                />
            </div>
        </nav>
    );
};

export default TopNav;