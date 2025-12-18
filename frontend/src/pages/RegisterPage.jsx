import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import logo from '../assets/logo_capiba.png';

const LoginPage = ({ onLogin, onNavigateToRegister }) => {
    const { login } = useContext(AuthContext);
    
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(email, senha);
            if (onLogin) onLogin(); // Chama a função do App.jsx para mudar a tela
        } catch (error) {
            alert('Usuário ou senha inválidos');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-xl border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                <div className="text-center mb-8">
                    <img src={logo} alt="Capiba Cultural" className="h-16 mx-auto mb-4 hover:scale-105 transition-transform" />
                    <h1 className="text-2xl font-black text-gray-800 tracking-tight">Bem-vindo de volta!</h1>
                    <p className="text-gray-400 text-sm mt-1">Acesse sua conta para continuar</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    <div className="group">
                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-medium text-gray-700 placeholder-gray-400"
                                placeholder="Seu e-mail"
                                required
                            />
                        </div>
                    </div>

                    <div className="group">
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <input 
                                type={showPassword ? "text" : "password"} 
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-medium text-gray-700 placeholder-gray-400"
                                placeholder="Sua senha"
                                required
                            />
                            {/* 🟢 CORRIGIDO: type="button" impede o envio do form */}
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="text-right">
                        <a href="#" className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline">
                            Esqueceu a senha?
                        </a>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-xl shadow-lg shadow-gray-200 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Entrar <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500 font-medium">
                        Não tem conta? <button onClick={onNavigateToRegister} className="text-blue-600 font-bold hover:underline">Crie agora</button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;