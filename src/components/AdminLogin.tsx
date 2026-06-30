import React, { useState } from 'react';
import { SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../translations';
import { KeyRound, ShieldAlert, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
// @ts-ignore
import brandLogo from '../assets/images/qalam_ka_zor_logo_1782697483449.jpg';

interface AdminLoginProps {
  currentLang: SupportedLanguage;
  onLoginSuccess: () => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  currentLang,
  onLoginSuccess,
  onCancel,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Direct local credentials check for secure admin bypass
      if (username === "rahbar@786" && password === "@rahbar@786") {
        localStorage.setItem('bma_authenticated', 'true');
        onLoginSuccess();
        return;
      }

      // Database fallback query check in Supabase 'admins' table
      const { data, error: dbError } = await supabase
        .from('admins')
        .select('*')
        .eq('username', username)
        .eq('password', password);

      if (!dbError && data && data.length > 0) {
        localStorage.setItem('bma_authenticated', 'true');
        onLoginSuccess();
      } else {
        setError(t.loginError);
      }
    } catch (err) {
      setError("Database connection failure. Please retry.");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-slate-200 w-full max-w-md space-y-6 relative">
        
        {/* Close/Back button */}
        <button
          onClick={onCancel}
          className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Portal</span>
        </button>

        <div className="text-center space-y-2 pt-4">
          <div className="flex justify-center mx-auto pb-2">
            <img
              src={brandLogo}
              alt="قلم کا زور Logo"
              className="h-24 w-auto object-contain rounded-xl bg-white p-1.5 border border-slate-100"
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="text-xl font-bold text-slate-900">{t.portalTitle}</h1>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            {t.adminAccessTitle}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-500 uppercase">
              {t.username}
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full px-4 py-3 bg-slate-50 rounded-lg border border-slate-200 focus:border-[#008080] focus:ring-2 focus:ring-[#008080]/10 transition-all outline-none text-sm text-slate-800"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-500 uppercase">
              {t.password}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-slate-50 rounded-lg border border-slate-200 focus:border-[#008080] focus:ring-2 focus:ring-[#008080]/10 transition-all outline-none text-sm text-slate-800"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs font-bold text-red-600 bg-red-50 border border-red-100 p-3 rounded-lg animate-shake">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 bg-[#008080] text-white font-bold text-sm rounded-lg hover:bg-[#006666] transition-colors active:scale-95 duration-200 shadow-md cursor-pointer"
          >
            {t.secureLogin}
          </button>
        </form>

        <p className="text-center text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-wider">
          {t.authorizedOnly}
        </p>
      </div>
    </div>
  );
};
