import React from 'react';
import { SupportedLanguage, Hadith, LANGUAGES } from '../types';
import { TRANSLATIONS } from '../translations';
import { BookOpen, Share2, Heart } from 'lucide-react';

interface HadithCenterProps {
  hadiths: Hadith[];
  currentLang: SupportedLanguage;
}

export const HadithCenter: React.FC<HadithCenterProps> = ({
  hadiths,
  currentLang,
}) => {
  const t = TRANSLATIONS[currentLang];
  const isRTL = LANGUAGES[currentLang].dir === 'rtl';

  const getHadithText = (hadith: Hadith): string => {
    switch (currentLang) {
      case 'ur':
        return hadith.text_ur || hadith.text_en;
      case 'ar':
        return hadith.text_ar || hadith.text_en;
      case 'hi':
        return hadith.text_hi || hadith.text_en;
      default:
        return hadith.text_en;
    }
  };

  const getHadithSource = (hadith: Hadith): string => {
    switch (currentLang) {
      case 'ur':
        return hadith.source_ur || hadith.source_en;
      case 'ar':
        return hadith.source_ar || hadith.source_en;
      case 'hi':
        return hadith.source_hi || hadith.source_en;
      default:
        return hadith.source_en;
    }
  };

  return (
    <section className="bg-gradient-to-br from-slate-900 via-[#008080]/10 to-slate-50 py-16 md:py-24">
      <div className="max-w-[1440px] mx-auto px-4 md:px-16">
        {/* Header */}
        <div className="text-center space-y-3 mb-16">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-[#008080]/10 rounded-xl">
              <BookOpen className="w-8 h-8 text-[#008080]" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-[#008080] tracking-tight">
            {currentLang === 'ur' ? 'حدیث مرکز' : currentLang === 'ar' ? 'مركز الحديث' : currentLang === 'hi' ? 'हदीस केंद्र' : 'Hadith Center'}
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {currentLang === 'ur' 
              ? 'نبی کریم ﷺ کی مبارک احادیث کو معتمد ذرائع سے شیئر کریں۔ قرآن و سنت پر عمل کی رہنمائی۔'
              : currentLang === 'ar'
              ? 'أحاديث نبوية شريفة من المصادر الموثوقة. الهداية من القرآن والسنة الشريفة.'
              : currentLang === 'hi'
              ? 'नबी करीम ﷺ की मुबारक हदीसें। कुरान और सुन्नत की शिक्षाएं।'
              : 'Prophetic traditions (Hadith) from authentic sources. Guidance from the Quran and Sunnah.'}
          </p>
        </div>

        {/* Hadiths Grid */}
        {hadiths && hadiths.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {hadiths.slice(0, 12).map((hadith, idx) => (
              <div
                key={hadith.id || idx}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-slate-100 group"
              >
                {/* Image Banner */}
                {hadith.image_url && (
                  <div className="w-full h-48 bg-gradient-to-br from-[#008080] to-[#006666] overflow-hidden relative">
                    <img
                      src={hadith.image_url}
                      alt="Hadith Banner"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  </div>
                )}

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Arabic/Urdu Text */}
                  {(hadith.text_ar || hadith.text_ur) && (
                    <div
                      dir={isRTL ? 'rtl' : 'ltr'}
                      className={`text-base font-bold leading-relaxed ${
                        isRTL ? 'font-brand text-teal-800' : 'text-slate-700'
                      }`}
                    >
                      "{getHadithText(hadith)}"
                    </div>
                  )}

                  {/* English Text (if different from primary) */}
                  {currentLang !== 'en' && hadith.text_en && (
                    <div className="text-sm italic text-slate-600 leading-relaxed border-l-2 border-[#008080]/30 pl-4">
                      "{hadith.text_en}"
                    </div>
                  )}

                  {/* Source Reference */}
                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                      {currentLang === 'ur' ? 'ماخذ' : currentLang === 'ar' ? 'المصدر' : currentLang === 'hi' ? 'स्रोत' : 'Source'}
                    </p>
                    <p className="text-sm font-semibold text-[#008080]">
                      {getHadithSource(hadith)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          `"${getHadithText(hadith)}"\n\n${getHadithSource(hadith)}`
                        )
                      }
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-slate-50 hover:bg-[#008080]/10 text-[#008080] font-bold text-xs rounded-lg transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>{currentLang === 'ur' ? 'شیئر' : 'Share'}</span>
                    </button>
                    <button className="flex items-center justify-center py-2 px-3 bg-slate-50 hover:bg-red-50 text-red-500 font-bold text-xs rounded-lg transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-semibold">
              {currentLang === 'ur' ? 'کوئی احادیث دستیاب نہیں' : 'No hadiths available yet'}
            </p>
          </div>
        )}

        {/* View All Button */}
        {hadiths && hadiths.length > 12 && (
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-[#008080] hover:bg-[#006666] text-white font-bold rounded-lg transition-colors">
              {currentLang === 'ur' ? 'تمام احادیث دیکھیں' : 'View All Hadiths'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
