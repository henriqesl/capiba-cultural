import React from 'react';
import { Icon } from '../user/PersonalComponents.jsx';
import { ICONS } from '../../utils/icons.jsx';

const NavItem = ({ href, iconPath, label, active = false }) => {
    const activeClass = active ? 'text-white border-b-2 border-white' : 'text-gray-300 border-b-2 border-transparent';
    return (
        <a href={href} className={`flex items-center gap-2 py-4 px-2 transition hover:scale-105 hover:text-white ${activeClass} transition-all duration-200`}>
            <Icon path={iconPath} className="w-5 h-5" />
            <span className="text-sm font-medium">{label}</span>
        </a>
    );
};

const TopNav = ({ currentPath }) => {
    return (
        <nav className="hidden md:flex w-full bg-blue-600 border-b border-gray-200 py-2">
            <div className="flex justify-around items-center w-full max-w-4xl mx-auto px-4">
                <NavItem href="#/home" iconPath={ICONS.home} label="Início" active={currentPath === '#/home'} />
                <NavItem href="#/eventos" iconPath={ICONS.calendar} label="Agenda" active={currentPath === '#/eventos'} />
                <NavItem href="#/capiba" iconPath={ICONS.dollar} label="Capiba" active={currentPath === '#/capiba'} />
                <NavItem href="#/status" iconPath={ICONS.star} label="Status" active={currentPath === '#/status'} />
                <NavItem href="#/perfil" iconPath={ICONS.user} label="Perfil" active={currentPath.startsWith('#/perfil')} />
            </div>
        </nav>
    );
};

export default TopNav;