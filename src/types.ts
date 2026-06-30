/**
 * Shared types for قلم کا زور Multilingual Portal
 */

export type ArticleStatus = 'Published' | 'Draft' | 'Archived';

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
  published_date: string; // ISO format or formatted string
  status: ArticleStatus;
  read_time: string; // e.g., "12 min read"
  course_id: string; // e.g., "CS-402"
  is_featured?: boolean;
  is_trending?: boolean;
}

export type SupportedLanguage = 'en' | 'ar' | 'ur' | 'hi';

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
    fontFamily: '"Noto Nastaliq Urdu", "Jameel Noori Nastaliq", serif',
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    dir: 'ltr',
    fontFamily: '"Tiro Devanagari Hindi", serif',
  },
};

export interface DailyQuote {
  id: string;
  text_en: string;
  text_ur?: string;
  text_ar?: string;
  text_hi?: string;
  author_en: string;
  author_ur?: string;
  author_ar?: string;
  author_hi?: string;
  is_active: boolean;
  published_date: string;
}

export interface Hadith {
  id: string;
  text_en: string;
  text_ur?: string;
  text_ar?: string;
  text_hi?: string;
  source_en: string;
  source_ur?: string;
  source_ar?: string;
  source_hi?: string;
  image_url: string;
  published_date: string;
}

