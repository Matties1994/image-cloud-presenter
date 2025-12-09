import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

export default function Login() {
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Simple hardcoded password for the prototype
        if (password === 'start') {
            localStorage.setItem('isAuthenticated', 'true');
            navigate('/');
        } else {
            alert('Verkeerd wachtwoord');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700">
                <div className="flex justify-center mb-6">
                    <div className="bg-blue-500/20 p-4 rounded-full">
                        <Lock size={32} className="text-blue-400" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-center mb-2">Welkom</h2>
                <p className="text-slate-400 text-center mb-8">Voer het wachtwoord in om door te gaan</p>

                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Wachtwoord"
                        className="w-full p-4 bg-slate-900 border border-slate-600 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                        autoFocus
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold p-4 rounded-xl transition-colors"
                    >
                        Inloggen
                    </button>
                </form>
                <p className="text-xs text-slate-500 text-center mt-6">
                    Wachtwoord is: <strong>start</strong>
                </p>
            </div>
        </div>
    );
}
