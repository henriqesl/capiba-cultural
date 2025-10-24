import React from 'react';
import { Icon } from './ProfileComponents';
import { ICONS } from '../utils/icons.jsx';

const NavItem = ({ iconPath, label, active = false }) => {
    const activeClass = active ? 'text-white border-gray-600' : 'text-gray-400 border-transparent';
    return (
        <button className={`flex items-center gap-2 py-4 px-2 transition hover:scale-105 hover:text-blue-800 border-b-2 ${activeClass} transition-all duration-200`}>
            <Icon path={iconPath} className="w-5 h-5" />
            <span className="text-sm font-medium">{label}</span>
        </button>
    );
};

const TopNav = () => {
    return (
        <nav className="hidden md:flex w-full bg-blue-600 border-b border-gray-200 py-2">
            <div className="flex justify-around items-center w-full max-w-4xl mx-auto px-4">
                <NavItem iconPath={ICONS.home} label="Início" />
                <NavItem iconPath={ICONS.calendar} label="Agenda" />
                <NavItem iconPath={ICONS.dollar} label="Saldo" />
                <NavItem iconPath={ICONS.star} label="Favoritos" />
                <NavItem iconPath={ICONS.user} label="Perfil" active={true} />
            </div>
        </nav>
    );
};

export default TopNav;

