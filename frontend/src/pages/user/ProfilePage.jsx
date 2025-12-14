import React, { useState, useEffect, useContext, useRef } from 'react';
import { PerfilImage } from '../../components/user/UserShared.jsx'; 
import { ArrowLeft, Camera, User, Save } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

const ProfilePage = () => {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    
    // Referência para o input de arquivo (invisível)
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        cpf: '',
        senha: '' 
    });

    // Estados para manipular a imagem
    const [previewUrl, setPreviewUrl] = useState(null); // O que aparece na tela
    const [fileToSend, setFileToSend] = useState(null); // O arquivo real para enviar
    
    // 🚨 ATENÇÃO: Substitua 'http://localhost:3000/' pela URL base do seu servidor de assets
    const BASE_URL = 'http://localhost:3000/'; 

    // Carregar dados ao entrar
    useEffect(() => {
        if (user?.id) {
            // Assumindo que a rota está correta
            api.get(`/usuarios/${user.id}`).then(res => {
                setFormData(prev => ({
                    ...prev,
                    nome: res.data.nome,
                    email: res.data.email,
                    cpf: res.data.cpf,
                }));

                // Se o usuário já tiver foto, monta a URL para exibir
                if (res.data.fotoUrl) {
                    // Corrige barras invertidas (Windows) para barras normais
                    const pathFixed = res.data.fotoUrl.replace(/\\/g, '/');
                    setPreviewUrl(`${BASE_URL}${pathFixed}`);
                }
            }).catch(err => {
                 console.error("Erro ao carregar dados do usuário:", err);
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Função disparada quando escolhe um arquivo
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileToSend(file);
            setPreviewUrl(URL.createObjectURL(file)); // Cria URL temporária para mostrar na hora
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const data = new FormData();
            data.append('nome', formData.nome);
            data.append('email', formData.email);
            data.append('cpf', formData.cpf);
            
            // Só envia senha se tiver digitado algo
            if (formData.senha) {
                data.append('senha', formData.senha);
            }

            // Só envia foto se tiver escolhido uma nova
            if (fileToSend) {
                data.append('foto', fileToSend);
            }

            // O axios detecta FormData e ajusta o header automaticamente
            await api.put(`/usuarios/${user.id}`, data);
            
            alert("Perfil atualizado com sucesso!");
            // Se precisar atualizar o estado global do usuário após a edição:
            // updateAuthContext(await api.get(`/usuarios/${user.id}`)); 
        } catch (error) {
            console.error(error);
            alert("Erro ao atualizar perfil. Verifique o console.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center py-4">
            <div className="w-[95%] max-w-md md:max-w-5xl bg-white md:rounded-2xl md:shadow-xl overflow-hidden flex flex-col">
                
                {/* Header Desktop */}
                <header className="hidden md:flex p-6 items-center border-b border-gray-200 bg-gray-50">
                    <a href="#/perfil" className="text-gray-600 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-gray-100">
                        <ArrowLeft className="w-6 h-6" />
                    </a>
                    <h1 className="text-xl font-bold text-gray-800 ml-4">Editar Perfil</h1>
                </header>

                {/* Header Mobile */}
                <header className="bg-blue-600 text-white p-4 flex justify-between items-center md:hidden">
                    <a href="#/perfil"><ArrowLeft className="w-6 h-6" /></a>
                    <h1 className="text-xl font-bold">Editar Perfil</h1>
                    <div className="w-6"></div>
                </header>

                <main className="p-6 pb-24 md:p-8 md:grid md:grid-cols-12 md:gap-8">
                    
                    {/* Esquerda: foto e botão salvar */}
                    <aside className="md:col-span-4 flex flex-col items-center text-center mb-8 md:mb-0 border-b md:border-b-0 md:border-r border-gray-100 md:pr-6">
                        
                        {/* Input Invisível para o Arquivo */}
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            accept="image/*"
                            className="hidden" 
                        />

                        {/* Ao clicar na div ou botão, abre o input de arquivo */}
                        <div 
                            className="relative group mb-4 cursor-pointer"
                            onClick={() => fileInputRef.current.click()}
                        > 
                            {/* Passamos o previewUrl para o componente mostrar a foto atual/nova */}
                            <PerfilImage src={previewUrl} />
                            
                            <button className="absolute -bottom-2 -right-2 bg-blue-600 p-3 rounded-full text-white hover:bg-blue-700 shadow-md border-2 border-white transition-transform hover:scale-110">
                                <Camera className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <p className="text-xs text-gray-400 mb-4">Toque na foto para alterar</p>

                        <h2 className="text-2xl font-bold text-gray-800 mt-2">{formData.nome || "Usuário"}</h2>
                        <p className="text-sm text-gray-500 font-medium">{formData.email}</p>
                        
                        <div className="w-full mt-6">
                            <button 
                                onClick={handleSave}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg py-2.5 px-4 transition-colors shadow-sm disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {loading ? "Enviando..." : "Salvar Alterações"}
                            </button>
                        </div>
                    </aside>

                    {/* Direita: formulário */}
                    <div className="md:col-span-8">
                        <section>
                            <h2 className="text-lg font-bold text-gray-700 mb-6 flex items-center">
                                <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                                    <User className="w-5 h-5"/> 
                                </span>
                                Informações Pessoais
                            </h2>
                            
                            <div className="space-y-4">
                                <div className="flex flex-col">
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1">Nome Completo</label>
                                    <input 
                                        name="nome"
                                        value={formData.nome}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <label className="text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                                        <input 
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                                            readOnly 
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-xs font-bold text-gray-500 uppercase mb-1">Nova Senha</label>
                                        <input 
                                            name="senha"
                                            type="password"
                                            placeholder="Deixe vazio para manter"
                                            value={formData.senha}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <label className="text-xs font-bold text-gray-500 uppercase mb-1">CPF</label>
                                        <input 
                                            name="cpf"
                                            value={formData.cpf}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-xs font-bold text-gray-500 uppercase mb-1">Data de Nasc.</label>
                                        <input 
                                            type="text"
                                            value="Não cadastrado"
                                            disabled
                                            className="w-full p-2 border rounded-lg bg-gray-50 text-gray-400"
                                        />
                                    </div>
                                </div>
                                
                                {/* Endereço (Corrigido para fechar a tag de endereço corretamente) */}
                                <div className="pt-4 mt-4 border-t border-gray-100 opacity-50">
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Endereço (Em breve)</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-2 border rounded-lg bg-gray-50 text-gray-400">CEP: 00000-000</div>
                                        <div className="p-2 border rounded-lg bg-gray-50 text-gray-400">Rua: ...</div>
                                    </div>
                                </div> {/* <--- FECHAMENTO CORRETO DA DIV pt-4 mt-4 */}
                                
                            </div> {/* <--- FECHAMENTO CORRETO DA DIV space-y-4 */}
                        </section>
                    </div> {/* <--- FECHAMENTO CORRETO DA DIV md:col-span-8 */}
                </main> {/* <--- FECHAMENTO CORRETO DA TAG MAIN */}
            </div>
        </div>
    );
};

export default ProfilePage;