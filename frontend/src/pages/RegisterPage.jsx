import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import CapibaLogo from '../components/CapibaLogo';
import { User, Mail, Lock, FileText, Calendar, MapPin, Home, CheckCircle } from 'lucide-react';

const RegisterPage = () => {
    const { register } = useAuth();
    const [loading, setLoading] = useState(false);
    
    // Estados do Formulário
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        confirmarSenha: '', // NOVO CAMPO
        cpf: '',
        dataNascimento: '',
        cep: '',
        endereco: '',
        bairro: '',
        numero: ''
    });

    const [foto, setFoto] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFoto(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // === CEP SILENCIOSO ===
    const handleBlurCep = async () => {
        const cepLimpo = formData.cep.replace(/\D/g, '');
        if (cepLimpo.length === 8) {
            try {
                const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
                const data = await res.json();
                
                // Só preenche se achar. Se der erro, não faz nada (usuário digita).
                if (!data.erro) {
                    setFormData(prev => ({
                        ...prev,
                        endereco: data.logradouro || prev.endereco, // Mantém o que estava se vier vazio
                        bairro: data.bairro || prev.bairro
                    }));
                }
            } catch (error) {
                // Silêncio total em caso de erro de rede ou API
                console.log("ViaCEP indisponível ou erro, preenchimento manual.");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // === VALIDAÇÃO DE SENHA ===
        if (formData.senha !== formData.confirmarSenha) {
            alert("As senhas não coincidem!");
            return;
        }

        setLoading(true);

        try {
            const data = new FormData();
            
            // Adiciona campos ao FormData (exceto confirmarSenha que não vai pro back)
            Object.keys(formData).forEach(key => {
                if (key !== 'confirmarSenha') {
                    data.append(key, formData[key]);
                }
            });
            
            // Foto é opcional: só anexa se o usuário escolheu
            if (foto) {
                data.append('foto', foto);
            }

            const resultado = await register(data);

            if (resultado.sucesso) {
                alert("Conta criada com sucesso! Faça login.");
                window.location.hash = '#/login';
            } else {
                alert(resultado.mensagem || "Erro ao criar conta.");
            }
        } catch (error) {
            alert("Erro inesperado.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
                
                {/* Coluna Visual */}
                <div className="bg-blue-600 p-8 flex flex-col items-center justify-center text-white md:w-2/5 text-center">
                    <CapibaLogo />
                    <h2 className="text-2xl font-bold mt-4">Junte-se a nós!</h2>
                    <p className="opacity-90 mt-2 text-sm">Crie sua conta e comece a explorar o melhor da cultura pernambucana.</p>
                    <a href="#/login" className="mt-8 text-sm underline hover:text-yellow-300">Já tem conta? Entrar</a>
                </div>

                {/* Formulário */}
                <div className="p-8 md:w-3/5">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Criar Conta</h1>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        {/* Foto Opcional */}
                        <div className="flex justify-center mb-4">
                            <label className="cursor-pointer group relative">
                                <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden border-2 border-dashed border-gray-400 group-hover:border-blue-500 transition-colors">
                                    {preview ? (
                                        <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center p-1">
                                            Foto (Opcional)
                                        </div>
                                    )}
                                </div>
                                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                            </label>
                        </div>

                        {/* Campos Pessoais */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="relative">
                                <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <input name="nome" placeholder="Nome Completo" onChange={handleChange} required className="w-full pl-9 p-2 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <input name="cpf" placeholder="CPF" onChange={handleChange} required className="w-full pl-9 p-2 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <input type="date" name="dataNascimento" onChange={handleChange} required className="w-full pl-9 p-2 border rounded-lg text-sm bg-gray-50 text-gray-500 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full pl-9 p-2 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                        </div>

                        {/* Endereço */}
                        <div className="pt-2 border-t border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Endereço</p>
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <input 
                                        name="cep" 
                                        placeholder="CEP" 
                                        onChange={handleChange} 
                                        onBlur={handleBlurCep} 
                                        required 
                                        className="w-full pl-9 p-2 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" 
                                    />
                                </div>
                                <div className="relative">
                                    <Home className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <input name="numero" placeholder="Número" onChange={handleChange} required className="w-full pl-9 p-2 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <input name="endereco" placeholder="Rua / Logradouro" value={formData.endereco} onChange={handleChange} required className="w-full p-2 border rounded-lg text-sm bg-gray-100 text-gray-600 focus:outline-none" />
                                <input name="bairro" placeholder="Bairro" value={formData.bairro} onChange={handleChange} required className="w-full p-2 border rounded-lg text-sm bg-gray-100 text-gray-600 focus:outline-none" />
                            </div>
                        </div>

                        {/* Senha e Confirmação */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <input type="password" name="senha" placeholder="Senha" onChange={handleChange} required className="w-full pl-9 p-2 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div className="relative">
                                <CheckCircle className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <input type="password" name="confirmarSenha" placeholder="Confirmar Senha" onChange={handleChange} required className="w-full pl-9 p-2 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition transform hover:scale-105 shadow-lg disabled:opacity-50">
                            {loading ? "Criando Conta..." : "Cadastrar"}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;