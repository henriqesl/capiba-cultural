import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api'; 
import { geocodeLocation, reverseGeocodeLocation } from '../services/mapbox'; 
import mapboxgl from 'mapbox-gl'; 
import 'mapbox-gl/dist/mapbox-gl.css'; 

import { 
    Megaphone, Camera, Plus, ScanLine, CalendarPlus, Info, 
    ArrowLeft, MapPin, DollarSign, Users, Clock, AlignLeft, 
    Upload, CheckCircle, Calendar, Link as LinkIcon, Loader2,
    Video, StopCircle, QrCode // Ícones necessários
} from 'lucide-react'; 

const RECIFE_BOUNDS = [
    [-35.05, -8.15], // Sudoeste (SW)
    [-34.80, -7.95]  // Nordeste (NE)
];

const isInsideBounds = (lat, lng, bounds) => {
    // bounds é um array de dois arrays: [[minLng, minLat], [maxLng, maxLat]]
    const [[minLng, minLat], [maxLng, maxLat]] = bounds;
    
    // Verifica se a longitude e a latitude estão dentro dos limites definidos
    return (
        lng >= minLng && 
        lng <= maxLng && 
        lat >= minLat && 
        lat <= maxLat
    );
};

// 🚨 Use o mesmo token de acesso que você usou em src/services/mapbox.js
mapboxgl.accessToken = 'pk.eyJ1IjoiZ3VpbW9udGVuZWdybyIsImEiOiJjbWo0d2JyaGswYXN1M2hxMjZ2ejN2dGoyIn0.fxxtwS3S493xLPud44zD3A'; // 🚨 SUBSTITUA PELA SUA CHAVE REAL

const LocationPreviewMap = ({ latitude, longitude, name }) => {
    const mapContainer = useRef(null);
    const mapRef = useRef(null); // Ref para guardar a instância do Mapbox Map
    const markerRef = useRef(null); // Ref para guardar a instância do Marker

    useEffect(() => {
        if (!mapContainer.current) return;
        
        // Se o mapa ainda não foi inicializado, crie-o
        if (!mapRef.current) {
            const mapInstance = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [longitude, latitude], // Mapbox usa [Lng, Lat]
                zoom: 15,
                maxBounds: RECIFE_BOUNDS, 
            });

            mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-right');
            mapRef.current = mapInstance; // Salva a instância no ref
            
            // Cria e salva o marcador
            markerRef.current = new mapboxgl.Marker({ color: '#E11D48' }) 
                .setLngLat([longitude, latitude])
                .setPopup(
                    new mapboxgl.Popup({ offset: 25 })
                        .setText(name || 'Local Confirmado')
                )
                .addTo(mapRef.current);

        } else {
            // Se o mapa já existe, apenas move o centro e o marcador
            mapRef.current.flyTo({ center: [longitude, latitude], zoom: 15 });
            markerRef.current.setLngLat([longitude, latitude]);
            markerRef.current.setPopup(
                new mapboxgl.Popup({ offset: 25 })
                    .setText(name || 'Local Confirmado')
            );
        }

        // Função de cleanup: Remove o mapa ao desmontar o componente
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
                markerRef.current = null;
            }
        };
    }, [latitude, longitude, name]); // Dependências

    return (
        <div className="rounded-xl shadow-lg mt-4 overflow-hidden" style={{ height: '250px' }}>
            <div ref={mapContainer} className="w-full h-full" />
        </div>
    );
};


