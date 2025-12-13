import React, { useState } from 'react';
import api from '../services/api'; 
import { 
    Megaphone, Camera, Plus, ScanLine, CalendarPlus, Info, 
    ArrowLeft, MapPin, DollarSign, Users, Clock, AlignLeft, 
    Upload, CheckCircle, Calendar, Link as LinkIcon 
} from 'lucide-react'; 

const CheckInPage = () => {
    // 'menu' | 'report' | 'suggest'
    const [view, setView] = useState('menu');

    // === 1. TELA PRINCIPAL (MENU) ===
    if (view === 'menu') {
        return (
            <MenuScreen 
                onScan={() => alert("Scanner em desenvolvimento...")}
                onReport={() => setView('report')} 
                onSuggest={() => setView('suggest')}
            />
        );
    }

    // === 2. TELA DE REPORTAR (VERMELHO) ===
    if (view === 'report') {
        return <ReportForm onBack={() => setView('menu')} />;
    }

    // === 3. TELA DE SUGERIR (VERDE) - NOVA ===
    if (view === 'suggest') {
        return <SuggestForm onBack={() => setView('menu')} />;
    }

    return null;
};

// --- COMPONENTE DA TELA PRINCIPAL ---
const MenuScreen = ({ onScan, onReport, onSuggest }) => (
    <div className="bg-gray-50 min-h-screen w-full flex flex-col items-center">
        <div className="w-full max-w-6xl px-4 py-8 md:py-12">
            
            <header className="mb-8 md:mb-12 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                    Check-in & Colaboração
                </h1>
                <p className="text-gray-500 mt-2 text-lg">
                    Registre sua presença ou ajude a comunidade a crescer.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
                
                {/* SCANNER */}
                <section className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 flex flex-col h-full min-h-[400px]">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <ScanLine className="w-6 h-6 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Ler QR Code</h2>
                    </div>
                    
                    <div 
                        onClick={onScan}
                        className="flex-1 relative group cursor-pointer rounded-2xl overflow-hidden bg-gray-900 flex flex-col items-center justify-center transition-all hover:shadow-2xl hover:shadow-blue-500/20"
                    >
                        {/* Detalhes visuais do scanner */}
                        <div className="absolute top-6 left-6 w-12 h-12 border-t-4 border-l-4 border-white/50 rounded-tl-xl"></div>
                        <div className="absolute top-6 right-6 w-12 h-12 border-t-4 border-r-4 border-white/50 rounded-tr-xl"></div>
                        <div className="absolute bottom-6 left-6 w-12 h-12 border-b-4 border-l-4 border-white/50 rounded-bl-xl"></div>
                        <div className="absolute bottom-6 right-6 w-12 h-12 border-b-4 border-r-4 border-white/50 rounded-br-xl"></div>

                        <div className="relative z-10 bg-white/10 p-6 rounded-full backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                            <Camera className="w-16 h-16 text-white" />
                        </div>
                        <p className="mt-6 text-gray-300 font-medium z-10">Toque para abrir a câmera</p>
                    </div>
                </section>

                {/* BOTÕES DE AÇÃO */}
                <section className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <Info className="w-5 h-5 text-gray-400" />
                            Central de Colaboração
                        </h2>
                    </div>

                    <button onClick={onReport} className="relative overflow-hidden bg-white p-6 rounded-3xl shadow-lg border border-gray-100 text-left transition-all hover:-translate-y-1 hover:shadow-xl group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
                            <div className="bg-red-50 p-4 rounded-2xl w-fit">
                                <Megaphone className="w-8 h-8 text-red-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Viu algo rolando?</h3>
                                <p className="text-red-600 font-semibold text-sm uppercase tracking-wide mb-1">Reportar Agora</p>
                                <p className="text-gray-500 text-sm">Tire uma foto e avise a galera em tempo real!</p>
                            </div>
                        </div>
                    </button>

                    <button onClick={onSuggest} className="relative overflow-hidden bg-white p-6 rounded-3xl shadow-lg border border-gray-100 text-left transition-all hover:-translate-y-1 hover:shadow-xl group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
                            <div className="bg-green-50 p-4 rounded-2xl w-fit">
                                <CalendarPlus className="w-8 h-8 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Sugestão futura?</h3>
                                <p className="text-green-600 font-semibold text-sm uppercase tracking-wide mb-1">Sugerir Evento</p>
                                <p className="text-gray-500 text-sm">Sabe de um evento futuro? Mande para a agenda.</p>
                            </div>
                        </div>
                    </button>
                </section>
            </div>
        </div>
    </div>
);

