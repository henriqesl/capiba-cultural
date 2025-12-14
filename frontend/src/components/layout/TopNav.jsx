import React from 'react';
import { Home, Calendar, CircleStar, Star, User, LogOut } from 'lucide-react'; 
import { useAuth } from '../../context/AuthContext'; 

const NavItem = ({ href, icon: Icon, label, active = false }) => {
    const activeClass = active ? 'text-white border-b-2 border-white' : 'text-blue-200 border-b-2 border-transparent hover:text-white';
    
    return (
        <a href={href} className={`flex items-center gap-2 py-2 px-3 transition-all duration-200 ${activeClass}`}>
            <Icon className="w-5 h-5" />
            <span className="text-sm font-medium">{label}</span>
        </a>
    );
};

const TopNav = ({ currentPath }) => {
    const { logout } = useAuth(); 

    return (
        <nav className="hidden md:flex w-full bg-blue-600 border-b border-blue-700 shadow-md py-3 px-6 justify-between items-center sticky top-0 z-50">
            <div className="flex justify-center items-center gap-6 mx-auto">
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

            {/* Botão de Logout no canto direito */}
            <button 
                onClick={logout}
                className="absolute right-8 flex items-center gap-2 text-blue-200 hover:text-red-300 transition-colors font-medium text-sm"
                title="Sair da conta"
            >
                <LogOut className="w-5 h-5" />
                <span>Sair</span>
            </button>
        </nav>
    );
};

export default TopNav;