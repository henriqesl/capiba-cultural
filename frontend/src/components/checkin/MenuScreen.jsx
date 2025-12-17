import React from 'react';
import { Camera, ScanLine, Info, Megaphone, CalendarPlus, DollarSign } from 'lucide-react'; // ⬅️ Adicionado DollarSign

// Modificamos a assinatura da função para incluir onShowSources
const MenuScreen = ({ onScan, onReport, onSuggest, onShowSources }) => (
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
                        <div className="absolute top-6 left-6 w-12 h-12 border-t-4 border-l-4 border-white/50 rounded-tl-xl"></div>
                        <div className="absolute top-6 right-6 w-12 h-12 border-t-4 border-r-4 border-white/50 rounded-tr-xl"></div>
                        <div className="absolute bottom-6 left-6 w-12 h-12 border-b-4 border-l-4 border-white/50 rounded-bl-xl"></div>
                        <div className="absolute bottom-6 right-6 w-12 h-12 border-b-4 border-r-4 border-white/50 rounded-br-xl"></div>

                        <div className="relative z-10 bg-white/10 p-6 rounded-full backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                            <Camera className="w-16 h-16 text-white" />
                        </div>
                        <p className="mt-6 text-gray-300 font-medium z-10">Toque para abrir o scanner</p>
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

                    {/* Botão de Reportar */}
                    <button onClick={onReport} className="relative overflow-hidden bg-white p-6 rounded-3xl shadow-lg border border-gray-100 text-left transition-all hover:-translate-y-1 hover:shadow-xl group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
                            <div className="bg-red-50 p-4 rounded-2xl w-fit">
                                <Megaphone className="w-8 h-8 text-red-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Viu algo rolando?</h3>
                                <p className="text-red-600 font-semibold text-sm uppercase tracking-wide mb-1">Reportar Agora</p>
                                <p className="text-gray-500 text-sm">Tire uma foto (câmera) e avise a galera!</p>
                            </div>
                        </div>
                    </button>

                    {/* Botão de Sugerir Evento */}
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
                    
                    {/* ⬅️ NOVO BOTÃO: Onde Ganhar Capibas */}
                    <button onClick={onShowSources} className="relative overflow-hidden bg-white p-6 rounded-3xl shadow-lg border border-gray-100 text-left transition-all hover:-translate-y-1 hover:shadow-xl group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
                            <div className="bg-yellow-50 p-4 rounded-2xl w-fit">
                                <DollarSign className="w-8 h-8 text-yellow-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Acumular Recompensas</h3>
                                <p className="text-yellow-600 font-semibold text-sm uppercase tracking-wide mb-1">Onde Ganhar Capibas?</p>
                                <p className="text-gray-500 text-sm">Veja as melhores formas de acumular moedas Capibas.</p>
                            </div>
                        </div>
                    </button>
                    {/* ⬅️ FIM DO NOVO BOTÃO */}
                    
                </section>
            </div>
        </div>
    </div>
);

export default MenuScreen;