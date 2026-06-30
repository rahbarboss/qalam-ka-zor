import React, { useState } from 'react';
import { Article, SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../translations';
import { ArticleComposer } from './ArticleComposer';
// @ts-ignore
import brandLogo from '../assets/images/qalam_ka_zor_logo_1782697483449.jpg';
import { 
  LayoutDashboard, FileText, Library, Settings, HelpCircle, 
  Plus, Search, Bell, Globe, Trash2, Edit3, LogOut, AlertTriangle,
  FileSpreadsheet, BookOpen, Book, GraduationCap, Eye, CheckCircle2,
  ListFilter, Copy, Check, UploadCloud, FileIcon, Loader2, RefreshCw, Quote, FlaskConical
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { 
  FALLBACK_QUOTES, 
  FALLBACK_HADITHS, 
  FALLBACK_BOOKS, 
  FALLBACK_RESEARCH, 
  FALLBACK_MEDIA 
} from '../lib/fallbacks';

interface AdminDashboardProps {
  articles: Article[];
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
  categories: string[];
  onAddCategory: (newCat: string) => Promise<boolean>;
  currentLang: SupportedLanguage;
  onLogout: () => void;
  onRefreshArticles: () => Promise<void>;
  books: any[];
  setBooks: React.Dispatch<React.SetStateAction<any[]>>;
  researchList: any[];
  setResearchList: React.Dispatch<React.SetStateAction<any[]>>;
  quotes: any[];
  setQuotes: React.Dispatch<React.SetStateAction<any[]>>;
  hadiths: any[];
  setHadiths: React.Dispatch<React.SetStateAction<any[]>>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  articles,
  setArticles,
  categories,
  onAddCategory,
  currentLang,
  onLogout,
  onRefreshArticles,
  books,
  setBooks,
  researchList,
  setResearchList,
  quotes,
  setQuotes,
  hadiths,
  setHadiths,
}) => {
  const t = TRANSLATIONS[currentLang];

  // Tab State: 'dashboard_stats' | 'articles' | 'side_posts' | 'quotes' | 'hadith' | 'books' | 'media' | 'research' | 'settings'
  const [activeTab, setActiveTab] = useState<'dashboard_stats' | 'articles' | 'side_posts' | 'quotes' | 'hadith' | 'books' | 'media' | 'research' | 'settings'>('articles');

  // Daily Quotes State
  const [isFetchingQuotes, setIsFetchingQuotes] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<any | null>(null);

  // Quote Form State
  const [quoteTextEn, setQuoteTextEn] = useState('');
  const [quoteTextUr, setQuoteTextUr] = useState('');
  const [quoteTextAr, setQuoteTextAr] = useState('');
  const [quoteTextHi, setQuoteTextHi] = useState('');
  const [quoteAuthorEn, setQuoteAuthorEn] = useState('');
  const [quoteAuthorUr, setQuoteAuthorUr] = useState('');
  const [quoteAuthorAr, setQuoteAuthorAr] = useState('');
  const [quoteAuthorHi, setQuoteAuthorHi] = useState('');
  const [quoteIsActive, setQuoteIsActive] = useState(true);

  // Hadiths State
  const [isFetchingHadiths, setIsFetchingHadiths] = useState(false);
  const [isHadithModalOpen, setIsHadithModalOpen] = useState(false);
  const [editingHadith, setEditingHadith] = useState<any | null>(null);

  // Hadith Form State
  const [hadithTextEn, setHadithTextEn] = useState('');
  const [hadithTextUr, setHadithTextUr] = useState('');
  const [hadithTextAr, setHadithTextAr] = useState('');
  const [hadithTextHi, setHadithTextHi] = useState('');
  const [hadithSourceEn, setHadithSourceEn] = useState('');
  const [hadithSourceUr, setHadithSourceUr] = useState('');
  const [hadithSourceAr, setHadithSourceAr] = useState('');
  const [hadithSourceHi, setHadithSourceHi] = useState('');
  const [hadithImageUrl, setHadithImageUrl] = useState('');

  // Books State
  const [isFetchingBooks, setIsFetchingBooks] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<any | null>(null);

  // Book Form State
  const [bookTitleEn, setBookTitleEn] = useState('');
  const [bookTitleUr, setBookTitleUr] = useState('');
  const [bookTitleAr, setBookTitleAr] = useState('');
  const [bookTitleHi, setBookTitleHi] = useState('');
  const [bookAuthorEn, setBookAuthorEn] = useState('');
  const [bookAuthorUr, setBookAuthorUr] = useState('');
  const [bookAuthorAr, setBookAuthorAr] = useState('');
  const [bookAuthorHi, setBookAuthorHi] = useState('');
  const [bookCategory, setBookCategory] = useState('Science');
  const [bookYear, setBookYear] = useState('');
  const [bookPages, setBookPages] = useState('');
  const [bookIsbn, setBookIsbn] = useState('');
  const [bookAbstractEn, setBookAbstractEn] = useState('');
  const [bookAbstractUr, setBookAbstractUr] = useState('');
  const [bookAbstractAr, setBookAbstractAr] = useState('');
  const [bookAbstractHi, setBookAbstractHi] = useState('');
  const [bookCoverImageUrl, setBookCoverImageUrl] = useState('');

  // Composing / Editing states
  const [isComposing, setIsComposing] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  // Research Projects State
  const [isFetchingResearch, setIsFetchingResearch] = useState(false);
  const [isResearchModalOpen, setIsResearchModalOpen] = useState(false);
  const [editingResearch, setEditingResearch] = useState<any | null>(null);

  // Research Form State
  const [resTitleEn, setResTitleEn] = useState('');
  const [resTitleAr, setResTitleAr] = useState('');
  const [resTitleUr, setResTitleUr] = useState('');
  const [resTitleHi, setResTitleHi] = useState('');
  const [resLeadEn, setResLeadEn] = useState('');
  const [resLeadAr, setResLeadAr] = useState('');
  const [resLeadUr, setResLeadUr] = useState('');
  const [resLeadHi, setResLeadHi] = useState('');
  const [resStatus, setResStatus] = useState<'Published' | 'Under Review' | 'In Progress'>('In Progress');
  const [resFunding, setResFunding] = useState('');
  const [resYear, setResYear] = useState(new Date().getFullYear());
  const [resCitations, setResCitations] = useState(0);
  const [resAbstractEn, setResAbstractEn] = useState('');
  const [resAbstractAr, setResAbstractAr] = useState('');
  const [resAbstractUr, setResAbstractUr] = useState('');
  const [resAbstractHi, setResAbstractHi] = useState('');

  // Search & Filtration (Articles)
  const [dashboardSearch, setDashboardSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Delete modal states (Articles)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- MEDIA MANAGER STATES ---
  const [mediaFiles, setMediaFiles] = useState<any[]>([]);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const [mediaSearch, setMediaSearch] = useState('');
  const [dragActive, setDragActive] = useState(false);
  
  // Media rename states
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  
  // Media delete states
  const [mediaToDelete, setMediaToDelete] = useState<any | null>(null);
  const [showMediaDeleteModal, setShowMediaDeleteModal] = useState(false);
  const [isDeletingMedia, setIsDeletingMedia] = useState(false);

  // Clipboard copy state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Settings mock state
  const [schoolName, setSchoolName] = useState('قلم کا زور');
  const [primaryColor, setPrimaryColor] = useState('#008080');
  const [accentColor, setAccentColor] = useState('#FFD700');
  const [adminName, setAdminName] = useState('Rahbar Admin');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Helper to translate article strings with robust multi-language fallback
  const getLocalizedTitle = (article: Article) => {
    if (currentLang === 'ar' && article.title_ar) return article.title_ar;
    if (currentLang === 'ur' && article.title_ur) return article.title_ur;
    if (currentLang === 'hi' && article.title_hi) return article.title_hi;
    if (currentLang === 'en' && article.title_en && article.title_en !== "Untitled English Article" && article.title_en !== "Untitled Article") return article.title_en;

    // Direct language check fallbacks for empty primary language title
    if (article.title_ur) return article.title_ur;
    if (article.title_ar) return article.title_ar;
    if (article.title_hi) return article.title_hi;
    if (article.title_en && article.title_en !== "Untitled English Article" && article.title_en !== "Untitled Article") return article.title_en;
    
    return article.title_en || "Untitled Article";
  };

  // Fetch Media metadata
  const fetchMedia = async () => {
    try {
      setIsLoadingMedia(true);
      const { data, error } = await supabase
        .from('media')
        .select('*');

      if (error) throw error;

      if (data && data.length > 0) {
        setMediaFiles(data);
      } else {
        setMediaFiles(FALLBACK_MEDIA);
      }
    } catch (e) {
      console.info("Error fetching media from Supabase, using fallback", e);
      setMediaFiles(FALLBACK_MEDIA);
    } finally {
      setIsLoadingMedia(false);
    }
  };

  // Perform Media Base64 upload
  const handleMediaUpload = async (fileBase64: string, filename: string, fileType: string, fileSize: string) => {
    try {
      setIsLoadingMedia(true);
      const newMedia = {
        name: filename,
        url: fileBase64,
        type: fileType,
        size: fileSize,
        uploaded_date: new Date().toISOString().split('T')[0]
      };

      const { error } = await supabase
        .from('media')
        .insert([{ ...newMedia, id: 'med-' + Date.now() }]);

      if (error) throw error;
      await fetchMedia();
    } catch (e) {
      console.info("Failed uploading media file to Supabase, falling back locally", e);
      setMediaFiles(prev => [
        {
          id: 'med-' + Date.now(),
          name: filename,
          url: fileBase64,
          type: fileType,
          size: fileSize,
          uploaded_date: new Date().toISOString().split('T')[0]
        },
        ...prev
      ]);
    } finally {
      setIsLoadingMedia(false);
    }
  };

  // Perform Media rename
  const handleRenameMedia = async (id: string) => {
    if (!renameValue.trim()) return;
    try {
      const { error } = await supabase
        .from('media')
        .update({ name: renameValue.trim() })
        .eq('id', id);

      if (error) throw error;
      setRenamingId(null);
      setRenameValue('');
      await fetchMedia();
    } catch (e) {
      console.info("Failed renaming media in Supabase", e);
      setMediaFiles(prev => prev.map(m => m.id === id ? { ...m, name: renameValue.trim() } : m));
      setRenamingId(null);
      setRenameValue('');
    }
  };

  // Perform Media delete
  const handleDeleteMedia = async () => {
    if (!mediaToDelete) return;
    setIsDeletingMedia(true);
    try {
      const { error } = await supabase
        .from('media')
        .delete()
        .eq('id', mediaToDelete.id);

      if (error) throw error;
      setShowMediaDeleteModal(false);
      setMediaToDelete(null);
      await fetchMedia();
    } catch (e) {
      console.info("Failed to delete media from Supabase", e);
      setMediaFiles(prev => prev.filter(m => m.id !== mediaToDelete.id));
      setShowMediaDeleteModal(false);
      setMediaToDelete(null);
    } finally {
      setIsDeletingMedia(false);
    }
  };

  // Clipboard copy handler
  const handleCopyToClipboard = (id: string, url: string) => {
    // Resolve absolute URL
    const absoluteUrl = url.startsWith('/') 
      ? `${window.location.protocol}//${window.location.host}${url}`
      : url;

    navigator.clipboard.writeText(absoluteUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Fetch quotes
  const fetchQuotes = async () => {
    try {
      setIsFetchingQuotes(true);
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
      console.info("Error fetching quotes from Supabase, using fallback", e);
      setQuotes(FALLBACK_QUOTES);
    } finally {
      setIsFetchingQuotes(false);
    }
  };

  // Create or Update quote
  const handleSaveQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteTextEn.trim() || !quoteAuthorEn.trim()) return;

    const payload = {
      text_en: quoteTextEn.trim(),
      text_ur: quoteTextUr.trim(),
      text_ar: quoteTextAr.trim(),
      text_hi: quoteTextHi.trim(),
      author_en: quoteAuthorEn.trim(),
      author_ur: quoteAuthorUr.trim(),
      author_ar: quoteAuthorAr.trim(),
      author_hi: quoteAuthorHi.trim(),
      is_active: quoteIsActive,
      published_date: editingQuote?.published_date || new Date().toISOString().split('T')[0]
    };

    try {
      if (editingQuote) {
        const { error } = await supabase
          .from('quotes')
          .update(payload)
          .eq('id', editingQuote.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('quotes')
          .insert([{ ...payload, id: 'q-' + Date.now() }]);

        if (error) throw error;
      }

      setIsQuoteModalOpen(false);
      setEditingQuote(null);
      setQuoteTextEn('');
      setQuoteTextUr('');
      setQuoteTextAr('');
      setQuoteTextHi('');
      setQuoteAuthorEn('');
      setQuoteAuthorUr('');
      setQuoteAuthorAr('');
      setQuoteAuthorHi('');
      setQuoteIsActive(true);
      await fetchQuotes();
    } catch (e) {
      console.info("Failed to save quote to Supabase, using fallback", e);
      const localId = editingQuote ? editingQuote.id : 'q-' + Date.now();
      const localQuote = { ...payload, id: localId };
      setQuotes(prev => {
        if (editingQuote) {
          return prev.map(q => q.id === localId ? localQuote : q);
        } else {
          return [...prev, localQuote];
        }
      });
      setIsQuoteModalOpen(false);
      setEditingQuote(null);
    }
  };

  // Delete quote
  const handleDeleteQuote = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this quote?")) return;
    try {
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchQuotes();
    } catch (e) {
      console.info("Failed to delete quote from Supabase", e);
      setQuotes(prev => prev.filter(q => q.id !== id));
    }
  };

  // Toggle active status
  const handleToggleQuoteActive = async (quote: any) => {
    try {
      const { error } = await supabase
        .from('quotes')
        .update({ is_active: !quote.is_active })
        .eq('id', quote.id);

      if (error) throw error;
      await fetchQuotes();
    } catch (e) {
      console.info("Failed to toggle quote active status in Supabase", e);
      setQuotes(prev => prev.map(q => q.id === quote.id ? { ...q, is_active: !q.is_active } : q));
    }
  };

  const startEditQuote = (quote: any) => {
    setEditingQuote(quote);
    setQuoteTextEn(quote.text_en || '');
    setQuoteTextUr(quote.text_ur || '');
    setQuoteTextAr(quote.text_ar || '');
    setQuoteTextHi(quote.text_hi || '');
    setQuoteAuthorEn(quote.author_en || '');
    setQuoteAuthorUr(quote.author_ur || '');
    setQuoteAuthorAr(quote.author_ar || '');
    setQuoteAuthorHi(quote.author_hi || '');
    setQuoteIsActive(quote.is_active !== undefined ? quote.is_active : true);
    setIsQuoteModalOpen(true);
  };

  const startCreateQuote = () => {
    setEditingQuote(null);
    setQuoteTextEn('');
    setQuoteTextUr('');
    setQuoteTextAr('');
    setQuoteTextHi('');
    setQuoteAuthorEn('');
    setQuoteAuthorUr('');
    setQuoteAuthorAr('');
    setQuoteAuthorHi('');
    setQuoteIsActive(true);
    setIsQuoteModalOpen(true);
  };

  // --- RESEARCH PROJECTS CRUD ---
  const fetchResearch = async () => {
    try {
      setIsFetchingResearch(true);
      const { data, error } = await supabase
        .from('research')
        .select('*');

      if (error) throw error;

      if (data && data.length > 0) {
        setResearchList(data);
      } else {
        setResearchList(FALLBACK_RESEARCH);
      }
    } catch (e) {
      console.info("Error fetching research from Supabase, using fallback", e);
      setResearchList(FALLBACK_RESEARCH);
    } finally {
      setIsFetchingResearch(false);
    }
  };

  const handleSaveResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitleEn.trim() || !resLeadEn.trim()) return;

    const payload = {
      title_en: resTitleEn.trim(),
      title_ar: resTitleAr.trim(),
      title_ur: resTitleUr.trim(),
      title_hi: resTitleHi.trim(),
      lead_en: resLeadEn.trim(),
      lead_ar: resLeadAr.trim(),
      lead_ur: resLeadUr.trim(),
      lead_hi: resLeadHi.trim(),
      status: resStatus,
      funding: resFunding.trim() || "$0",
      year: Number(resYear) || new Date().getFullYear(),
      citations: Number(resCitations) || 0,
      abstract_en: resAbstractEn.trim(),
      abstract_ar: resAbstractAr.trim(),
      abstract_ur: resAbstractUr.trim(),
      abstract_hi: resAbstractHi.trim(),
    };

    try {
      if (editingResearch) {
        const { error } = await supabase
          .from('research')
          .update(payload)
          .eq('id', editingResearch.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('research')
          .insert([{ ...payload, id: 'res-' + Date.now() }]);

        if (error) throw error;
      }

      setIsResearchModalOpen(false);
      setEditingResearch(null);
      setResTitleEn('');
      setResTitleAr('');
      setResTitleUr('');
      setResTitleHi('');
      setResLeadEn('');
      setResLeadAr('');
      setResLeadUr('');
      setResLeadHi('');
      setResStatus('In Progress');
      setResFunding('');
      setResYear(new Date().getFullYear());
      setResCitations(0);
      setResAbstractEn('');
      setResAbstractAr('');
      setResAbstractUr('');
      setResAbstractHi('');
      await fetchResearch();
    } catch (e) {
      console.info("Failed to save research project to Supabase, using local fallback", e);
      const localId = editingResearch ? editingResearch.id : 'res-' + Date.now();
      const localProject = { ...payload, id: localId };
      setResearchList(prev => {
        if (editingResearch) {
          return prev.map(r => r.id === localId ? localProject : r);
        } else {
          return [...prev, localProject];
        }
      });
      setIsResearchModalOpen(false);
      setEditingResearch(null);
    }
  };

  const handleDeleteResearch = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this research project?")) return;
    try {
      const { error } = await supabase
        .from('research')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchResearch();
    } catch (e) {
      console.info("Failed to delete research project from Supabase", e);
      setResearchList(prev => prev.filter(r => r.id !== id));
    }
  };

  const startEditResearch = (project: any) => {
    setEditingResearch(project);
    setResTitleEn(project.title_en || '');
    setResTitleAr(project.title_ar || '');
    setResTitleUr(project.title_ur || '');
    setResTitleHi(project.title_hi || '');
    setResLeadEn(project.lead_en || '');
    setResLeadAr(project.lead_ar || '');
    setResLeadUr(project.lead_ur || '');
    setResLeadHi(project.lead_hi || '');
    setResStatus(project.status || 'In Progress');
    setResFunding(project.funding || '');
    setResYear(Number(project.year) || new Date().getFullYear());
    setResCitations(Number(project.citations) || 0);
    setResAbstractEn(project.abstract_en || '');
    setResAbstractAr(project.abstract_ar || '');
    setResAbstractUr(project.abstract_ur || '');
    setResAbstractHi(project.abstract_hi || '');
    setIsResearchModalOpen(true);
  };

  const startCreateResearch = () => {
    setEditingResearch(null);
    setResTitleEn('');
    setResTitleAr('');
    setResTitleUr('');
    setResTitleHi('');
    setResLeadEn('');
    setResLeadAr('');
    setResLeadUr('');
    setResLeadHi('');
    setResStatus('In Progress');
    setResFunding('');
    setResYear(new Date().getFullYear());
    setResCitations(0);
    setResAbstractEn('');
    setResAbstractAr('');
    setResAbstractUr('');
    setResAbstractHi('');
    setIsResearchModalOpen(true);
  };

  // Fetch hadiths
  const fetchHadiths = async () => {
    try {
      setIsFetchingHadiths(true);
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
      console.info("Error fetching hadiths from Supabase, using fallback", e);
      setHadiths(FALLBACK_HADITHS);
    } finally {
      setIsFetchingHadiths(false);
    }
  };

  // Create or Update hadith
  const handleSaveHadith = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hadithTextEn.trim() || !hadithSourceEn.trim()) return;

    const payload = {
      text_en: hadithTextEn.trim(),
      text_ur: hadithTextUr.trim(),
      text_ar: hadithTextAr.trim(),
      text_hi: hadithTextHi.trim(),
      source_en: hadithSourceEn.trim(),
      source_ur: hadithSourceUr.trim(),
      source_ar: hadithSourceAr.trim(),
      source_hi: hadithSourceHi.trim(),
      image_url: hadithImageUrl.trim() || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600",
      published_date: editingHadith?.published_date || new Date().toISOString().split('T')[0]
    };

    try {
      if (editingHadith) {
        const { error } = await supabase
          .from('hadiths')
          .update(payload)
          .eq('id', editingHadith.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('hadiths')
          .insert([{ ...payload, id: 'h-' + Date.now() }]);

        if (error) throw error;
      }

      setIsHadithModalOpen(false);
      setEditingHadith(null);
      setHadithTextEn('');
      setHadithTextUr('');
      setHadithTextAr('');
      setHadithTextHi('');
      setHadithSourceEn('');
      setHadithSourceUr('');
      setHadithSourceAr('');
      setHadithSourceHi('');
      setHadithImageUrl('');
      await fetchHadiths();
    } catch (e) {
      console.info("Failed to save hadith to Supabase, using local fallback", e);
      const localId = editingHadith ? editingHadith.id : 'h-' + Date.now();
      const localHadith = { ...payload, id: localId };
      setHadiths(prev => {
        if (editingHadith) {
          return prev.map(h => h.id === localId ? localHadith : h);
        } else {
          return [...prev, localHadith];
        }
      });
      setIsHadithModalOpen(false);
      setEditingHadith(null);
    }
  };

  // Delete hadith
  const handleDeleteHadith = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this Hadith?")) return;
    try {
      const { error } = await supabase
        .from('hadiths')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchHadiths();
    } catch (e) {
      console.info("Failed to delete hadith from Supabase", e);
      setHadiths(prev => prev.filter(h => h.id !== id));
    }
  };

  const startEditHadith = (hadith: any) => {
    setEditingHadith(hadith);
    setHadithTextEn(hadith.text_en || '');
    setHadithTextUr(hadith.text_ur || '');
    setHadithTextAr(hadith.text_ar || '');
    setHadithTextHi(hadith.text_hi || '');
    setHadithSourceEn(hadith.source_en || '');
    setHadithSourceUr(hadith.source_ur || '');
    setHadithSourceAr(hadith.source_ar || '');
    setHadithSourceHi(hadith.source_hi || '');
    setHadithImageUrl(hadith.image_url || '');
    setIsHadithModalOpen(true);
  };

  const startCreateHadith = () => {
    setEditingHadith(null);
    setHadithTextEn('');
    setHadithTextUr('');
    setHadithTextAr('');
    setHadithTextHi('');
    setHadithSourceEn('');
    setHadithSourceUr('');
    setHadithSourceAr('');
    setHadithSourceHi('');
    setHadithImageUrl('');
    setIsHadithModalOpen(true);
  };

  // Fetch classical books
  const fetchBooks = async () => {
    try {
      setIsFetchingBooks(true);
      const { data, error } = await supabase
        .from('books')
        .select('*');

      if (error) throw error;

      if (data && data.length > 0) {
        setBooks(data);
      } else {
        setBooks(FALLBACK_BOOKS);
      }
    } catch (e) {
      console.info("Error fetching books from Supabase, using fallback", e);
      setBooks(FALLBACK_BOOKS);
    } finally {
      setIsFetchingBooks(false);
    }
  };

  // Create or Update book
  const handleSaveBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookTitleEn.trim() || !bookAuthorEn.trim()) return;

    const payload = {
      title_en: bookTitleEn.trim(),
      title_ar: bookTitleAr.trim(),
      title_ur: bookTitleUr.trim(),
      title_hi: bookTitleHi.trim(),
      author_en: bookAuthorEn.trim(),
      author_ar: bookAuthorAr.trim(),
      author_ur: bookAuthorUr.trim(),
      author_hi: bookAuthorHi.trim(),
      category: bookCategory,
      year: Number(bookYear) || new Date().getFullYear(),
      pages: Number(bookPages) || 100,
      isbn: bookIsbn.trim() || "N/A",
      abstract_en: bookAbstractEn.trim(),
      abstract_ar: bookAbstractAr.trim(),
      abstract_ur: bookAbstractUr.trim(),
      abstract_hi: bookAbstractHi.trim(),
      cover_image_url: bookCoverImageUrl.trim()
    };

    try {
      if (editingBook) {
        const { error } = await supabase
          .from('books')
          .update(payload)
          .eq('id', editingBook.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('books')
          .insert([{ ...payload, id: 'lib-' + Date.now() }]);

        if (error) throw error;
      }

      setIsBookModalOpen(false);
      setEditingBook(null);
      setBookTitleEn('');
      setBookTitleUr('');
      setBookTitleAr('');
      setBookTitleHi('');
      setBookAuthorEn('');
      setBookAuthorUr('');
      setBookAuthorAr('');
      setBookAuthorHi('');
      setBookCategory('Science');
      setBookYear('');
      setBookPages('');
      setBookIsbn('');
      setBookAbstractEn('');
      setBookAbstractUr('');
      setBookAbstractAr('');
      setBookAbstractHi('');
      setBookCoverImageUrl('');
      await fetchBooks();
    } catch (e) {
      console.info("Failed to save book to Supabase, using local fallback", e);
      const localId = editingBook ? editingBook.id : 'lib-' + Date.now();
      const localBook = { ...payload, id: localId };
      setBooks(prev => {
        if (editingBook) {
          return prev.map(b => b.id === localId ? localBook : b);
        } else {
          return [...prev, localBook];
        }
      });
      setIsBookModalOpen(false);
      setEditingBook(null);
    }
  };

  // Delete book
  const handleDeleteBook = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this Classical Book?")) return;
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchBooks();
    } catch (e) {
      console.info("Failed to delete book from Supabase", e);
      setBooks(prev => prev.filter(b => b.id !== id));
    }
  };

  const startEditBook = (book: any) => {
    setEditingBook(book);
    setBookTitleEn(book.title_en || '');
    setBookTitleUr(book.title_ur || '');
    setBookTitleAr(book.title_ar || '');
    setBookTitleHi(book.title_hi || '');
    setBookAuthorEn(book.author_en || '');
    setBookAuthorUr(book.author_ur || '');
    setBookAuthorAr(book.author_ar || '');
    setBookAuthorHi(book.author_hi || '');
    setBookCategory(book.category || 'Science');
    setBookYear(book.year ? String(book.year) : '');
    setBookPages(book.pages ? String(book.pages) : '');
    setBookIsbn(book.isbn || '');
    setBookAbstractEn(book.abstract_en || '');
    setBookAbstractUr(book.abstract_ur || '');
    setBookAbstractAr(book.abstract_ar || '');
    setBookAbstractHi(book.abstract_hi || '');
    setBookCoverImageUrl(book.cover_image_url || '');
    setIsBookModalOpen(true);
  };

  const startCreateBook = () => {
    setEditingBook(null);
    setBookTitleEn('');
    setBookTitleUr('');
    setBookTitleAr('');
    setBookTitleHi('');
    setBookAuthorEn('');
    setBookAuthorUr('');
    setBookAuthorAr('');
    setBookAuthorHi('');
    setBookCategory('Science');
    setBookYear('');
    setBookPages('');
    setBookIsbn('');
    setBookAbstractEn('');
    setBookAbstractUr('');
    setBookAbstractAr('');
    setBookAbstractHi('');
    setBookCoverImageUrl('');
    setIsBookModalOpen(true);
  };

  // Load media and quotes/hadiths whenever Tab is active
  React.useEffect(() => {
    if (activeTab === 'media') {
      fetchMedia();
    }
    if (activeTab === 'quotes' || quotes.length === 0) {
      fetchQuotes();
    }
    if (activeTab === 'hadith' || hadiths.length === 0) {
      fetchHadiths();
    }
    if (activeTab === 'books' || books.length === 0) {
      fetchBooks();
    }
    if (activeTab === 'research' || researchList.length === 0) {
      fetchResearch();
    }
  }, [activeTab]);

  // Drag & drop file processing for Media manager
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const base64String = event.target.result as string;
        const sizeString = file.size > 1024 * 1024 
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
          : `${Math.round(file.size / 1024)} KB`;
        handleMediaUpload(base64String, file.name, file.type, sizeString);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Filter dashboard table
  const filteredDashboardArticles = articles.filter(article => {
    const title = getLocalizedTitle(article).toLowerCase();
    const titleEn = (article.title_en || '').toLowerCase();
    const titleAr = (article.title_ar || '').toLowerCase();
    const titleUr = (article.title_ur || '').toLowerCase();
    const titleHi = (article.title_hi || '').toLowerCase();
    const matchesSearch = title.includes(dashboardSearch.toLowerCase()) || 
                          titleEn.includes(dashboardSearch.toLowerCase()) ||
                          titleAr.includes(dashboardSearch.toLowerCase()) ||
                          titleUr.includes(dashboardSearch.toLowerCase()) ||
                          titleHi.includes(dashboardSearch.toLowerCase()) ||
                          article.author.toLowerCase().includes(dashboardSearch.toLowerCase()) ||
                          article.faculty.toLowerCase().includes(dashboardSearch.toLowerCase()) ||
                          article.course_id.toLowerCase().includes(dashboardSearch.toLowerCase());

    const matchesStatus = statusFilter === 'All' || article.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle Edit click
  const handleEditClick = (article: Article) => {
    setEditingArticle(article);
    setIsComposing(true);
    setActiveTab('articles');
  };

  // Handle Create click
  const handleCreateClick = () => {
    setEditingArticle(null);
    setIsComposing(true);
    setActiveTab('articles');
  };

  // Trigger Delete confirmation
  const triggerDeleteConfirm = (article: Article) => {
    setArticleToDelete(article);
    setDeleteModalOpen(true);
  };

  // Perform backend DELETE request
  const handleDeleteArticle = async () => {
    if (!articleToDelete) return;
    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', articleToDelete.id);

      if (error) throw error;

      await onRefreshArticles();
      setDeleteModalOpen(false);
      setArticleToDelete(null);
    } catch (err) {
      console.info("Failed to delete article in Supabase, using local fallback", err);
      setArticles(prev => prev.filter(art => art.id !== articleToDelete.id));
      alert("Article deleted locally (Supabase table offline).");
      setDeleteModalOpen(false);
      setArticleToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // Perform backend POST or PUT request
  const handleSaveArticle = async (articleData: Partial<Article>) => {
    try {
      if (editingArticle) {
        const { error } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', editingArticle.id);

        if (error) throw error;
      } else {
        const newId = articleData.id || 'art-' + Date.now();
        const { error } = await supabase
          .from('articles')
          .insert([{ ...articleData, id: newId }]);

        if (error) throw error;
      }

      await onRefreshArticles();
      setIsComposing(false);
      setEditingArticle(null);
    } catch (err) {
      console.info("Failed to save article in Supabase, utilizing fallback", err);
      const localId = editingArticle ? editingArticle.id : 'art-' + Date.now();
      const updatedArticle = {
        id: localId,
        views: editingArticle?.views || 0,
        published_date: editingArticle?.published_date || new Date().toISOString().split('T')[0],
        ...articleData
      } as Article;

      setArticles(prev => {
        if (editingArticle) {
          return prev.map(art => art.id === localId ? updatedArticle : art);
        } else {
          return [updatedArticle, ...prev];
        }
      });

      alert("Saved publication (offline fallback applied).");
      setIsComposing(false);
      setEditingArticle(null);
    }
  };

  const handleToggleFeatured = async (article: Article) => {
    try {
      const { error } = await supabase
        .from('articles')
        .update({ is_featured: !article.is_featured })
        .eq('id', article.id);

      if (error) throw error;
      await onRefreshArticles();
    } catch (e) {
      console.info("Failed to toggle featured status in Supabase", e);
      setArticles(prev => prev.map(art => art.id === article.id ? { ...art, is_featured: !art.is_featured } : art));
    }
  };

  const handleToggleTrending = async (article: Article) => {
    try {
      const { error } = await supabase
        .from('articles')
        .update({ is_trending: !article.is_trending })
        .eq('id', article.id);

      if (error) throw error;
      await onRefreshArticles();
    } catch (e) {
      console.info("Failed to toggle trending status in Supabase", e);
      setArticles(prev => prev.map(art => art.id === article.id ? { ...art, is_trending: !art.is_trending } : art));
    }
  };

  const handleBookCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      if (event.target?.result) {
        const base64String = event.target.result as string;
        setBookCoverImageUrl(base64String);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row relative">
      
      {/* SIDEBAR NAVIGATION (SideNavBar) */}
      <aside className="w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col flex-shrink-0 lg:fixed lg:h-screen lg:left-0 lg:top-0 z-40">
        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
          <img
            src={brandLogo}
            alt="قلم کا زور Logo"
            className="w-10 h-10 object-contain rounded-lg bg-white p-0.5 border border-slate-100"
            referrerPolicy="no-referrer"
          />
          <div>
            <h2 className="font-brand text-lg font-medium text-gradient-teal-gold tracking-wide leading-none">{t.portalTitle}</h2>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">{t.adminPortal}</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          <a 
            onClick={() => {
              setActiveTab('dashboard_stats');
              setIsComposing(false);
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeTab === 'dashboard_stats' && !isComposing
                ? 'bg-[#008080]/10 text-[#008080]' 
                : 'text-slate-500 hover:text-[#008080] hover:bg-slate-50'
            }`}
          >
            <LayoutDashboard className="w-4.5 h-4.5" />
            <span>{t.dashboard}</span>
          </a>
          
          <a 
            onClick={() => {
              setActiveTab('articles');
              setIsComposing(false);
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeTab === 'articles' || isComposing
                ? 'bg-[#008080]/10 text-[#008080]' 
                : 'text-slate-500 hover:text-[#008080] hover:bg-slate-50'
            }`}
          >
            <FileText className="w-4.5 h-4.5" />
            <span>{t.postManager}</span>
          </a>

          <a 
            onClick={() => {
              setActiveTab('side_posts');
              setIsComposing(false);
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeTab === 'side_posts' && !isComposing
                ? 'bg-[#008080]/10 text-[#008080]' 
                : 'text-slate-500 hover:text-[#008080] hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-4.5 h-4.5" />
            <span>Side Post</span>
          </a>

          <a 
            onClick={() => {
              setActiveTab('quotes');
              setIsComposing(false);
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeTab === 'quotes' && !isComposing
                ? 'bg-[#008080]/10 text-[#008080]' 
                : 'text-slate-500 hover:text-[#008080] hover:bg-slate-50'
            }`}
          >
            <Quote className="w-4.5 h-4.5" />
            <span>Daily Quotes</span>
          </a>

          <a 
            onClick={() => {
              setActiveTab('research');
              setIsComposing(false);
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeTab === 'research' && !isComposing
                ? 'bg-[#008080]/10 text-[#008080]' 
                : 'text-slate-500 hover:text-[#008080] hover:bg-slate-50'
            }`}
          >
            <FlaskConical className="w-4.5 h-4.5" />
            <span>Research Projects</span>
          </a>

          <a 
            onClick={() => {
              setActiveTab('hadith');
              setIsComposing(false);
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeTab === 'hadith' && !isComposing
                ? 'bg-[#008080]/10 text-[#008080]' 
                : 'text-slate-500 hover:text-[#008080] hover:bg-slate-50'
            }`}
          >
            <Book className="w-4.5 h-4.5" />
            <span>Hadith</span>
          </a>

          <a 
            onClick={() => {
              setActiveTab('books');
              setIsComposing(false);
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeTab === 'books' && !isComposing
                ? 'bg-[#008080]/10 text-[#008080]' 
                : 'text-slate-500 hover:text-[#008080] hover:bg-slate-50'
            }`}
          >
            <Library className="w-4.5 h-4.5" />
            <span>Classical Books</span>
          </a>

          <a 
            onClick={() => {
              setActiveTab('media');
              setIsComposing(false);
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeTab === 'media' && !isComposing
                ? 'bg-[#008080]/10 text-[#008080]' 
                : 'text-slate-500 hover:text-[#008080] hover:bg-slate-50'
            }`}
          >
            <Library className="w-4.5 h-4.5" />
            <span>{t.media}</span>
          </a>

          <a 
            onClick={() => {
              setActiveTab('settings');
              setIsComposing(false);
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeTab === 'settings' && !isComposing
                ? 'bg-[#008080]/10 text-[#008080]' 
                : 'text-slate-500 hover:text-[#008080] hover:bg-slate-50'
            }`}
          >
            <Settings className="w-4.5 h-4.5" />
            <span>{t.settings}</span>
          </a>
        </nav>

        {/* Footer Admin Info */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3">
          <div className="flex items-center gap-3 p-1">
            <div className="w-9 h-9 rounded-full bg-[#008080] text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
              RA
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">{adminName}</p>
              <p className="text-[9px] text-slate-400 font-bold uppercase truncate">{t.principalEditor}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg cursor-pointer transition-colors border border-red-100"
          >
            <LogOut className="w-4 h-4" />
            <span>{t.logout}</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        
        {/* TOP BAR BAR */}
        <header className="h-20 bg-white border-b border-slate-200 px-6 md:px-12 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <h2 className="text-base font-extrabold text-slate-800 hidden md:block">
              {isComposing 
                ? "Article Composer" 
                : activeTab === 'dashboard_stats'
                ? t.dashboard
                : activeTab === 'side_posts'
                ? "Side Post Manager"
                : activeTab === 'quotes'
                ? "Daily Quotes Manager"
                : activeTab === 'research'
                ? "Research Projects Manager"
                : activeTab === 'media'
                ? t.media
                : activeTab === 'settings'
                ? t.settings
                : t.postManager}
            </h2>
          </div>

          {/* Top panel actions (Notification, search) */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell className="w-5 h-5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-[#FFD700] rounded-full ring-2 ring-white" />
            </div>

            <div className="h-10 w-[1px] bg-slate-200" />

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full uppercase">
                {currentLang} editor
              </span>
            </div>
          </div>
        </header>

        {/* WORKSPACE AREA */}
        <main className="p-6 md:p-12 max-w-5xl mx-auto w-full flex-1 space-y-6">
          
          {isComposing ? (
            /* Render modular composer component with dynamic category support */
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs animate-in fade-in slide-in-from-bottom-3 duration-250">
              <ArticleComposer
                currentLang={currentLang}
                articleToEdit={editingArticle}
                categories={categories}
                onAddCategory={onAddCategory}
                onSave={handleSaveArticle}
                onCancel={() => {
                  setIsComposing(false);
                  setEditingArticle(null);
                }}
              />
            </div>
          ) : activeTab === 'dashboard_stats' ? (
            /* RENDER DASHBOARD STATISTICS OVERVIEW */
            <div className="space-y-8 animate-in fade-in duration-200">
              <div>
                <h1 className="text-2xl font-extrabold text-[#008080] tracking-tight flex items-center gap-2 flex-wrap"><span className="font-brand font-medium text-2xl leading-relaxed py-1">{schoolName}</span> Dashboard</h1>
                <p className="text-xs text-slate-400 font-semibold">Academic metrics, content insights, and system activities overview</p>
              </div>

              {/* Grid cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
                  <div className="p-3 bg-[#008080]/10 text-[#008080] rounded-xl">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Total Publications</p>
                    <p className="text-xl font-black text-slate-800">{articles.length}</p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
                  <div className="p-3 bg-[#FFD700]/10 text-[#008080] rounded-xl">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Academic Categories</p>
                    <p className="text-xl font-black text-slate-800">{categories.length}</p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                    <Eye className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Total Readership</p>
                    <p className="text-xl font-black text-slate-800">
                      {articles.reduce((acc, a) => acc + (a.views || 0), 0)}
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Average Read Time</p>
                    <p className="text-xl font-black text-slate-800">3.5 min</p>
                  </div>
                </div>
              </div>

              {/* Distribution & Activity Panel */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-800">Academic Category Distribution</h3>
                  <div className="space-y-3.5 pt-2">
                    {categories.map((cat) => {
                      const count = articles.filter(a => a.category === cat).length;
                      const percentage = articles.length > 0 ? (count / articles.length) * 100 : 0;
                      return (
                        <div key={cat} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-700">{cat}</span>
                            <span className="text-slate-400">{count} articles ({Math.round(percentage)}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-[#008080] h-full rounded-full" style={{ width: `${percentage}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="md:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-800">Academic System Log</h3>
                  <div className="space-y-3.5 text-xs">
                    <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl space-y-0.5">
                      <p className="font-bold text-slate-700">Categories Synced</p>
                      <p className="text-slate-400 text-[10px]">Academic categories indexed with database metadata successfully.</p>
                    </div>
                    <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl space-y-0.5">
                      <p className="font-bold text-slate-700">Media System Active</p>
                      <p className="text-slate-400 text-[10px]">Serving static files on physical `/uploads` route.</p>
                    </div>
                    <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl space-y-0.5">
                      <p className="font-bold text-slate-700">Multilingual Core Loaded</p>
                      <p className="text-slate-400 text-[10px]">Directional RTL text grids responsive for Arabic and Urdu.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'media' ? (
            /* RENDER FILE / IMAGE MEDIA MANAGER TAB */
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-[#008080] tracking-tight">{t.media}</h1>
                  <p className="text-xs text-slate-400 font-semibold">Upload, rename, copy paths, and manage portal file systems</p>
                </div>
                
                {/* File selector button proxy */}
                <label className="bg-[#FFD700] text-slate-900 px-5 py-3 rounded-xl font-bold text-xs hover:bg-[#e6c200] active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer border-none">
                  <UploadCloud className="w-4 h-4 text-slate-900" />
                  <span>Upload New Media</span>
                  <input type="file" onChange={handleFileInputChange} accept="image/*" className="hidden" />
                </label>
              </div>

              {/* Drag and drop upload zone */}
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all ${
                  dragActive 
                    ? "border-[#008080] bg-[#008080]/5" 
                    : "border-slate-200 bg-white hover:bg-slate-50/50"
                }`}
              >
                <UploadCloud className="w-10 h-10 text-[#008080]/60 mx-auto mb-3" />
                <p className="text-xs font-bold text-slate-700">Drag & drop image here or click "Upload New Media" above</p>
                <p className="text-[10px] text-slate-400 mt-1">Supports PNG, JPEG, WEBP (Max 5MB)</p>
              </div>

              {/* Search media */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    value={mediaSearch}
                    onChange={(e) => setMediaSearch(e.target.value)}
                    placeholder="Search media files by name..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 text-xs border border-slate-200 rounded-lg outline-none focus:border-[#008080]"
                  />
                </div>
                <button onClick={fetchMedia} className="p-2 text-[#008080] hover:bg-slate-100 rounded-lg transition-all border-none bg-transparent cursor-pointer" title="Refresh files">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Media list grid */}
              {isLoadingMedia ? (
                <div className="py-12 text-center">
                  <Loader2 className="w-8 h-8 text-[#008080] animate-spin mx-auto mb-2" />
                  <p className="text-xs text-slate-400 font-semibold">Synchronizing Media Repository...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {mediaFiles.filter(m => m.name.toLowerCase().includes(mediaSearch.toLowerCase())).length > 0 ? (
                    mediaFiles.filter(m => m.name.toLowerCase().includes(mediaSearch.toLowerCase())).map((media) => (
                      <div key={media.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between">
                        <div className="aspect-video w-full bg-slate-100 border-b border-slate-100 relative overflow-hidden flex items-center justify-center">
                          {media.type.startsWith('image/') ? (
                            <img src={media.url} alt={media.name} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" referrerPolicy="no-referrer" />
                          ) : (
                            <FileIcon className="w-12 h-12 text-slate-400" />
                          )}
                          <span className="absolute top-2 right-2 bg-slate-900/60 text-white text-[9px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                            {media.size}
                          </span>
                        </div>

                        <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                          <div className="space-y-1">
                            {renamingId === media.id ? (
                              <div className="flex gap-1.5 items-center">
                                <input
                                  type="text"
                                  value={renameValue}
                                  onChange={(e) => setRenameValue(e.target.value)}
                                  className="flex-1 border border-slate-300 bg-slate-50 rounded px-2 py-1 text-xs outline-none focus:border-[#008080]"
                                  autoFocus
                                />
                                <button onClick={() => handleRenameMedia(media.id)} className="bg-[#008080] text-white px-2 py-1 rounded text-xs font-bold hover:bg-[#006666] border-none cursor-pointer">
                                  Save
                                </button>
                                <button onClick={() => setRenamingId(null)} className="text-slate-400 hover:text-slate-600 text-xs px-1 bg-transparent border-none cursor-pointer">
                                  X
                                </button>
                              </div>
                            ) : (
                              <p className="text-xs font-bold text-slate-800 break-all truncate" title={media.name}>
                                {media.name}
                              </p>
                            )}
                            <p className="text-[10px] text-slate-400 font-semibold">
                              Type: {media.type} • Date: {media.uploaded_date}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 mt-2">
                            {/* Copy url */}
                            <button
                              onClick={() => handleCopyToClipboard(media.id, media.url)}
                              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                                copiedId === media.id
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600'
                              }`}
                            >
                              {copiedId === media.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedId === media.id ? "Copied!" : "Copy Path"}</span>
                            </button>

                            {/* Rename */}
                            <button
                              onClick={() => {
                                setRenamingId(media.id);
                                setRenameValue(media.name);
                              }}
                              className="px-2 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-lg text-[10px] font-bold cursor-pointer"
                              title="Rename File"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => {
                                setMediaToDelete(media);
                                setShowMediaDeleteModal(true);
                              }}
                              className="px-2 py-1.5 border border-red-100 hover:bg-red-50 text-red-600 rounded-lg text-[10px] font-bold cursor-pointer"
                              title="Delete File"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center bg-white border border-slate-200 rounded-3xl">
                      <p className="text-xs text-slate-400 italic">No media assets found in full-stack repository.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : activeTab === 'settings' ? (
            /* RENDER PORTAL LAYOUT SETTINGS FORM */
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs space-y-6 animate-in fade-in duration-200">
              <div>
                <h1 className="text-2xl font-extrabold text-[#008080] tracking-tight">{t.settings}</h1>
                <p className="text-xs text-slate-400 font-semibold">Customize school titles, admin credentials, and dashboard behaviors</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase">Academy Portal Name</label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-xs text-slate-700 outline-none focus:border-[#008080]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase">Principal Editor (Admin Name)</label>
                  <input
                    type="text"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-xs text-slate-700 outline-none focus:border-[#008080]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase">Primary Branding Theme Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-10 h-10 border border-slate-200 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 text-xs font-mono text-slate-700 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase">Secondary Accent Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-10 h-10 border border-slate-200 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 text-xs font-mono text-slate-700 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsSavingSettings(true);
                    setTimeout(() => {
                      setIsSavingSettings(false);
                      alert("Academy portal configurations updated successfully!");
                    }, 500);
                  }}
                  className="bg-[#008080] hover:bg-[#006666] text-white px-6 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-sm"
                >
                  {isSavingSettings ? "Saving configurations..." : "Save Academy Configurations"}
                </button>
              </div>
            </div>
          ) : activeTab === 'side_posts' ? (
            /* RENDER SPECIAL SIDE POST MANAGER TAB */
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-[#008080] tracking-tight">Side Post Manager</h1>
                  <p className="text-xs text-slate-400 font-semibold text-start">
                    Set, add, edit, and update Featured Banner articles and Trending Now sidebar items daily.
                  </p>
                </div>

                <button
                  onClick={handleCreateClick}
                  className="bg-[#FFD700] text-slate-900 px-5 py-3 rounded-xl font-bold text-xs hover:bg-[#e6c200] active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer border-none"
                >
                  <Plus className="w-4 h-4 text-slate-900" />
                  <span>Add New Side Post</span>
                </button>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
                  <div className="p-3 bg-teal-50 text-[#008080] rounded-xl font-bold text-sm">★</div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Featured Articles</p>
                    <p className="text-lg font-black text-slate-800">{articles.filter(a => a.is_featured).length}</p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
                  <div className="p-3 bg-amber-50 text-amber-500 rounded-xl font-bold text-sm">🔥</div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Trending Articles</p>
                    <p className="text-lg font-black text-slate-800">{articles.filter(a => a.is_trending).length}</p>
                  </div>
                </div>
              </div>

              {/* High density listing */}
              <section className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Image / Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Title & Category</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Featured status</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Trending Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {articles.length > 0 ? (
                        articles.map((article) => (
                          <tr key={article.id} className="hover:bg-slate-50/50 transition-colors group">
                            {/* Image Thumbnail */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-10 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0 bg-slate-50">
                                  <img 
                                    src={article.image_url} 
                                    alt="thumbnail" 
                                    className="w-full h-full object-cover" 
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold ${
                                  article.status === 'Published' 
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                    : 'bg-amber-50 text-amber-700 border border-amber-100'
                                }`}>
                                  {article.status}
                                </span>
                              </div>
                            </td>

                            {/* Title & Category */}
                            <td className="px-6 py-4">
                              <p className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-[#008080] transition-colors">
                                {getLocalizedTitle(article)}
                              </p>
                              <span className="inline-block mt-1 text-[9px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full uppercase">
                                {article.category}
                              </span>
                            </td>

                            {/* Featured status - Toggle Button */}
                            <td className="px-6 py-4 text-center whitespace-nowrap">
                              <button
                                onClick={() => handleToggleFeatured(article)}
                                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                                  article.is_featured
                                    ? 'bg-[#008080] text-white hover:bg-[#006666]'
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                }`}
                              >
                                {article.is_featured ? '★ Featured' : '☆ Make Featured'}
                              </button>
                            </td>

                            {/* Trending Status - Toggle Button */}
                            <td className="px-6 py-4 text-center whitespace-nowrap">
                              <button
                                onClick={() => handleToggleTrending(article)}
                                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                                  article.is_trending
                                    ? 'bg-amber-500 text-white hover:bg-amber-600'
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                }`}
                              >
                                {article.is_trending ? '🔥 Trending' : '♢ Make Trending'}
                              </button>
                            </td>

                            {/* Actions (Edit / Delete) */}
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleEditClick(article)}
                                  className="p-2 text-[#008080] hover:bg-[#008080]/10 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
                                  title="Edit Scholarly Article"
                                >
                                  <Edit3 className="w-4.5 h-4.5" />
                                </button>
                                <button
                                  onClick={() => triggerDeleteConfirm(article)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
                                  title="Delete Article"
                                >
                                  <Trash2 className="w-4.5 h-4.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center py-12 text-xs text-slate-400 italic">
                            No publications in library.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          ) : activeTab === 'hadith' ? (
            /* RENDER SPECIAL DAILY HADITH MANAGER TAB */
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-[#008080] tracking-tight">Daily Hadith Manager</h1>
                  <p className="text-xs text-slate-400 font-semibold text-start">
                    Manage and publish Prophetic Hadiths in Arabic, Urdu, Hindi & English with custom image banners.
                  </p>
                </div>

                <button
                  onClick={startCreateHadith}
                  className="bg-[#FFD700] text-slate-900 px-5 py-3 rounded-xl font-bold text-xs hover:bg-[#e6c200] active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer border-none"
                >
                  <Plus className="w-4 h-4 text-slate-900" />
                  <span>Add Daily Hadith</span>
                </button>
              </div>

              {/* Hadiths info card banner */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
                  <div className="p-3 bg-teal-50 text-[#008080] rounded-xl font-bold text-sm">📖</div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Total Hadiths</p>
                    <p className="text-lg font-black text-slate-800">{hadiths.length}</p>
                  </div>
                </div>
              </div>

              {/* Hadiths High Density Listing */}
              <section className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                     <thead>
                       <tr className="bg-slate-50 border-b border-slate-100">
                         <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Banner</th>
                         <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Hadith Content (Multilingual)</th>
                         <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Source Reference</th>
                         <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                       {hadiths.length > 0 ? (
                         hadiths.map((hadith) => (
                           <tr key={hadith.id} className="hover:bg-slate-50/50 transition-colors group">
                             {/* Banner Preview */}
                             <td className="px-6 py-4 whitespace-nowrap">
                               <img 
                                 src={hadith.image_url} 
                                 alt="Hadith Banner" 
                                 className="w-16 h-10 object-cover rounded-lg border border-slate-200"
                                 referrerPolicy="no-referrer"
                               />
                             </td>

                             {/* Text & translations preview */}
                             <td className="px-6 py-4 max-w-md">
                               {hadith.text_ar && (
                                 <p className="text-xs font-bold text-emerald-800 line-clamp-1 font-brand text-right mb-1" dir="rtl">
                                   {hadith.text_ar}
                                 </p>
                               )}
                               <p className="text-xs font-bold text-slate-800 line-clamp-2 italic">
                                 "{hadith.text_en}"
                               </p>
                               <div className="flex gap-2 mt-1 flex-wrap">
                                 {hadith.text_ur && (
                                   <span className="text-[9px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded font-brand">Urdu</span>
                                 )}
                                 {hadith.text_ar && (
                                   <span className="text-[9px] bg-teal-50 text-teal-800 px-1.5 py-0.5 rounded font-brand">Arabic</span>
                                 )}
                                 {hadith.text_hi && (
                                   <span className="text-[9px] bg-purple-50 text-purple-800 px-1.5 py-0.5 rounded font-brand">Hindi</span>
                                 )}
                               </div>
                             </td>

                             {/* Source */}
                             <td className="px-6 py-4 whitespace-nowrap">
                               <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">{hadith.source_en}</span>
                               {hadith.source_ur && <p className="text-[9px] text-slate-400 font-brand font-medium mt-1">{hadith.source_ur}</p>}
                             </td>

                             {/* Actions (Edit / Delete) */}
                             <td className="px-6 py-4 whitespace-nowrap text-right">
                               <div className="flex items-center justify-end gap-1.5">
                                 <button
                                   onClick={() => startEditHadith(hadith)}
                                   className="p-2 text-[#008080] hover:bg-[#008080]/10 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
                                   title="Edit Hadith"
                                 >
                                   <Edit3 className="w-4.5 h-4.5" />
                                 </button>
                                 <button
                                   onClick={() => handleDeleteHadith(hadith.id)}
                                   className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
                                   title="Delete Hadith"
                                 >
                                   <Trash2 className="w-4.5 h-4.5" />
                                 </button>
                               </div>
                             </td>
                           </tr>
                         ))
                       ) : (
                         <tr>
                           <td colSpan={4} className="text-center py-12 text-xs text-slate-400 italic">
                             No Hadiths found. Click "Add Daily Hadith" to begin.
                           </td>
                         </tr>
                       )}
                     </tbody>
                  </table>
                </div>
              </section>
            </div>
          ) : activeTab === 'books' ? (
            /* RENDER CLASSICAL BOOKS MANAGER TAB */
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-[#008080] tracking-tight">Classical Books Manager</h1>
                  <p className="text-xs text-slate-400 font-semibold text-start">
                    Manage and publish classical library books in English, Arabic, Urdu & Hindi with uploadable cover images.
                  </p>
                </div>

                <button
                  onClick={startCreateBook}
                  className="bg-[#FFD700] text-slate-900 px-5 py-3 rounded-xl font-bold text-xs hover:bg-[#e6c200] active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer border-none"
                >
                  <Plus className="w-4 h-4 text-slate-900" />
                  <span>Add Classical Book</span>
                </button>
              </div>

              {/* Books info card banner */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
                  <div className="p-3 bg-teal-50 text-[#008080] rounded-xl font-bold text-sm">📚</div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Total Books</p>
                    <p className="text-lg font-black text-slate-800">{books.length}</p>
                  </div>
                </div>
              </div>

              {/* Books High Density Listing */}
              <section className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                     <thead>
                       <tr className="bg-slate-50 border-b border-slate-100">
                         <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Book Cover</th>
                         <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Title & Author (Multilingual)</th>
                         <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Details</th>
                         <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                       {books.length > 0 ? (
                         books.map((book) => (
                           <tr key={book.id} className="hover:bg-slate-50/50 transition-colors group">
                             {/* Cover Preview */}
                             <td className="px-6 py-4 whitespace-nowrap">
                               <img 
                                 src={book.cover_image_url || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600"} 
                                 alt="Book Cover" 
                                 className="w-12 h-16 object-cover rounded-lg border border-slate-200"
                                 referrerPolicy="no-referrer"
                               />
                             </td>

                             {/* Title & Author preview */}
                             <td className="px-6 py-4 max-w-md">
                               <div className="space-y-1">
                                 <p className="text-xs font-bold text-[#008080]">
                                   {book.title_en}
                                 </p>
                                 <p className="text-[11px] font-semibold text-slate-600">
                                   By: {book.author_en}
                                 </p>
                                 
                                 {/* Multi-language title indicators */}
                                 <div className="flex gap-2 mt-1 flex-wrap">
                                   {book.title_ur && (
                                     <span className="text-[9px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded font-brand" title={book.title_ur}>Urdu</span>
                                   )}
                                   {book.title_ar && (
                                     <span className="text-[9px] bg-teal-50 text-teal-800 px-1.5 py-0.5 rounded font-brand" title={book.title_ar}>Arabic</span>
                                   )}
                                   {book.title_hi && (
                                     <span className="text-[9px] bg-purple-50 text-purple-800 px-1.5 py-0.5 rounded font-brand" title={book.title_hi}>Hindi</span>
                                   )}
                                 </div>
                               </div>
                             </td>

                             {/* Category, Year, pages, ISBN */}
                             <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600 space-y-1">
                               <p><span className="font-bold text-slate-400 uppercase text-[9px] tracking-wider">Category:</span> {book.category}</p>
                               <p><span className="font-bold text-slate-400 uppercase text-[9px] tracking-wider">Year:</span> {book.year}</p>
                               <p><span className="font-bold text-slate-400 uppercase text-[9px] tracking-wider">Pages:</span> {book.pages}</p>
                               <p><span className="font-bold text-slate-400 uppercase text-[9px] tracking-wider">ISBN:</span> {book.isbn}</p>
                             </td>

                             {/* Actions (Edit / Delete) */}
                             <td className="px-6 py-4 whitespace-nowrap text-right">
                               <div className="flex items-center justify-end gap-1.5">
                                 <button
                                   onClick={() => startEditBook(book)}
                                   className="p-2 text-[#008080] hover:bg-[#008080]/10 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
                                   title="Edit Book"
                                 >
                                   <Edit3 className="w-4.5 h-4.5" />
                                 </button>
                                 <button
                                   onClick={() => handleDeleteBook(book.id)}
                                   className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
                                   title="Delete Book"
                                 >
                                   <Trash2 className="w-4.5 h-4.5" />
                                 </button>
                               </div>
                             </td>
                           </tr>
                         ))
                       ) : (
                         <tr>
                           <td colSpan={4} className="text-center py-12 text-xs text-slate-400 italic">
                             No Books found. Click "Add Classical Book" to begin.
                           </td>
                         </tr>
                       )}
                     </tbody>
                  </table>
                </div>
              </section>
            </div>
          ) : activeTab === 'quotes' ? (
            /* RENDER SPECIAL DAILY QUOTES MANAGER TAB */
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-[#008080] tracking-tight">Daily Quotes Manager</h1>
                  <p className="text-xs text-slate-400 font-semibold text-start">
                    Manage and publish inspiring quote banners for the scholar homepage in Urdu, Arabic, Hindi & English.
                  </p>
                </div>

                <button
                  onClick={startCreateQuote}
                  className="bg-[#FFD700] text-slate-900 px-5 py-3 rounded-xl font-bold text-xs hover:bg-[#e6c200] active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer border-none"
                >
                  <Plus className="w-4 h-4 text-slate-900" />
                  <span>Add Daily Quote</span>
                </button>
              </div>

              {/* Quotes info card banner */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
                  <div className="p-3 bg-teal-50 text-[#008080] rounded-xl font-bold text-sm">❝</div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Total Quotes</p>
                    <p className="text-lg font-black text-slate-800">{quotes.length}</p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4 col-span-2">
                  <div className="p-3 bg-amber-50 text-amber-500 rounded-xl font-bold text-sm">★</div>
                  <div className="flex-1">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Currently Active Quote</p>
                    {quotes.some(q => q.is_active) ? (
                      <p className="text-xs font-bold text-slate-700 italic line-clamp-2">
                        "{quotes.find(q => q.is_active)?.text_en}" — <span className="not-italic text-[#008080]">{quotes.find(q => q.is_active)?.author_en}</span>
                      </p>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No quote marked as active. Default static quote will be shown.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Quotes High Density Listing */}
              <section className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Quote Content (Multilingual)</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Author</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Toggle Active</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {quotes.length > 0 ? (
                        quotes.map((quote) => (
                          <tr key={quote.id} className="hover:bg-slate-50/50 transition-colors group">
                            {/* Active badge */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold ${
                                quote.is_active 
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                  : 'bg-slate-100 text-slate-500 border border-slate-200'
                              }`}>
                                {quote.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>

                            {/* Text & translations preview */}
                            <td className="px-6 py-4 max-w-md">
                              <p className="text-xs font-bold text-slate-800 line-clamp-2 italic">
                                "{quote.text_en}"
                              </p>
                              <div className="flex gap-2 mt-1 flex-wrap">
                                {quote.text_ur && (
                                  <span className="text-[9px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded font-brand">Urdu</span>
                                )}
                                {quote.text_ar && (
                                  <span className="text-[9px] bg-teal-50 text-teal-800 px-1.5 py-0.5 rounded font-brand">Arabic</span>
                                )}
                                {quote.text_hi && (
                                  <span className="text-[9px] bg-purple-50 text-purple-800 px-1.5 py-0.5 rounded font-brand">Hindi</span>
                                )}
                              </div>
                            </td>

                            {/* Author */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-xs font-bold text-slate-700">{quote.author_en}</span>
                              {quote.author_ur && <p className="text-[9px] text-slate-400 font-brand font-medium mt-0.5">{quote.author_ur}</p>}
                            </td>

                            {/* Toggle active switch button */}
                            <td className="px-6 py-4 text-center whitespace-nowrap">
                              <button
                                onClick={() => handleToggleQuoteActive(quote)}
                                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                                  quote.is_active
                                    ? 'bg-[#008080] text-white hover:bg-[#006666]'
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                }`}
                              >
                                {quote.is_active ? '★ Active Quote' : '☆ Set Active'}
                              </button>
                            </td>

                            {/* Actions (Edit / Delete) */}
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => startEditQuote(quote)}
                                  className="p-2 text-[#008080] hover:bg-[#008080]/10 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
                                  title="Edit Quote"
                                >
                                  <Edit3 className="w-4.5 h-4.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteQuote(quote.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
                                  title="Delete Quote"
                                >
                                  <Trash2 className="w-4.5 h-4.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center py-12 text-xs text-slate-400 italic">
                            No quotes found. Click "Add Daily Quote" to begin.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          ) : activeTab === 'research' ? (
            /* RENDER SPECIAL RESEARCH PROJECTS MANAGER TAB */
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-[#008080] tracking-tight">Research Projects Manager</h1>
                  <p className="text-xs text-slate-400 font-semibold text-start">
                    Manage university research lab initiatives, funding sources, and ongoing multilingual publication statuses.
                  </p>
                </div>

                <button
                  onClick={startCreateResearch}
                  className="bg-[#FFD700] text-slate-900 px-5 py-3 rounded-xl font-bold text-xs hover:bg-[#e6c200] active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer border-none"
                >
                  <Plus className="w-4 h-4 text-slate-900" />
                  <span>Add Research Project</span>
                </button>
              </div>

              {/* Research projects listing */}
              <section className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Project Details (EN / UR / AR)</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Year & Funding</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Citations</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {researchList.length > 0 ? (
                        researchList.map((project) => (
                          <tr key={project.id} className="hover:bg-slate-50/50 transition-colors group">
                            {/* Status badge */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                                project.status === 'Published' 
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                  : project.status === 'Under Review'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                  : 'bg-blue-50 text-blue-700 border border-blue-100'
                              }`}>
                                {project.status}
                              </span>
                            </td>

                            {/* Project details */}
                            <td className="px-6 py-4">
                              <div className="space-y-1.5 max-w-xl">
                                <div>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">English</span>
                                  <p className="text-xs font-bold text-slate-800">{project.title_en}</p>
                                  <p className="text-[11px] text-slate-500 line-clamp-1">{project.lead_en}</p>
                                </div>
                                {project.title_ur && (
                                  <div className="border-t border-slate-100 pt-1">
                                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block font-brand">Urdu</span>
                                    <p className="text-xs font-bold text-slate-800 font-brand" dir="rtl">{project.title_ur}</p>
                                  </div>
                                )}
                                {project.title_ar && (
                                  <div className="border-t border-slate-100 pt-1">
                                    <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest block font-brand">Arabic</span>
                                    <p className="text-xs font-bold text-slate-800 font-brand" dir="rtl">{project.title_ar}</p>
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Year & Funding */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <p className="text-xs font-bold text-slate-700 font-mono">{project.year}</p>
                              <p className="text-[11px] font-medium text-slate-500 mt-0.5">{project.funding}</p>
                            </td>

                            {/* Citations */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-md font-mono">
                                {project.citations || 0}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => startEditResearch(project)}
                                  className="p-2 text-[#008080] hover:bg-[#008080]/10 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
                                  title="Edit Project"
                                >
                                  <Edit3 className="w-4.5 h-4.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteResearch(project.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
                                  title="Delete Project"
                                >
                                  <Trash2 className="w-4.5 h-4.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center py-12 text-xs text-slate-400 italic">
                            No research projects found. Click "Add Research Project" to begin.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          ) : (
            /* RENDER HIGH-DENSITY POST MANAGER TABLE GRID (Articles list) */
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Table header control bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-[#008080] tracking-tight">{t.articleRepository}</h1>
                  <p className="text-xs text-slate-400 font-semibold">{t.manageAcademicPubs}</p>
                </div>
                
                {/* Yellow themed button trigger */}
                <button
                  onClick={handleCreateClick}
                  className="bg-[#FFD700] text-slate-900 px-5 py-3 rounded-xl font-bold text-xs hover:bg-[#e6c200] active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer border-none"
                >
                  <Plus className="w-4 h-4 text-slate-900" />
                  <span>{t.createNewArticle}</span>
                </button>
              </div>

              {/* Filtering panel */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-xs">
                {/* Search */}
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    value={dashboardSearch}
                    onChange={(e) => setDashboardSearch(e.target.value)}
                    placeholder="Search titles, authors, codes..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 text-xs border border-slate-200 rounded-lg outline-none focus:border-[#008080]"
                  />
                </div>

                {/* Status badges selector */}
                <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto hide-scrollbar">
                  {['All', 'Published', 'Draft', 'Archived'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors border-none ${
                        statusFilter === status
                          ? 'bg-[#008080] text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Post Manager table */}
              <section className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{t.status}</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{t.articleTitle}</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{t.author}</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{t.faculty}</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{t.publishedDate}</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">{t.actions}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredDashboardArticles.length > 0 ? (
                        filteredDashboardArticles.map((article) => (
                          <tr key={article.id} className="hover:bg-slate-50/50 transition-colors group">
                            {/* Status badge */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                article.status === 'Published' 
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                  : article.status === 'Draft'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}>
                                {article.status}
                              </span>
                            </td>

                            {/* Title details */}
                            <td className="px-6 py-4">
                              <p className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-[#008080] transition-colors">
                                {getLocalizedTitle(article)}
                              </p>
                              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                                Course ID: {article.course_id} • <span className="text-[#008080]/70 font-bold">{article.views >= 1000 ? `${(article.views / 1000).toFixed(1)}k` : article.views} views</span>
                              </p>
                            </td>

                            {/* Author */}
                            <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-slate-600">
                              {article.author}
                            </td>

                            {/* Faculty */}
                            <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-slate-600">
                              {article.faculty}
                            </td>

                            {/* Published Date */}
                            <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-slate-400">
                              {article.published_date || "---"}
                            </td>

                            {/* Action icons */}
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleEditClick(article)}
                                  className="p-2 text-[#008080] hover:bg-[#008080]/10 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
                                  title="Edit Scholarly Article"
                                >
                                  <Edit3 className="w-4.5 h-4.5" />
                                </button>
                                <button
                                  onClick={() => triggerDeleteConfirm(article)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
                                  title="Delete Article"
                                >
                                  <Trash2 className="w-4.5 h-4.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center py-12 text-xs text-slate-400 italic">
                            No matching publications found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Simulated pagination footer */}
                <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <p>Showing 1-{filteredDashboardArticles.length} of {filteredDashboardArticles.length} results</p>
                  <div className="flex gap-1.5">
                    <button disabled className="px-3 py-1 bg-white border border-slate-200 rounded text-slate-300">1</button>
                  </div>
                </div>
              </section>
            </div>
          )}
        </main>
      </div>

      {/* ARTICLE DELETE CONFIRMATION MODAL */}
      {deleteModalOpen && articleToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">{t.deleteArticle}</h4>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-0.5">Permanent Deletion</p>
                </div>
              </div>

              <p className="text-sm text-slate-500 leading-relaxed">
                You are about to permanently delete <span className="font-bold text-slate-800">"{articleToDelete ? getLocalizedTitle(articleToDelete) : ''}"</span>. This action cannot be reversed and will immediately strip it from all student indices.
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setArticleToDelete(null);
                  }}
                  className="px-5 py-2.5 rounded-lg border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleDeleteArticle}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-md border-none"
                >
                  {isDeleting ? "Deleting..." : t.deletePermanently}
                </button>
              </div>
            </div>

            {/* Audit log trail footer */}
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Activity will be logged to system audits</span>
            </div>
          </div>
        </div>
      )}

      {/* MEDIA DELETE CONFIRMATION MODAL */}
      {showMediaDeleteModal && mediaToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Delete Media Asset</h4>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-0.5">Permanent Deletion</p>
                </div>
              </div>

              <p className="text-sm text-slate-500 leading-relaxed">
                You are about to permanently delete <span className="font-bold text-slate-800">"{mediaToDelete.name}"</span>. This file will be removed from disk, causing broken links for articles referencing this exact path.
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  disabled={isDeletingMedia}
                  onClick={() => {
                    setShowMediaDeleteModal(false);
                    setMediaToDelete(null);
                  }}
                  className="px-5 py-2.5 rounded-lg border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="button"
                  disabled={isDeletingMedia}
                  onClick={handleDeleteMedia}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-md border-none"
                >
                  {isDeletingMedia ? "Deleting..." : "Delete Permanently"}
                </button>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Media activity is permanently archived</span>
            </div>
          </div>
        </div>
      )}

      {/* DAILY QUOTES CREATE/EDIT MODAL */}
      {isQuoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl border border-slate-200 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 my-8">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-slate-900">{editingQuote ? "Edit Daily Quote" : "Add Daily Quote"}</h4>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">Inspiring Banner Quote</p>
              </div>
              <button 
                onClick={() => setIsQuoteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-xl transition-all cursor-pointer border-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveQuote} className="p-6 space-y-6">
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {/* English inputs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Quote Text (English) *</label>
                    <textarea
                      required
                      value={quoteTextEn}
                      onChange={(e) => setQuoteTextEn(e.target.value)}
                      placeholder="e.g. The function of education is to teach one to think intensively..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all min-h-[70px]"
                    />
                  </div>
                  <div className="space-y-1 flex flex-col justify-end">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Author (English) *</label>
                    <input
                      type="text"
                      required
                      value={quoteAuthorEn}
                      onChange={(e) => setQuoteAuthorEn(e.target.value)}
                      placeholder="e.g. Dr. Martin Luther King Jr."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all"
                    />
                  </div>
                </div>

                {/* Urdu inputs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block font-brand">Quote Text (Urdu)</label>
                    <textarea
                      value={quoteTextUr}
                      onChange={(e) => setQuoteTextUr(e.target.value)}
                      dir="rtl"
                      placeholder="تعلیم کا مقصد ذہن کو گہرائی سے..."
                      className="w-full bg-white border border-amber-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all min-h-[70px] font-brand"
                    />
                  </div>
                  <div className="space-y-1 flex flex-col justify-end">
                    <label className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block font-brand">Author (Urdu)</label>
                    <input
                      type="text"
                      value={quoteAuthorUr}
                      onChange={(e) => setQuoteAuthorUr(e.target.value)}
                      dir="rtl"
                      placeholder="ڈاکٹر مارٹن لوتھر کنگ..."
                      className="w-full bg-white border border-amber-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all font-brand"
                    />
                  </div>
                </div>

                {/* Arabic inputs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-teal-50/50 rounded-2xl border border-teal-100">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block font-brand">Quote Text (Arabic)</label>
                    <textarea
                      value={quoteTextAr}
                      onChange={(e) => setQuoteTextAr(e.target.value)}
                      dir="rtl"
                      placeholder="وظيفة التعليم هي تعليم المرء..."
                      className="w-full bg-white border border-teal-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all min-h-[70px] font-brand"
                    />
                  </div>
                  <div className="space-y-1 flex flex-col justify-end">
                    <label className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block font-brand">Author (Arabic)</label>
                    <input
                      type="text"
                      value={quoteAuthorAr}
                      onChange={(e) => setQuoteAuthorAr(e.target.value)}
                      dir="rtl"
                      placeholder="د. مارتن لوثر كينغ..."
                      className="w-full bg-white border border-teal-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all font-brand"
                    />
                  </div>
                </div>

                {/* Hindi inputs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-purple-50/50 rounded-2xl border border-purple-100">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-purple-800 uppercase tracking-wider block font-brand">Quote Text (Hindi)</label>
                    <textarea
                      value={quoteTextHi}
                      onChange={(e) => setQuoteTextHi(e.target.value)}
                      placeholder="शिक्षा का कार्य गहनता से और गंभीर रूप से..."
                      className="w-full bg-white border border-purple-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all min-h-[70px] font-brand"
                    />
                  </div>
                  <div className="space-y-1 flex flex-col justify-end">
                    <label className="text-[10px] font-bold text-purple-800 uppercase tracking-wider block font-brand">Author (Hindi)</label>
                    <input
                      type="text"
                      value={quoteAuthorHi}
                      onChange={(e) => setQuoteAuthorHi(e.target.value)}
                      placeholder="डॉ. मार्टिन लूथर किंग..."
                      className="w-full bg-white border border-purple-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all font-brand"
                    />
                  </div>
                </div>

                {/* Toggle Is Active */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Mark as Active Quote</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Activate this quote immediately and show it on the homepage banner.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={quoteIsActive}
                    onChange={(e) => setQuoteIsActive(e.target.checked)}
                    className="rounded text-[#008080] focus:ring-[#008080] h-4 w-4 border-slate-300"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsQuoteModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#008080] hover:bg-[#006666] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-md border-none"
                >
                  Save Quote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESEARCH PROJECTS CREATE/EDIT MODAL */}
      {isResearchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl border border-slate-200 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 my-8">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-slate-900">{editingResearch ? "Edit Research Project" : "Add Research Project"}</h4>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">Scientific & Linguistic Labs</p>
              </div>
              <button 
                onClick={() => setIsResearchModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-xl transition-all cursor-pointer border-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveResearch} className="p-6 space-y-6">
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {/* English title & lead */}
                <div className="space-y-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">English Metadata *</span>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Project Title (English) *</label>
                      <input
                        type="text"
                        required
                        value={resTitleEn}
                        onChange={(e) => setResTitleEn(e.target.value)}
                        placeholder="e.g. Artificial Intelligence and Quranic Linguistic Patterns"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Short Lead Summary (English) *</label>
                      <textarea
                        required
                        value={resLeadEn}
                        onChange={(e) => setResLeadEn(e.target.value)}
                        placeholder="e.g. Exploring structural symmetries and semantic graphs..."
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all min-h-[60px]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Abstract (English)</label>
                      <textarea
                        value={resAbstractEn}
                        onChange={(e) => setResAbstractEn(e.target.value)}
                        placeholder="Detailed academic abstract..."
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all min-h-[85px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Urdu inputs */}
                <div className="space-y-4 p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
                  <span className="text-[10px] font-brand font-bold text-amber-800 uppercase tracking-wider block">Urdu Translation</span>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-brand font-bold text-amber-800 uppercase tracking-wider block">Project Title (Urdu)</label>
                      <input
                        type="text"
                        value={resTitleUr}
                        onChange={(e) => setResTitleUr(e.target.value)}
                        dir="rtl"
                        placeholder="مصنوعی ذہانت اور قرآنی لسانی نمونے..."
                        className="w-full bg-white border border-amber-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all font-brand"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-brand font-bold text-amber-800 uppercase tracking-wider block">Short Lead Summary (Urdu)</label>
                      <textarea
                        value={resLeadUr}
                        onChange={(e) => setResLeadUr(e.target.value)}
                        dir="rtl"
                        placeholder="ساختی ہم آہنگی اور معنوی گراف کا مطالعہ..."
                        className="w-full bg-white border border-amber-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all min-h-[60px] font-brand"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-brand font-bold text-amber-800 uppercase tracking-wider block">Abstract (Urdu)</label>
                      <textarea
                        value={resAbstractUr}
                        onChange={(e) => setResAbstractUr(e.target.value)}
                        dir="rtl"
                        placeholder="تفصیلی علمی خلاصہ..."
                        className="w-full bg-white border border-amber-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all min-h-[85px] font-brand"
                      />
                    </div>
                  </div>
                </div>

                {/* Arabic inputs */}
                <div className="space-y-4 p-4 bg-teal-50/50 rounded-2xl border border-teal-100">
                  <span className="text-[10px] font-brand font-bold text-teal-800 uppercase tracking-wider block">Arabic Translation</span>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-brand font-bold text-teal-800 uppercase tracking-wider block">Project Title (Arabic)</label>
                      <input
                        type="text"
                        value={resTitleAr}
                        onChange={(e) => setResTitleAr(e.target.value)}
                        dir="rtl"
                        placeholder="الذكاء الاصطناعي والأنماط اللغوية القرآنية..."
                        className="w-full bg-white border border-teal-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all font-brand"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-brand font-bold text-teal-800 uppercase tracking-wider block">Short Lead Summary (Arabic)</label>
                      <textarea
                        value={resLeadAr}
                        onChange={(e) => setResLeadAr(e.target.value)}
                        dir="rtl"
                        placeholder="استكشاف التماثلات الهيكلية والرسوم البيانية الدلالية..."
                        className="w-full bg-white border border-teal-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all min-h-[60px] font-brand"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-brand font-bold text-teal-800 uppercase tracking-wider block">Abstract (Arabic)</label>
                      <textarea
                        value={resAbstractAr}
                        onChange={(e) => setResAbstractAr(e.target.value)}
                        dir="rtl"
                        placeholder="الملخص الأكاديمي التفصيلي..."
                        className="w-full bg-white border border-teal-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all min-h-[85px] font-brand"
                      />
                    </div>
                  </div>
                </div>

                {/* Status, Funding, Year, Citations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Project Status *</label>
                    <select
                      value={resStatus}
                      onChange={(e) => setResStatus(e.target.value as any)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all"
                    >
                      <option value="In Progress">In Progress</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Published">Published</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Funding Source / Amount</label>
                    <input
                      type="text"
                      value={resFunding}
                      onChange={(e) => setResFunding(e.target.value)}
                      placeholder="e.g. $250,000 / Ministry of Science"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Establishment Year</label>
                    <input
                      type="number"
                      value={resYear}
                      onChange={(e) => setResYear(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Academic Citations</label>
                    <input
                      type="number"
                      value={resCitations}
                      onChange={(e) => setResCitations(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsResearchModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#008080] hover:bg-[#006666] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-md border-none"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DAILY HADITH CREATE/EDIT MODAL */}
      {isHadithModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl border border-slate-200 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 my-8">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-slate-900">{editingHadith ? "Edit Daily Hadith" : "Add Daily Hadith"}</h4>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">Prophetic Tradition Narration</p>
              </div>
              <button 
                onClick={() => setIsHadithModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-xl transition-all cursor-pointer border-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveHadith} className="p-6 space-y-6">
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                
                {/* Image URL Input */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Banner Image URL</label>
                  <input
                    type="url"
                    value={hadithImageUrl}
                    onChange={(e) => setHadithImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all"
                  />
                  <p className="text-[9px] text-slate-400">Leave blank to use a default beautiful Islamic architecture backdrop.</p>
                </div>

                {/* English inputs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Hadith Translation (English) *</label>
                    <textarea
                      required
                      value={hadithTextEn}
                      onChange={(e) => setHadithTextEn(e.target.value)}
                      placeholder="e.g. Verily, actions are judged by intentions..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all min-h-[70px]"
                    />
                  </div>
                  <div className="space-y-1 flex flex-col justify-end">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Source/Reference (English) *</label>
                    <input
                      type="text"
                      required
                      value={hadithSourceEn}
                      onChange={(e) => setHadithSourceEn(e.target.value)}
                      placeholder="e.g. Sahih al-Bukhari 1"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all"
                    />
                  </div>
                </div>

                {/* Arabic inputs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-teal-50/50 rounded-2xl border border-teal-100">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block font-brand">Hadith Text (Arabic)</label>
                    <textarea
                      value={hadithTextAr}
                      onChange={(e) => setHadithTextAr(e.target.value)}
                      dir="rtl"
                      placeholder="إنما الأعمال بالنيات..."
                      className="w-full bg-white border border-teal-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all min-h-[70px] font-brand"
                    />
                  </div>
                  <div className="space-y-1 flex flex-col justify-end">
                    <label className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block font-brand">Reference (Arabic)</label>
                    <input
                      type="text"
                      value={hadithSourceAr}
                      onChange={(e) => setHadithSourceAr(e.target.value)}
                      dir="rtl"
                      placeholder="صحيح البخاري ١..."
                      className="w-full bg-white border border-teal-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all font-brand"
                    />
                  </div>
                </div>

                {/* Urdu inputs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block font-brand">Hadith Translation (Urdu)</label>
                    <textarea
                      value={hadithTextUr}
                      onChange={(e) => setHadithTextUr(e.target.value)}
                      dir="rtl"
                      placeholder="اعمال کا دارومدار نیتوں پر ہے..."
                      className="w-full bg-white border border-amber-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all min-h-[70px] font-brand"
                    />
                  </div>
                  <div className="space-y-1 flex flex-col justify-end">
                    <label className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block font-brand">Reference (Urdu)</label>
                    <input
                      type="text"
                      value={hadithSourceUr}
                      onChange={(e) => setHadithSourceUr(e.target.value)}
                      dir="rtl"
                      placeholder="صحیح البخاری ۱..."
                      className="w-full bg-white border border-amber-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all font-brand"
                    />
                  </div>
                </div>

                {/* Hindi inputs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-purple-50/50 rounded-2xl border border-purple-100">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-purple-800 uppercase tracking-wider block font-brand">Hadith Translation (Hindi)</label>
                    <textarea
                      value={hadithTextHi}
                      onChange={(e) => setHadithTextHi(e.target.value)}
                      placeholder="कर्मों का दारोमदार नीयतों पर है..."
                      className="w-full bg-white border border-purple-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all min-h-[70px] font-brand"
                    />
                  </div>
                  <div className="space-y-1 flex flex-col justify-end">
                    <label className="text-[10px] font-bold text-purple-800 uppercase tracking-wider block font-brand">Reference (Hindi)</label>
                    <input
                      type="text"
                      value={hadithSourceHi}
                      onChange={(e) => setHadithSourceHi(e.target.value)}
                      placeholder="सहीह अल-बुख़ारी १..."
                      className="w-full bg-white border border-purple-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all font-brand"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsHadithModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#008080] hover:bg-[#006666] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-md border-none"
                >
                  Save Hadith
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CLASSICAL BOOKS CREATE/EDIT MODAL */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl border border-slate-200 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 my-8">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-slate-900">{editingBook ? "Edit Classical Book" : "Add Classical Book"}</h4>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">Academic Library Archive</p>
              </div>
              <button 
                onClick={() => setIsBookModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-xl transition-all cursor-pointer border-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBook} className="p-6 space-y-6">
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                
                {/* Book Cover and Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Book Cover Image</label>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-16 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex-shrink-0 flex items-center justify-center">
                        {bookCoverImageUrl ? (
                          <img src={bookCoverImageUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs text-slate-400">No Cover</span>
                        )}
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <label className="inline-block px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] uppercase rounded-lg transition-all cursor-pointer shadow-xs border border-slate-200">
                          Choose Cover File
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleBookCoverUpload} 
                            className="hidden" 
                          />
                        </label>
                        <p className="text-[9px] text-slate-400">Directly upload covers or use an Unsplash URL below.</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 flex flex-col justify-end">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cover Image URL</label>
                    <input
                      type="url"
                      value={bookCoverImageUrl}
                      onChange={(e) => setBookCoverImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all"
                    />
                  </div>
                </div>

                {/* Common fields: Category, Year, Pages, ISBN */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Category *</label>
                    <select
                      value={bookCategory}
                      onChange={(e) => setBookCategory(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all"
                    >
                      <option value="Science">Science</option>
                      <option value="History">History</option>
                      <option value="Culture">Culture</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Year *</label>
                    <input
                      type="number"
                      required
                      value={bookYear}
                      onChange={(e) => setBookYear(e.target.value)}
                      placeholder="e.g. 1025"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Pages *</label>
                    <input
                      type="number"
                      required
                      value={bookPages}
                      onChange={(e) => setBookPages(e.target.value)}
                      placeholder="e.g. 320"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">ISBN</label>
                    <input
                      type="text"
                      value={bookIsbn}
                      onChange={(e) => setBookIsbn(e.target.value)}
                      placeholder="e.g. 978-01997..."
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all"
                    />
                  </div>
                </div>

                {/* English inputs */}
                <div className="space-y-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-150">
                  <h5 className="text-[11px] font-black uppercase text-[#008080] tracking-wider">English Details</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Book Title (English) *</label>
                      <input
                        type="text"
                        required
                        value={bookTitleEn}
                        onChange={(e) => setBookTitleEn(e.target.value)}
                        placeholder="The Canon of Medicine"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Author (English) *</label>
                      <input
                        type="text"
                        required
                        value={bookAuthorEn}
                        onChange={(e) => setBookAuthorEn(e.target.value)}
                        placeholder="Ibn Sina (Avicenna)"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Abstract (English)</label>
                    <textarea
                      value={bookAbstractEn}
                      onChange={(e) => setBookAbstractEn(e.target.value)}
                      placeholder="An encyclopedia of medicine in five books..."
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all min-h-[70px]"
                    />
                  </div>
                </div>

                {/* Arabic inputs */}
                <div className="space-y-4 p-4 bg-teal-50/30 rounded-2xl border border-teal-100">
                  <h5 className="text-[11px] font-black uppercase text-teal-800 tracking-wider font-brand">Arabic Details</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block font-brand">Book Title (Arabic)</label>
                      <input
                        type="text"
                        value={bookTitleAr}
                        onChange={(e) => setBookTitleAr(e.target.value)}
                        dir="rtl"
                        placeholder="القانون في الطب"
                        className="w-full bg-white border border-teal-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all font-brand"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block font-brand">Author (Arabic)</label>
                      <input
                        type="text"
                        value={bookAuthorAr}
                        onChange={(e) => setBookAuthorAr(e.target.value)}
                        dir="rtl"
                        placeholder="ابن سينا"
                        className="w-full bg-white border border-teal-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all font-brand"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block font-brand">Abstract (Arabic)</label>
                    <textarea
                      value={bookAbstractAr}
                      onChange={(e) => setBookAbstractAr(e.target.value)}
                      dir="rtl"
                      placeholder="موسوعة طبية من خمسة كتب..."
                      className="w-full bg-white border border-teal-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all min-h-[70px] font-brand"
                    />
                  </div>
                </div>

                {/* Urdu inputs */}
                <div className="space-y-4 p-4 bg-amber-50/30 rounded-2xl border border-amber-100">
                  <h5 className="text-[11px] font-black uppercase text-amber-800 tracking-wider font-brand">Urdu Details</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block font-brand">Book Title (Urdu)</label>
                      <input
                        type="text"
                        value={bookTitleUr}
                        onChange={(e) => setBookTitleUr(e.target.value)}
                        dir="rtl"
                        placeholder="القانون فی الطب"
                        className="w-full bg-white border border-amber-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all font-brand"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block font-brand">Author (Urdu)</label>
                      <input
                        type="text"
                        value={bookAuthorUr}
                        onChange={(e) => setBookAuthorUr(e.target.value)}
                        dir="rtl"
                        placeholder="ابن سینا"
                        className="w-full bg-white border border-amber-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all font-brand"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block font-brand">Abstract (Urdu)</label>
                    <textarea
                      value={bookAbstractUr}
                      onChange={(e) => setBookAbstractUr(e.target.value)}
                      dir="rtl"
                      placeholder="طب کا ایک دائرۃ المعارف..."
                      className="w-full bg-white border border-amber-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all min-h-[70px] font-brand"
                    />
                  </div>
                </div>

                {/* Hindi inputs */}
                <div className="space-y-4 p-4 bg-purple-50/30 rounded-2xl border border-purple-100">
                  <h5 className="text-[11px] font-black uppercase text-purple-800 tracking-wider font-brand">Hindi Details</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-purple-800 uppercase tracking-wider block font-brand">Book Title (Hindi)</label>
                      <input
                        type="text"
                        value={bookTitleHi}
                        onChange={(e) => setBookTitleHi(e.target.value)}
                        placeholder="चिकित्सा का नियम (अल-कानून)"
                        className="w-full bg-white border border-purple-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all font-brand"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-purple-800 uppercase tracking-wider block font-brand">Author (Hindi)</label>
                      <input
                        type="text"
                        value={bookAuthorHi}
                        onChange={(e) => setBookAuthorHi(e.target.value)}
                        placeholder="इब्न सीना"
                        className="w-full bg-white border border-purple-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all font-brand"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-purple-800 uppercase tracking-wider block font-brand">Abstract (Hindi)</label>
                    <textarea
                      value={bookAbstractHi}
                      onChange={(e) => setBookAbstractHi(e.target.value)}
                      placeholder="चिकित्सा का एक विश्वकोश..."
                      className="w-full bg-white border border-purple-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008080] transition-all min-h-[70px] font-brand"
                    />
                  </div>
                </div>

              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#008080] hover:bg-[#006666] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-md border-none"
                >
                  Save Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
