import React from 'react';
import { Icon } from './ProfileComponents';
import { ICONS } from '../utils/icons.jsx';

const NavItem = ({ iconPath, label, active = false }) => {
    const activeClass = active ? 'text-blue-600' : 'text-gray-400';
    return (
        <button className={`flex flex-col items-center gap-1 hover:text-blue-600 transition-colors ${activeClass}`}>
            <Icon path={iconPath} className="w-7 h-7" />
            <span className="text-xs font-bold">{label}</span>
        </button>
    );
};

const BottomNav = () => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] px-4 py-2 md:hidden">
            <div className="flex justify-around items-center">
                <NavItem iconPath={ICONS.home} label="Início" />
                <NavItem iconPath={ICONS.calendar} label="Agenda" />
                <NavItem iconPath={ICONS.dollar} label="Saldo" />
                <NavItem iconPath={ICONS.star} label="Favoritos" />
                <NavItem iconPath={ICONS.user} label="Perfil" active={true} />
            </div>
        </nav>
    );
};

export default BottomNav;