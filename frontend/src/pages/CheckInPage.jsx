import React, { useState } from 'react';
import { Icon } from '../components/user/UserShared';
import { ICONS } from '../utils/icons';

const CheckInPage = () => {
    const [code, setCode] = useState('');

    const handleScan = () => {
        alert("Funcionalidade de Câmera em desenvolvimento...");
    };

    const handleSubmit = () => {
        if (!code) return;
        alert(`Validando código: ${code}...`);
    };

    return (
        <div className="bg-gray-100 min-h-screen p-4 pb-24">
            
            <div className="max-w-md mx-auto flex flex-col gap-6">
                
                {/* Título */}
                <header className="mt-4">
                    <h1 className="text-2xl font-bold text-gray-800">Check-in</h1>
                    <p className="text-gray-500 text-sm">Registre sua presença</p>
                </header>

                {/* LEITURA DO QR CODE === */}
                <section className="bg-white p-4 rounded-xl shadow-sm">
                    <label className="text-sm font-bold text-gray-700 mb-2 block">
                        Ler QR Code
                    </label>
                    
                    {/* "Placeholder" para a câmera */}
                    <div 
                        onClick={handleScan}
                        className="border-2 border-dashed border-gray-400 bg-gray-50 rounded-lg h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                        <Icon path={ICONS.camera} className="w-10 h-10 text-gray-400 mb-2" />
                        <span className="text-gray-500 text-xs font-medium">Toque para abrir a câmera</span>
                    </div>
                </section>

                {/* OUTRAS OPÇÕES */}
                <section>
                    <h2 className="text-sm font-bold text-gray-500 uppercase mb-3 ml-1">
                        Colabore
                    </h2>
                    
                    <div className="grid grid-cols-2 gap-4">
                        {/* Botão Reportar */}
                        <button 
                            onClick={() => alert("Em breve...")}
                            className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center gap-2 hover:bg-gray-50 transition-colors"
                        >
                            <div className="bg-red-100 p-2 rounded-full">
                                <Icon path={ICONS.trash} className="w-6 h-6 text-red-500" />
                            </div>
                            <span className="text-sm font-bold text-gray-700">Reportar</span>
                        </button>

                        {/* Botão Sugerir */}
                        <button 
                            onClick={() => alert("Em breve...")}
                            className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center gap-2 hover:bg-gray-50 transition-colors"
                        >
                            <div className="bg-green-100 p-2 rounded-full">
                                <Icon path={ICONS.plus} className="w-6 h-6 text-green-600" />
                            </div>
                            <span className="text-sm font-bold text-gray-700">Sugerir</span>
                        </button>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default CheckInPage;

/*
  [INTEGRAÇÃO]
  Rota: POST /checkins (CheckInRoutes.js)
  
  Importante:
  1. Mandar o token no Header (Authorization).
  2. Mandar o `{ eventoId: ... }` no corpo.
  3. O backend já verifica se é duplicado e já adiciona as moedas na conta do usuário sozinho.
     O front só precisa mostrar "Sucesso!".
*/