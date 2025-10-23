import React from 'react';
import capiba_logo from '../assets/logo_capiba.png'

const CapibaLogo = () => (
    <img
        src={capiba_logo}
        alt="Logo da Moeda Capiba"
        className="h-32 w-32 rounded-full object-cover shadow-lg"
        onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/128x128/cccccc/ffffff?text=Erro'; }}
    />
);

export default CapibaLogo;
