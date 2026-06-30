import React, { useState, useEffect } from 'react';
import { Article, SupportedLanguage, LANGUAGES } from '../types';
import { TRANSLATIONS } from '../translations';
import { 
  Star, Clock, Calendar, ChevronRight, TrendingUp, Mail, 
  School, Globe, Share2, Search, ArrowLeft, ArrowRight,
  BookOpen, Eye, CheckCircle2, Book, Award, GraduationCap, Check, 
  Compass, FileText, HelpCircle, MapPin, Bookmark
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { FALLBACK_QUOTES, FALLBACK_HADITHS } from '../lib/fallbacks';

interface PortalMainProps {
  articles: Article[];
  categories: string[];
  books?: any[];
  research?: any[];
  quotes: any[];
  hadiths: any[];
  currentLang: SupportedLanguage;
  onNavigateToAdmin: () => void;
  incrementViews: (id: string) => void;
  activeHeaderTab: 'courses' | 'library' | 'research' | 'admissions';
  setActiveHeaderTab: (tab: 'courses' | 'library' | 'research' | 'admissions') => void;
}

export interface LibraryBook {
  id: string;
  title_en: string;
  title_ar: string;
  title_ur: string;
  title_hi: string;
  author_en: string;
  author_ar: string;
  author_ur: string;
  author_hi: string;
  category: string;
  year: number;
  pages: number;
  isbn: string;
  abstract_en: string;
  abstract_ar: string;
  abstract_ur: string;
  abstract_hi: string;
}

export interface ResearchProject {
  id: string;
  title_en: string;
  title_ar: string;
  title_ur: string;
  title_hi: string;
  lead_en: string;
  lead_ar: string;
  lead_ur: string;
  lead_hi: string;
  status: 'Published' | 'Under Review' | 'In Progress';
  funding: string;
  year: number;
  citations: number;
  abstract_en: string;
  abstract_ar: string;
  abstract_ur: string;
  abstract_hi: string;
}

export interface Program {
  id: string;
  name_en: string;
  name_ar: string;
  name_ur: string;
  name_hi: string;
  level: string;
  duration_en: string;
  duration_ar: string;
  duration_ur: string;
  duration_hi: string;
  fee_en: string;
  fee_ar: string;
  fee_ur: string;
  fee_hi: string;
  deadline_en: string;
  deadline_ar: string;
  deadline_ur: string;
  deadline_hi: string;
  requirements_en: string;
  requirements_ar: string;
  requirements_ur: string;
  requirements_hi: string;
}

export const LIBRARY_BOOKS: LibraryBook[] = [
  {
    id: "lib-1",
    title_en: "The Canon of Medicine (Al-Qanun fi al-Tibb)",
    title_ar: "القانون في الطب",
    title_ur: "القانون فی الطب",
    title_hi: "चिकित्सा का नियम (अल-कानून)",
    author_en: "Ibn Sina (Avicenna)",
    author_ar: "ابن سينا",
    author_ur: "ابن سینا",
    author_hi: "इब्न सीना",
    category: "Science",
    year: 1025,
    pages: 1400,
    isbn: "978-0199754731",
    abstract_en: "An encyclopedia of medicine in five books compiled by Persian physician Ibn Sina. It presents a clear and organized summary of all medical knowledge of the era.",
    abstract_ar: "موسوعة طبية من خمسة كتب وضعها الطبيب والفيلسوف ابن سينا. تقدم ملخصاً واضحاً ومنظماً لجميع المعارف الطبية في ذلك العصر.",
    abstract_ur: "طب کا ایک دائرۃ المعارف جو پانچ جلدوں پر مشتمل ہے اور اسے مشہور طبیب ابن سینا نے تالیف کیا ہے۔ یہ اپنے عہد کے تمام طبی علم کا ایک جامع خلاصہ ہے۔",
    abstract_hi: "फारसी चिकित्सक इब्न सीना द्वारा पांच पुस्तकों में संकलित चिकित्सा का एक विश्वकोश। यह उस युग के सभी चिकित्सा ज्ञान का एक स्पष्ट और व्यवस्थित सारांश प्रस्तुत करता है।"
  },
  {
    id: "lib-2",
    title_en: "The Muqaddimah (An Introduction to History)",
    title_ar: "المقدمة",
    title_ur: "مقدمہ ابن خلدون",
    title_hi: "मुकद्दिमा (इतिहास की प्रस्तावना)",
    author_en: "Ibn Khaldun",
    author_ar: "ابن خلدون",
    author_ur: "ابن خلدون",
    author_hi: "इब्न ख़लदून",
    category: "History",
    year: 1377,
    pages: 650,
    isbn: "978-0691166285",
    abstract_en: "A monumental work of historiography, sociology, and economics. Ibn Khaldun analyzes the rise and fall of civilizations and proposes the concept of Asabiyyah (social cohesion).",
    abstract_ar: "عمل ضخم في تأريخ الاجتماع والاقتصاد. يحلل ابن خلدون صعود وسقوط الحضارات ويقترح مفهوم 'العصبية' (التماسك الاجتماعي).",
    abstract_ur: "تاریخ، عمرانیات اور معاشیات کا ایک شاہکار۔ ابن خلدون نے اس کتاب میں تہذیبوں کے عروج و زوال کا تجزیہ کیا ہے اور 'عصبیت' کا تصور پیش کیا ہے۔",
    abstract_hi: "इतिहासलेखन, समाजशास्त्र और अर्थशास्त्र का एक ऐतिहासिक कार्य। इब्न ख़लदून सभ्यताओं के उत्थान और पतन का विश्लेषण करते हैं और असबिय्याह (सामाजिक एकजुटता) की अवधारणा का प्रस्ताव करते हैं।"
  },
  {
    id: "lib-3",
    title_en: "Diwan-e-Ghalib",
    title_ar: "ديوان غالب",
    title_ur: "دیوانِ غالب",
    title_hi: "दीवान-ए-ग़ालिब",
    author_en: "Mirza Asadullah Khan Ghalib",
    author_ar: "ميرزا أسد الله خان غالب",
    author_ur: "مرزا اسد اللہ خان غالب",
    author_hi: "मिर्ज़ा असदुल्लाह ख़ान ग़ालिब",
    category: "Culture",
    year: 1841,
    pages: 320,
    isbn: "978-8171161201",
    abstract_en: "The definitive collection of Urdu and Persian ghazals by Ghalib. It showcases a profound exploration of existential philosophy, love, and human nature through sublime wordplay.",
    abstract_ar: "المجموعة الكاملة للقصائد الغزلية باللغتين الأردية والفارسية للشاعر غالب. تعرض استكشافاً عميقاً للفلسفة الوجودية والحب والطبيعة البشرية.",
    abstract_ur: "مرزا غالب کی اردو غزلوں کا مستند ترین مجموعہ۔ یہ بے مثال الفاظ کے چناؤ اور شاعری کے ذریعے فلسفہِ حیات، محبت اور انسانی جبلت کی عکاسی کرتا ہے۔",
    abstract_hi: "ग़ालिब द्वारा उर्दू और फ़ारसी ग़ज़लों का प्रामाणिक संग्रह। यह उत्कृष्ट शब्दों के खेल के माध्यम से अस्तित्ववादी दर्शन, प्रेम और मानव स्वभाव की गहन खोज को प्रदर्शित करता है।"
  },
  {
    id: "lib-4",
    title_en: "Mathematical Foundations of Physics",
    title_ar: "الأسس الرياضية للفيزياء",
    title_ur: "طبیعیات کی ریاضیاتی بنیادیں",
    title_hi: "भौतिकी के गणितीय आधार",
    author_en: "Prof. S. Ahmad & Dr. K. Raman",
    author_ar: "الأستاذ س. أحمد والدكتور ك. رامان",
    author_ur: "پروفیسر ایس احمد اور ڈاکٹر کے رمن",
    author_hi: "प्रो. एस. अहमद और डॉ. के. रमन",
    category: "Science",
    year: 2023,
    pages: 580,
    isbn: "978-0198566901",
    abstract_en: "A comprehensive modern graduate-level text detailing the differential geometry, group theory, and functional analysis essential for current quantum field theories.",
    abstract_ar: "نص حديث وشامل لطلبة الدراسات العليا يستعرض الهندسة التفاضلية ونظرية المجموعات والتحليل الدالي الضروري لنظريات الحقل الكمي الحالية.",
    abstract_ur: "اعلیٰ تعلیم کے طلبہ کے لیے تالیف کردہ ایک جدید ترین کتاب جس میں تفریقی جیومیٹری، گروپ تھیوری، اور فنکشنل انیلیسس جیسے اہم ریاضیاتی موضوعات کی تفصیل دی گئی ہے جو جدید کوانٹم فیلڈ تھیوری کے لیے ناگزیر ہیں۔",
    abstract_hi: "वर्तमान क्वांटम क्षेत्र सिद्धांतों के लिए आवश्यक विभेदक ज्यामिति, समूह सिद्धांत और कार्यात्मक विश्लेषण का विवरण देने वाला एक व्यापक आधुनिक स्नातक-स्तरीय पाठ।"
  }
];

export const RESEARCH_PROJECTS: ResearchProject[] = [
  {
    id: "res-1",
    title_en: "Deep Nastaliq: OCR and Digital Transcription of Classical Manuscripts",
    title_ar: "نستعليق العميق: التعرف البصري والنسخ الرقمي للمخطوطات الكلاسيكية",
    title_ur: "ڈیپ نستعلیق: کلاسیکی قلمی نسخوں کا او سی آر اور ڈیجیٹل نسخہ سازی",
    title_hi: "डीप नस्तालीक़: शास्त्रीय पांडुलिपियों का ओसीआर और डिजिटल प्रतिलेखन",
    lead_en: "Prof. Tariq Mansoor, AI & Linguistics Lab",
    lead_ar: "الأستاذ طارق منصور، مختبر الذكاء الاصطناعي واللسانيات",
    lead_ur: "پروفیسر طارق منصور، اے آئی اینڈ لسانیات لیب",
    lead_hi: "प्रो. तारिक मंसूर, एआई और भाषाविज्ञान लैब",
    status: "In Progress",
    funding: "$145,000",
    year: 2026,
    citations: 28,
    abstract_en: "This project uses custom-trained deep learning networks to perform accurate OCR and layout analysis on cursive Urdu Nastaliq and Arabic Naskh historical manuscripts. The system converts raw page scans into search-indexed Unicode texts with 98.4% character accuracy.",
    abstract_ar: "يستخدم هذا المشروع شبكات التعلم العميق المدربة خصيصاً لإجراء تحليل دقيق للتعرف البصري على الحروف والمخطوطات التاريخية المكتوبة بخط النستعليق الأردية والنسخ العربي. يقوم النظام بتحويل عمليات مسح الصفحات الخام إلى نصوص يونيكود مفهرسة للبحث بدقة تصل إلى 98.4٪.",
    abstract_ur: "یہ پروجیکٹ گہرائی سے سیکھنے والے (deep learning) نیٹ ورکس کا استعمال کرتے ہوئے تاریخی قلمی نسخوں کے پیچیدہ خطِ نستعلیق اور نسخ کا تجزیہ کرتا ہے۔ یہ سسٹم صفحات کے عام عکس کو سرچ ایبل یونیکوڈ تحریر میں 98.4 فیصد درستگی کے ساتھ تبدیل کرنے کی صلاحیت رکھتا ہے۔",
    abstract_hi: "यह परियोजना उर्दू नस्तालीक़ और अरबी नस्क ऐतिहासिक पांडुलिपियों पर सटीक ओसीआर और लेआउट विश्लेषण करने के लिए कस्टम-प्रशिक्षित गहन शिक्षण नेटवर्क का उपयोग करती है। सिस्टम कच्चे पेज स्कैन को 98.4% वर्ण सटीकता के साथ खोज-अनुक्रमित यूनिकोड पाठों में परिवर्तित करता है।"
  },
  {
    id: "res-2",
    title_en: "Quantum Symmetries in Curved Spacetime Geometry",
    title_ar: "التماثلات الكمومية في هندسة الزمكان المنحني",
    title_ur: "خمیدہ مکان و زمان کے ہندسے میں کوانٹم تشاکل",
    title_hi: "वक्रित स्पेसटाइम ज्यामिति में क्वांटम समरूपता",
    lead_en: "Dr. Farah Naaz, High-Energy Physics Faculty",
    lead_ar: "الدكتورة فرح ناز، كلية فيزياء الطاقات العالية",
    lead_ur: "ڈاکٹر فرح ناز، شعبہ ہائی انرجی فزکس",
    lead_hi: "डॉ. फराह नाज़, उच्च-ऊर्जा भौतिकी संकाय",
    status: "Published",
    funding: "$210,000",
    year: 2025,
    citations: 142,
    abstract_en: "An investigation into topological field theory and quantum entanglement near gravitational horizons. This study solves long-standing anomalies in Hawking-radiation backreaction calculations and matches high-performance cluster computing simulations.",
    abstract_ar: "دراسة في نظرية الحقل الطوبولوجي والتشابك الكمي بالقرب من الآفاق الثقالية. تحل هذه الدراسة الشذوذات طويلة الأمد في حسابات رد الفعل العكسي لإشعاع هاوكينغ وتطابق محاكاة الحوسبة العنقودية عالية الأداء.",
    abstract_ur: "ثقلی افق کے قریب ٹوپولوجیکل فیلڈ تھیوری اور کوانٹم اینٹینگل منٹ کی ایک گہری تحقیق۔ یہ مطالعہ ہاکنگ ریڈی ایشن کے رد عمل کے حسابات میں دیرینہ الجھنوں کو حل کرتا ہے اور جدید سمولیشنز کے عین مطابق نتائج فراہم کرتا ہے۔",
    abstract_hi: "गुरुत्वाकर्षण क्षितिज के निकट टोपोलॉजिकल क्षेत्र सिद्धांत और क्वांटम उलझाव की जांच। यह अध्ययन हॉकिंग-विकिरण प्रतिक्रिया गणनाओं में लंबे समय से चली आ रही विसंगतियों को हल करता है और उच्च-प्रदर्शन क्लस्टर कंप्यूटिंग सिमुलेशन से मेल खाता है।"
  },
  {
    id: "res-3",
    title_en: "The Influence of Central Asian Calligraphy on Mughal Inscriptions",
    title_ar: "تأثير خط آسيا الوسطى على النقوش المغولية",
    title_ur: "مغلیہ کتبات پر وسطی ایشیائی خطاطی کے اثرات",
    title_hi: "मुगल शिलालेखों पर मध्य एशियाई सुलेख का प्रभाव",
    lead_en: "Prof. Akhtar Hussain, Department of Classical Antiquities",
    lead_ar: "الأستاذ أختر حسين، قسم الآثار الكلاسيكية",
    lead_ur: "پروفیسر اختر حسین، شعبہ آثارِ قدیمہ",
    lead_hi: "प्रो. अख्तर हुसैन, शास्त्रीय पुरावशेष विभाग",
    status: "Published",
    funding: "$85,000",
    year: 2024,
    citations: 63,
    abstract_en: "A comprehensive archeological and artistic survey tracing the migration of calligraphic styles from Samarkand and Herat into the imperial architectural monuments of Lahore, Delhi, and Agra built during the 16th and 17th centuries.",
    abstract_ar: "مسح أثري وفني شامل يتتبع هجرة أساليب الخط من سمرقند وهيرات إلى المعالم المعمارية الإمبراطورية في لاهور ودلهي وأغرا المبنية خلال القرنين السادس عشر والسابع عشر.",
    abstract_ur: "وسطی ایشیا (سمرقند اور ہرات) سے ہجرت کرنے والے خطاطی کے اسالیب کا ایک جامع آثارِ قدیمہ اور فنی سروے جو 16ویں اور 17ویں صدی کے دوران لاہور، دہلی اور آگرہ میں تعمیر کی گئی تاریخی عمارتوں کے خطاطی کے نمونوں سے مماثلت کا احاطہ کرتا ہے۔",
    abstract_hi: "16वीं और 17वीं शताब्दी के दौरान लाहौर, दिल्ली और आगरा में निर्मित शाही वास्तुशिल्प स्मारकों में समरकंद और हेरात से सुलेख शैलियों के प्रवास का पता लगाने वाला एक व्यापक पुरातात्विक और कलात्मक सर्वेक्षण।"
  }
];

export const ACADEMIC_PROGRAMS: Program[] = [
  {
    id: "prog-1",
    name_en: "Master of Science in Theoretical Physics",
    name_ar: "ماجستير العلوم في الفيزياء النظرية",
    name_ur: "ایم ایس سی ان تھیوریٹیکل فزکس",
    name_hi: "सैद्धांतिक भौतिकी में मास्टर ऑफ साइंस",
    level: "Postgraduate Research",
    duration_en: "2 Academic Years",
    duration_ar: "سنتين أكاديميتين",
    duration_ur: "2 تعلیمی سال",
    duration_hi: "2 शैक्षणिक वर्ष",
    fee_en: "$3,200 / Semester",
    fee_ar: "3,200 دولار / الفصل الدراسي",
    fee_ur: "3,200 ڈالر فی سمسٹر",
    fee_hi: "$3,200 / सेमेस्टर",
    deadline_en: "August 15, 2026",
    deadline_ar: "15 أغسطس 2026",
    deadline_ur: "15 اگست 2026",
    deadline_hi: "15 अगस्त 2026",
    requirements_en: "Bachelor's degree in Physics or Mathematics with a minimum GPA of 3.5/4.0 or equivalent. Academic references required.",
    requirements_ar: "درجة البكالوريوس في الفيزياء أو الرياضيات بمعدل تراكمي لا يقل عن 3.5/4.0 أو ما يعادله. مراجع أكاديمية مطلوبة.",
    requirements_ur: "فزکس یا میتھمیٹکس میں بیچلرز ڈگری جس میں کم از کم جی پی اے 3.5 یا اس کے مساوی ہو۔ تعلیمی سفارشات درکار ہیں۔",
    requirements_hi: "भौतिकी या गणित में स्नातक की डिग्री न्यूनतम 3.5/4.0 जीपीए या समकक्ष के साथ। शैक्षणिक संदर्भ आवश्यक हैं।"
  },
  {
    id: "prog-2",
    name_en: "Advanced Diploma in Nastaliq Calligraphy and Paleography",
    name_ar: "دبلوم عالي في خط النستعليق ودراسة المخطوطات القديمة",
    name_ur: "ایڈوانسڈ ڈپلومہ ان نستعلیق خطاطی اور علمِ خطوطِ قدیمہ",
    name_hi: "नस्तालीक़ सुलेख और पुरालेख में उन्नत डिप्लोमा",
    level: "Professional Certification",
    duration_en: "1 Year (Full-time)",
    duration_ar: "سنة واحدة (دوام كامل)",
    duration_ur: "1 سال (کل وقتی)",
    duration_hi: "1 वर्ष (पूर्णकालिक)",
    fee_en: "$1,800 / Total Program",
    fee_ar: "1,800 دولار / إجمالي البرنامج",
    fee_ur: "1,800 ڈالر کل فیس",
    fee_hi: "$1,800 / कुल कार्यक्रम",
    deadline_en: "September 1, 2026",
    deadline_ar: "1 سبتمبر 2026",
    deadline_ur: "1 ستمبر 2026",
    deadline_hi: "1 सितंबर 2026",
    requirements_en: "Portfolio of handwriting or calligraphic samples. High school diploma or secondary education degree.",
    requirements_ar: "ملف أعمال يحتوي على عينات من خط اليد أو الخط العربي. شهادة الثانوية العامة أو ما يعادلها.",
    requirements_ur: "خوش نویسی یا خطاطی کے نمونوں کا پورٹ فولیو۔ ہائی اسکول ڈپلومہ یا ثانوی تعلیم کی سند۔",
    requirements_hi: "हस्तलेखन या सुलेख के नमूनों का पोर्टफोलियो। हाई स्कूल डिप्लोमा या माध्यमिक शिक्षा की डिग्री।"
  },
  {
    id: "prog-3",
    name_en: "Bachelor of Arts in Semitic and Indo-Aryan Linguistics",
    name_ar: "بكالوريوس الآداب في اللسانيات السامية والهندوأريية",
    name_ur: "بی اے ان سامی اور ہند آریائی لسانیات",
    name_hi: "सामी और भारत-आर्य भाषाविज्ञान में कला स्नातक",
    level: "Undergraduate Program",
    duration_en: "4 Academic Years",
    duration_ar: "4 سنوات أكاديمية",
    duration_ur: "4 تعلیمی سال",
    duration_hi: "4 शैक्षणिक वर्ष",
    fee_en: "$2,400 / Semester",
    fee_ar: "2,400 دولار / الفصل الدراسي",
    fee_ur: "2,400 ڈالر فی سمسٹر",
    fee_hi: "$2,400 / सेमेस्टर",
    deadline_en: "August 1, 2026",
    deadline_ar: "1 أغسطس 2026",
    deadline_ur: "1 اگست 2026",
    deadline_hi: "1 अगस्त 2026",
    requirements_en: "Excellent high school record with strong credentials in history, languages, or humanities. Language assessment required.",
    requirements_ar: "سجل ثانوي ممتاز مع كفاءة قوية في التاريخ واللغات أو العلوم الإنسانية. تقييم لغوي مطلوب.",
    requirements_ur: "تاریخ، زبانوں یا ہیومینیٹیز میں بہترین ہائی اسکول ریکارڈ۔ زبان کی مہارت کا ٹیسٹ لازمی ہے۔",
    requirements_hi: "इतिहास, भाषाओं या मानविकी में मजबूत साख के साथ उत्कृष्ट हाई स्कूल रिकॉर्ड। भाषा मूल्यांकन आवश्यक है।"
  }
];

export const PortalMain: React.FC<PortalMainProps> = ({
  articles,
  categories,
  books = [],
  research = [],
  quotes,
  hadiths,
  currentLang,
  onNavigateToAdmin,
  incrementViews,
  activeHeaderTab,
  setActiveHeaderTab,
}) => {
  const t = TRANSLATIONS[currentLang];
  
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);

  const getLocalizedQuoteText = (quote: any) => {
    if (currentLang === 'ur' && quote.text_ur) return quote.text_ur;
    if (currentLang === 'ar' && quote.text_ar) return quote.text_ar;
    if (currentLang === 'hi' && quote.text_hi) return quote.text_hi;
    return quote.text_en;
  };

  const getLocalizedQuoteAuthor = (quote: any) => {
    if (currentLang === 'ur' && quote.author_ur) return quote.author_ur;
    if (currentLang === 'ar' && quote.author_ar) return quote.author_ar;
    if (currentLang === 'hi' && quote.author_hi) return quote.author_hi;
    return quote.author_en;
  };

  // Hadiths Search State
  const [searchHadithQuery, setSearchHadithQuery] = useState<string>('');

  const getLocalizedHadithText = (hadith: any) => {
    if (currentLang === 'ur' && hadith.text_ur) return hadith.text_ur;
    if (currentLang === 'ar' && hadith.text_ar) return hadith.text_ar;
    if (currentLang === 'hi' && hadith.text_hi) return hadith.text_hi;
    return hadith.text_en;
  };

  const getLocalizedHadithSource = (hadith: any) => {
    if (currentLang === 'ur' && hadith.source_ur) return hadith.source_ur;
    if (currentLang === 'ar' && hadith.source_ar) return hadith.source_ar;
    if (currentLang === 'hi' && hadith.source_hi) return hadith.source_hi;
    return hadith.source_en;
  };

  // Clear selected article details when changing header navigation tab
  useEffect(() => {
    setActiveArticleId(null);
  }, [activeHeaderTab]);

  // Library State
  const [librarySearchQuery, setLibrarySearchQuery] = useState<string>('');
  const [selectedLibraryCategory, setSelectedLibraryCategory] = useState<string>('All');
  const [copiedBookId, setCopiedBookId] = useState<string | null>(null);
  const [activeBookPreview, setActiveBookPreview] = useState<LibraryBook | null>(null);
  const [selectedLibraryLanguage, setSelectedLibraryLanguage] = useState<'All' | 'ar' | 'hi' | 'ur' | 'en'>('All');
  const [libraryActiveSubTab, setLibraryActiveSubTab] = useState<'articles' | 'books'>('articles');

  // Research State
  const [selectedResearchProject, setSelectedResearchProject] = useState<ResearchProject | null>(null);

  // Admissions State
  const [applicantName, setApplicantName] = useState<string>('');
  const [applicantEmail, setApplicantEmail] = useState<string>('');
  const [applicantProgram, setApplicantProgram] = useState<string>('prog-1');
  const [applicantHistory, setApplicantHistory] = useState<string>('');
  const [applicantStatement, setApplicantStatement] = useState<string>('');
  const [admissionSubmitted, setAdmissionSubmitted] = useState<boolean>(false);
  const [admissionApplicationId, setAdmissionApplicationId] = useState<string | null>(null);
  
  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Pagination or Load More state
  const [visibleCount, setVisibleCount] = useState(3);

  // Filter only published articles for students
  const publishedArticles = articles.filter(a => a.status === 'Published');

  // Filter based on search query and category
  const filteredArticles = publishedArticles.filter(article => {
    // Determine active fields
    const title = (
      currentLang === 'ar' ? article.title_ar :
      currentLang === 'ur' ? article.title_ur :
      currentLang === 'hi' ? article.title_hi :
      article.title_en
    ) || '';

    const content = (
      currentLang === 'ar' ? article.content_ar :
      currentLang === 'ur' ? article.content_ur :
      currentLang === 'hi' ? article.content_hi :
      article.content_en
    ) || '';

    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    const matchesSearch = 
      title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Featured Article is always prioritized if explicitly marked, otherwise default to art-1 or first
  const featuredArticle = publishedArticles.find(a => a.is_featured) || publishedArticles.find(a => a.id === 'art-1') || publishedArticles[0];

  // Selected article detail
  const activeArticle = publishedArticles.find(a => a.id === activeArticleId);

  // Trigger scroll to top when selecting an article
  useEffect(() => {
    if (activeArticleId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeArticleId]);

  // Related articles algorithm
  const getRelatedArticles = (currentArticle: Article) => {
    return publishedArticles
      .filter(a => a.id !== currentArticle.id && a.category === currentArticle.category)
      .slice(0, 3);
  };

  const handleArticleClick = (id: string) => {
    setActiveArticleId(id);
    incrementViews(id);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail('');
      }, 4000);
    }
  };

  // Helper to translate article strings with robust multi-language fallback
  const getLocalizedTitle = (article: Article) => {
    if (currentLang === 'ar' && article.title_ar && article.title_ar !== "Untitled English Article" && article.title_ar !== "Untitled Article") return article.title_ar;
    if (currentLang === 'ur' && article.title_ur && article.title_ur !== "Untitled English Article" && article.title_ur !== "Untitled Article") return article.title_ur;
    if (currentLang === 'hi' && article.title_hi && article.title_hi !== "Untitled English Article" && article.title_hi !== "Untitled Article") return article.title_hi;
    if (currentLang === 'en' && article.title_en && article.title_en !== "Untitled English Article" && article.title_en !== "Untitled Article") return article.title_en;

    // Direct language check fallbacks for empty primary language title or placeholder titles
    const candidates = [article.title_ur, article.title_ar, article.title_hi, article.title_en];
    for (const val of candidates) {
      if (val && val !== "Untitled English Article" && val !== "Untitled Article" && val.trim() !== "") {
        return val;
      }
    }
    
    return article.title_en || "Untitled Article";
  };

  const getLocalizedContent = (article: Article) => {
    if (currentLang === 'ar' && article.content_ar) return article.content_ar;
    if (currentLang === 'ur' && article.content_ur) return article.content_ur;
    if (currentLang === 'hi' && article.content_hi) return article.content_hi;
    if (currentLang === 'en' && article.content_en) return article.content_en;

    // Direct language check fallbacks for empty primary language content
    const candidates = [article.content_ur, article.content_ar, article.content_hi, article.content_en];
    for (const val of candidates) {
      if (val && val.trim() !== "") {
        return val;
      }
    }

    return "";
  };

  const getLocalizedCategory = (cat: string) => {
    if (cat === 'Science') return currentLang === 'en' ? 'Science' : currentLang === 'ar' ? 'العلوم' : currentLang === 'ur' ? 'سائنس' : 'विज्ञान';
    if (cat === 'History') return currentLang === 'en' ? 'History' : currentLang === 'ar' ? 'التاريخ' : currentLang === 'ur' ? 'تاریخ' : 'इतिहास';
    if (cat === 'Culture') return currentLang === 'en' ? 'Culture' : currentLang === 'ar' ? 'الثقافة' : currentLang === 'ur' ? 'ثقافت' : 'संस्कृति';
    return cat;
  };

  // Robust RTL text detection helper
  const isRtlText = (text: string): boolean => {
    if (!text) return false;
    const rtlRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
    return rtlRegex.test(text);
  };

  // Get localized text style including dynamic alignment, direction, premium fonts, and appropriate line heights
  const getTextStyle = (text: string) => {
    const isRtl = isRtlText(text) || currentLang === 'ar' || currentLang === 'ur';
    const hasArabicChars = /[\u0600-\u06FF]/.test(text);
    // Detect if Urdu specifically to apply beautiful Nastaliq font with slightly extra vertical breathing room (important for Nastaliq accents)
    const isUrdu = currentLang === 'ur' || (
      isRtl && hasArabicChars && (
        text.includes('ہے') || text.includes('ہیں') || text.includes('کا') || 
        text.includes('کے') || text.includes('کی') || text.includes('میں') || 
        text.includes('نے') || text.includes('ہوا') || text.includes('کر') ||
        text.includes('پر') || text.includes('سے') || text.includes('تھا') ||
        text.includes('یہ') || text.includes('وہ') || text.includes('تو')
      )
    );

    if (isRtl) {
      return {
        direction: 'rtl' as const,
        textAlign: 'right' as const,
        fontFamily: isUrdu 
          ? '"AA Sameer Asmaak Regular", "AA Sameer Asmaak", "Noto Nastaliq Urdu", "Jameel Noori Nastaliq", serif' 
          : '"Noto Naskh Arabic", serif',
        lineHeight: isUrdu ? '2.4' : '2.0',
        whiteSpace: 'pre-line' as const,
      };
    }

    return {
      direction: 'ltr' as const,
      textAlign: 'left' as const,
      fontFamily: '"Poppins", "Arial", sans-serif',
      lineHeight: '1.7',
      whiteSpace: 'pre-line' as const,
    };
  };

  // Utility to decode HTML entities and strip raw markdown tags for beautiful card list previews
  const getCleanSnippet = (text: string): string => {
    if (!text) return '';
    return text
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#39;/g, "'")
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/<u>/g, '')
      .replace(/<\/u>/g, '')
      .replace(/^>\s*/gm, '')
      .replace(/^-\s*/gm, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Inline formatting style parser (Bold, Italic, Underline)
  const parseInlineStyles = (text: string): React.ReactNode => {
    // Decode HTML entities
    let decoded = text
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#39;/g, "'");

    const parts: React.ReactNode[] = [];
    let currentIndex = 0;
    const tokenRegex = /(\*\*(.*?)\*\*|\*(.*?)\*|<u>(.*?)<\/u>)/g;
    let match;

    while ((match = tokenRegex.exec(decoded)) !== null) {
      const matchIndex = match.index;
      if (matchIndex > currentIndex) {
        parts.push(decoded.substring(currentIndex, matchIndex));
      }

      const [,, boldText, italicText, underlineText] = match;

      if (boldText !== undefined) {
        parts.push(<strong key={matchIndex} className="font-extrabold text-[#008080]">{boldText}</strong>);
      } else if (italicText !== undefined) {
        parts.push(<em key={matchIndex} className="italic text-slate-700">{italicText}</em>);
      } else if (underlineText !== undefined) {
        parts.push(<span key={matchIndex} className="underline decoration-[#008080]/40 decoration-2">{underlineText}</span>);
      }

      currentIndex = tokenRegex.lastIndex;
    }

    if (currentIndex < decoded.length) {
      parts.push(decoded.substring(currentIndex));
    }

    return parts.length > 0 ? <>{parts}</> : decoded;
  };

  // Structure-aware Multi-paragraph and Block renderer
  const renderArticleContent = (content: string) => {
    if (!content) return null;

    // Normalize spacing and split by double-newlines (paragraphs)
    const rawBlocks = content.split(/\n\s*\n/);

    return rawBlocks.map((rawBlock, blockIdx) => {
      const blockText = rawBlock.trim();
      if (!blockText) return null;

      const blockStyle = getTextStyle(blockText);
      const isRtl = isRtlText(blockText);

      // Render Blockquote
      if (blockText.startsWith('>')) {
        const cleanQuote = blockText.replace(/^>\s*/, '').replace(/^["'«»“”„]/, '').replace(/["'«»“”„]$/, '');
        return (
          <blockquote
            key={blockIdx}
            className={`my-6 px-6 py-4 bg-slate-50/70 border-slate-200 text-slate-700 font-medium text-base leading-relaxed ${
              isRtl
                ? 'border-r-4 border-l-0 rounded-l-2xl pr-6 pl-4'
                : 'border-l-4 border-r-0 rounded-r-2xl pl-6 pr-4'
            }`}
            style={blockStyle}
          >
            {parseInlineStyles(cleanQuote)}
          </blockquote>
        );
      }

      // Render Unordered Lists
      if (blockText.startsWith('- ') || blockText.startsWith('* ')) {
        const lines = blockText.split('\n');
        return (
          <ul
            key={blockIdx}
            className={`space-y-3 my-5 ${isRtl ? 'pr-8 list-disc list-inside' : 'pl-8 list-disc list-inside'}`}
            style={blockStyle}
          >
            {lines.map((line, lineIdx) => {
              const cleanLine = line.replace(/^[-*]\s*/, '');
              return (
                <li key={lineIdx} className="text-slate-800 text-base md:text-[17px]">
                  {parseInlineStyles(cleanLine)}
                </li>
              );
            })}
          </ul>
        );
      }

      // Render Standard Paragraph
      return (
        <p
          key={blockIdx}
          className="mb-6 last:mb-0 text-slate-800 text-base md:text-[17px] tracking-normal"
          style={blockStyle}
        >
          {parseInlineStyles(blockText)}
        </p>
      );
    });
  };

  // ==========================================
  // LIBRARY TAB RENDER ROUTINE
  // ==========================================
  if (activeHeaderTab === 'library') {
    // Filter books based on category and search query
    const displayBooks = books.length > 0 ? books : LIBRARY_BOOKS;
    const filteredBooks = displayBooks.filter(book => {
      const title = (currentLang === 'ar' ? book.title_ar : currentLang === 'ur' ? book.title_ur : currentLang === 'hi' ? book.title_hi : book.title_en) || '';
      const author = (currentLang === 'ar' ? book.author_ar : currentLang === 'ur' ? book.author_ur : currentLang === 'hi' ? book.author_hi : book.author_en) || '';
      
      const matchesCategory = selectedLibraryCategory === 'All' || book.category === selectedLibraryCategory;
      const matchesSearch = 
        title.toLowerCase().includes(librarySearchQuery.toLowerCase()) || 
        author.toLowerCase().includes(librarySearchQuery.toLowerCase()) ||
        book.isbn.includes(librarySearchQuery);

      return matchesCategory && matchesSearch;
    });

    // Filter published articles based on library category, search, and language menu selection
    const filteredLibraryArticles = publishedArticles.filter(article => {
      const title = (
        currentLang === 'ar' ? article.title_ar :
        currentLang === 'ur' ? article.title_ur :
        currentLang === 'hi' ? article.title_hi :
        article.title_en
      ) || '';
      
      const content = (
        currentLang === 'ar' ? article.content_ar :
        currentLang === 'ur' ? article.content_ur :
        currentLang === 'hi' ? article.content_hi :
        article.content_en
      ) || '';

      const matchesCategory = selectedLibraryCategory === 'All' || article.category === selectedLibraryCategory;
      const matchesSearch = 
        title.toLowerCase().includes(librarySearchQuery.toLowerCase()) || 
        content.toLowerCase().includes(librarySearchQuery.toLowerCase()) ||
        article.category.toLowerCase().includes(librarySearchQuery.toLowerCase());

      let matchesLanguage = true;
      if (selectedLibraryLanguage === 'ar') {
        matchesLanguage = !!(article.title_ar || article.content_ar);
      } else if (selectedLibraryLanguage === 'ur') {
        matchesLanguage = !!(article.title_ur || article.content_ur);
      } else if (selectedLibraryLanguage === 'hi') {
        matchesLanguage = !!(article.title_hi || article.content_hi);
      } else if (selectedLibraryLanguage === 'en') {
        matchesLanguage = !!(article.title_en || article.content_en);
      }

      return matchesCategory && matchesSearch && matchesLanguage;
    });

    const getLocalizedBookTitle = (book: LibraryBook) => {
      if (currentLang === 'ar' && book.title_ar) return book.title_ar;
      if (currentLang === 'ur' && book.title_ur) return book.title_ur;
      if (currentLang === 'hi' && book.title_hi) return book.title_hi;
      return book.title_en;
    };

    const getLocalizedBookAuthor = (book: LibraryBook) => {
      if (currentLang === 'ar' && book.author_ar) return book.author_ar;
      if (currentLang === 'ur' && book.author_ur) return book.author_ur;
      if (currentLang === 'hi' && book.author_hi) return book.author_hi;
      return book.author_en;
    };

    const getLocalizedBookAbstract = (book: LibraryBook) => {
      if (currentLang === 'ar' && book.abstract_ar) return book.abstract_ar;
      if (currentLang === 'ur' && book.abstract_ur) return book.abstract_ur;
      if (currentLang === 'hi' && book.abstract_hi) return book.abstract_hi;
      return book.abstract_en;
    };

    const handleCopyCitation = (book: LibraryBook) => {
      const citation = `${getLocalizedBookAuthor(book)}. (${book.year}). _${getLocalizedBookTitle(book)}_. Al-Qalam Academy Press. ISBN: ${book.isbn}.`;
      navigator.clipboard.writeText(citation);
      setCopiedBookId(book.id);
      setTimeout(() => setCopiedBookId(null), 3000);
    };

    const getLibrarySubTabLabel = (subTab: 'articles' | 'books') => {
      if (subTab === 'articles') {
        if (currentLang === 'ar') return 'المقالات الإخبارية';
        if (currentLang === 'ur') return 'مضامین';
        if (currentLang === 'hi') return 'लेख गैलरी';
        return 'Articles Gallery';
      } else {
        if (currentLang === 'ar') return 'الكتب الكلاسيكية';
        if (currentLang === 'ur') return 'کلاسیکی کتب';
        if (currentLang === 'hi') return 'क्लासिक पुस्तकें';
        return 'Classical Books';
      }
    };

    return (
      <div className="max-w-[1440px] mx-auto px-4 md:px-16 py-8 animate-in fade-in duration-300">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-8 text-xs font-semibold text-slate-500">
          <a href="#" className="hover:text-[#008080] transition-colors cursor-pointer" onClick={(e) => { e.preventDefault(); setActiveHeaderTab('courses'); setActiveArticleId(null); setSelectedCategory('All'); setSearchQuery(''); }}>{t.home}</a>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#008080] font-bold">{t.navLibrary}</span>
        </nav>

        {/* Header */}
        <div className="mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#008080]/5 rounded-full border border-[#008080]/10">
            <BookOpen className="w-4 h-4 text-[#008080]" />
            <span className="text-xs font-bold text-[#008080] tracking-wide uppercase">Academy Library Repository</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Digital Scholarly Repository
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
            Search and reference our elite collection of foundational textbooks, historical treatises, and digital learning assets preserved for students and faculty.
          </p>
        </div>

        {/* Modern Sub-Tab Toggles */}
        <div className="flex border-b border-slate-200 mb-8 gap-6">
          <button
            onClick={() => setLibraryActiveSubTab('articles')}
            className={`pb-4 text-sm font-bold transition-all relative cursor-pointer border-none bg-transparent ${
              libraryActiveSubTab === 'articles'
                ? 'text-[#008080]'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {getLibrarySubTabLabel('articles')}
            {libraryActiveSubTab === 'articles' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#008080] rounded-full animate-in fade-in duration-200" />
            )}
          </button>
          <button
            onClick={() => setLibraryActiveSubTab('books')}
            className={`pb-4 text-sm font-bold transition-all relative cursor-pointer border-none bg-transparent ${
              libraryActiveSubTab === 'books'
                ? 'text-[#008080]'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {getLibrarySubTabLabel('books')}
            {libraryActiveSubTab === 'books' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#008080] rounded-full animate-in fade-in duration-200" />
            )}
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {libraryActiveSubTab === 'books' ? (
              ['All', 'Science', 'History', 'Culture'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedLibraryCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    selectedLibraryCategory === cat
                      ? 'bg-[#008080] text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {cat === 'All' ? (currentLang === 'en' ? 'All' : currentLang === 'ar' ? 'الكل' : currentLang === 'ur' ? 'سب' : 'सभी') : getLocalizedCategory(cat)}
                </button>
              ))
            ) : (
              // 4 language menus + All Languages
              [
                { code: 'All', labelEn: 'All Languages', labelAr: 'كل اللغات', labelUr: 'تمام زبانیں', labelHi: 'सभी भाषाएँ' },
                { code: 'en', labelEn: 'English', labelAr: 'الإنجليزية', labelUr: 'انگریزی', labelHi: 'अंग्रेजी' },
                { code: 'ar', labelEn: 'Arabic', labelAr: 'العربية', labelUr: 'عربی', labelHi: 'अरबी' },
                { code: 'ur', labelEn: 'Urdu', labelAr: 'الأردية', labelUr: 'اردو', labelHi: 'उर्दू' },
                { code: 'hi', labelEn: 'Hindi', labelAr: 'الهندية', labelUr: 'ہندی', labelHi: 'हिन्दी' }
              ].map((langItem) => {
                const isSelected = selectedLibraryLanguage === langItem.code;
                const label = currentLang === 'ar' ? langItem.labelAr : currentLang === 'ur' ? langItem.labelUr : currentLang === 'hi' ? langItem.labelHi : langItem.labelEn;
                return (
                  <button
                    key={langItem.code}
                    onClick={() => setSelectedLibraryLanguage(langItem.code as any)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#008080] text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <Globe className="w-3 h-3 opacity-70" />
                    <span>{label}</span>
                  </button>
                );
              })
            )}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={librarySearchQuery}
              onChange={(e) => setLibrarySearchQuery(e.target.value)}
              placeholder={libraryActiveSubTab === 'books' ? "Search by title, author, or ISBN..." : "Search by title, category, or content..."}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs focus:ring-2 focus:ring-[#008080]/20 focus:border-[#008080] outline-none transition-all text-slate-800"
            />
          </div>
        </div>

        {/* Content Render Grid */}
        {libraryActiveSubTab === 'articles' ? (
          /* Articles Display Grid with uploaded images */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLibraryArticles.map((article) => {
              const localizedTitle = getLocalizedTitle(article);
              const localizedSnippet = getCleanSnippet(getLocalizedContent(article));
              const hasRtlTitle = isRtlText(localizedTitle);

              return (
                <div
                  key={article.id}
                  onClick={() => {
                    setActiveHeaderTab('courses');
                    setActiveArticleId(article.id);
                  }}
                  className="group bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  {/* Article Banner Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100 flex-shrink-0">
                    <img
                      src={article.image_url}
                      alt={localizedTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-[#008080] text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                      {getLocalizedCategory(article.category)}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-slate-400 text-[11px] font-semibold">
                        <span>{article.published_date}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.read_time}
                        </span>
                      </div>

                      <h3
                        className="text-base font-bold text-slate-900 group-hover:text-[#008080] transition-colors line-clamp-2"
                        style={{
                          direction: hasRtlTitle ? 'rtl' : 'ltr',
                          textAlign: hasRtlTitle ? 'right' : 'left',
                          fontFamily: hasRtlTitle ? (localizedTitle.includes('ہے') ? '"Noto Nastaliq Urdu", serif' : '"Noto Naskh Arabic", serif') : 'inherit'
                        }}
                      >
                        {localizedTitle}
                      </h3>

                      <p
                        className="text-xs text-slate-500 line-clamp-3 leading-relaxed"
                        style={{
                          direction: isRtlText(localizedSnippet) ? 'rtl' : 'ltr',
                          textAlign: isRtlText(localizedSnippet) ? 'right' : 'left'
                        }}
                      >
                        {localizedSnippet}
                      </p>
                    </div>

                    {/* Card Footer */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">By {article.author}</span>
                      <span className="text-xs font-bold text-[#008080] group-hover:underline flex items-center gap-1">
                        Read Article <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredLibraryArticles.length === 0 && (
              <div className="col-span-full text-center py-16 bg-white border border-slate-200 rounded-3xl">
                <Globe className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-400 font-medium">No articles found in selected language/category.</p>
                <button
                  onClick={() => {
                    setSelectedLibraryLanguage('All');
                    setSelectedLibraryCategory('All');
                    setLibrarySearchQuery('');
                  }}
                  className="text-xs text-[#008080] underline font-bold mt-2 cursor-pointer border-none bg-transparent"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Books Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBooks.map((book) => {
              const hasRtlTitle = isRtlText(getLocalizedBookTitle(book));
              return (
                <div 
                  key={book.id} 
                  className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row gap-5 hover:shadow-md transition-shadow group relative"
                >
                  {/* Book Cover Visual Accent */}
                  <div className="w-full md:w-32 h-44 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200 relative shadow-sm">
                    {book.cover_image_url ? (
                      <img 
                        src={book.cover_image_url} 
                        alt="Book Cover" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col justify-between p-3 bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#008080]/5 rounded-full blur-xl" />
                        <div className="z-10 flex justify-between items-center">
                          <Book className="w-4 h-4 text-[#008080]" />
                          <span className="text-[9px] font-mono font-bold text-slate-400 bg-white border border-slate-150 px-1 py-0.5 rounded uppercase">{book.category}</span>
                        </div>
                        <div className="z-10 space-y-1">
                          <p className="text-[10px] font-mono text-slate-400 font-bold uppercase font-sans">YEAR {book.year}</p>
                          <p className="text-[10px] font-bold text-slate-500 line-clamp-2" style={{ direction: hasRtlTitle ? 'rtl' : 'ltr' }}>{getLocalizedBookTitle(book)}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-[#008080] uppercase tracking-wider">{book.category}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{book.pages} Pages</span>
                      </div>
                      <h3 
                        className="text-base font-bold text-slate-900 group-hover:text-[#008080] transition-colors"
                        style={{
                          direction: hasRtlTitle ? 'rtl' : 'ltr',
                          textAlign: hasRtlTitle ? 'right' : 'left',
                          fontFamily: hasRtlTitle ? (getLocalizedBookTitle(book).includes('ہے') ? '"Noto Nastaliq Urdu", serif' : '"Noto Naskh Arabic", serif') : 'inherit'
                        }}
                      >
                        {getLocalizedBookTitle(book)}
                      </h3>
                      <p 
                        className="text-xs font-bold text-slate-500"
                        style={{
                          direction: isRtlText(getLocalizedBookAuthor(book)) ? 'rtl' : 'ltr',
                          textAlign: isRtlText(getLocalizedBookAuthor(book)) ? 'right' : 'left'
                        }}
                      >
                        By {getLocalizedBookAuthor(book)}
                      </p>
                      <p 
                        className="text-xs text-slate-500 line-clamp-3 leading-relaxed pt-1"
                        style={{
                          direction: isRtlText(getLocalizedBookAbstract(book)) ? 'rtl' : 'ltr',
                          textAlign: isRtlText(getLocalizedBookAbstract(book)) ? 'right' : 'left'
                        }}
                      >
                        {getLocalizedBookAbstract(book)}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-[10px] font-mono font-bold text-slate-400">ISBN: {book.isbn}</span>
                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={() => handleCopyCitation(book)}
                          className="px-3 py-1.5 border border-slate-200 hover:border-[#008080] rounded-lg text-[11px] font-bold text-slate-600 hover:text-[#008080] flex items-center gap-1 transition-all cursor-pointer bg-slate-50 hover:bg-[#008080]/5"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>{copiedBookId === book.id ? "Cited!" : "Cite"}</span>
                        </button>
                        <button 
                          onClick={() => setActiveBookPreview(book)}
                          className="px-3 py-1.5 bg-[#008080] hover:bg-[#006666] active:scale-95 rounded-lg text-[11px] font-bold text-white flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Read Digital</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredBooks.length === 0 && (
              <div className="col-span-2 text-center py-16 bg-white border border-slate-200 rounded-3xl">
                <Book className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-400 font-medium">No matching texts found in the digital library.</p>
                <button onClick={() => { setLibrarySearchQuery(''); setSelectedLibraryCategory('All'); }} className="text-xs text-[#008080] underline font-bold mt-2">Clear Filters</button>
              </div>
            )}
          </div>
        )}

        {/* Digital Reader Preview Modal */}
        {activeBookPreview && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl relative animate-in zoom-in-95 duration-300">
              <button 
                onClick={() => setActiveBookPreview(null)}
                className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 rotate-180" />
              </button>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="bg-[#008080]/10 text-[#008080] px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider">Digital Copy</span>
                  <span className="text-[10px] text-slate-400 font-semibold font-mono">ISBN {activeBookPreview.isbn}</span>
                </div>
                
                <h2 
                  className="text-2xl font-black text-slate-900"
                  style={{
                    direction: isRtlText(getLocalizedBookTitle(activeBookPreview)) ? 'rtl' : 'ltr',
                    textAlign: isRtlText(getLocalizedBookTitle(activeBookPreview)) ? 'right' : 'left'
                  }}
                >
                  {getLocalizedBookTitle(activeBookPreview)}
                </h2>
                <p 
                  className="text-sm font-bold text-[#008080]"
                  style={{
                    direction: isRtlText(getLocalizedBookAuthor(activeBookPreview)) ? 'rtl' : 'ltr',
                    textAlign: isRtlText(getLocalizedBookAuthor(activeBookPreview)) ? 'right' : 'left'
                  }}
                >
                  Author: {getLocalizedBookAuthor(activeBookPreview)}
                </p>
                
                <div className="h-48 rounded-2xl bg-slate-50 border border-slate-150 p-5 overflow-y-auto font-mono text-[11px] text-slate-600 leading-relaxed border-l-4 border-l-[#008080]">
                  <p className="font-bold text-slate-800 text-xs mb-2">CHAPTER I — SYSTEM OVERVIEW & PREFACE</p>
                  <p className="mb-4">
                    All matters appertaining to the advancement of scholastic studies in this elite institution are directed towards the pursuit of pure, unadulterated truth. Whether we analyze the physical symmetries of the cosmos or translate classical scripts written in the Nastaliq style, the scientific spirit remains unified.
                  </p>
                  <p className="mb-4">
                    The pages compiled in this digital format constitute the institutional assets of the Academy. Under compliance standards, any distribution, borrowing, or reproduction of these files is monitored for academic integrity.
                  </p>
                  <p className="italic text-slate-400 text-[10px] text-center mt-6">
                    [End of Digital Fragment — Fully compatible with curriculum course syllabus]
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-between items-center gap-2">
                <span className="text-xs text-slate-400 font-bold uppercase">{activeBookPreview.pages} pages indexed</span>
                <button 
                  onClick={() => setActiveBookPreview(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Close Document
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // RESEARCH TAB RENDER ROUTINE
  // ==========================================
  if (activeHeaderTab === 'research') {
    const getLocalizedResearchTitle = (project: ResearchProject) => {
      if (currentLang === 'ar' && project.title_ar) return project.title_ar;
      if (currentLang === 'ur' && project.title_ur) return project.title_ur;
      if (currentLang === 'hi' && project.title_hi) return project.title_hi;
      return project.title_en;
    };

    const getLocalizedResearchLead = (project: ResearchProject) => {
      if (currentLang === 'ar' && project.lead_ar) return project.lead_ar;
      if (currentLang === 'ur' && project.lead_ur) return project.lead_ur;
      if (currentLang === 'hi' && project.lead_hi) return project.lead_hi;
      return project.lead_en;
    };

    const getLocalizedResearchAbstract = (project: ResearchProject) => {
      if (currentLang === 'ar' && project.abstract_ar) return project.abstract_ar;
      if (currentLang === 'ur' && project.abstract_ur) return project.abstract_ur;
      if (currentLang === 'hi' && project.abstract_hi) return project.abstract_hi;
      return project.abstract_en;
    };

    return (
      <div className="max-w-[1440px] mx-auto px-4 md:px-16 py-8 animate-in fade-in duration-300">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-8 text-xs font-semibold text-slate-500">
          <a href="#" className="hover:text-[#008080] transition-colors cursor-pointer" onClick={(e) => { e.preventDefault(); setActiveHeaderTab('courses'); setActiveArticleId(null); setSelectedCategory('All'); setSearchQuery(''); }}>{t.home}</a>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#008080] font-bold">{t.navResearch}</span>
        </nav>

        {/* Header */}
        <div className="mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#008080]/5 rounded-full border border-[#008080]/10">
            <Compass className="w-4 h-4 text-[#008080]" />
            <span className="text-xs font-bold text-[#008080] tracking-wide uppercase">Institutional Investigations</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Scientific & Linguistic Research Labs
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
            Discover our high-impact ongoing research efforts combining cutting-edge artificial intelligence, quantum sciences, and heritage manuscript digitization.
          </p>
        </div>

        {/* Research Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(research.length > 0 ? research : RESEARCH_PROJECTS).map((project) => {
            const hasRtlTitle = isRtlText(getLocalizedResearchTitle(project));
            return (
              <div key={project.id} className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      project.status === 'Published' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                        : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      {project.status}
                    </span>
                    <span className="text-xs font-bold text-slate-400 font-mono">EST. {project.year}</span>
                  </div>

                  <div className="space-y-2">
                    <h3 
                      className="text-base font-extrabold text-slate-900 line-clamp-3 leading-snug hover:text-[#008080] transition-colors"
                      style={{
                        direction: hasRtlTitle ? 'rtl' : 'ltr',
                        textAlign: hasRtlTitle ? 'right' : 'left'
                      }}
                    >
                      {getLocalizedResearchTitle(project)}
                    </h3>
                    <p 
                      className="text-xs font-semibold text-[#008080]"
                      style={{
                        direction: isRtlText(getLocalizedResearchLead(project)) ? 'rtl' : 'ltr',
                        textAlign: isRtlText(getLocalizedResearchLead(project)) ? 'right' : 'left'
                      }}
                    >
                      Lead: {getLocalizedResearchLead(project)}
                    </p>
                    <p 
                      className="text-xs text-slate-500 line-clamp-4 leading-relaxed pt-1"
                      style={{
                        direction: isRtlText(getLocalizedResearchAbstract(project)) ? 'rtl' : 'ltr',
                        textAlign: isRtlText(getLocalizedResearchAbstract(project)) ? 'right' : 'left'
                      }}
                    >
                      {getLocalizedResearchAbstract(project)}
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">FUNDING</p>
                    <p className="text-xs font-black text-slate-800 font-mono">{project.funding}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedResearchProject(project)}
                    className="px-4 py-2 bg-[#008080]/5 hover:bg-[#008080] text-[#008080] hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>Read Abstract</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Abstract Modal */}
        {selectedResearchProject && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl relative animate-in zoom-in-95 duration-300">
              <button 
                onClick={() => setSelectedResearchProject(null)}
                className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 rotate-180" />
              </button>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="bg-[#008080]/10 text-[#008080] px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider">Research Abstract</span>
                  <span className="text-[10px] text-slate-400 font-semibold font-mono">{selectedResearchProject.citations} Citations Indexed</span>
                </div>
                
                <h2 
                  className="text-2xl font-black text-slate-900"
                  style={{
                    direction: isRtlText(getLocalizedResearchTitle(selectedResearchProject)) ? 'rtl' : 'ltr',
                    textAlign: isRtlText(getLocalizedResearchTitle(selectedResearchProject)) ? 'right' : 'left'
                  }}
                >
                  {getLocalizedResearchTitle(selectedResearchProject)}
                </h2>
                <p 
                  className="text-sm font-bold text-[#008080]"
                  style={{
                    direction: isRtlText(getLocalizedResearchLead(selectedResearchProject)) ? 'rtl' : 'ltr',
                    textAlign: isRtlText(getLocalizedResearchLead(selectedResearchProject)) ? 'right' : 'left'
                  }}
                >
                  Principal Investigator: {getLocalizedResearchLead(selectedResearchProject)}
                </p>
                
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">PROJECT SUMMARY</h4>
                  <p 
                    className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-100"
                    style={{
                      direction: isRtlText(getLocalizedResearchAbstract(selectedResearchProject)) ? 'rtl' : 'ltr',
                      textAlign: isRtlText(getLocalizedResearchAbstract(selectedResearchProject)) ? 'right' : 'left'
                    }}
                  >
                    {getLocalizedResearchAbstract(selectedResearchProject)}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-between items-center gap-2 flex-wrap">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 block uppercase font-sans">YEAR</span>
                    <span className="text-xs font-bold text-slate-700">{selectedResearchProject.year}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 block uppercase font-sans">GRANT STATUS</span>
                    <span className="text-xs font-bold text-slate-700">{selectedResearchProject.status}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedResearchProject(null)}
                  className="px-5 py-2.5 bg-[#008080] hover:bg-[#006666] text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Close Abstract
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // ADMISSIONS TAB RENDER ROUTINE
  // ==========================================
  if (activeHeaderTab === 'admissions') {
    const filteredHadiths = hadiths.filter(h => {
      const query = searchHadithQuery.toLowerCase();
      return (
        (h.text_en && h.text_en.toLowerCase().includes(query)) ||
        (h.text_ur && h.text_ur.toLowerCase().includes(query)) ||
        (h.text_ar && h.text_ar.toLowerCase().includes(query)) ||
        (h.text_hi && h.text_hi.toLowerCase().includes(query)) ||
        (h.source_en && h.source_en.toLowerCase().includes(query))
      );
    });

    return (
      <div className="max-w-[1440px] mx-auto px-4 md:px-16 py-8 animate-in fade-in duration-300">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-8 text-xs font-semibold text-slate-500">
          <a href="#" className="hover:text-[#008080] transition-colors cursor-pointer" onClick={(e) => { e.preventDefault(); setActiveHeaderTab('courses'); setActiveArticleId(null); setSelectedCategory('All'); setSearchQuery(''); }}>{t.home}</a>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#008080] font-bold">{t.navAdmissions}</span>
        </nav>

        {/* Header */}
        <div className="mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#008080]/5 rounded-full border border-[#008080]/10">
            <BookOpen className="w-4 h-4 text-[#008080]" />
            <span className="text-xs font-bold text-[#008080] tracking-wide uppercase">Daily Hadith Collection</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Prophetic Traditions & Wisdom
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
            Explore authentic and beautifully preserved narrations of the Prophet Muhammad (ﷺ). Read, search, and contemplate daily updates added by our administration.
          </p>
        </div>

        {/* Search & Filter bar */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchHadithQuery}
              onChange={(e) => setSearchHadithQuery(e.target.value)}
              placeholder="Search Hadith by narration, keywords, or source..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#008080]/10 focus:border-[#008080] outline-none transition-all"
            />
          </div>
          <div className="text-xs font-bold text-slate-500">
            Showing {filteredHadiths.length} {filteredHadiths.length === 1 ? 'Hadith' : 'Hadiths'}
          </div>
        </div>

        {/* Hadith List */}
        {filteredHadiths.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-100 rounded-3xl space-y-3">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-700">No Hadiths Found</p>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">Try checking your spelling or search using another language/keyword.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHadiths.map((h) => {
              const text = getLocalizedHadithText(h);
              const isRtl = currentLang === 'ur' || currentLang === 'ar';
              return (
                <div key={h.id} className="bg-white border border-slate-150 rounded-3xl overflow-hidden hover:shadow-md transition-all flex flex-col relative group">
                  {/* Image banner with overlays */}
                  <div className="h-44 w-full relative overflow-hidden bg-slate-100">
                    <img 
                      src={h.image_url} 
                      alt="Hadith Backdrop" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    
                    {/* Source and date badges */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2 text-white">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-[#008080] text-white px-2 py-1 rounded-md">
                        {getLocalizedHadithSource(h)}
                      </span>
                      <span className="text-[10px] bg-white/20 backdrop-blur-xs text-white px-2 py-1 rounded-md">
                        {h.published_date}
                      </span>
                    </div>
                  </div>

                  {/* Content area */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      {/* Arabic Original if available and not Arabic primary lang */}
                      {h.text_ar && currentLang !== 'ar' && (
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/80 text-center">
                          <p 
                            className="font-brand text-base text-emerald-800 leading-loose" 
                            dir="rtl"
                          >
                            {h.text_ar}
                          </p>
                        </div>
                      )}

                      {/* Localized translation */}
                      <p 
                        className={`text-slate-700 text-sm leading-relaxed ${isRtl ? 'font-brand text-base text-right' : 'text-left'}`}
                        dir={isRtl ? 'rtl' : 'ltr'}
                      >
                        "{text}"
                      </p>
                    </div>

                    {/* Copy Button */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <cite className={`text-[11px] font-bold text-slate-400 not-italic ${isRtl ? 'text-right' : 'text-left'}`}>
                        — {getLocalizedHadithSource(h)}
                      </cite>
                      <button 
                        onClick={() => {
                          const clipboardText = `${h.text_ar ? `${h.text_ar}\n\n` : ''}${text}\n\n— ${getLocalizedHadithSource(h)}`;
                          navigator.clipboard.writeText(clipboardText);
                          alert("Hadith copied to clipboard!");
                        }}
                        className="p-2 text-slate-400 hover:text-[#008080] hover:bg-[#008080]/5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                        title="Copy Hadith"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Copy</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-16 py-8">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-8 text-xs font-semibold text-slate-500">
        <a 
          href="#" 
          className="hover:text-[#008080] transition-colors cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            setActiveHeaderTab('courses');
            setActiveArticleId(null);
            setSelectedCategory('All');
            setSearchQuery('');
          }}
        >
          {t.home}
        </a>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <a 
          href="#" 
          className="hover:text-[#008080] transition-colors cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            setActiveArticleId(null);
            setSelectedCategory('All');
            setSearchQuery('');
          }}
        >
          {t.articles}
        </a>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[#008080] font-bold">
          {activeArticle ? getLocalizedTitle(activeArticle) : t.latestKnowledge}
        </span>
      </nav>

      {/* SEARCH AND CATEGORY FILTER BAR */}
      {!activeArticle && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Quick Categories filter */}
          <div className="flex flex-wrap items-center gap-2">
            {['All', ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#008080] text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat === 'All' ? t.allCategories : getLocalizedCategory(cat)}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs focus:ring-2 focus:ring-[#008080]/20 focus:border-[#008080] outline-none transition-all text-slate-800"
            />
          </div>
        </div>
      )}

      {/* READING MODE: IF ACTIVE ARTICLE SELECTED */}
      {activeArticle ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main article reader body */}
          <article 
            className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-xs space-y-6"
            style={getTextStyle(getLocalizedContent(activeArticle))}
          >
            <button
              onClick={() => setActiveArticleId(null)}
              className="flex items-center gap-2 text-xs font-bold text-[#008080] hover:underline cursor-pointer mb-4"
              style={{
                flexDirection: isRtlText(getLocalizedContent(activeArticle)) ? 'row-reverse' : 'row',
              }}
            >
              <ArrowLeft className={`w-4 h-4 ${isRtlText(getLocalizedContent(activeArticle)) ? 'rotate-180' : ''}`} />
              <span>{t.backToPortal}</span>
            </button>

            <div className="space-y-4">
              <div 
                className="flex flex-wrap items-center gap-3" 
                style={{ 
                  justifyContent: isRtlText(getLocalizedContent(activeArticle)) ? 'flex-end' : 'flex-start',
                  flexDirection: isRtlText(getLocalizedContent(activeArticle)) ? 'row-reverse' : 'row'
                }}
              >
                <span className="bg-[#008080]/10 text-[#008080] px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
                  {getLocalizedCategory(activeArticle.category)}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  {activeArticle.read_time}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  {activeArticle.published_date}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <Eye className="w-3.5 h-3.5" />
                  {activeArticle.views} views
                </span>
              </div>

              <h1 
                className="text-2xl md:text-4xl font-extrabold text-slate-900 leading-tight"
                style={getTextStyle(getLocalizedTitle(activeArticle))}
              >
                {getLocalizedTitle(activeArticle)}
              </h1>

              <p 
                className="text-xs text-slate-500 italic"
                style={{
                  textAlign: isRtlText(getLocalizedTitle(activeArticle)) ? 'right' : 'left',
                  direction: isRtlText(getLocalizedTitle(activeArticle)) ? 'rtl' : 'ltr',
                }}
              >
                By <span className="font-bold text-slate-700">{activeArticle.author}</span> • Faculty of {activeArticle.faculty} • Course ID: <span className="font-mono">{activeArticle.course_id}</span>
              </p>
            </div>

            {/* Compressed Image Frame */}
            <div className="w-full aspect-video rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-50">
              <img
                src={activeArticle.image_url}
                alt={getLocalizedTitle(activeArticle)}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Dynamic Localized Typography body */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              {renderArticleContent(getLocalizedContent(activeArticle))}
            </div>

            {/* Social Share bar */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100 text-slate-500 text-xs">
              <span>{t.copyright}</span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => alert("Link copied to clipboard!")}
                  className="p-2 hover:text-[#008080] hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
                  title="Share article"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </article>

          {/* Sidebar for reading mode: Related Articles */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#008080]" />
                <span>Related Publications</span>
              </h3>

              <div className="space-y-4">
                {getRelatedArticles(activeArticle).length > 0 ? (
                  getRelatedArticles(activeArticle).map(art => (
                    <div
                      key={art.id}
                      onClick={() => handleArticleClick(art.id)}
                      className="group cursor-pointer flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <div className="w-16 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                        <img src={art.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <h4 
                          className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-[#008080] transition-colors"
                          style={{
                            direction: isRtlText(getLocalizedTitle(art)) ? 'rtl' : 'ltr',
                            textAlign: isRtlText(getLocalizedTitle(art)) ? 'right' : 'left',
                            fontFamily: isRtlText(getLocalizedTitle(art)) 
                              ? (getLocalizedTitle(art).includes('ہے') ? '"Noto Nastaliq Urdu", serif' : '"Noto Naskh Arabic", serif')
                              : 'inherit'
                          }}
                        >
                          {getLocalizedTitle(art)}
                        </h4>
                        <span className={`text-[10px] text-slate-400 font-semibold uppercase block ${isRtlText(getLocalizedTitle(art)) ? 'text-right' : 'text-left'}`}>{art.category}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">No related articles found in this category.</p>
                )}
              </div>
            </div>

            {/* Newsletter form inside active mode too */}
            <div className="bg-[#008080] text-white rounded-3xl p-6 relative overflow-hidden shadow-md">
              <div className="relative z-10 space-y-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold leading-tight">{t.scholarsDigest}</h3>
                <p className="text-xs text-white/80 leading-relaxed">{t.scholarsDigestSub}</p>

                {newsletterSubscribed ? (
                  <div className="bg-white/10 border border-white/20 rounded-lg p-3 text-center text-xs font-bold flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FFD700]" />
                    <span>{t.newsletterSuccess}</span>
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                    <input
                      type="email"
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder={t.emailPlaceholder}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-xs text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#FFD700] transition-all"
                    />
                    <button
                      type="submit"
                      className="w-full bg-[#FFD700] text-slate-900 py-2.5 rounded-lg text-xs font-bold hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
                    >
                      {t.subscribeNow}
                    </button>
                  </form>
                )}
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
            </div>
          </aside>
        </div>
      ) : (
        /* STANDARD 3-COLUMN LAYOUT */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: FEATURED ARTICLE */}
          <section className="col-span-1 md:col-span-12 lg:col-span-3 space-y-6">
            <div className="lg:sticky lg:top-28">
              <h2 className="text-lg font-bold text-[#008080] mb-5 flex items-center gap-1.5">
                <Star className="w-5 h-5 text-[#FFD700] fill-[#FFD700]" />
                <span>{t.featured}</span>
              </h2>

              {featuredArticle && (
                <article className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-[4/3] w-full bg-slate-100 overflow-hidden">
                    <img 
                      src={featuredArticle.image_url} 
                      alt={getLocalizedTitle(featuredArticle)} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#008080]/10 text-[#008080] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                        {getLocalizedCategory(featuredArticle.category)}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                        <Clock className="w-3 h-3" />
                        {featuredArticle.read_time}
                      </span>
                    </div>

                    <h3 
                      className="text-base font-bold text-slate-800 leading-snug hover:text-[#008080] transition-colors cursor-pointer" 
                      onClick={() => handleArticleClick(featuredArticle.id)}
                      style={getTextStyle(getLocalizedTitle(featuredArticle))}
                    >
                      {getLocalizedTitle(featuredArticle)}
                    </h3>

                    <p 
                      className="text-xs text-slate-500 line-clamp-3 leading-relaxed"
                      style={getTextStyle(getCleanSnippet(getLocalizedContent(featuredArticle)))}
                    >
                      {getCleanSnippet(getLocalizedContent(featuredArticle))}
                    </p>

                    <button 
                      onClick={() => handleArticleClick(featuredArticle.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#008080] hover:underline cursor-pointer group"
                    >
                      <span>{t.readSummary}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </article>
              )}

              {/* DAILY QUOTE */}
              {(() => {
                const activeQuote = quotes.find(q => q.is_active) || quotes[0] || {
                  text_en: "The function of education is to teach one to think intensively and to think critically. Intelligence plus character - that is the goal of true education.",
                  text_ur: "تعلیم کا حقیقی مقصد انسان کو گہرائی اور سنجیدگی سے سوچنا سکھانا ہے۔ ذہانت اور بہترین کردار، یہی حقیقی تعلیم کا نشان ہے۔",
                  text_ar: "وظيفة التعليم هي تعليم المرء التفكير بشكل مكثف والتفكير بشكل نقدي. الذكاء بالإضافة إلى الشخصية - هذا هو هدف التعليم الحقيقي.",
                  text_hi: "शिक्षा का कार्य व्यक्ति को गहनता से और गंभीर रूप से सोचना सिखाना है। बुद्धिमत्ता और चरित्र ही सच्ची शिक्षा का लक्ष्य है।",
                  author_en: "Dr. Martin Luther King Jr.",
                  author_ur: "ڈاکٹر مارٹن لوتھر کنگ",
                  author_ar: "د. مارتن لوثر كينغ",
                  author_hi: "डॉ. मार्टिन लूथर किंग"
                };
                return (
                  <div className="mt-6 bg-slate-50 p-5 rounded-2xl border-l-4 border-[#008080] shadow-xs text-start">
                    <span className="text-3xl font-serif text-[#008080] block -mb-2">“</span>
                    <p 
                      className={`text-xs text-slate-600 italic leading-relaxed mb-3 ${currentLang === 'ur' || currentLang === 'ar' ? 'font-brand' : ''}`}
                      dir={currentLang === 'ur' || currentLang === 'ar' ? 'rtl' : 'ltr'}
                    >
                      "{getLocalizedQuoteText(activeQuote)}"
                    </p>
                    <cite 
                      className={`text-[10px] font-bold text-[#008080] not-italic block ${currentLang === 'ur' || currentLang === 'ar' ? 'font-brand text-right' : ''}`}
                      dir={currentLang === 'ur' || currentLang === 'ar' ? 'rtl' : 'ltr'}
                    >
                      — {getLocalizedQuoteAuthor(activeQuote)}
                    </cite>
                  </div>
                );
              })()}
            </div>
          </section>

          {/* CENTER COLUMN: LATEST ARTICLES FEED */}
          <section className="col-span-1 md:col-span-8 lg:col-span-6 space-y-6">
            <div className="border-b border-slate-200 pb-4 mb-4 flex justify-between items-center">
              <h2 className="text-xl font-extrabold text-slate-800">
                {selectedCategory !== 'All' ? `${getLocalizedCategory(selectedCategory)} ${t.articles}` : t.latestArticles}
              </h2>
              <span className="text-xs text-slate-400 font-semibold">
                {filteredArticles.length} publications
              </span>
            </div>

            {/* Articles List */}
            <div className="space-y-5">
              {filteredArticles.length > 0 ? (
                filteredArticles.slice(0, visibleCount).map((article) => (
                  <article 
                    key={article.id}
                    onClick={() => handleArticleClick(article.id)}
                    className="group flex flex-col sm:flex-row gap-5 p-4 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all cursor-pointer shadow-xs"
                  >
                    {/* Compact preview card (auto-compressed ratio) */}
                    <div className="w-full sm:w-44 h-28 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0">
                      <img 
                        src={article.image_url} 
                        alt={getLocalizedTitle(article)} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-[#008080] uppercase tracking-wider">
                          {getLocalizedCategory(article.category)}
                        </span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                        <span className="text-xs text-slate-400 font-medium">
                          {article.published_date}
                        </span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.read_time}
                        </span>
                      </div>

                      <h3 
                        className="text-base font-bold text-slate-800 leading-snug group-hover:text-[#008080] transition-colors line-clamp-2"
                        style={getTextStyle(getLocalizedTitle(article))}
                      >
                        {getLocalizedTitle(article)}
                      </h3>

                      <p 
                        className="text-xs text-slate-500 line-clamp-2 leading-relaxed"
                        style={getTextStyle(getCleanSnippet(getLocalizedContent(article)))}
                      >
                        {getCleanSnippet(getLocalizedContent(article))}
                      </p>
                    </div>
                  </article>
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                  <p className="text-sm text-slate-400 italic mb-1">{t.noResults}</p>
                  <button 
                    onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                    className="text-xs text-[#008080] underline font-bold"
                  >
                    Clear Filters
                  </button>
                </div>
              )}

              {/* Load More Articles Trigger */}
              {filteredArticles.length > visibleCount && (
                <button 
                  onClick={() => setVisibleCount(prev => prev + 3)}
                  className="w-full py-3.5 border-2 border-dashed border-slate-200 rounded-xl font-semibold text-xs text-slate-500 hover:border-[#008080] hover:text-[#008080] transition-colors cursor-pointer text-center"
                >
                  {t.loadMoreArticles}
                </button>
              )}
            </div>
          </section>

          {/* RIGHT COLUMN: SIDEBAR */}
          <aside className="col-span-1 md:col-span-4 lg:col-span-3 space-y-6">
            {/* Trending Posts Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <h3 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2 pb-3 border-b border-slate-100">
                <TrendingUp className="w-4 h-4 text-[#008080]" />
                <span>{t.trendingNow}</span>
              </h3>

              <ul className="space-y-4">
                {[...publishedArticles]
                  .sort((a, b) => {
                    const aTrend = a.is_trending ? 1 : 0;
                    const bTrend = b.is_trending ? 1 : 0;
                    if (aTrend !== bTrend) return bTrend - aTrend;
                    return b.views - a.views;
                  })
                  .slice(0, 3)
                  .map((art, index) => (
                    <li 
                      key={art.id} 
                      onClick={() => handleArticleClick(art.id)}
                      className="flex gap-3 group cursor-pointer"
                    >
                      <span className="text-2xl font-extrabold text-slate-200 group-hover:text-[#FFD700] transition-colors leading-none">
                        0{index + 1}
                      </span>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-[#008080] transition-colors">
                          {getLocalizedTitle(art)}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-semibold">
                          {art.views >= 1000 ? `${(art.views / 1000).toFixed(1)}k` : art.views} readers
                        </p>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Newsletter Sign up */}
            <div className="bg-[#008080] text-white rounded-2xl p-6 relative overflow-hidden shadow-sm">
              <div className="relative z-10 space-y-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold leading-tight">{t.scholarsDigest}</h3>
                <p className="text-xs text-white/80 leading-relaxed">
                  {t.scholarsDigestSub}
                </p>

                {newsletterSubscribed ? (
                  <div className="bg-white/10 border border-white/20 rounded-lg p-3 text-center text-xs font-bold flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FFD700]" />
                    <span>{t.newsletterSuccess}</span>
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                    <input
                      type="email"
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder={t.emailPlaceholder}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-xs text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#FFD700] transition-all"
                    />
                    <button
                      type="submit"
                      className="w-full bg-[#FFD700] text-slate-900 py-2.5 rounded-lg text-xs font-bold hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
                    >
                      {t.subscribeNow}
                    </button>
                  </form>
                )}
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
            </div>

            {/* Faculty Portal Card (Matches Screenshot style perfectly) */}
            <div 
              onClick={onNavigateToAdmin}
              className="border border-slate-200 rounded-2xl p-5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group bg-white shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#008080]/10 flex items-center justify-center text-[#008080]">
                  <School className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">{t.facultyPortal}</p>
                  <p className="text-[10px] text-slate-400 font-semibold">{t.manageCourses}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#008080] group-hover:translate-x-1 transition-all" />
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};
