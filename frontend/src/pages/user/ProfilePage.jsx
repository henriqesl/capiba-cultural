import React, { useState, useEffect, useCallback } from 'react';
// 🔑 Importamos o contexto para acessar o ID do usuário e a função de logout
import { useAuth } from '../../context/AuthContext'; 
import api from '../../services/api'; 
// 1. Componentes
import { InfoRow, PerfilImage } from '../../components/user/UserShared.jsx'; 

// 2. Ícones
import { ArrowLeft, Camera, User, LogOut, Phone, Calendar, Mail, Edit } from 'lucide-react';

const BASE_URL = 'http://localhost:3000'; // URL base do seu backend

// 🔑 Funções de Formatação (Recomendado fora do componente)
const formatarTelefone = (tel) => {
    if (!tel) return 'N/A';
    tel = String(tel).replace(/\D/g, ''); 
    if (tel.length >= 10) { // Ex: (XX) XXXX-XXXX ou (XX) XXXXX-XXXX
        return `(${tel.substring(0, 2)}) ${tel.substring(2, tel.length - 4)}-${tel.substring(tel.length - 4)}`;
    }
    return tel;
};

const formatarData = (dataISO) => {
    if (!dataISO) return 'N/A';
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR'); 
};


const ProfilePage = () => {
    // 🔑 USANDO O CONTEXTO PARA BUSCAR O USUÁRIO E O LOGOUT
    const { user: userContext, logout } = useAuth(); 
    
    // 🔑 ESTADOS: Para guardar os dados carregados e controlar a edição
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editFields, setEditFields] = useState({}); // Estado para os inputs editáveis
    
    // 🔑 LÓGICA DE BUSCA DE DADOS (USANDO userContext.id)
    const fetchUserData = useCallback(async () => {
        if (!userContext?.id) {
            setLoading(false);
            return;
        }
        try {
            // Supondo que você tem GET /api/usuarios/:id no backend
            const response = await api.get(`/usuarios/${userContext.id}`);
            const data = response.data;
            setUserData(data);
            // 🔑 Popula os campos de edição com os dados atuais
            setEditFields(data); 
        } catch (error) {
            console.error("Erro ao carregar dados do perfil:", error);
            // Redirecionar para login ou mostrar erro
        } finally {
            setLoading(false);
        }
    }, [userContext]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);
    
    
    // 🔑 Handlers de Edição/Salvar
    const handleChange = (e) => {
        setEditFields({ ...editFields, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setIsEditing(false); // Sair do modo de edição
        setLoading(true);
        // 🔑 Lógica para preparar e enviar os dados para o endpoint de PUT/PATCH /api/usuarios/:id
        try {
            // Exemplo de payload:
            const payload = {
                nome: editFields.nome,
                username: editFields.username,
                telefone: editFields.telefone.replace(/\D/g, ''), // Envia limpo
                // ... outros campos ...
            };

            await api.patch(`/usuarios/${userContext.id}`, payload);
            alert("Perfil atualizado com sucesso!");
            await fetchUserData(); // Recarrega os dados para mostrar o que foi salvo
        } catch (error) {
            alert(`Erro ao salvar: ${error.response?.data?.erro || 'Tente novamente.'}`);
        } finally {
            setLoading(false);
        }
    };
    
    const imageUrl = userData?.imagemPerfilPath ? `${BASE_URL}/${userData.imagemPerfilPath}` : '/caminho-para-placeholder.png';

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-100">Carregando perfil...</div>;
    }
    
    // 🔑 Componente de Linha Editável (Substitui InfoRow para edição)
    // Este componente é essencial para transformar a página em um formulário
    const EditableInfoRow = ({ label, name, value, type = 'text', readOnly = false, icon: IconComponent }) => (
        <div className="flex flex-col border-b border-gray-100 py-3">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-2">
                {IconComponent && <IconComponent className="w-4 h-4" />}
                {label}
            </label>
            {isEditing && !readOnly ? (
                <input
                    type={type}
                    name={name}
                    value={value || ''}
                    onChange={handleChange}
                    className="mt-1 p-1 border-b-2 border-blue-200 focus:border-blue-600 transition duration-150 outline-none text-gray-800"
                />
            ) : (
                <p className="text-gray-800 font-medium">{value}</p>
            )}
        </div>
    );


    return (
        <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center py-4">
            
            <div className="w-[95%] max-w-md md:max-w-5xl bg-white md:rounded-2xl md:shadow-xl overflow-hidden flex flex-col">
                
                {/* Header Mobile & Desktop - Adiciona o botão de edição/salvar */}
                <header className="bg-blue-600 text-white p-4 flex justify-between items-center ">
                    <a href="#/home" className="hover:opacity-80">
                        <ArrowLeft className="w-6 h-6" />
                    </a>
                    <h1 className="text-xl font-bold">{isEditing ? 'SALVAR PERFIL' : 'MEU PERFIL'}</h1>
                    
                    {/* Botão de Edição/Salvar */}
                    <button 
                        onClick={isEditing ? handleSave : () => setIsEditing(true)}
                        className={`text-sm font-semibold py-1 px-3 rounded-full transition-colors ${isEditing ? 'bg-yellow-400 text-gray-900' : 'bg-blue-500 hover:bg-blue-400'}`}
                    >
                        {isEditing ? 'SALVAR' : <Edit className="w-5 h-5" />}
                    </button>
                </header>


                <main className="p-6 pb-24 md:p-8 md:grid md:grid-cols-12 md:gap-8">

                    {/* Coluna Esquerda: Avatar e Ações */}
                    <aside className="md:col-span-4 flex flex-col items-center text-center mb-8 md:mb-0 border-b md:border-b-0 md:border-r border-gray-100 md:pr-6">
                        <div className="relative group mb-4 cursor-pointer"> 
                            {/* 🔑 USANDO A URL BUSCADA */}
                            <PerfilImage imageUrl={imageUrl} /> 
                            {isEditing && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <span className="text-white font-bold text-sm">Trocar Foto</span>
                                </div>
                            )}
                            
                            {/* Botão da Câmera (Para Upload/Troca - Lógica omitida aqui) */}
                            <button className="absolute -bottom-2 -right-2 transition hover:scale-110 bg-blue-600 p-3 rounded-full text-white hover:bg-blue-700 shadow-md border-2 border-white">
                                <Camera className="w-5 h-5" />
                            </button>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-800 mt-2">{userData?.nome || 'Nome'}</h2>
                        <p className="text-sm text-gray-500 font-medium">@{userData?.username || 'username'}</p>
                        
                        {/* Botão de Salvar/Editar Desktop */}
                        <div className="w-full mt-6 hidden md:block">
                            <button 
                                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                                className={`w-full text-sm font-semibold text-white rounded-lg py-2.5 px-4 transition-colors shadow-sm ${isEditing ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                            >
                                {isEditing ? 'Salvar Alterações' : 'Editar Perfil'}
                            </button>
                        </div>

                        <div className="w-full mt-3">
                            <button 
                                onClick={logout} 
                                className="w-full text-sm font-semibold text-red-600 bg-red-100 hover:bg-red-200 rounded-lg py-2.5 px-4 transition-colors shadow-sm flex items-center justify-center gap-2"
                            >
                                <LogOut className="w-5 h-5" /> 
                                Sair da Conta
                            </button>
                        </div>
                    </aside>

                    {/* Coluna Direita: Informações */}
                    <div className="md:col-span-8">
                        <section>
                            <h2 className="text-lg font-bold text-gray-700 mb-6 flex items-center">
                                <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                                    <User className="w-5 h-5"/> 
                                </span>
                                Informações Pessoais
                            </h2>
                            
                            <div className="space-y-4">
                                
                                {/* 🔑 CAMPO EDITÁVEL (Email - ReadOnly) */}
                                <EditableInfoRow 
                                    label="Email" 
                                    name="email" 
                                    value={userData?.email}
                                    type="email"
                                    readOnly={true} // Email geralmente não é editado
                                    icon={Mail}
                                />
                                
                                {/* Username é exibido no topo, mas também pode ser um campo editável */}
                                <EditableInfoRow 
                                    label="Username" 
                                    name="username" 
                                    value={editFields?.username}
                                    icon={User}
                                />
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* 🔑 CAMPO TELEFONE (com formatação) */}
                                    <EditableInfoRow 
                                        label="Telefone" 
                                        name="telefone" 
                                        value={isEditing ? editFields?.telefone : formatarTelefone(userData?.telefone)} // Formata para visualização, edita o valor cru (idealmente)
                                        type="tel"
                                        icon={Phone}
                                    />
                                    <InfoRow label="Senha" value="********" /> {/* Senha não deve ser editada diretamente aqui */}
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* 🔑 CAMPO DATA DE NASCIMENTO (com formatação) */}
                                    <EditableInfoRow 
                                        label="Data de Nasc." 
                                        name="dataNascimento" 
                                        value={isEditing ? editFields?.dataNascimento : formatarData(userData?.dataNascimento)}
                                        type={isEditing ? "text" : "text"} // Ou use "date" no modo de edição
                                        icon={Calendar}
                                    />
                                    {/* 🔑 CAMPO CPF (ReadOnly por segurança) */}
                                    <InfoRow label="CPF" value={userData?.cpf || 'N/A'} />
                                </div>
                                
                                {/* Outras Informações (Endereço, etc.) */}
                                <div className="pt-4 mt-4 border-t border-gray-100">
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Outras Informações</h3>
                                    {/* Você pode substituir as InfoRow fixas pelas reais do seu userData */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InfoRow label="CEP" value="52091-235" />
                                        <InfoRow label="Bairro" value="Nova Descoberta" />
                                        <InfoRow label="Rua" value="Rua Alto Santa Luzia" />
                                        <InfoRow label="Número" value="460" />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ProfilePage;