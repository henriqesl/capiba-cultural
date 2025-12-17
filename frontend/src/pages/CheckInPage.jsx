import React, { useState } from 'react';

import MenuScreen from '../components/checkin/MenuScreen';
import ScannerScreen from '../components/checkin/ScannerScreen';
import ReportForm from '../components/checkin/ReportForm';
import SuggestForm from '../components/checkin/SuggestForm';
// ⬅️ Importar o novo componente
import CapibaSourcesPage from '../components/checkin/RecifeSpotsPage'; 

const CheckInPage = () => {
    // 'menu' | 'report' | 'suggest' | 'scanner' | 'sources' ⬅️ Novo estado
    const [view, setView] = useState('menu'); 

    const handleScanResult = (result) => {
        alert(`QR Code lido: ${result}. Redirecionando...`);
        // Lógica de check-in
        setTimeout(() => setView('menu'), 500); 
    };

    if (view === 'menu') {
        return (
            <MenuScreen 
                onScan={() => setView('scanner')} 
                onReport={() => setView('report')} 
                onSuggest={() => setView('suggest')}
                // ⬅️ Nova função para navegar
                onShowSources={() => setView('sources')}
            />
        );
    }

    if (view === 'report') {
        return <ReportForm onBack={() => setView('menu')} />;
    }

    if (view === 'suggest') {
        return <SuggestForm onBack={() => setView('menu')} />;
    }
    
    if (view === 'scanner') {
        return <ScannerScreen onBack={() => setView('menu')} onScanResult={handleScanResult} />;
    }
    
    // ⬅️ Nova renderização
    if (view === 'sources') {
        return <CapibaSourcesPage onBack={() => setView('menu')} />;
    }

    return null;
};

export default CheckInPage;