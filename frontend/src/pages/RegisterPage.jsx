import React, { useState, useContext } from 'react';
import CapibaLogo from '../components/CapibaLogo';
import Button from '../components/Button';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft, User, Mail, Lock, Smartphone, Calendar, Hash, Image, Key } from 'lucide-react'; // Ícones adicionais

// 🔑 Componente de Input Reutilizável com Ícone (Melhora o UX/UI)
const InputField = ({ icon: Icon, placeholder, value, onChange, type = 'text', disabled, name, required = true }) => (
    <div className="relative">
        <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input 
            type={type} 
            placeholder={placeholder} 
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 text-gray-800 border-2 border-transparent focus:border-yellow-400 focus:outline-none shadow-sm transition duration-200"
        />
    </div>
);


const RegisterPage = () => {
    const { register } = useContext(AuthContext); 

    // Estados
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [cpf, setCpf] = useState(''); 
    const [username, setUsername] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [telefone, setTelefone] = useState('');
    const [imagemPerfil, setImagemPerfil] = useState(null); 
    const [loading, setLoading] = useState(false);
    // Estado para o nome do arquivo, para exibição no campo de upload
    const [fileName, setFileName] = useState('Nenhuma foto selecionada');


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImagemPerfil(file);
        setFileName(file ? file.name : 'Nenhuma foto selecionada');
    };

    const handleRegister = async () => {
        // Limpeza de CPF e Telefone
        const cpfLimpo = cpf.replace(/\D/g, ''); 
        const telefoneLimpo = telefone.replace(/\D/g, ''); 
        
        // VALIDAÇÃO: Todos os campos obrigatórios
        if (!nome || !email || !senha || !confirmarSenha || !cpfLimpo || !username || !dataNascimento || !telefoneLimpo) {
            alert("Preencha todos os campos obrigatórios!");
            return;
        }
        if (senha !== confirmarSenha) {
            alert("As senhas não coincidem.");
            return;
        }
        if (cpfLimpo.length !== 11) {
            alert("O CPF deve conter 11 dígitos válidos.");
            return;
        }

        // CRIAÇÃO DO FORMDATA
        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('email', email);
        formData.append('senha', senha);
        formData.append('cpf', cpfLimpo);
        formData.append('username', username);
        formData.append('dataNascimento', dataNascimento);
        formData.append('telefone', telefoneLimpo);

        if (imagemPerfil) {
            formData.append('imagemPerfil', imagemPerfil);
        }

        setLoading(true);
        const resultado = await register(formData);
        setLoading(false);

        if (resultado.sucesso) {
            alert("Conta criada com sucesso! Faça login.");
            window.location.hash = '#/login';
        } else {
            alert(resultado.mensagem);
        }
    };

    return (
        <div className="min-h-screen font-sans bg-gradient-to-br from-blue-700 to-blue-900 flex justify-center items-center p-4">
            <div className="w-full max-w-lg text-center flex flex-col items-center gap-y-6 animate-fade-in bg-white p-8 md:p-10 rounded-2xl shadow-2xl">
                
                <CapibaLogo width="120px" variant="dark" />

                <header className="w-full">
                    <h1 className="text-3xl font-extrabold text-gray-800">Crie Sua Conta</h1>
                    <p className="text-gray-500 mt-1">Insira seus dados para começar.</p>
                </header>
                
                <main className="w-full flex flex-col gap-y-4">
                    
                    {/* 1. SEÇÃO DE IDENTIFICAÇÃO PESSOAL */}
                    <h3 className="text-left text-sm font-semibold text-blue-600 border-b pb-1">Dados Básicos</h3>
                    <InputField 
                        icon={User}
                        placeholder="Nome Completo" 
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        disabled={loading}
                    />
                    
                    <InputField 
                        icon={Mail}
                        placeholder="Email (Usado para login)" 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                    />

                    {/* 2. SEÇÃO DE CREDENCIAIS */}
                    <h3 className="text-left text-sm font-semibold text-blue-600 border-b pb-1 pt-3">Credenciais</h3>

                    <InputField 
                        icon={Key}
                        placeholder="Nome de Usuário (Username)" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={loading}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                         <InputField 
                            icon={Lock}
                            placeholder="Senha" 
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            disabled={loading}
                        />
                        <InputField 
                            icon={Lock}
                            placeholder="Confirmar Senha" 
                            type="password"
                            value={confirmarSenha}
                            onChange={(e) => setConfirmarSenha(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    
                    {/* 3. SEÇÃO DE CONTATO E DOCUMENTO */}
                    <h3 className="text-left text-sm font-semibold text-blue-600 border-b pb-1 pt-3">Contato e Documento</h3>

                    <div className="grid grid-cols-2 gap-4">
                        {/* CPF */}
                        <InputField 
                            icon={Hash}
                            placeholder="CPF (apenas números)" 
                            value={cpf}
                            onChange={(e) => setCpf(e.target.value)}
                            disabled={loading}
                        />

                        {/* TELEFONE */}
                        <InputField 
                            icon={Smartphone}
                            placeholder="Telefone (apenas números)" 
                            type="tel"
                            value={telefone}
                            onChange={(e) => setTelefone(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    {/* DATA DE NASCIMENTO */}
                    <InputField 
                        icon={Calendar}
                        placeholder="Data de Nascimento (DDMMAAAA)" 
                        value={dataNascimento}
                        onChange={(e) => setDataNascimento(e.target.value)}
                        disabled={loading}
                    />
                    

                    {/* 4. SEÇÃO DE IMAGEM DE PERFIL */}
                    <h3 className="text-left text-sm font-semibold text-blue-600 border-b pb-1 pt-3">Imagem de Perfil (Opcional)</h3>
                    
                    <label 
                        htmlFor="imagemPerfil"
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 text-gray-800 border-2 transition duration-200 cursor-pointer ${imagemPerfil ? 'border-blue-400 text-blue-600' : 'border-gray-200'}`}
                    >
                        <div className="flex items-center gap-2">
                             <Image className="w-5 h-5" />
                            <span className="truncate text-sm font-medium">{fileName}</span>
                        </div>
                        <span className="text-xs bg-gray-200 py-1 px-3 rounded-lg hover:bg-gray-300">Escolher Foto</span>
                        
                        {/* Campo de arquivo escondido */}
                        <input 
                            id="imagemPerfil"
                            type="file" 
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={loading}
                            className="hidden"
                        />
                    </label>

                    
                    {/* BOTÕES */}
                    <Button variant="primary" onClick={handleRegister} disabled={loading} className="mt-4">
                        {loading ? 'CRIANDO CONTA...' : 'CADASTRAR'}
                    </Button>
                    
                    <Button variant="secondary" href="#/login" disabled={loading}>
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        JÁ TENHO CONTA
                    </Button>
                </main>
            </div>
        </div>
    );
};

export default RegisterPage;