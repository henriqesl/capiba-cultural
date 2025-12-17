import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, QrCode, Loader2 } from 'lucide-react';
import jsQR from 'jsqr';

const ScannerScreen = ({ onBack, onScanResult }) => {
    const [isScanning, setIsScanning] = useState(true);
    const videoRef = useRef(null);
    const canvasRef = useRef(document.createElement("canvas"));
    const scanningRef = useRef(true);

    // Loop de processamento
    const tick = () => {
        if (!scanningRef.current) return;
        
        const video = videoRef.current;
        
        if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            
            canvas.height = video.videoHeight;
            canvas.width = video.videoWidth;
            
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
            // Tenta decodificar
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });

            // SÓ ACEITA SE TIVER DADOS REAIS
            if (code && code.data && code.data.trim() !== "") {
                console.log("QR Detectado:", code.data);
                scanningRef.current = false; // Para o loop
                setIsScanning(false);
                onScanResult(code.data); // Manda para validação no pai
                return;
            }
        }
        
        requestAnimationFrame(tick);
    };

    useEffect(() => {
        scanningRef.current = true;
        
        navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
        })
        .then(stream => {
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.setAttribute("playsinline", true);
                videoRef.current.play();
                requestAnimationFrame(tick);
            }
        })
        .catch(err => {
            console.error("Erro câmera:", err);
            alert("Erro ao abrir câmera. Verifique permissões.");
        });

        return () => {
            scanningRef.current = false;
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(t => t.stop());
            }
        };
    }, []);

    return (
        <div className="bg-black min-h-screen w-full flex flex-col items-center justify-center relative">
            {/* Header Flutuante */}
            <div className="absolute top-0 left-0 w-full p-4 z-20 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
                <button onClick={onBack} className="text-white p-2 bg-white/10 rounded-full hover:bg-white/20">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <span className="text-white font-bold tracking-wide">Escanear Código</span>
                <div className="w-10"></div>
            </div>

            {/* Area da Câmera */}
            <div className="relative w-full h-full flex items-center justify-center bg-black">
                <video 
                    ref={videoRef} 
                    className="absolute inset-0 w-full h-full object-cover opacity-60" 
                    playsInline 
                    muted
                ></video>
                
                {/* Overlay de Foco (Quadrado) */}
                <div className="relative z-10 w-64 h-64 border-2 border-blue-400 rounded-3xl flex items-center justify-center shadow-[0_0_0_9999px_rgba(0,0,0,0.7)]">
                    {isScanning && (
                        <>
                            <div className="absolute inset-0 border-t-4 border-l-4 border-blue-500 rounded-tl-3xl w-10 h-10 -mt-1 -ml-1"></div>
                            <div className="absolute inset-0 border-t-4 border-r-4 border-blue-500 rounded-tr-3xl w-10 h-10 -mt-1 -mr-1 right-0 left-auto"></div>
                            <div className="absolute inset-0 border-b-4 border-l-4 border-blue-500 rounded-bl-3xl w-10 h-10 -mb-1 -ml-1 bottom-0"></div>
                            <div className="absolute inset-0 border-b-4 border-r-4 border-blue-500 rounded-br-3xl w-10 h-10 -mb-1 -mr-1 bottom-0 right-0 left-auto"></div>
                            
                            <div className="absolute w-full h-1 bg-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-[scan_2s_infinite]"></div>
                        </>
                    )}
                    
                    {!isScanning && (
                        <div className="bg-white/20 backdrop-blur-md p-4 rounded-full">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                    )}
                </div>

                <p className="absolute bottom-20 text-white/80 text-sm font-medium z-20 bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">
                    Aponte para o QR Code do Evento
                </p>
            </div>
        </div>
    );
};

export default ScannerScreen;