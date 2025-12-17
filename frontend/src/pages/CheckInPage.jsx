import React, { useState } from 'react';
import api from '../services/api';

import MenuScreen from '../components/checkin/MenuScreen';
import ScannerScreen from '../components/checkin/ScannerScreen';
import ReportForm from '../components/checkin/ReportForm';
import SuggestForm from '../components/checkin/SuggestForm';
// ⬅️ Importar o novo componente
import CapibaSourcesPage from '../components/checkin/RecifeSpotsPage'; 

const CheckInPage = () => {
    // 'menu' | 'report' | 'suggest' | 'scanner' | 'sources' ⬅️ Novo estado
    const [view, setView] = useState('menu'); 
    const [loading, setLoading] = useState(false);

    // Função que recebe o texto lido pelo QR Code
    const handleScanResult = async (result) => {
        if (!result || loading) return; // Se já estiver carregando, ignora

        // 1. FILTRO DE RUÍDO (Evita ler rosto, URLs aleatórias, etc)
        // Se for uma URL externa ou texto muito longo/curto estranho, ignora
        if (result.startsWith('http') || result.length > 50 || result.length < 1) {
            console.log("Leitura ignorada (formato inválido):", result);
            return; // Retorna sem fazer nada, o scanner continua rodando
        }

        // 2. Tenta extrair apenas o ID numérico
        const eventoId = result.replace(/\D/g, '');

        // Se não conseguiu extrair nenhum número (ex: leu um texto "Olá Mundo")
        if (!eventoId) {
            console.log("Leitura ignorada (sem ID numérico):", result);
            return; // Ignora silenciosamente
        }

        // Se passou pelos filtros, aí sim paramos para processar
        setLoading(true);

        try {
            // Chama a API de Check-in
            const response = await api.post('/checkin', { 
                eventoId: Number(eventoId) 
            });

            // Sucesso!
            const moedas = response.data.moedasGanhas || 0;
            
            // Pequeno delay para garantir que o usuário veja que travou a câmera
            setTimeout(() => {
                alert(`✅ SUCESSO!\nCheck-in realizado no evento ${eventoId}.\n💰 Você ganhou ${moedas} moedas Capiba!`);
                setView('menu');
            }, 100);

        } catch (error) {
            console.error("Erro checkin:", error);
            
            const msg = error.response?.data?.erro || "Erro ao validar check-in.";
            
            // Só exibe alerta se for erro do backend (ex: Duplicidade ou ID não existe)
            setTimeout(() => {
                if (msg.includes("já fez check-in")) {
                    alert(`⚠️ JÁ VISITADO\nVocê já marcou presença neste evento.`);
                } else {
                    alert(`❌ ERRO NO CHECK-IN\n${msg}`);
                }
                setView('menu');
            }, 100);
            
        } finally {
            setLoading(false);
        }
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