import React from 'react';
import CapibaLogo from '../components/CapibaLogo';
import ActionButton from '../components/ActionButton';

const LoginPage = ({ onLoginSuccess }) => {
    return (
        
        <div className="min-h-screen font-sans bg-linear-to-br from-blue-600 to-blue-800 flex justify-center items-center p-8">
            <div className="w-full max-w-sm text-center flex flex-col items-center gap-y-8 animate-fade-in">
                <CapibaLogo />

                <header className="w-full">
                    <h1 className="text-3xl font-bold text-white">Bem-Vindo!</h1>
                    <p className="text-blue-100 mt-1">Digite seu CPF ou CNPJ para acessar</p>
                </header>

                <main className="w-full flex flex-col gap-y-4">
                    <input
                        type="text"
                        placeholder="CPF/CNPJ"
                        className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
                    />
                    <input
                        type="password"
                        placeholder="SENHA"
                        className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
                    />

                    <ActionButton onClick={onLoginSuccess}>
                        LOGAR
                    </ActionButton>
                    <ActionButton onClick={() => console.log("Botão de Criar Conta Clicado")} type="secondary">
                        CRIAR CONTA
                    </ActionButton>
                </main>
            </div>
        </div>
    );
};

export default LoginPage;