// --- NOVO COMPONENTE: TELA DO SCANNER ---
const ScannerScreen = ({ onBack, onScanResult }) => {
    const [isScanning, setIsScanning] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const videoRef = useRef(null);
    // const scannerRef = useRef(null); // Ref para a instância de biblioteca de scanning (Ex: html5-qrcode)

    const stopCamera = () => {
        const video = videoRef.current;
        if (video && video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
            video.srcObject = null;
        }
    };

    const startScanner = () => {
        setIsScanning(true);
        setScanResult(null);
        
        // 1. Iniciar o stream da câmera (getUserMedia)
        navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: 'environment', // Câmera traseira
                width: { ideal: 1280 },
                height: { ideal: 720 }
            } 
        })
        .then(stream => {
            let video = videoRef.current;
            if (video) {
                video.srcObject = stream;
                video.play();
            }
            
            // 2. 🚨 SIMULAÇÃO DE LEITURA 🚨
            // EM PRODUÇÃO: Aqui você integraria uma biblioteca de scanning (Ex: html5-qrcode)
            
            setTimeout(() => {
                const simulatedResult = "https://app.checkin.com/event/calourada-cin-2026";
                setScanResult(simulatedResult);
                onScanResult(simulatedResult); 
                stopCamera();
                setIsScanning(false);
            }, 3000); // 3 segundos para simular o tempo de leitura

        })
        .catch(err => {
            console.error("Erro ao iniciar o scanner:", err);
            setIsScanning(false);
            alert("Não foi possível acessar a câmera para escanear. Verifique as permissões.");
        });
    };
    
    useEffect(() => {
        startScanner();
        return () => {
            stopCamera();
        };
    }, []);

    const handleRestart = () => {
        setScanResult(null);
        startScanner();
    };

    return (
        <div className="bg-gray-100 min-h-screen w-full flex justify-center py-6 px-4">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col">
                <header className="bg-blue-600 text-white p-6 flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold">Scanner de QR Code</h1>
                        <p className="text-blue-100 text-sm">Aponte para o código do evento.</p>
                    </div>
                </header>

                <div className="p-6 md:p-8 space-y-6">
                    <div className="relative w-full h-96 rounded-xl overflow-hidden shadow-lg bg-gray-900 flex items-center justify-center">
                        
                        {/* Stream de Vídeo */}
                        {isScanning && (
                            <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted></video>
                        )}
                        
                        {/* Overlay de Scanning */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-10 pointer-events-none">
                            {isScanning ? (
                                <>
                                    <QrCode className="w-16 h-16 text-blue-400 animate-pulse" />
                                    <p className="mt-4 text-white text-lg font-semibold flex items-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin" /> Escaneando...
                                    </p>
                                </>
                            ) : (
                                <p className="text-white text-lg font-semibold">Pronto para escanear</p>
                            )}
                            
                            {/* Foco do Scanner */}
                            <div className="absolute w-48 h-48 border-4 border-dashed border-blue-400 rounded-lg"></div>
                        </div>
                    </div>
                    
                    {/* Exibe o Resultado da Simulação */}
                    {scanResult && (
                        <div className="bg-green-100 border border-green-400 text-green-700 p-4 rounded-lg flex flex-col">
                            <h3 className="font-bold flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" /> Código Escaneado com Sucesso!
                            </h3>
                            <p className="mt-2 break-all text-sm">**Resultado:** {scanResult}</p>
                            <button 
                                onClick={handleRestart}
                                className="mt-4 bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Escanear Novamente
                            </button>
                        </div>
                    )}
                    
                    <button 
                        onClick={onBack}
                        className="w-full bg-gray-200 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Voltar ao Menu
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- COMPONENTE PRINCIPAL (ROTEAMENTO) ---
const CheckInPage = () => {
    // 'menu' | 'report' | 'suggest' | 'scanner'
    const [view, setView] = useState('menu'); 

    // Ação que o scanner chama após a leitura
    const handleScanResult = (result) => {
        alert(`QR Code lido: ${result}. Redirecionando...`);
        
        // Aqui deve entrar a lógica real de check-in, navegação ou chamada de API
        
        setTimeout(() => setView('menu'), 500); 
    };


    if (view === 'menu') {
        return (
            <MenuScreen 
                onScan={() => setView('scanner')} 
                onReport={() => setView('report')} 
                onSuggest={() => setView('suggest')}
            />
        );
    }

    if (view === 'report') {
        return <ReportForm onBack={() => setView('menu')} />;
    }

    if (view === 'suggest') {
        return <SuggestForm onBack={() => setView('menu')} />;
    }
    
    if (view === 'scanner') {
        return <ScannerScreen onBack={() => setView('menu')} onScanResult={handleScanResult} />;
    }


    return null;
};

// --- COMPONENTE DA TELA PRINCIPAL (MenuScreen) ---
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

// --- FORMULÁRIO DE REPORTAR (COM CÂMERA EM TEMPO REAL) ---
const ReportForm = ({ onBack }) => {
    const [local, setLocal] = useState('');
    const [value, setValue] = useState('');
    const [noAgeLimit, setNoAgeLimit] = useState(false);
    const [unknownTime, setUnknownTime] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null); 
    const [isLoading, setIsLoading] = useState(false); 
    const [isGeocoding, setIsGeocoding] = useState(false); 
    const [isGeolocating, setIsGeolocating] = useState(false); 
    const [coords, setCoords] = useState(null);
    
    // ESTADOS E REFS PARA A CÂMERA
    const [isCameraActive, setIsCameraActive] = useState(false); 
    const videoRef = useRef(null); 
    const canvasRef = useRef(null);
    
    // --- LÓGICA DA CÂMERA ---

    const stopCameraStream = () => {
        const video = videoRef.current;
        if (video && video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
            video.srcObject = null;
        }
    };

    useEffect(() => {
        if (isCameraActive) {
            stopCameraStream(); 
            
            navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: 'environment'
                } 
            }) 
            .then(stream => {
                let video = videoRef.current;
                if (video) {
                    video.srcObject = stream;
                    video.play();
                }
            })
            .catch(err => {
                console.error("Erro ao acessar a câmera: ", err);
                setIsCameraActive(false);
                alert("Não foi possível acessar a câmera. Verifique as permissões do navegador.");
            });
        } else {
            stopCameraStream();
        }
        
        return () => {
            stopCameraStream();
        };
    }, [isCameraActive]);

    const handleCapture = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (video && canvas) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

            canvas.toBlob((blob) => {
                if (blob) {
                    const capturedFile = new File([blob], "report_camera_image.jpeg", { type: "image/jpeg" });
                    
                    setImageFile(capturedFile); 
                    setImagePreview(URL.createObjectURL(capturedFile));
                    
                    setIsCameraActive(false);
                }
            }, 'image/jpeg');
        }
    };

    // --- FUNÇÕES DE UPLOAD DE ARQUIVO (GALERIA) ---

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file); 
            setImagePreview(URL.createObjectURL(file));
        } else {
            setImageFile(null); 
            setImagePreview(null);
        }
    };

    // --- FUNÇÕES DE GEOLOCALIZAÇÃO E SUBMISSÃO (MANTIDAS) ---

    const handleCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Seu navegador não suporta geolocalização.");
            return;
        }

        setIsGeolocating(true);
        setCoords(null);
        setLocal('Localizando...');

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                
                try {
                    const address = await reverseGeocodeLocation(latitude, longitude); 
                    
                    if (address) {
                        setLocal(address);
                        setCoords({ latitude, longitude }); 
                    } else {
                        setLocal(`Coordenadas: ${latitude}, ${longitude} (Endereço não resolvido)`);
                        setCoords({ latitude, longitude });
                        alert("Não foi possível resolver o endereço. Coordenadas salvas.");
                    }
                } catch (error) {
                    setLocal('');
                    setCoords(null);
                    console.error("Erro ao resolver o endereço:", error);
                    alert("Erro ao resolver o endereço. Verifique o console.");
                } finally {
                    setIsGeolocating(false);
                }
            },
            (error) => {
                setIsGeolocating(false);
                setLocal('');
                console.error("Erro de Geolocalização:", error);
                alert(`Não foi possível acessar a localização. Erro: ${error.message}.`);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const geocodeAndDisplayMap = async () => {
        if (!local) {
            setCoords(null);
            alert("Por favor, insira um local/endereço primeiro.");
            return;
        }

        setIsGeocoding(true);
        setCoords(null); 
        
        try {
            const result = await geocodeLocation(local);
            if (result) {
                const { latitude, longitude } = result;
                if (!isInsideBounds(latitude, longitude, RECIFE_BOUNDS)) {
                    alert("A busca encontrou um local fora dos limites de Recife. Por favor, especifique o endereço em Recife.");
                    setCoords(null);
                    return; // Interrompe se estiver fora dos limites
                }

                setCoords(result);
            } else {
                alert("Não foi possível encontrar a localização no mapa. Tente ser mais específico.");
            }
        } catch (error) {
            console.error("Erro ao geocodificar:", error);
            alert("Erro de conexão ao tentar localizar o endereço.");
        } finally {
            setIsGeocoding(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        if (isCameraActive) {
            alert("Capture a foto ou cancele antes de enviar.");
            setIsLoading(false);
            return;
        }

        try {
            let finalLatitude = coords ? coords.latitude : null;
            let finalLongitude = coords ? coords.longitude : null;
            
            if (!finalLatitude && local) {
                const result = await geocodeLocation(local);
                if (result) {
                    finalLatitude = result.latitude;
                    finalLongitude = result.longitude;
                } else {
                    console.warn("Geocoding falhou para o reporte. Enviando sem coordenadas precisas.");
                }
            }

            const formData = new FormData();

            formData.append('nome', `Evento em ${local || "Local Desconhecido"}`);
            formData.append('local', local);
            formData.append('data', new Date().toISOString());
            formData.append('preco', value || "Gratuito");
            formData.append('faixaEtaria', noAgeLimit ? 0 : 18);
            formData.append('descricao', "Evento reportado pela comunidade em tempo real.");
            formData.append('precisaInscricao', false);
            formData.append('ativo', true);
            
            if (finalLatitude !== null) formData.append('latitude', finalLatitude);
            if (finalLongitude !== null) formData.append('longitude', finalLongitude);

            if (imageFile) {
                formData.append('imagemFile', imageFile); 
            }

            const resposta = await api.post('/eventos', formData); 

            console.log("RESPOSTA DA API:", resposta.data);
            alert("Reporte enviado com sucesso!");
            onBack();

        } catch (error) {
            console.error("CATCH PEGOU ERRO:", error);
            alert("Erro ao enviar reporte. Verifique o console.");
        } finally {
            setIsLoading(false);
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
                    
                    {/* 1. IMAGEM / CÂMERA (BLOCO DINÂMICO) */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Foto do local/evento</label>
                        
                        {isCameraActive ? (
                            // MODO CÂMERA ATIVA
                            <div className="relative w-full rounded-xl overflow-hidden shadow-lg bg-gray-900">
                                <video ref={videoRef} className="w-full h-auto object-cover" autoPlay playsInline muted></video>
                                <canvas ref={canvasRef} style={{ display: 'none' }}></canvas> 

                                <div className="absolute inset-x-0 bottom-0 p-4 flex justify-center gap-4 bg-black/30">
                                    <button
                                        type="button"
                                        onClick={handleCapture}
                                        className="bg-red-500 text-white p-4 rounded-full shadow-xl hover:bg-red-600 transition-colors"
                                    >
                                        <Camera className="w-8 h-8" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsCameraActive(false)}
                                        className="bg-gray-500 text-white p-4 rounded-full shadow-xl hover:bg-gray-600 transition-colors"
                                    >
                                        <StopCircle className="w-8 h-8" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // MODO INATIVO (OPÇÕES DE UPLOAD)
                            <div className="relative w-full h-48 border-2 border-dashed border-red-300 rounded-xl bg-red-50 transition-colors flex flex-col items-center justify-center overflow-hidden hover:bg-red-100">
                                
                                {imagePreview ? (
                                    // A. Imagem Capturada/Selecionada
                                    <div className="relative w-full h-full">
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-10">
                                            <p className="text-white font-bold bg-red-600 px-4 py-2 rounded-full flex items-center gap-2">
                                                <Camera className="w-5 h-5" /> Imagem Capturada (Clique para mudar)
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    // B. Opções de Ação (Câmera ou Galeria)
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 p-4 text-red-600">
                                        <button
                                            type="button"
                                            onClick={() => setIsCameraActive(true)} // Ativa a câmera em tempo real
                                            className="flex flex-col items-center justify-center p-4 bg-red-100 rounded-xl hover:bg-red-200 transition-colors shadow"
                                        >
                                            <Video className="w-8 h-8" />
                                            <span className="mt-1 font-semibold">Câmera Agora</span>
                                        </button>
                                        
                                        <span className="text-gray-400">OU</span>
                                        
                                        {/* Input file para Galeria */}
                                        <div className="relative flex flex-col items-center justify-center p-4 bg-white rounded-xl hover:bg-gray-50 transition-colors shadow border border-gray-300">
                                            <input
                                                id="report-file-input"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="absolute inset-0 opacity-0 cursor-pointer z-20"
                                            />
                                            <Megaphone className="w-8 h-8" />
                                            <span className="mt-1 font-semibold">Upload Galeria</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    {/* FIM DO BLOCO DE CÂMERA */}


                    {/* Campo de Localização + Botão de Verificação + GPS */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Local (Endereço para Mapa)</label>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input value={local} onChange={e => {setLocal(e.target.value); setCoords(null);}} type="text" placeholder="Ex: Pátio do CIn, Rua dos Capibaribes, 123" className="flex-1 p-2.5 border border-gray-300 rounded-lg outline-none" required />
                            <button
                                type="button"
                                onClick={handleCurrentLocation}
                                disabled={isGeolocating || isGeocoding}
                                className={`flex items-center justify-center gap-1 px-4 py-2.5 rounded-lg text-white font-medium transition-colors whitespace-nowrap ${isGeolocating ? 'bg-blue-500 cursor-wait' : 'bg-blue-600 hover:bg-blue-700'}`}
                            >
                                {isGeolocating ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
                                {isGeolocating ? 'GPS Ativo...' : 'Usar GPS'}
                            </button>
                            <button
                                type="button"
                                onClick={geocodeAndDisplayMap}
                                disabled={isGeocoding || !local}
                                className={`flex items-center justify-center gap-1 px-4 py-2.5 rounded-lg text-white font-medium transition-colors whitespace-nowrap ${isGeocoding || !local ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}`}
                            >
                                {isGeocoding ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
                                {isGeocoding ? 'Localizando...' : 'Verificar Local'}
                            </button>
                        </div>
                        
                        {/* VISUALIZAÇÃO DO MAPA */}
                        {coords && (
                            <LocationPreviewMap 
                                latitude={coords.latitude} 
                                longitude={coords.longitude} 
                                name={local}
                            />
                        )}
                        
                    </div>
                    {/* Fim do Campo de Localização */}


                    {/* 2. Valor e Faixa Etária */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Valor</label>
                            <input value={value} onChange={e => setValue(e.target.value)} type="text" placeholder="Ex: Grátis ou R$15" className="w-full p-2.5 border border-gray-300 rounded-lg outline-none" required/>
                        </div>
                        <div className="flex flex-col gap-1">
                             <label className="block text-sm font-bold text-gray-700">Faixa Etária</label>
                             <div className="flex gap-2">
                                 <input type="text" placeholder="+18" disabled={noAgeLimit} className={`w-full p-2.5 border rounded-lg ${noAgeLimit ? 'bg-gray-100' : ''}`} />
                                 <label className="flex items-center gap-1 cursor-pointer whitespace-nowrap">
                                     <input type="checkbox" checked={noAgeLimit} onChange={(e) => setNoAgeLimit(e.target.checked)} /> Livre</label>
                             </div>
                        </div>
                    </div>
                    
                    {/* 3. Horário */}
                    <div className="flex flex-col gap-1">
                             <label className="block text-sm font-bold text-gray-700">Horário</label>
                             <input type="time" disabled={unknownTime} className={`w-full p-2.5 border rounded-lg ${unknownTime ? 'bg-gray-100' : ''}`} />
                             <div className="flex gap-2">
                                 <label className="flex items-center gap-1 cursor-pointer whitespace-nowrap">
                                     <input type="checkbox" checked={unknownTime} onChange={(e) => setUnknownTime(e.target.checked)} /> Não sei</label>
                             </div>
                    </div>

                    {/* 4. Botão de Envio */}
                    <button 
                        type="submit" 
                        className={`w-full text-white font-bold py-4 rounded-xl shadow-lg transition-transform hover:scale-[1.02] flex items-center justify-center gap-2 ${isLoading || isCameraActive ? 'bg-gray-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                        disabled={isLoading || isCameraActive} 
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" /> 
                                Enviando e Mapeando...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-6 h-6" /> Enviar Reporte
                            </>
                        )}
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
    const [imageFile, setImageFile] = useState(null); 
    const [isLoading, setIsLoading] = useState(false); 
    const [isGeocoding, setIsGeocoding] = useState(false); 
    const [coords, setCoords] = useState(null); 
    
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file); 
            setImagePreview(URL.createObjectURL(file));
        } else {
             setImageFile(null); 
             setImagePreview(null);
        }
    };
    
    const geocodeAndDisplayMap = async () => {
        if (!local) {
            setCoords(null);
            alert("Por favor, insira um local/endereço primeiro.");
            return;
        }

        setIsGeocoding(true);
        setCoords(null); 
        
        try {
            const result = await geocodeLocation(local);
            if (result) {
                setCoords(result);
            } else {
                alert("Não foi possível encontrar a localização no mapa. Tente ser mais específico.");
            }
        } catch (error) {
            console.error("Erro ao geocodificar:", error);
            alert("Erro de conexão ao tentar localizar o endereço.");
        } finally {
            setIsGeocoding(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let finalLatitude = coords ? coords.latitude : null;
            let finalLongitude = coords ? coords.longitude : null;
            
            if (!finalLatitude && local) {
                const result = await geocodeLocation(local);
                if (result) {
                    finalLatitude = result.latitude;
                    finalLongitude = result.longitude;
                } else {
                    console.warn("Geocoding falhou para a sugestão. Enviando sem coordenadas precisas.");
                }
            }
            
            const dataHour = new Date(`${date}T${hour || '00:00'}:00`);
            
            const formData = new FormData();
            
            formData.append('nome', name);
            formData.append('local', local);
            formData.append('data', dataHour.toISOString()); 
            formData.append('descricao', `${obs} \n\n Link oficial: ${link}`);
            formData.append('preco', "A definir"); 
            formData.append('faixaEtaria', 0);
            formData.append('precisaInscricao', false);
            formData.append('ativo', false);

            if (finalLatitude !== null) formData.append('latitude', finalLatitude);
            if (finalLongitude !== null) formData.append('longitude', finalLongitude);

            if (imageFile) {
                formData.append('imagemFile', imageFile); 
            }

            await api.post('/eventos', formData);
            alert("Sugestão enviada! Aguarde aprovação.");
            onBack();
        } catch (error) {
            console.error(error);
            alert("Erro ao enviar sugestão.");
        } finally {
            setIsLoading(false);
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
                    
                    {/* 1. NOME DO EVENTO */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Nome do Evento</label>
                        <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder="Ex: Calourada CIn" className="w-full p-3 border border-gray-300 rounded-lg outline-none" required /> 
                    </div>
                    
                    {/* 2. IMAGEM (SUGESTÃO) */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Imagem de Divulgação (Opcional)</label>
                        <div className="relative w-full h-48 border-2 border-dashed border-green-300 rounded-xl bg-green-50 transition-colors flex flex-col items-center justify-center overflow-hidden hover:bg-green-100">
                            <input
                                id="suggest-file-input"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 opacity-0 cursor-pointer z-20"
                            />

                            {imagePreview ? (
                                <div className="relative w-full h-full">
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-10">
                                        <p className="text-white font-bold bg-green-600 px-4 py-2 rounded-full flex items-center gap-2">
                                            <Camera className="w-5 h-5" /> Clique para trocar
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-green-600">
                                    <CalendarPlus className="w-10 h-10 mb-2" />
                                    <p className="text-lg font-semibold">Toque para anexar a arte</p>
                                    <p className="text-sm text-gray-500">Poster, flyer, etc. (Opcional)</p>
                                </div>
                            )}
                        </div>
                    </div>

                    
                    {/* 3. DATA E HORA */}
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
                
                    {/* 4. Campo de Localização + Botão de Verificação (SugestForm) */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Local (Endereço para Mapa)</label>
                        <div className="flex gap-2">
                            <input 
                                value={local} 
                                onChange={e => {setLocal(e.target.value); setCoords(null);}} 
                                type="text" 
                                placeholder="Ex: Pátio do CIn, Rua dos Capibaribes, 123" 
                                className="flex-1 p-2.5 border border-gray-300 rounded-lg outline-none" 
                                required 
                            />

                            {/* Botão de Verificação */}
                            <button
                                type="button"
                                onClick={geocodeAndDisplayMap}
                                disabled={isGeocoding || !local}
                                className={`flex items-center gap-1 px-4 py-2.5 rounded-lg text-white font-medium transition-colors whitespace-nowrap ${isGeocoding || !local ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                            >
                                {isGeocoding ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
                                {isGeocoding ? 'Localizando...' : 'Verificar Local'}
                            </button>
                        </div>
                        
                        {/* VISUALIZAÇÃO DO MAPA */}
                        {coords && (
                            <LocationPreviewMap 
                                latitude={coords.latitude} 
                                longitude={coords.longitude} 
                                name={local}
                            />
                        )}
                        
                    </div>

                    {/* 5. LINK */}
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Link Oficial (Opcional)</label>
                            <div className="relative">
                                <LinkIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <input value={link} onChange={e => setLink(e.target.value)} type="url" placeholder="https://..." className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg outline-none" />
                            </div>
                        </div>
                    </div>

                    {/* 6. COMENTÁRIO */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Observações / Detalhes</label>
                        <div className="relative">
                            <AlignLeft className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <textarea
                                value={obs}
                                onChange={e => setObs(e.target.value)}
                                placeholder="Ex: Entrada gratuita, vai ter banda X e Y, começa a partir das 22h, etc."
                                rows="4"
                                className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg outline-none resize-none"
                            ></textarea>
                        </div>
                    </div>

                    {/* 7. Botão de Envio */}
                    <button 
                        type="submit" 
                        className={`w-full text-white font-bold py-4 rounded-xl shadow-lg transition-transform hover:scale-[1.02] flex items-center justify-center gap-2 ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" /> 
                                Enviando Sugestão...
                            </>
                        ) : (
                            <>
                                <Upload className="w-6 h-6" /> Sugerir Evento
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CheckInPage;