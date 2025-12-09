import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';
import { Share2, Users, ImageIcon, Maximize2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const isProduction = import.meta.env.PROD || window.location.hostname.includes('loca.lt') || window.location.hostname.includes('lhr.life');
const SOCKET_URL = isProduction ? window.location.origin : `http://${window.location.hostname}:3001`;
const socket = io(SOCKET_URL);

export default function Presenter() {
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [qrUrl, setQrUrl] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Listen for new images
        socket.on('new-image', (data) => {
            setImages(prev => [{ ...data, timestamp: Date.now() }, ...prev]);
        });

        // Listen for clear event
        socket.on('clear-images', () => {
            setImages([]);
        });

        // Determine QR URL
        if (isProduction) {
            // Hardcode your short URL here if you have one, e.g. "bit.ly/foto123"
            const SHORT_URL = "bit.ly/3KMZ3LU";

            if (SHORT_URL) {
                setQrUrl(`https://${SHORT_URL}`);
            } else {
                setQrUrl(`${window.location.origin}/upload`);
            }
        } else {
            // In local dev, try to get local IP
            axios.get(`${SOCKET_URL}/api/ip`)
                .then(res => {
                    const ip = res.data.ip;
                    const clientPort = window.location.port;
                    setQrUrl(`http://${ip}:${clientPort}/upload`);
                })
                .catch(() => setQrUrl(`${window.location.origin}/upload`));
        }

        return () => {
            socket.off('new-image');
            socket.off('clear-images');
        };
    }, []);

    const handleClear = () => {
        if (confirm('Weet je zeker dat je alle foto\'s wilt verwijderen?')) {
            socket.emit('clear-images');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white overflow-hidden relative font-sans">
            {/* Header Bar */}
            <div className="absolute top-0 left-0 right-0 p-4 bg-slate-900/90 backdrop-blur-md z-10 flex justify-between items-center border-b border-slate-800">
                <div className="flex items-center space-x-3">
                    <Share2 className="text-blue-400" />
                    <h1 className="font-bold text-lg">Live Foto Cloud</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleClear}
                        className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/50 px-3 py-1 rounded flex items-center gap-2 cursor-pointer transition-colors"
                    >
                        <X size={14} />
                        Alles Wissen
                    </button>
                    <button
                        onClick={() => navigate('/upload')}
                        className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded border border-slate-600 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                        <Users size={14} />
                        Switch naar Student
                    </button>
                    <div className="text-sm text-slate-400">
                        {images.length} {images.length === 1 ? 'afbeelding' : 'afbeeldingen'}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex h-screen pt-16">

                {/* Sidebar met QR Code */}
                <div className="w-80 bg-slate-800 p-6 flex flex-col items-center justify-center border-r border-slate-700 shadow-2xl z-20 overflow-y-auto shrink-0">

                    <div className="bg-white p-4 rounded-xl mb-6 shadow-inner transform hover:scale-105 transition-transform duration-300">
                        {qrUrl ? (
                            <QRCodeSVG value={qrUrl} size={192} />
                        ) : (
                            <div className="w-48 h-48 flex items-center justify-center text-black">Loading...</div>
                        )}
                    </div>

                    <h3 className="text-xl font-bold text-center mb-2">Doe mee!</h3>
                    <p className="text-slate-400 text-center text-sm mb-4">
                        Scan de code of ga naar de link.
                    </p>

                    <div className="bg-slate-900 p-3 rounded-lg w-full break-all text-xs font-mono text-slate-500 text-center select-all">
                        {qrUrl || 'Laden...'}
                    </div>
                </div>

                {/* Gallery / Table Grid Area */}
                <div className="flex-1 p-8 overflow-y-auto bg-gradient-to-br from-slate-900 to-slate-800 scroll-smooth">
                    {images.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50 animate-pulse">
                            <ImageIcon size={64} className="mb-4" />
                            <p className="text-2xl font-light">Wachten op foto's...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {images.map((img, index) => (
                                <div
                                    key={img.id}
                                    onClick={() => setSelectedImage(img)}
                                    className="
                    relative group cursor-pointer rounded-xl overflow-hidden shadow-lg border-2 border-transparent hover:border-blue-400 transition-all duration-300 hover:scale-[1.02] hover:z-10 bg-slate-800
                    aspect-square
                    animate-in fade-in zoom-in duration-500 fill-mode-backwards
                  "
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <img
                                        src={`${SOCKET_URL}${img.url}`}
                                        alt="Uploaded"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <Maximize2 className="text-white drop-shadow-md transform scale-75 group-hover:scale-100 transition-transform duration-300" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Lightbox / Spotlight Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-6 right-6 text-white/50 hover:text-white p-2 cursor-pointer transition-colors z-50"
                    >
                        <X size={32} />
                    </button>

                    <img
                        src={`${SOCKET_URL}${selectedImage.url}`}
                        alt="Spotlight"
                        className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
}
