import React, { useState } from 'react';
import { SupportedLanguage, LANGUAGES } from '../types';
import { TRANSLATIONS } from '../translations';
import { Globe, User, LogIn, Menu, X, ChevronDown } from 'lucide-react';
// @ts-ignore
import brandLogo from '../assets/images/qalam_ka_zor_logo_1782697483449.jpg';

interface PortalHeaderProps {
  currentLang: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  onNavigateToAdmin: () => void;
  isAdmin: boolean;
  activeTab: 'courses' | 'library' | 'research' | 'admissions';
  setActiveTab: (tab: 'courses' | 'library' | 'research' | 'admissions') => void;
}

export const PortalHeader: React.FC<PortalHeaderProps> = ({
  currentLang,
  setLanguage,
  onNavigateToAdmin,
  isAdmin,
  activeTab,
  setActiveTab,
}) => {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[currentLang];

  const handleLangChange = (lang: SupportedLanguage) => {
    setLanguage(lang);
    setLangDropdownOpen(false);
  };

  const handleTabClick = (tab: 'courses' | 'library' | 'research' | 'admissions') => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-slate-200 h-20 transition-all duration-300 shadow-xs">
      <nav className="flex justify-between items-center w-full px-4 md:px-16 max-w-[1440px] mx-auto h-full">
        {/* Brand Logo & Desktop Links */}
        <div className="flex items-center gap-8">
          <a
            href="#"
            className="flex items-center gap-3"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('courses');
            }}
          >
            <img
              src={brandLogo}
              alt="قلم کا زور Logo"
              className="h-14 w-auto max-w-[56px] object-contain rounded-xl bg-white p-1 border border-slate-100 transition-transform duration-300 hover:rotate-3 hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <span className="font-brand text-xl md:text-2xl font-medium text-gradient-teal-gold whitespace-nowrap tracking-wide leading-relaxed py-1 transition-all duration-300 hover:brightness-110">
              {t.portalTitle}
            </span>
          </a>
          
          <ul className="hidden lg:flex items-center gap-6">
            <li 
              onClick={() => handleTabClick('courses')}
              className={`font-sans text-sm font-medium transition-all cursor-pointer pb-1 ${
                activeTab === 'courses' 
                  ? 'text-[#008080] border-b-2 border-[#008080]' 
                  : 'text-slate-600 hover:text-[#008080]'
              }`}
            >
              {t.navCourses}
            </li>
            <li 
              onClick={() => handleTabClick('library')}
              className={`font-sans text-sm font-medium transition-all cursor-pointer pb-1 ${
                activeTab === 'library' 
                  ? 'text-[#008080] border-b-2 border-[#008080]' 
                  : 'text-slate-600 hover:text-[#008080]'
              }`}
            >
              {t.navLibrary}
            </li>
            <li 
              onClick={() => handleTabClick('research')}
              className={`font-sans text-sm font-medium transition-all cursor-pointer pb-1 ${
                activeTab === 'research' 
                  ? 'text-[#008080] border-b-2 border-[#008080]' 
                  : 'text-slate-600 hover:text-[#008080]'
              }`}
            >
              {t.navResearch}
            </li>
            <li 
              onClick={() => handleTabClick('admissions')}
              className={`font-sans text-sm font-medium transition-all cursor-pointer pb-1 ${
                activeTab === 'admissions' 
                  ? 'text-[#008080] border-b-2 border-[#008080]' 
                  : 'text-slate-600 hover:text-[#008080]'
              }`}
            >
              {t.navAdmissions}
            </li>
          </ul>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {/* Language Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-[#008080] cursor-pointer px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <Globe className="w-4 h-4 text-[#008080]" />
              <span>{LANGUAGES[currentLang].name}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {langDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setLangDropdownOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 z-40 bg-white border border-slate-200 rounded-xl shadow-xl p-2 w-36 animate-in fade-in slide-in-from-top-2 duration-200">
                  {(Object.keys(LANGUAGES) as SupportedLanguage[]).map((langKey) => (
                    <button
                      key={langKey}
                      onClick={() => handleLangChange(langKey)}
                      className={`w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-50 transition-colors flex justify-between items-center ${
                        currentLang === langKey ? 'text-[#008080] font-bold bg-[#008080]/5' : 'text-slate-700'
                      }`}
                    >
                      <span>{LANGUAGES[langKey].nativeName}</span>
                      <span className="text-[10px] text-slate-400 font-mono uppercase">
                        ({langKey})
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="hidden md:block h-8 w-[1px] bg-slate-200" />

          {/* Admin / Portal Toggle button */}
          <button
            onClick={onNavigateToAdmin}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold cursor-pointer transition-colors ${
              isAdmin 
                ? 'bg-[#008080] text-white hover:bg-[#006666]' 
                : 'text-slate-700 bg-slate-50 hover:bg-slate-100'
            }`}
            title="Administrator Portal"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">
              {isAdmin ? t.adminPortal : t.facultyPortal}
            </span>
          </button>

          {/* Enroll Now high priority CTA */}
          <button 
            onClick={() => handleTabClick('admissions')}
            className="hidden md:block bg-[#FFD700] text-slate-900 px-5 py-2.5 rounded-full font-sans text-xs font-bold hover:bg-[#e6c200] active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            {t.enrollNow}
          </button>

          {/* Mobile Hamburg menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-[#008080] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-200 shadow-lg p-6 space-y-6 animate-in slide-in-from-top-5 duration-300 z-50">
          <ul className="space-y-4">
            <li 
              onClick={() => handleTabClick('courses')}
              className={`text-base font-semibold py-2 border-b border-slate-100 cursor-pointer ${
                activeTab === 'courses' ? 'text-[#008080]' : 'text-slate-700 hover:text-[#008080]'
              }`}
            >
              {t.navCourses}
            </li>
            <li 
              onClick={() => handleTabClick('library')}
              className={`text-base font-semibold py-2 border-b border-slate-100 cursor-pointer ${
                activeTab === 'library' ? 'text-[#008080]' : 'text-slate-700 hover:text-[#008080]'
              }`}
            >
              {t.navLibrary}
            </li>
            <li 
              onClick={() => handleTabClick('research')}
              className={`text-base font-semibold py-2 border-b border-slate-100 cursor-pointer ${
                activeTab === 'research' ? 'text-[#008080]' : 'text-slate-700 hover:text-[#008080]'
              }`}
            >
              {t.navResearch}
            </li>
            <li 
              onClick={() => handleTabClick('admissions')}
              className={`text-base font-semibold py-2 border-b border-slate-100 cursor-pointer ${
                activeTab === 'admissions' ? 'text-[#008080]' : 'text-slate-700 hover:text-[#008080]'
              }`}
            >
              {t.navAdmissions}
            </li>
          </ul>
          <button 
            onClick={() => handleTabClick('admissions')}
            className="w-full bg-[#FFD700] text-slate-900 py-3 rounded-full font-bold text-sm hover:opacity-95 transition-opacity"
          >
            {t.enrollNow}
          </button>
        </div>
      )}
    </header>
  );
};
