import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import jsQR from 'jsqr';

const ScannerScreen = ({ onBack, onScanResult }) => {
    const [isScanning, setIsScanning] = useState(true);
    const videoRef = useRef(null);
    // Removemos o canvasRef do estado para evitar recriação desnecessária, 
    // mas criamos ele internamente no tick ou usamos uma ref persistente simples.
    const canvasRef = useRef(document.createElement("canvas"));
    const scanningRef = useRef(true);
    const streamRef = useRef(null); // 🟢 Nova ref para guardar o stream e poder desligar depois

    // Função para parar a câmera
    const stopCamera = () => {
        scanningRef.current = false;
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => {
                track.stop(); // 🛑 Para a câmera fisicamente
            });
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    };

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
            
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });

            if (code && code.data && code.data.trim() !== "") {
                console.log("QR Detectado:", code.data);
                stopCamera(); // 🛑 Para a câmera assim que ler
                setIsScanning(false);
                onScanResult(code.data);
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
            streamRef.current = stream; // Guarda o stream
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.setAttribute("playsinline", true);
                videoRef.current.play();
                requestAnimationFrame(tick);
            }
        })
        .catch(err => {
            console.error("Erro câmera:", err);
            alert("Erro ao acessar câmera.");
        });

        // 🟢 CLEANUP: Executado quando o componente desmonta (ao clicar em Voltar)
        return () => {
            stopCamera();
        };
    }, []);

    const handleBack = () => {
        stopCamera(); // Garante parada ao clicar no botão
        onBack();
    };

    return (
        <div className="bg-black min-h-screen w-full flex flex-col items-center justify-center relative">
            <div className="absolute top-0 left-0 w-full p-4 z-20 flex justify-between">
                <button onClick={handleBack} className="text-white p-2 bg-white/10 rounded-full hover:bg-white/20">
                    <ArrowLeft className="w-6 h-6" />
                </button>
            </div>
            
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                <video 
                    ref={videoRef} 
                    className="absolute inset-0 w-full h-full object-cover opacity-80" 
                    playsInline 
                    muted
                ></video>
                
                <div className="relative z-10 w-72 h-72 border-2 border-blue-400 rounded-3xl flex items-center justify-center shadow-[0_0_0_9999px_rgba(0,0,0,0.8)]">
                    {!isScanning && <Loader2 className="w-10 h-10 text-white animate-spin" />}
                    
                    {isScanning && (
                        <div className="absolute w-full h-1 bg-blue-500/80 shadow-[0_0_20px_rgba(59,130,246,1)] animate-[scan_2s_infinite]"></div>
                    )}
                </div>

                <p className="absolute bottom-24 text-white/90 text-sm font-medium z-20 bg-black/60 px-6 py-2 rounded-full backdrop-blur-md border border-white/10">
                    Aponte para o código do evento
                </p>
            </div>
        </div>
    );
};

export default ScannerScreen;