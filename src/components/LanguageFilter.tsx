import React, { useState } from 'react';
import { SupportedLanguage, LANGUAGES } from '../types';
import { Filter, X } from 'lucide-react';

interface LanguageFilterProps {
  selectedLanguages: SupportedLanguage[];
  onLanguageToggle: (lang: SupportedLanguage) => void;
  currentLang: SupportedLanguage;
}

export const LanguageFilter: React.FC<LanguageFilterProps> = ({
  selectedLanguages,
  onLanguageToggle,
  currentLang,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const languages: SupportedLanguage[] = ['en', 'ur', 'ar', 'hi'];

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors font-bold text-xs uppercase tracking-wider text-slate-600"
      >
        <Filter className="w-4 h-4 text-[#008080]" />
        <span>Language Filter</span>
        {selectedLanguages.length > 0 && (
          <span className="ml-1 px-2 py-0.5 bg-[#008080] text-white rounded-full text-[10px]">
            {selectedLanguages.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-3 space-y-2 min-w-[220px]">
          {languages.map((lang) => (
            <label
              key={lang}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedLanguages.includes(lang)}
                onChange={() => onLanguageToggle(lang)}
                className="w-4 h-4 rounded accent-[#008080]"
              />
              <div className="flex-1">
                <span className="text-sm font-bold text-slate-800">
                  {LANGUAGES[lang].name}
                </span>
                <span className="text-xs text-slate-500 block">
                  {LANGUAGES[lang].nativeName}
                </span>
              </div>
            </label>
          ))}

          <button
            onClick={() => {
              onLanguageToggle('en');
              onLanguageToggle('ur');
              onLanguageToggle('ar');
              onLanguageToggle('hi');
              setIsOpen(false);
            }}
            className="w-full text-xs font-bold text-[#008080] hover:bg-slate-50 py-2 rounded-lg mt-2"
          >
            Select All Languages
          </button>

          <button
            onClick={() => {
              selectedLanguages.forEach((lang) => onLanguageToggle(lang));
              setIsOpen(false);
            }}
            className="w-full text-xs font-bold text-red-600 hover:bg-red-50 py-2 rounded-lg"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};