// --- FORMULÁRIO DE REPORTAR (VERMELHO) ---
const ReportForm = ({ onBack }) => {
    const [local, setLocal] = useState('');
    const [value, setValue] = useState('');
    const [noAgeLimit, setNoAgeLimit] = useState(false);
    const [unknownTime, setUnknownTime] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null); 


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file); 
            setImagePreview(URL.createObjectURL(file));
        }
    };

const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("HANDLE SUBMIT DISPAROU");

    // CRIA O FORM DATA
    const formData = new FormData();

        formData.append('nome', `Evento em ${local}`);
        formData.append('local', local);
        formData.append('data', new Date().toISOString());
        formData.append('preco', value || "Gratuito");
        formData.append('faixaEtaria', noAgeLimit ? 0 : 18);
        formData.append('descricao', "Evento reportado pela comunidade em tempo real.");
        formData.append('precisaInscricao', false);
        formData.append('ativo', true);

        if (imageFile) {
            formData.append('imagemFile', imageFile); 
            console.log("Arquivo adicionado ao FormData:", imageFile.name);
        }


        try {
         const resposta = await api.post('/eventos', formData); 

         console.log("RESPOSTA DA API:", resposta.data);
         alert("Reporte enviado com sucesso!");
         onBack();

        } catch (error) {
            console.log("CATCH PEGOU ERRO:", error);
             alert("Erro ao enviar reporte. Verifique o console.");
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen w-full flex justify-center py-6 px-4">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col animate-fade-in-up">
                <header className="bg-red-600 text-white p-6 flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold">Reportar Evento (Agora)</h1>
                        <p className="text-red-100 text-sm">O que está acontecendo neste momento?</p>
                    </div>
                </header>

                <form className="p-6 md:p-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Foto do local/evento</label>
                        <div className="relative w-full h-48 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center overflow-hidden">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />

                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="relative z-0 flex flex-col items-center">
                                    <div className="bg-red-100 p-3 rounded-full mb-2">
                                        <Upload className="w-6 h-6 text-red-500" />
                                    </div>
                                    <span className="text-gray-500 text-sm font-medium">
                                        Toque para adicionar foto
                                    </span>
                                </div>
                            )}

                        </div>
                    </div>
                    {/* Campos de Local e Valor */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Local</label>
                            <input value={local} onChange={e => setLocal(e.target.value)} type="text" placeholder="Ex: Pátio do CIn" className="w-full p-2.5 border border-gray-300 rounded-lg outline-none" required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Valor</label>
                            <input value={value} onChange={e => setValue(e.target.value)} type="text" placeholder="Ex: Grátis" className="w-full p-2.5 border border-gray-300 rounded-lg outline-none" required/>
                        </div>
                    </div>
                    {/* Checkboxes de Controle */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                             <label className="block text-sm font-bold text-gray-700">Faixa Etária</label>
                             <div className="flex gap-2">
                                <input type="text" placeholder="+18" disabled={noAgeLimit} className={`w-full p-2.5 border rounded-lg ${noAgeLimit ? 'bg-gray-100' : ''}`} />
                                <label className="flex items-center gap-1 cursor-pointer whitespace-nowrap">
                                    <input type="checkbox" checked={noAgeLimit} onChange={(e) => setNoAgeLimit(e.target.checked)} /> Livre</label>
                             </div>
                        </div>
                        <div className="flex flex-col gap-1">
                             <label className="block text-sm font-bold text-gray-700">Horário</label>
                             <input type="time" disabled={unknownTime} className={`w-full p-2.5 border rounded-lg ${unknownTime ? 'bg-gray-100' : ''}`} />
                             <div className="flex gap-2">
                                <label className="flex items-center gap-1 cursor-pointer whitespace-nowrap">
                                        <input type="checkbox" checked={unknownTime} onChange={(e) => setUnknownTime(e.target.checked)} /> Não sei</label>
                             </div>
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-red-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-red-700 transition-transform hover:scale-[1.02] flex items-center justify-center gap-2">
                        <CheckCircle className="w-6 h-6" /> Enviar Reporte
                    </button>
                </form>
            </div>
        </div>
    );
};

