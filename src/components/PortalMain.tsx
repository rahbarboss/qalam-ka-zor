import React, { useState } from 'react';
import { Article, SupportedLanguage, LANGUAGES, Hadith } from '../types';
import { TRANSLATIONS } from '../translations';
import { HadithCenter } from './HadithCenter';
import { LanguageFilter } from './LanguageFilter';
import { BookOpen, Zap, TrendingUp, ArrowRight, MapPin, Calendar } from 'lucide-react';

interface PortalMainProps {
  articles: Article[];
  categories: string[];
  books: any[];
  research: any[];
  quotes: any[];
  hadiths: Hadith[];
  currentLang: SupportedLanguage;
  onNavigateToAdmin: () => void;
  incrementViews: (id: string) => void;
  activeHeaderTab: 'courses' | 'library' | 'research' | 'hadith';
  setActiveTab: (tab: 'courses' | 'library' | 'research' | 'hadith') => void;
}

export const PortalMain: React.FC<PortalMainProps> = ({
  articles,
  categories,
  books,
  research,
  quotes,
  hadiths,
  currentLang,
  onNavigateToAdmin,
  incrementViews,
  activeHeaderTab,
  setActiveTab,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [selectedLanguages, setSelectedLanguages] = useState<SupportedLanguage[]>(['en', currentLang]);
  const isRTL = LANGUAGES[currentLang].dir === 'rtl';

  // Handle language filter toggle
  const handleLanguageToggle = (lang: SupportedLanguage) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  // Get localized article title
  const getArticleTitle = (article: Article): string => {
    switch (currentLang) {
      case 'ur':
        return article.title_ur || article.title_en;
      case 'ar':
        return article.title_ar || article.title_en;
      case 'hi':
        return article.title_hi || article.title_en;
      default:
        return article.title_en;
    }
  };

  // Get localized article content preview
  const getArticlePreview = (article: Article): string => {
    const content =
      currentLang === 'ur'
        ? article.content_ur || article.content_en
        : currentLang === 'ar'
        ? article.content_ar || article.content_en
        : currentLang === 'hi'
        ? article.content_hi || article.content_en
        : article.content_en;
    return content.substring(0, 150) + '...';
  };

  // Filter articles by selected language
  const filteredArticles = articles.filter((art) => {
    const hasSelectedLang =
      (selectedLanguages.includes('en') && art.title_en) ||
      (selectedLanguages.includes('ur') && art.title_ur) ||
      (selectedLanguages.includes('ar') && art.title_ar) ||
      (selectedLanguages.includes('hi') && art.title_hi);
    return hasSelectedLang;
  });

  // Get featured articles
  const featuredArticles = filteredArticles.filter((a) => a.is_featured).slice(0, 3);

  // Get trending articles
  const trendingArticles = filteredArticles.filter((a) => a.is_trending).slice(0, 3);

  return (
    <main className="w-full">
      {/* COURSES TAB */}
      {activeHeaderTab === 'courses' && (
        <section className="space-y-16">
          {/* Featured Banner */}
          {quotes && quotes.length > 0 && (
            <div className="bg-gradient-to-r from-[#008080] to-[#006666] text-white px-4 md:px-16 py-12 md:py-16 rounded-none md:rounded-2xl space-y-4">
              <p className="text-xs uppercase font-bold tracking-widest opacity-90">
                {currentLang === 'ur' ? 'آج کا نقطہ نظر' : 'Daily Insight'}
              </p>
              <h2 className="text-2xl md:text-3xl font-black leading-relaxed">
                "{quotes[0]?.text_en}"
              </h2>
              <p className="text-sm opacity-90">— {quotes[0]?.author_en}</p>
            </div>
          )}

          {/* Featured Articles Section */}
          {featuredArticles.length > 0 && (
            <div className="px-4 md:px-16 space-y-6">
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-[#FFD700]" />
                <h3 className="text-2xl font-bold text-slate-900">{t.featured}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featuredArticles.map((article) => (
                  <div
                    key={article.id}
                    onClick={() => incrementViews(article.id)}
                    className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100"
                  >
                    {/* Image */}
                    <div className="w-full h-48 bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden">
                      <img
                        src={article.image_url}
                        alt={getArticleTitle(article)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex px-3 py-1 bg-[#008080]/10 text-[#008080] text-[10px] font-bold rounded-full uppercase">
                          {article.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">
                          {article.status}
                        </span>
                      </div>

                      <h4 className="text-lg font-bold text-slate-800 line-clamp-2">
                        {getArticleTitle(article)}
                      </h4>

                      <p className="text-sm text-slate-600 line-clamp-2">
                        {getArticlePreview(article)}
                      </p>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <span className="text-xs text-slate-400 font-semibold">
                          {article.read_time}
                        </span>
                        <ArrowRight className="w-4 h-4 text-[#008080] group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trending Articles */}
          {trendingArticles.length > 0 && (
            <div className="px-4 md:px-16 space-y-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-orange-500" />
                <h3 className="text-2xl font-bold text-slate-900">{t.trendingNow}</h3>
              </div>

              <div className="space-y-4">
                {trendingArticles.map((article, idx) => (
                  <div
                    key={article.id}
                    onClick={() => incrementViews(article.id)}
                    className="group cursor-pointer flex gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-[#008080] hover:shadow-md transition-all"
                  >
                    <div className="w-2 h-full bg-gradient-to-b from-orange-500 to-transparent rounded" />
                    <div className="flex-1 space-y-2">
                      <span className="inline-block text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded">
                        🔥 Trending #{idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-slate-800 group-hover:text-[#008080] transition-colors">
                        {getArticleTitle(article)}
                      </h4>
                      <div className="flex items-center gap-4 text-xs text-slate-500 font-semibold">
                        <span>{article.author}</span>
                        <span>{article.published_date}</span>
                        <span>{article.views} views</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Articles with Filter */}
          <div className="px-4 md:px-16 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-2xl font-bold text-slate-900">{t.latestArticles}</h3>
              <LanguageFilter
                selectedLanguages={selectedLanguages}
                onLanguageToggle={handleLanguageToggle}
                currentLang={currentLang}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.slice(0, 9).map((article) => (
                <div
                  key={article.id}
                  onClick={() => incrementViews(article.id)}
                  className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-slate-100"
                >
                  <div className="w-full h-40 bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden">
                    <img
                      src={article.image_url}
                      alt={getArticleTitle(article)}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="p-4 space-y-3">
                    <span className="inline-flex px-2 py-1 bg-slate-100 text-slate-700 text-[9px] font-bold rounded uppercase">
                      {article.category}
                    </span>

                    <h4 className="text-sm font-bold text-slate-800 line-clamp-2">
                      {getArticleTitle(article)}
                    </h4>

                    <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
                      <span>{article.author}</span>
                      <span>•</span>
                      <span>{article.published_date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* LIBRARY TAB */}
      {activeHeaderTab === 'library' && (
        <section className="px-4 md:px-16 py-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-[#008080]" />
              {t.navLibrary}
            </h2>

            {books && books.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {books.slice(0, 8).map((book) => (
                  <div key={book.id} className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-slate-100 overflow-hidden">
                    <div className="w-full h-56 bg-gradient-to-br from-[#008080] to-[#006666] overflow-hidden flex items-center justify-center">
                      {book.cover_image_url ? (
                        <img
                          src={book.cover_image_url}
                          alt={book.title_en}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <BookOpen className="w-16 h-16 text-white/50" />
                      )}
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="text-sm font-bold text-slate-800 line-clamp-2">
                        {book.title_en}
                      </h3>
                      <p className="text-xs text-slate-600">{book.author_en}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-12">No books available</p>
            )}
          </div>
        </section>
      )}

      {/* RESEARCH TAB */}
      {activeHeaderTab === 'research' && (
        <section className="px-4 md:px-16 py-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-900">{t.researchLabs}</h2>

            {research && research.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {research.slice(0, 6).map((proj) => (
                  <div key={proj.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-slate-100 p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-bold text-slate-800 flex-1">
                        {proj.title_en}
                      </h3>
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full whitespace-nowrap">
                        {proj.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">{proj.lead_en}</p>
                    <div className="flex gap-4 text-xs text-slate-500 font-semibold pt-4 border-t border-slate-100">
                      <span>Year: {proj.year}</span>
                      <span>{proj.citations} Citations</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-12">No research projects available</p>
            )}
          </div>
        </section>
      )}

      {/* HADITH CENTER TAB */}
      {activeHeaderTab === 'hadith' && (
        <HadithCenter hadiths={hadiths} currentLang={currentLang} />
      )}
    </main>
  );
};
