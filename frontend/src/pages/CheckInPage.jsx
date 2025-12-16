import React, { useState } from 'react';

import MenuScreen from '../components/checkin/MenuScreen';
import ScannerScreen from '../components/checkin/ScannerScreen';
import ReportForm from '../components/checkin/ReportForm';
import SuggestForm from '../components/checkin/SuggestForm';

const CheckInPage = () => {
    // 'menu' | 'report' | 'suggest' | 'scanner'
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

    return null;
};

export default CheckInPage;