// --- FORMULÁRIO DE SUGERIR (VERDE) ---
const SuggestForm = ({ onBack }) => {
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [hour, setHour] = useState('');
    const [local, setLocal] = useState('');
    const [link, setLink] = useState('');
    const [obs, setObs] = useState('');
    const [imagePreview, setImagePreview] = useState(null);


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        

        try {
            // Junta Data + Hora para criar um DateTime válido para o Prisma
            const dataHour = new Date(`${date}T${hour || '00:00'}:00`);

            const dadosSugestao = {
                name,
                local,
                date: dataHour,
                obs: `${obs} \n\n Link oficial: ${link}`, 
                ativo: false, 
            };

            await api.post('/eventos', dadosSugestao);
            alert("Sugestão enviada! Aguarde aprovação.");
            onBack();
        } catch (error) {
            console.error(error);
            alert("Erro ao enviar sugestão.");
        } 
    };

    return (
        <div className="bg-gray-100 min-h-screen w-full flex justify-center py-6 px-4">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col animate-fade-in-up">
                
                {/* Header Verde */}
                <header className="bg-green-600 text-white p-6 flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold">Sugerir Evento (Futuro)</h1>
                        <p className="text-green-100 text-sm">Ajude a construir nossa agenda!</p>
                    </div>
                </header>

                <form className="p-6 md:p-8 space-y-6" onSubmit={handleSubmit}>
                    {/* 1. COMPROVANTE (Diferencial da Sugestão) */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Comprovante / Divulgação
                            <span className="ml-2 text-xs font-normal text-gray-500">(Post do insta, cartaz ou site)</span>
                        </label>
                        <div className="relative w-full h-48 border-2 border-dashed border-green-300 rounded-xl bg-green-50 hover:bg-green-100 transition-colors flex flex-col items-center justify-center cursor-pointer overflow-hidden">
                            <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />                            
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <div className="bg-green-200 p-3 rounded-full mb-2">
                                            <Upload className="w-6 h-6 text-green-700" />
                                        </div>
                                        <span className="text-green-800 text-sm font-medium">
                                            Anexar imagem de comprovação do evento
                                        </span>
                                    </>
                                )}                                         
                        </div>
                    </div>

                    {/* 2. NOME DO EVENTO */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Nome do Evento</label>
                        <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder="Ex: Calourada CIn" className="w-full p-3 border border-gray-300 rounded-lg outline-none" required />                   
                    </div>
                    {/* 3. DATA E HORA (Obrigatório para sugestão) */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Data</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                type="date"
                                className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg outline-none"
                                required
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Horário Previsto</label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input value={hour} onChange={e => setHour(e.target.value)} type="time" className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg outline-none" />                      
                        </div>
                    </div>
                

                    {/* 4. LOCAL E LINK */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Local</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <input value={local} onChange={e => setLocal(e.target.value)} type="text" placeholder="Local" className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg outline-none" required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Link Oficial (Opcional)</label>
                            <div className="relative">
                                <LinkIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <input value={link} onChange={e => setLink(e.target.value)} type="url" placeholder="https://..." className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg outline-none" />
                            </div>
                        </div>
                    </div>

                    {/* 5. COMENTÁRIO */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Observações extras</label>
                        <textarea rows="2" value={obs} onChange={e => setObs(e.target.value)} placeholder="Algo mais que devamos saber?" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none"></textarea>
                    </div>

                    <button type="submit" className="w-full bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-green-700 transition-transform hover:scale-[1.02] flex items-center justify-center gap-2">
                        <CheckCircle className="w-6 h-6" /> Enviar Sugestão
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CheckInPage;