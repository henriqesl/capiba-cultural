import React, { useState } from 'react';
import api from '../services/api';

import MenuScreen from '../components/checkin/MenuScreen';
import ScannerScreen from '../components/checkin/ScannerScreen';
import ReportForm from '../components/checkin/ReportForm';
import SuggestForm from '../components/checkin/SuggestForm';
import RecifeSpotsPage from '../components/checkin/RecifeSpotsPage'; // <--- IMPORTADO

const CheckInPage = () => {
    const [view, setView] = useState('menu'); 
    const [loading, setLoading] = useState(false);

    const handleScanResult = async (result) => {
        if (!result || loading) return; 

        if (result.startsWith('http') || result.length > 50) return;

        const eventoId = result.replace(/\D/g, '');
        if (!eventoId) return;

        setLoading(true);

        try {
            const response = await api.post('/checkin', { eventoId: Number(eventoId) });
            const moedas = response.data.moedasGanhas || 0;
            
            setTimeout(() => {
                alert(`✅ SUCESSO!\nCheck-in confirmado!\n💰 +${moedas} Capibas`);
                setView('menu');
            }, 100);

        } catch (error) {
            const msg = error.response?.data?.erro || "Erro no check-in.";
            setTimeout(() => {
                if (msg.includes("já fez check-in")) alert(`⚠️ Você já fez check-in neste evento.`);
                else alert(`❌ ERRO: ${msg}`);
                setView('menu');
            }, 100);
        } finally {
            setLoading(false);
        }
    };

    // --- ROTEAMENTO DAS TELAS ---

    if (view === 'menu') {
        return (
            <MenuScreen 
                onScan={() => setView('scanner')} 
                onReport={() => setView('report')} 
                onSuggest={() => setView('suggest')}
                onSpots={() => setView('spots')} // <--- NOVA PROPS
            />
        );
    }

    if (view === 'spots') { // <--- NOVA TELA (LOCAIS CULTURAIS)
        return <RecifeSpotsPage onBack={() => setView('menu')} />;
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