import React, { useState } from 'react';
import CreateCaravanaPage from './CreateCaravanaPage'; // Ajuste o caminho conforme necessário
import JoinCaravanaPage from './JoinCaravanaPage';   // Ajuste o caminho conforme necessário

// --------------------------------------------------
// Sub-Componente: Tela de Escolha (Landing)
// --------------------------------------------------
const CaravanaLanding = ({ onCreateClick, onJoinClick }) => (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-xl text-center">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Gerenciar Caravanas</h2>
            <p className="text-gray-600 mb-8">
                Crie uma nova caravana ou junte-se a um grupo existente com um código de acesso.
            </p>
            
            <div className="space-y-4">
                <button 
                    onClick={onCreateClick}
                    className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-colors transform hover:scale-[1.01]"
                >
                    Criar Nova Caravana
                </button>
                <button 
                    onClick={onJoinClick}
                    className="w-full bg-gray-200 text-gray-800 font-bold py-4 rounded-xl hover:bg-gray-300 transition-colors"
                >
                    Entrar com Código de Acesso
                </button>
            </div>
        </div>
    </div>
);

// --------------------------------------------------
// Componente Principal que Gerencia a Navegação
// --------------------------------------------------
const CaravanaManager = () => {
    // Estado para controlar a visualização: 'landing', 'create', 'join'
    const [view, setView] = useState('landing'); 

    // Exemplo de manipulação após a criação/adesão (substitua pela sua lógica real de API)
    const handleCreateCaravana = (data) => {
        console.log("Caravana Criada:", data);
        alert(`Caravana "${data.nome}" criada com sucesso!`);
        setView('landing'); // Volta para a Landing Page após a criação
    };

    const handleJoinCaravana = (code) => {
        console.log("Tentativa de Adesão com o Código:", code);
        alert(`Entrando na caravana com o código: ${code}`);
        // Aqui você chamaria a API para verificar o código e adicionar o usuário
        setView('landing'); // Volta para a Landing Page após a adesão
    };

    switch (view) {
        case 'create':
            return (
                <CreateCaravanaPage 
                    onBack={() => setView('landing')} // Volta para a landing page
                    onCreate={handleCreateCaravana}
                />
            );
        case 'join':
            return (
                <JoinCaravanaPage 
                    onBack={() => setView('landing')} // Volta para a landing page
                    onJoin={handleJoinCaravana} 
                />
            );
        case 'landing':
        default:
            return (
                <CaravanaLanding 
                    onCreateClick={() => setView('create')}
                    onJoinClick={() => setView('join')}
                />
            );
    }
};

export default CaravanaManager;