/**
 * Shared types for قلم کا زور Multilingual Portal
 * UTF-8 Encoded for Urdu/Arabic/Hindi rendering
 */

export type ArticleStatus = 'Published' | 'Draft' | 'Archived';
export type SupportedLanguage = 'en' | 'ar' | 'ur' | 'hi';

// ==================== ARTICLE ====================
export interface Article {
  id: string;
  title_en: string;
  title_ur: string;
  title_ar: string;
  title_hi: string;
  content_en: string;
  content_ur: string;
  content_ar: string;
  content_hi: string;
  image_url: string;
  category: string; // e.g., "Science", "History", "Culture"
  author: string;
  faculty: string;
  views: number;
  published_date: string; // ISO format
  status: ArticleStatus;
  read_time: string; // e.g., "12 min read"
  course_id: string;
  is_featured?: boolean;
  is_trending?: boolean;
  language?: SupportedLanguage; // Primary language of article
}

// ==================== RESEARCH ====================
export interface Research {
  id: string;
  title_en: string;
  title_ur: string;
  title_ar: string;
  title_hi: string;
  description_en: string;
  description_ur: string;
  description_ar: string;
  description_hi: string;
  keywords_en: string;
  keywords_ur: string;
  image_url: string;
  category: string;
  author: string;
  status: ArticleStatus;
  published_date: string;
  pdf_url?: string;
  language?: SupportedLanguage;
}

// ==================== BOOKS ====================
export interface Book {
  id: string;
  title_en: string;
  title_ur: string;
  title_ar: string;
  title_hi: string;
  author_en: string;
  author_ur: string;
  description_en: string;
  description_ur: string;
  description_ar: string;
  description_hi: string;
  cover_image_url: string; // Book cover image
  category: string;
  status: ArticleStatus;
  published_date: string;
  language?: SupportedLanguage;
}

// ==================== CLASSICAL BOOKS ====================
export interface ClassicalBook {
  id: string;
  title_en: string;
  title_ur: string;
  title_ar: string;
  title_hi: string;
  author_en: string;
  author_ur: string;
  description_en: string;
  description_ur: string;
  description_ar: string;
  description_hi: string;
  cover_image_url: string;
  category: string; // e.g., "Fiqh", "Tafsir", "Hadith Compilation"
  status: ArticleStatus;
  published_date: string;
  language?: SupportedLanguage;
}

// ==================== DAILY QUOTES ====================
export interface DailyQuote {
  id: string;
  text_en: string;
  text_ur: string;
  text_ar: string;
  text_hi: string;
  author_en: string;
  author_ur: string;
  author_ar: string;
  author_hi: string;
  is_active: boolean;
  published_date: string;
  language?: SupportedLanguage;
}

// ==================== HADITH ====================
export interface Hadith {
  id: string;
  text_en: string;
  text_ur: string;
  text_ar: string;
  text_hi: string;
  source_en: string;
  source_ur: string;
  source_ar: string;
  source_hi: string;
  narrator_en: string;
  narrator_ur: string;
  image_url?: string;
  published_date: string;
  language?: SupportedLanguage;
}

// ==================== LANGUAGE CONFIGURATION ====================
export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
  fontFamily: string;
}

export const LANGUAGES: Record<SupportedLanguage, LanguageConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    dir: 'ltr',
    fontFamily: '"Poppins", "Arial", sans-serif',
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    dir: 'rtl',
    fontFamily: '"Noto Naskh Arabic", serif',
  },
  ur: {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    dir: 'rtl',
    fontFamily: '"Jameel Noori Nastaliq", "Noto Nastaliq Urdu", serif',
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    dir: 'ltr',
    fontFamily: '"Tiro Devanagari Hindi", serif',
  },
};
