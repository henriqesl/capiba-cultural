import React, { useState, useContext } from 'react';
import CapibaLogo from '../components/CapibaLogo';
import Button from '../components/Button';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        // previne o recarregamento da página padrão do formulário
        if (e) e.preventDefault(); 

        if (!email || !senha) {
            alert("Preencha todos os campos!");
            return;
        }

        setIsLoading(true);
        const sucesso = await login(email, senha);
        setIsLoading(false);
        
        if (sucesso) {
            window.location.hash = '#/eventos'; 
        } else {
            alert("Email ou senha incorretos.");
        }
    };

    return (
        <div className="min-h-screen font-sans bg-linear-to-br from-blue-600 to-blue-800 flex justify-center items-center p-8">
            <div className="w-full max-w-sm text-center flex flex-col items-center gap-y-8 animate-fade-in">
                <CapibaLogo />
                <header className="w-full">
                    <h1 className="text-3xl font-bold text-white">Bem-Vindo!</h1>
                    <p className="text-blue-100 mt-1">Digite suas credenciais</p>
                </header>

                <form onSubmit={handleLogin} className="w-full flex flex-col gap-y-4">
                    <input 
                        type="email" 
                        placeholder="Email (ex: joao@email.com)" 
                        className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input 
                        type="password" 
                        placeholder="SENHA" 
                        className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                    />
                    
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full font-bold py-3 rounded-lg transition-transform transform hover:scale-105 duration-300 shadow-md bg-white text-gray-800 hover:bg-gray-300 disabled:opacity-50"
                    >
                        {isLoading ? "ENTRANDO..." : "LOGAR"}
                    </button>
                </form>

                <Button variant="secondary" href="#/login">CRIAR CONTA</Button>
            </div>
        </div>
    );
};

export default LoginPage;