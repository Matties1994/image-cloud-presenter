import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Monitor, Upload, Camera, Image as ImageIcon } from 'lucide-react';

const isProduction = import.meta.env.PROD || window.location.hostname.includes('loca.lt') || window.location.hostname.includes('lhr.life');
const API_URL = isProduction ? window.location.origin : `http://${window.location.hostname}:3001`;

export default function Uploader() {
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const galleryInputRef = useRef(null);
    const cameraInputRef = useRef(null);
    const navigate = useNavigate();
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setSuccess(false);

        const formData = new FormData();
        formData.append('image', file);

        try {
            await axios.post(`${API_URL}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setSuccess(true);
            // Reset inputs
            if (galleryInputRef.current) galleryInputRef.current.value = '';
            if (cameraInputRef.current) cameraInputRef.current.value = '';

            // Reset success message after 3 seconds
            setTimeout(() => setSuccess(false), 3000);

        } catch (error) {
            console.error("Upload error:", error);
            alert("Er ging iets mis met uploaden.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center justify-center relative font-sans">


            <div className="w-full max-w-md bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold mb-2">Foto Uploaden</h2>
                    <p className="text-slate-400">Kies hoe je een foto wilt delen</p>
                </div>

                {success ? (
                    <div className="bg-green-500/20 border border-green-500 text-green-200 rounded-xl p-6 text-center animate-in bounce-in duration-500">
                        <div className="flex justify-center mb-2">
                            <div className="bg-green-500 rounded-full p-2">
                                <Upload size={24} className="text-white" />
                            </div>
                        </div>
                        <p className="font-bold text-lg">Gelukt!</p>
                        <p className="text-sm opacity-80">Je foto staat op het bord.</p>
                        <button
                            onClick={() => setSuccess(false)}
                            className="mt-4 text-sm underline hover:text-white cursor-pointer"
                        >
                            Nog een foto uploaden
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Gallery Button */}
                        <button
                            onClick={() => galleryInputRef.current?.click()}
                            disabled={uploading}
                            className={`
                w-full p-6 rounded-xl border-2 border-slate-600 hover:border-blue-400 hover:bg-slate-750 transition-all duration-300 flex items-center gap-4 text-left group
                ${uploading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
              `}
                        >
                            <div className="bg-blue-500/20 p-3 rounded-lg group-hover:scale-110 transition-transform">
                                <ImageIcon size={32} className="text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Kies uit Galerij</h3>
                                <p className="text-slate-400 text-sm">Selecteer een bestaande foto</p>
                            </div>
                        </button>

                        {/* Camera Button */}
                        <button
                            onClick={() => cameraInputRef.current?.click()}
                            disabled={uploading}
                            className={`
                w-full p-6 rounded-xl border-2 border-slate-600 hover:border-purple-400 hover:bg-slate-750 transition-all duration-300 flex items-center gap-4 text-left group
                ${uploading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
              `}
                        >
                            <div className="bg-purple-500/20 p-3 rounded-lg group-hover:scale-110 transition-transform">
                                <Camera size={32} className="text-purple-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Maak een Foto</h3>
                                <p className="text-slate-400 text-sm">Gebruik je camera direct</p>
                            </div>
                        </button>

                        {uploading && (
                            <div className="text-center text-slate-400 text-sm animate-pulse mt-4">
                                Bezig met uploaden...
                            </div>
                        )}

                        {/* Hidden Inputs */}
                        <input
                            type="file"
                            accept="image/*"
                            ref={galleryInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            ref={cameraInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
