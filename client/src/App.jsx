import React from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { Monitor, Users } from 'lucide-react';
import Presenter from './pages/Presenter';
import Uploader from './pages/Uploader';
import Login from './pages/Login';

// --- Auth Wrapper ---
const RequireAuth = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// --- Component: Startkeuze Scherm ---
const RoleSelection = () => {
  const navigate = useNavigate();
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-6 font-sans">
      <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
        Foto Cloud Presentatie
      </h1>
      <p className="text-slate-400 mb-12 text-center max-w-md">
        Kies je rol om te beginnen. Start de presentatie op het digibord of upload mee als deelnemer.
      </p>

      <div className={`grid grid-cols-1 ${isLocalhost ? 'md:grid-cols-2' : ''} gap-8 w-full max-w-2xl justify-items-center`}>
        {isLocalhost && (
          <button
            onClick={() => navigate('/presenter')}
            className="group relative flex flex-col items-center p-8 bg-slate-800 rounded-2xl border border-slate-700 hover:border-blue-500 hover:bg-slate-750 transition-all duration-300 shadow-xl cursor-pointer w-full"
          >
            <div className="absolute -top-4 -right-4 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-bounce">
              Voor het Digibord
            </div>
            <Monitor size={48} className="mb-4 text-blue-400 group-hover:scale-110 transition-transform" />
            <h2 className="text-xl font-bold mb-2">Start Presentatie</h2>
            <p className="text-sm text-slate-400 text-center">
              Ik wil de QR-code tonen en de resultaten zien.
            </p>
          </button>
        )}

        <button
          onClick={() => navigate('/upload')}
          className="flex flex-col items-center p-8 bg-slate-800 rounded-2xl border border-slate-700 hover:border-purple-500 hover:bg-slate-750 transition-all duration-300 shadow-xl cursor-pointer w-full"
        >
          <Users size={48} className="mb-4 text-purple-400" />
          <h2 className="text-xl font-bold mb-2">Ik ben Deelnemer</h2>
          <p className="text-sm text-slate-400 text-center">
            Ik wil een foto uploaden vanaf mijn telefoon.
          </p>
        </button>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans overflow-hidden">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<RoleSelection />} />
        <Route path="/presenter" element={
          <RequireAuth>
            <Presenter />
          </RequireAuth>
        } />
        <Route path="/upload" element={<Uploader />} />
      </Routes>
    </div>
  );
}

export default App;
