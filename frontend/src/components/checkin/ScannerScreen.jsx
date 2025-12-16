import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, QrCode, Loader2, CheckCircle } from 'lucide-react';

const ScannerScreen = ({ onBack, onScanResult }) => {
    const [isScanning, setIsScanning] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const videoRef = useRef(null);

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
        
        navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: 'environment',
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
            
            // SIMULAÇÃO DE LEITURA
            setTimeout(() => {
                const simulatedResult = "https://app.checkin.com/event/calourada-cin-2026";
                setScanResult(simulatedResult);
                onScanResult(simulatedResult); 
                stopCamera();
                setIsScanning(false);
            }, 3000); 

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
                        
                        {isScanning && (
                            <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted></video>
                        )}
                        
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
                            
                            <div className="absolute w-48 h-48 border-4 border-dashed border-blue-400 rounded-lg"></div>
                        </div>
                    </div>
                    
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

export default ScannerScreen;