import { useState, useEffect } from 'react';
import { SupportedLanguage, Article, LANGUAGES } from './types';
import { TRANSLATIONS } from './translations';
import { PortalHeader } from './components/PortalHeader';
import { PortalMain } from './components/PortalMain';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
// @ts-ignore
import brandLogo from './assets/images/qalam_ka_zor_logo_1782697483449.jpg';
import { 
  Globe, Info, Sparkles, LogOut, ChevronRight, GraduationCap, 
  MapPin, PhoneCall, Mail, Facebook, Instagram, Twitter
} from 'lucide-react';
import { supabase } from './lib/supabase';
import { 
  FALLBACK_ARTICLES, 
  FALLBACK_BOOKS, 
  FALLBACK_RESEARCH, 
  FALLBACK_CATEGORIES,
  FALLBACK_QUOTES,
  FALLBACK_HADITHS
} from './lib/fallbacks';

export default function App() {
  // Localization context state
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(() => {
    const cached = localStorage.getItem('qkz_lang');
    return (cached as SupportedLanguage) || 'en';
  });

  const t = TRANSLATIONS[currentLang];

  // Global Articles state
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<string[]>(['Science', 'History', 'Culture']);
  const [books, setBooks] = useState<any[]>([]);
  const [research, setResearch] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [hadiths, setHadiths] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Router navigation state: 'portal' | 'login' | 'dashboard'
  const [currentView, setCurrentView] = useState<'portal' | 'login' | 'dashboard'>(() => {
    const isAuthed = localStorage.getItem('qkz_authenticated') === 'true';
    return isAuthed ? 'dashboard' : 'portal';
  });

  // Tab selected in portal header
  const [activeHeaderTab, setActiveHeaderTab] = useState<'courses' | 'library' | 'research' | 'hadith'>('courses');

  // Dynamic RTL/LTR and Font Swap on language change
  useEffect(() => {
    localStorage.setItem('qkz_lang', currentLang);
    document.documentElement.setAttribute('dir', LANGUAGES[currentLang].dir);
    document.documentElement.setAttribute('lang', currentLang);
    document.documentElement.setAttribute('charset', 'UTF-8');
    
    // Dynamically update document body font-family
    document.body.style.fontFamily = LANGUAGES[currentLang].fontFamily;
    
    // Force re-render of Urdu/Arabic text
    document.body.style.textRendering = 'optimizeLegibility';
  }, [currentLang]);

  // Retrieve initial articles list from backend database
  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('articles')
        .select('*');

      if (error) throw error;

      if (data && data.length > 0) {
        setArticles(data as Article[]);
      } else {
        setArticles(FALLBACK_ARTICLES);
      }
    } catch (err) {
      console.info("Failed to connect to Supabase articles table, using fallback", err);
      setArticles(FALLBACK_ARTICLES);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch books from backend database
  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*');

      if (error) throw error;

      if (data && data.length > 0) {
        setBooks(data);
      } else {
        setBooks(FALLBACK_BOOKS);
      }
    } catch (err) {
      console.info("Failed to fetch books from Supabase, using fallback", err);
      setBooks(FALLBACK_BOOKS);
    }
  };

  // Fetch research projects from backend database
  const fetchResearch = async () => {
    try {
      const { data, error } = await supabase
        .from('research')
        .select('*');

      if (error) throw error;

      if (data && data.length > 0) {
        setResearch(data);
      } else {
        setResearch(FALLBACK_RESEARCH);
      }
    } catch (err) {
      console.info("Failed to fetch research projects from Supabase, using fallback", err);
      setResearch(FALLBACK_RESEARCH);
    }
  };

  // Fetch categories from backend database
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('name');

      if (error) throw error;

      if (data && data.length > 0) {
        setCategories(data.map((c: any) => c.name));
      } else {
        setCategories(FALLBACK_CATEGORIES);
      }
    } catch (err) {
      console.info("Failed to fetch academic categories from Supabase, using fallback", err);
      setCategories(FALLBACK_CATEGORIES);
    }
  };

  // Fetch Quotes
  const fetchQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*');

      if (error) throw error;

      if (data && data.length > 0) {
        setQuotes(data);
      } else {
        setQuotes(FALLBACK_QUOTES);
      }
    } catch (e) {
      console.info("Error loading quotes from Supabase, using fallback", e);
      setQuotes(FALLBACK_QUOTES);
    }
  };

  // Fetch Hadiths
  const fetchHadiths = async () => {
    try {
      const { data, error } = await supabase
        .from('hadiths')
        .select('*');

      if (error) throw error;

      if (data && data.length > 0) {
        setHadiths(data);
      } else {
        setHadiths(FALLBACK_HADITHS);
      }
    } catch (e) {
      console.info("Error loading hadiths from Supabase, using fallback", e);
      setHadiths(FALLBACK_HADITHS);
    }
  };

  const handleAddCategory = async (newCategory: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('categories')
        .insert([{ name: newCategory }]);

      if (error) throw error;

      setCategories(prev => {
        if (!prev.includes(newCategory)) {
          return [...prev, newCategory];
        }
        return prev;
      });
      return true;
    } catch (err) {
      console.info("Failed to add category to Supabase, falling back locally", err);
      setCategories(prev => {
        if (!prev.includes(newCategory)) {
          return [...prev, newCategory];
        }
        return prev;
      });
      return true;
    }
  };

  useEffect(() => {
    fetchArticles();
    fetchCategories();
    fetchBooks();
    fetchResearch();
    fetchQuotes();
    fetchHadiths();
  }, []);

  // Increment views counter
  const incrementViews = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('views')
        .eq('id', id)
        .single();

      if (error) throw error;

      const currentViews = data ? (data.views || 0) : 0;
      const newViews = currentViews + 1;

      const { error: updateError } = await supabase
        .from('articles')
        .update({ views: newViews })
        .eq('id', id);

      if (updateError) throw updateError;

      // Optimistic UI updates
      setArticles(prev => prev.map(art => art.id === id ? { ...art, views: newViews } : art));
    } catch (err) {
      console.info("Could not increment view counts on Supabase, adjusting locally", err);
      setArticles(prev => prev.map(art => art.id === id ? { ...art, views: (art.views || 0) + 1 } : art));
    }
  };

  // Navigations
  const handleNavigateToAdmin = () => {
    const isAuthed = localStorage.getItem('qkz_authenticated') === 'true';
    if (isAuthed) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('login');
    }
  };

  const handleLoginSuccess = () => {
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('qkz_authenticated');
    setCurrentView('portal');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans transition-all duration-300" lang={currentLang}>
      
      {/* Conditionally render header depending on dashboard mode */}
      {currentView !== 'dashboard' && (
        <PortalHeader
          currentLang={currentLang}
          setLanguage={setCurrentLang}
          onNavigateToAdmin={handleNavigateToAdmin}
          isAdmin={currentView === 'login'}
          activeTab={activeHeaderTab}
          setActiveTab={setActiveHeaderTab}
        />
      )}

      {/* CORE ROUTING ENGINE */}
      <main className="flex-1">
        {isLoading ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-[#008080] animate-spin" />
            <p className="text-xs font-bold text-[#008080] tracking-wide uppercase">{t.loading}</p>
          </div>
        ) : (
          <>
            {currentView === 'portal' && (
              <PortalMain
                articles={articles}
                categories={categories}
                books={books}
                research={research}
                quotes={quotes}
                hadiths={hadiths}
                currentLang={currentLang}
                onNavigateToAdmin={handleNavigateToAdmin}
                incrementViews={incrementViews}
                activeHeaderTab={activeHeaderTab}
                setActiveHeaderTab={setActiveHeaderTab}
              />
            )}

            {currentView === 'login' && (
              <AdminLogin
                currentLang={currentLang}
                onLoginSuccess={handleLoginSuccess}
                onCancel={() => setCurrentView('portal')}
              />
            )}

            {currentView === 'dashboard' && (
              <AdminDashboard
                articles={articles}
                setArticles={setArticles}
                categories={categories}
                onAddCategory={handleAddCategory}
                currentLang={currentLang}
                onLogout={handleLogout}
                onRefreshArticles={fetchArticles}
                books={books}
                setBooks={setBooks}
                researchList={research}
                setResearchList={setResearch}
                quotes={quotes}
                setQuotes={setQuotes}
                hadiths={hadiths}
                setHadiths={setHadiths}
              />
            )}
          </>
        )}
      </main>

      {/* FOOTER */}
      {currentView !== 'dashboard' && (
        <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-20 md:pb-12 mt-16">
          <div className="max-w-[1440px] mx-auto px-4 md:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            
            {/* Branding column */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <img
                  src={brandLogo}
                  alt="قلم کا زور Logo"
                  className="h-14 w-auto max-w-[56px] object-contain rounded-xl bg-white p-1 border border-slate-700/50"
                  referrerPolicy="no-referrer"
                />
                <h3 className="font-brand text-xl md:text-2xl font-medium text-gradient-teal-gold whitespace-nowrap tracking-wide leading-relaxed py-1">قلم کا زور</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                {t.footerText}
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#008080] hover:text-white flex items-center justify-center transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#008080] hover:text-white flex items-center justify-center transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#008080] hover:text-white flex items-center justify-center transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Academic column */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-5">{t.navCourses}</h4>
              <ul className="space-y-2.5 text-xs text-slate-400 font-semibold">
                <li><a href="#" className="hover:text-[#008080] transition-colors">{t.degreePrograms}</a></li>
                <li><a href="#" className="hover:text-[#008080] transition-colors">{t.onlineCourses}</a></li>
                <li><a href="#" className="hover:text-[#008080] transition-colors">{t.researchLabs}</a></li>
                <li><a href="#" className="hover:text-[#008080] transition-colors">{t.scholarships}</a></li>
              </ul>
            </div>

            {/* Community column */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-5">Community</h4>
              <ul className="space-y-2.5 text-xs text-slate-400 font-semibold">
                <li><a href="#" className="hover:text-[#008080] transition-colors">{t.alumniNetwork}</a></li>
                <li><a href="#" className="hover:text-[#008080] transition-colors">{t.eventsCalendar}</a></li>
                <li><a href="#" className="hover:text-[#008080] transition-colors">Student Clubs</a></li>
                <li><a href="#" className="hover:text-[#008080] transition-colors">{t.academicJournal}</a></li>
                <li><a href="#" className="hover:text-[#008080] transition-colors">{t.careers}</a></li>
              </ul>
            </div>

            {/* Support column */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-5">Support</h4>
              <ul className="space-y-2.5 text-xs text-slate-400 font-semibold">
                <li><a href="#" className="hover:text-[#008080] transition-colors">{t.helpCenter}</a></li>
                <li><a href="#" className="hover:text-[#008080] transition-colors">{t.privacyPolicy}</a></li>
                <li><a href="#" className="hover:text-[#008080] transition-colors">{t.termsOfService}</a></li>
                <li><a href="#" className="hover:text-[#008080] transition-colors">{t.contactUs}</a></li>
              </ul>
            </div>
          </div>

          {/* Subfooter */}
          <div className="pt-8 border-t border-slate-800 max-w-[1440px] mx-auto px-4 md:px-16 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-slate-500 font-bold uppercase">
            <p>{t.copyright}</p>
            <div className="flex gap-6 items-center flex-wrap">
              <span className="flex items-center gap-1 hover:text-[#008080] transition-colors cursor-pointer">
                <Globe className="w-3.5 h-3.5 text-[#008080]" />
                <span>Global - {LANGUAGES[currentLang].name}</span>
              </span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
                <span>{t.isoCertified} 9001:2015</span>
              </span>
            </div>
          </div>
        </footer>
      )}

      {/* MOBILE BOTTOM NAV BAR */}
      {currentView === 'portal' && (
        <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center bg-white border-t border-slate-200 py-2.5 z-50 shadow-lg">
          <button 
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex flex-col items-center justify-center text-[#008080] font-bold flex-1"
          >
            <span className="text-xs font-bold">{t.home}</span>
          </button>
          
          <button 
            onClick={handleNavigateToAdmin}
            className="flex flex-col items-center justify-center text-slate-500 font-bold flex-1"
          >
            <span className="text-xs font-bold">{t.facultyPortal}</span>
          </button>
        </nav>
      )}
    </div>
  );
}
