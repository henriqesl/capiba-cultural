import React, { useState } from 'react';
import { ArrowLeft, Lock } from 'lucide-react';

const JoinCaravanaPage = ({ onBack, onJoin }) => {
    const [accessCode, setAccessCode] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!accessCode) {
            alert("Por favor, insira o Código de Acesso.");
            return;
        }
        
        // Chama a função onJoin passada pelo componente pai (CaravanaManager)
        onJoin(accessCode);
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center pb-20">
            <div className="w-full max-w-md bg-white min-h-screen md:min-h-fit md:rounded-2xl md:shadow-xl md:my-8 flex flex-col">
                
                <header className="bg-white p-4 flex items-center border-b border-gray-100 sticky top-0">
                    <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full text-gray-600">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-800 ml-2">Entrar em uma Caravana</h1>
                </header>

                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
                    
                    {/* CÓDIGO DE ACESSO */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Código de Acesso do Grupo</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input 
                                name="accessCode"
                                value={accessCode}
                                onChange={(e) => setAccessCode(e.target.value.toUpperCase())} // Mantém o uppercase
                                placeholder="Ex: ROCK123"
                                className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono tracking-widest uppercase"
                                maxLength={10}
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Insira o código fornecido pelo criador da Caravana para entrar no grupo.</p>
                    </div>

                    <div className="pt-4">
                        <button 
                            type="submit"
                            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-colors"
                        >
                            Entrar na Caravana
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JoinCaravanaPage;