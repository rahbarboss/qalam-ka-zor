import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { INITIAL_ARTICLES } from "./src/initialArticles.js"; // note: built-in esm import or common ts relative resolution
import { Article } from "./src/types.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));

  // Ensure data directory and uploads directory exist
  const dataDir = path.join(process.cwd(), "data");
  const uploadsDir = path.join(dataDir, "uploads");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Serve static uploads
  app.use("/uploads", express.static(uploadsDir));

  const dbPath = path.join(dataDir, "articles.json");
  const categoriesPath = path.join(dataDir, "categories.json");
  const mediaPath = path.join(dataDir, "media.json");
  const quotesPath = path.join(dataDir, "quotes.json");
  const hadithsPath = path.join(dataDir, "hadiths.json");
  const booksPath = path.join(dataDir, "books.json");
  const researchPath = path.join(dataDir, "research.json");

  // Load quotes
  let quotes: any[] = [];
  const defaultQuotes = [
    {
      id: "q-1",
      text_en: "The function of education is to teach one to think intensively and to think critically. Intelligence plus character - that is the goal of true education.",
      text_ur: "تعلیم کا مقصد ذہن کو گہرائی سے اور تنقیدی انداز میں سوچنا سکھانا ہے۔ ذہانت کے ساتھ کردار - یہی سچی تعلیم کا مقصد ہے۔",
      text_ar: "وظيفة التعليم هي تعليم المرء التفكير بشكل مكثف والتفكير بشكل نقدي. الذكاء بالإضافة إلى الشخصية - هذا هو الهدف من التعليم الحقيقي.",
      text_hi: "शिक्षा का कार्य गहनता से और गंभीर रूप से सोचना सिखाना है। चरित्र के साथ बुद्धि - यही सच्ची शिक्षा का लक्ष्य है।",
      author_en: "Dr. Martin Luther King Jr.",
      author_ur: "ڈاکٹر مارٹن لوتھر کنگ جونیئر",
      author_ar: "د. مارتن لوثر كينغ الابن",
      author_hi: "डॉ. मार्टिन लूथर किंग जूनियर",
      is_active: true,
      published_date: "2026-06-28"
    }
  ];

  if (fs.existsSync(quotesPath)) {
    try {
      quotes = JSON.parse(fs.readFileSync(quotesPath, "utf-8"));
    } catch (e) {
      console.error("Error reading quotes file, using defaults", e);
      quotes = [...defaultQuotes];
    }
  } else {
    quotes = [...defaultQuotes];
    fs.writeFileSync(quotesPath, JSON.stringify(quotes, null, 2), "utf-8");
  }

  // Load hadiths
  let hadiths: any[] = [];
  const defaultHadiths = [
    {
      id: "h-1",
      text_en: "Actions are but by intentions and every man shall have only that which he intended.",
      text_ur: "اعمال کا دارومدار نیتوں پر ہے اور ہر انسان کے لیے وہی ہے جس کی اس نے نیت کی۔",
      text_ar: "إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى.",
      text_hi: "कर्मों का फल नियत पर निर्भर करता है और हर मनुष्य को वही मिलता है जिसकी उसने नियत की हो।",
      source_en: "Sahih al-Bukhari 1",
      source_ur: "صحیح البخاری ۱",
      source_ar: "صحيح البخاري ١",
      source_hi: "सहीह अल-बुखारी १",
      image_url: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600",
      published_date: "2026-06-29"
    }
  ];

  if (fs.existsSync(hadithsPath)) {
    try {
      hadiths = JSON.parse(fs.readFileSync(hadithsPath, "utf-8"));
    } catch (e) {
      console.error("Error reading hadiths file, using defaults", e);
      hadiths = [...defaultHadiths];
    }
  } else {
    hadiths = [...defaultHadiths];
    fs.writeFileSync(hadithsPath, JSON.stringify(hadiths, null, 2), "utf-8");
  }

  // Load classical books
  let books: any[] = [];
  const defaultBooks = [
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
      abstract_hi: "फारसी चिकित्सक इब्न सीना द्वारा पांच पुस्तकों में संकलित चिकित्सा का एक विश्वकोश। यह उस युग के सभी चिकित्सा ज्ञान का एक स्पष्ट और व्यवस्थित सारांश प्रस्तुत करता है।",
      cover_image_url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600"
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
      abstract_hi: "इतिहासलेखन, समाजशास्त्र और अर्थशास्त्र का एक ऐतिहासिक कार्य। इब्न ख़लदून सभ्यताओं के उत्थान और पतन का विश्लेषण करते हैं और असबिय्याह (सामाजिक एकजुटता) की अवधारणा का प्रस्ताव करते हैं।",
      cover_image_url: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "lib-3",
      title_en: "Diwan-e-Ghalib",
      title_ar: "ديوان غالب",
      title_ur: "دیوانِ غالب",
      title_hi: "दीवान-ए-غالب",
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
      abstract_hi: "ग़ालिब द्वारा उर्दू और फ़ारसी ग़ज़लों का प्रामाणिक संग्रह। यह उत्कृष्ट शब्दों के खेल के माध्यम से अस्तित्ववादी दर्शन, प्रेम और मानव स्वभाव की गहन खोज को प्रदर्शित करता है।",
      cover_image_url: "https://images.unsplash.com/photo-1474932430478-367db26830c1?auto=format&fit=crop&q=80&w=600"
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
      abstract_hi: "वर्तमान क्वांटम क्षेत्र सिद्धांतों के लिए आवश्यक विभेदक ज्यामिति, समूह सिद्धांत और कार्यात्मक विश्लेषण का विवरण देने वाला एक व्यापक आधुनिक स्नातक-स्तरीय पाठ।",
      cover_image_url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=600"
    }
  ];

  if (fs.existsSync(booksPath)) {
    try {
      books = JSON.parse(fs.readFileSync(booksPath, "utf-8"));
    } catch (e) {
      console.error("Error reading books file, using defaults", e);
      books = [...defaultBooks];
    }
  } else {
    books = [...defaultBooks];
    fs.writeFileSync(booksPath, JSON.stringify(books, null, 2), "utf-8");
  }

  // Load Research Projects
  let research: any[] = [];
  const defaultResearch = [
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
      abstract_hi: "यह परियोजना उर्दू नस्तालीक़ और अरबी नस्क ऐतिहासिक पांडुलिपियों पर सटीक ओसीआर और लेआउट विश्लेषण करने के लिए क्वांटम-प्रशिक्षित गहन शिक्षण नेटवर्क का उपयोग करती है। सिस्टम कच्चे पेज स्कैन को 98.4% वर्ण सटीकता के साथ खोज-अनुक्रमित यूनिकोड पाठों में परिवर्तित करता है।"
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

  if (fs.existsSync(researchPath)) {
    try {
      research = JSON.parse(fs.readFileSync(researchPath, "utf-8"));
    } catch (e) {
      console.error("Error reading research file, using defaults", e);
      research = [...defaultResearch];
    }
  } else {
    research = [...defaultResearch];
    fs.writeFileSync(researchPath, JSON.stringify(research, null, 2), "utf-8");
  }

  // Load articles
  let articles: Article[] = [];
  if (fs.existsSync(dbPath)) {
    try {
      articles = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
    } catch (e) {
      console.error("Error reading database file, using defaults", e);
      articles = [...INITIAL_ARTICLES];
    }
  } else {
    articles = [...INITIAL_ARTICLES];
    fs.writeFileSync(dbPath, JSON.stringify(articles, null, 2), "utf-8");
  }

  // Load categories
  let categories: string[] = ["Science", "History", "Culture"];
  if (fs.existsSync(categoriesPath)) {
    try {
      categories = JSON.parse(fs.readFileSync(categoriesPath, "utf-8"));
    } catch (e) {
      console.error("Error reading categories file", e);
    }
  } else {
    fs.writeFileSync(categoriesPath, JSON.stringify(categories, null, 2), "utf-8");
  }

  // Load media list
  const initialMedia = [
    {
      id: "med-1",
      name: "quantum_mechanics_architecture.jpg",
      url: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=1200",
      type: "image/jpeg",
      size: "452 KB",
      uploaded_date: "2024-10-26"
    },
    {
      id: "med-2",
      name: "silk_road_digital_remapping.jpg",
      url: "https://images.unsplash.com/photo-1464013778555-8e723c2f01f8?auto=format&fit=crop&q=80&w=1200",
      type: "image/jpeg",
      size: "890 KB",
      uploaded_date: "2024-10-24"
    },
    {
      id: "med-3",
      name: "linguistic_evolution_ai.jpg",
      url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200",
      type: "image/jpeg",
      size: "1.2 MB",
      uploaded_date: "2024-10-22"
    },
    {
      id: "med-4",
      name: "islam_on_web_layout_sample.jpg",
      url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200",
      type: "image/jpeg",
      size: "620 KB",
      uploaded_date: "2024-10-20"
    },
    {
      id: "med-5",
      name: "academic_campus_main.jpg",
      url: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1200",
      type: "image/jpeg",
      size: "710 KB",
      uploaded_date: "2024-10-18"
    }
  ];

  let mediaList: any[] = [];
  if (fs.existsSync(mediaPath)) {
    try {
      mediaList = JSON.parse(fs.readFileSync(mediaPath, "utf-8"));
    } catch (e) {
      console.error("Error reading media file", e);
      mediaList = [...initialMedia];
    }
  } else {
    mediaList = [...initialMedia];
    fs.writeFileSync(mediaPath, JSON.stringify(mediaList, null, 2), "utf-8");
  }

  // API helpers
  const saveArticles = (updatedArticles: Article[]) => {
    articles = updatedArticles;
    fs.writeFileSync(dbPath, JSON.stringify(articles, null, 2), "utf-8");
  };

  const saveCategories = (updatedCategories: string[]) => {
    categories = updatedCategories;
    fs.writeFileSync(categoriesPath, JSON.stringify(categories, null, 2), "utf-8");
  };

  const saveMediaList = (updatedMedia: any[]) => {
    mediaList = updatedMedia;
    fs.writeFileSync(mediaPath, JSON.stringify(mediaList, null, 2), "utf-8");
  };

  const saveQuotes = (updatedQuotes: any[]) => {
    quotes = updatedQuotes;
    fs.writeFileSync(quotesPath, JSON.stringify(quotes, null, 2), "utf-8");
  };

  const saveHadiths = (updatedHadiths: any[]) => {
    hadiths = updatedHadiths;
    fs.writeFileSync(hadithsPath, JSON.stringify(hadiths, null, 2), "utf-8");
  };

  const saveBooks = (updatedBooks: any[]) => {
    books = updatedBooks;
    fs.writeFileSync(booksPath, JSON.stringify(books, null, 2), "utf-8");
  };

  const saveResearch = (updatedResearch: any[]) => {
    research = updatedResearch;
    fs.writeFileSync(researchPath, JSON.stringify(research, null, 2), "utf-8");
  };

  // --- API ROUTES ---

  // Auth endpoint
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "rahbar@786" && password === "@rahbar@786") {
      res.json({ success: true, token: "admin-jwt-token-786" });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  // Get articles
  app.get("/api/articles", (req, res) => {
    res.json(articles);
  });

  // Get single article
  app.get("/api/articles/:id", (req, res) => {
    const { id } = req.params;
    const article = articles.find((a) => a.id === id);
    if (article) {
      res.json(article);
    } else {
      res.status(404).json({ message: "Article not found" });
    }
  });

  // Create article (In a real app, middleware would check headers.token === "admin-jwt-token-786")
  app.post("/api/articles", (req, res) => {
    const articleData = req.body;
    
    // Server-side default calculations (Reading Time & ID generation)
    const wordCount = (articleData.content_en || "").split(/\s+/).length || 100;
    const computedReadTime = `${Math.max(1, Math.ceil(wordCount / 150))} min read`;

    const newArticle: Article = {
      id: `art-${Date.now()}`,
      title_en: articleData.title_en || "Untitled Article",
      title_ar: articleData.title_ar || "",
      title_ur: articleData.title_ur || "",
      title_hi: articleData.title_hi || "",
      content_en: articleData.content_en || "",
      content_ar: articleData.content_ar || "",
      content_ur: articleData.content_ur || "",
      content_hi: articleData.content_hi || "",
      image_url: articleData.image_url || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200",
      category: articleData.category || "Science",
      author: articleData.author || "Faculty Principal",
      faculty: articleData.faculty || "General",
      views: 0,
      published_date: new Date().toISOString().split("T")[0],
      status: articleData.status || "Published",
      read_time: computedReadTime,
      course_id: articleData.course_id || `CRS-${Math.floor(100 + Math.random() * 900)}`,
      is_featured: !!articleData.is_featured,
      is_trending: !!articleData.is_trending
    };

    const updated = [newArticle, ...articles];
    saveArticles(updated);
    res.status(214).json(newArticle); // 214 or 201 Created
  });

  // Update article
  app.put("/api/articles/:id", (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    const index = articles.findIndex((a) => a.id === id);
    if (index === -1) {
      return res.status(404).json({ message: "Article not found" });
    }

    const current = articles[index];
    const wordCount = (updatedData.content_en || "").split(/\s+/).length || 100;
    const computedReadTime = `${Math.max(1, Math.ceil(wordCount / 150))} min read`;

    const updatedArticle: Article = {
      ...current,
      ...updatedData,
      read_time: computedReadTime
    };

    const updated = [...articles];
    updated[index] = updatedArticle;
    saveArticles(updated);
    res.json(updatedArticle);
  });

  // Delete article
  app.delete("/api/articles/:id", (req, res) => {
    const { id } = req.params;
    const index = articles.findIndex((a) => a.id === id);
    if (index === -1) {
      return res.status(404).json({ message: "Article not found" });
    }

    const updated = articles.filter((a) => a.id !== id);
    saveArticles(updated);
    res.json({ success: true, message: "Deleted successfully" });
  });

  // --- CATEGORIES ENDPOINTS ---
  app.get("/api/categories", (req, res) => {
    res.json(categories);
  });

  app.post("/api/categories", (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Category name required" });
    if (!categories.includes(name)) {
      const updated = [...categories, name];
      saveCategories(updated);
    }
    res.json(categories);
  });

  // --- QUOTES ENDPOINTS ---
  app.get("/api/quotes", (req, res) => {
    res.json(quotes);
  });

  app.post("/api/quotes", (req, res) => {
    const { text_en, text_ur, text_ar, text_hi, author_en, author_ur, author_ar, author_hi, is_active } = req.body;
    if (!text_en || !author_en) {
      return res.status(400).json({ message: "English text and author are required" });
    }

    const newQuote = {
      id: `q-${Date.now()}`,
      text_en,
      text_ur: text_ur || "",
      text_ar: text_ar || "",
      text_hi: text_hi || "",
      author_en,
      author_ur: author_ur || "",
      author_ar: author_ar || "",
      author_hi: author_hi || "",
      is_active: is_active !== undefined ? is_active : true,
      published_date: new Date().toISOString().split("T")[0]
    };

    let updatedQuotes = [...quotes];
    if (newQuote.is_active) {
      updatedQuotes = updatedQuotes.map(q => ({ ...q, is_active: false }));
    }
    updatedQuotes = [newQuote, ...updatedQuotes];
    saveQuotes(updatedQuotes);
    res.json(newQuote);
  });

  app.put("/api/quotes/:id", (req, res) => {
    const { id } = req.params;
    const { text_en, text_ur, text_ar, text_hi, author_en, author_ur, author_ar, author_hi, is_active } = req.body;

    const index = quotes.findIndex(q => q.id === id);
    if (index === -1) {
      return res.status(404).json({ message: "Quote not found" });
    }

    const existing = quotes[index];
    const updatedQuote = {
      ...existing,
      text_en: text_en !== undefined ? text_en : existing.text_en,
      text_ur: text_ur !== undefined ? text_ur : existing.text_ur,
      text_ar: text_ar !== undefined ? text_ar : existing.text_ar,
      text_hi: text_hi !== undefined ? text_hi : existing.text_hi,
      author_en: author_en !== undefined ? author_en : existing.author_en,
      author_ur: author_ur !== undefined ? author_ur : existing.author_ur,
      author_ar: author_ar !== undefined ? author_ar : existing.author_ar,
      author_hi: author_hi !== undefined ? author_hi : existing.author_hi,
      is_active: is_active !== undefined ? is_active : existing.is_active,
    };

    let updatedQuotes = [...quotes];
    if (updatedQuote.is_active && !existing.is_active) {
      updatedQuotes = updatedQuotes.map(q => q.id === id ? updatedQuote : { ...q, is_active: false });
    } else {
      updatedQuotes[index] = updatedQuote;
    }

    saveQuotes(updatedQuotes);
    res.json(updatedQuote);
  });

  app.delete("/api/quotes/:id", (req, res) => {
    const { id } = req.params;
    const index = quotes.findIndex(q => q.id === id);
    if (index === -1) {
      return res.status(404).json({ message: "Quote not found" });
    }

    const updated = quotes.filter(q => q.id !== id);
    saveQuotes(updated);
    res.json({ success: true, message: "Deleted successfully" });
  });

  // --- HADITH ENDPOINTS ---
  app.get("/api/hadith", (req, res) => {
    res.json(hadiths);
  });

  app.post("/api/hadith", (req, res) => {
    const {
      text_en, text_ur, text_ar, text_hi,
      source_en, source_ur, source_ar, source_hi,
      image_url
    } = req.body;

    if (!text_en) {
      return res.status(400).json({ message: "English text is required" });
    }

    const newHadith = {
      id: `h-${Date.now()}`,
      text_en,
      text_ur: text_ur || "",
      text_ar: text_ar || "",
      text_hi: text_hi || "",
      source_en: source_en || "Anonymous",
      source_ur: source_ur || "",
      source_ar: source_ar || "",
      source_hi: source_hi || "",
      image_url: image_url || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600",
      published_date: new Date().toISOString().split("T")[0]
    };

    const updatedHadiths = [newHadith, ...hadiths];
    saveHadiths(updatedHadiths);
    res.status(211).json(newHadith);
  });

  app.put("/api/hadith/:id", (req, res) => {
    const { id } = req.params;
    const {
      text_en, text_ur, text_ar, text_hi,
      source_en, source_ur, source_ar, source_hi,
      image_url
    } = req.body;

    const index = hadiths.findIndex(h => h.id === id);
    if (index === -1) {
      return res.status(404).json({ message: "Hadith not found" });
    }

    const existing = hadiths[index];
    const updatedHadith = {
      ...existing,
      text_en: text_en !== undefined ? text_en : existing.text_en,
      text_ur: text_ur !== undefined ? text_ur : existing.text_ur,
      text_ar: text_ar !== undefined ? text_ar : existing.text_ar,
      text_hi: text_hi !== undefined ? text_hi : existing.text_hi,
      source_en: source_en !== undefined ? source_en : existing.source_en,
      source_ur: source_ur !== undefined ? source_ur : existing.source_ur,
      source_ar: source_ar !== undefined ? source_ar : existing.source_ar,
      source_hi: source_hi !== undefined ? source_hi : existing.source_hi,
      image_url: image_url !== undefined ? image_url : existing.image_url,
    };

    const updatedHadiths = [...hadiths];
    updatedHadiths[index] = updatedHadith;
    saveHadiths(updatedHadiths);
    res.json(updatedHadith);
  });

  app.delete("/api/hadith/:id", (req, res) => {
    const { id } = req.params;
    const index = hadiths.findIndex(h => h.id === id);
    if (index === -1) {
      return res.status(404).json({ message: "Hadith not found" });
    }

    const updated = hadiths.filter(h => h.id !== id);
    saveHadiths(updated);
    res.json({ success: true, message: "Deleted successfully" });
  });

  // --- CLASSICAL BOOKS ENDPOINTS ---
  app.get("/api/books", (req, res) => {
    res.json(books);
  });

  app.post("/api/books", (req, res) => {
    const {
      title_en, title_ar, title_ur, title_hi,
      author_en, author_ar, author_ur, author_hi,
      category, year, pages, isbn,
      abstract_en, abstract_ar, abstract_ur, abstract_hi,
      cover_image_url
    } = req.body;

    if (!title_en || !author_en) {
      return res.status(400).json({ message: "English title and author are required" });
    }

    const newBook = {
      id: `lib-${Date.now()}`,
      title_en,
      title_ar: title_ar || "",
      title_ur: title_ur || "",
      title_hi: title_hi || "",
      author_en,
      author_ar: author_ar || "",
      author_ur: author_ur || "",
      author_hi: author_hi || "",
      category: category || "Science",
      year: Number(year) || new Date().getFullYear(),
      pages: Number(pages) || 100,
      isbn: isbn || "N/A",
      abstract_en: abstract_en || "",
      abstract_ar: abstract_ar || "",
      abstract_ur: abstract_ur || "",
      abstract_hi: abstract_hi || "",
      cover_image_url: cover_image_url || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600"
    };

    const updatedBooks = [newBook, ...books];
    saveBooks(updatedBooks);
    res.status(201).json(newBook);
  });

  app.put("/api/books/:id", (req, res) => {
    const { id } = req.params;
    const {
      title_en, title_ar, title_ur, title_hi,
      author_en, author_ar, author_ur, author_hi,
      category, year, pages, isbn,
      abstract_en, abstract_ar, abstract_ur, abstract_hi,
      cover_image_url
    } = req.body;

    const index = books.findIndex(b => b.id === id);
    if (index === -1) {
      return res.status(404).json({ message: "Book not found" });
    }

    const existing = books[index];
    const updatedBook = {
      ...existing,
      title_en: title_en !== undefined ? title_en : existing.title_en,
      title_ar: title_ar !== undefined ? title_ar : existing.title_ar,
      title_ur: title_ur !== undefined ? title_ur : existing.title_ur,
      title_hi: title_hi !== undefined ? title_hi : existing.title_hi,
      author_en: author_en !== undefined ? author_en : existing.author_en,
      author_ar: author_ar !== undefined ? author_ar : existing.author_ar,
      author_ur: author_ur !== undefined ? author_ur : existing.author_ur,
      author_hi: author_hi !== undefined ? author_hi : existing.author_hi,
      category: category !== undefined ? category : existing.category,
      year: year !== undefined ? Number(year) : existing.year,
      pages: pages !== undefined ? Number(pages) : existing.pages,
      isbn: isbn !== undefined ? isbn : existing.isbn,
      abstract_en: abstract_en !== undefined ? abstract_en : existing.abstract_en,
      abstract_ar: abstract_ar !== undefined ? abstract_ar : existing.abstract_ar,
      abstract_ur: abstract_ur !== undefined ? abstract_ur : existing.abstract_ur,
      abstract_hi: abstract_hi !== undefined ? abstract_hi : existing.abstract_hi,
      cover_image_url: cover_image_url !== undefined ? cover_image_url : existing.cover_image_url,
    };

    const updatedBooks = [...books];
    updatedBooks[index] = updatedBook;
    saveBooks(updatedBooks);
    res.json(updatedBook);
  });

  app.delete("/api/books/:id", (req, res) => {
    const { id } = req.params;
    const index = books.findIndex(b => b.id === id);
    if (index === -1) {
      return res.status(404).json({ message: "Book not found" });
    }

    const updated = books.filter(b => b.id !== id);
    saveBooks(updated);
    res.json({ success: true, message: "Deleted successfully" });
  });

  // --- RESEARCH PROJECTS ENDPOINTS ---
  app.get("/api/research", (req, res) => {
    res.json(research);
  });

  app.post("/api/research", (req, res) => {
    const {
      title_en, title_ar, title_ur, title_hi,
      lead_en, lead_ar, lead_ur, lead_hi,
      status, funding, year, citations,
      abstract_en, abstract_ar, abstract_ur, abstract_hi
    } = req.body;

    if (!title_en || !lead_en) {
      return res.status(400).json({ message: "English title and project lead are required" });
    }

    const newProject = {
      id: `res-${Date.now()}`,
      title_en,
      title_ar: title_ar || "",
      title_ur: title_ur || "",
      title_hi: title_hi || "",
      lead_en,
      lead_ar: lead_ar || "",
      lead_ur: lead_ur || "",
      lead_hi: lead_hi || "",
      status: status || "In Progress",
      funding: funding || "$0",
      year: Number(year) || new Date().getFullYear(),
      citations: Number(citations) || 0,
      abstract_en: abstract_en || "",
      abstract_ar: abstract_ar || "",
      abstract_ur: abstract_ur || "",
      abstract_hi: abstract_hi || ""
    };

    const updatedResearch = [newProject, ...research];
    saveResearch(updatedResearch);
    res.status(201).json(newProject);
  });

  app.put("/api/research/:id", (req, res) => {
    const { id } = req.params;
    const {
      title_en, title_ar, title_ur, title_hi,
      lead_en, lead_ar, lead_ur, lead_hi,
      status, funding, year, citations,
      abstract_en, abstract_ar, abstract_ur, abstract_hi
    } = req.body;

    const index = research.findIndex(r => r.id === id);
    if (index === -1) {
      return res.status(404).json({ message: "Research project not found" });
    }

    const existing = research[index];
    const updatedProject = {
      ...existing,
      title_en: title_en !== undefined ? title_en : existing.title_en,
      title_ar: title_ar !== undefined ? title_ar : existing.title_ar,
      title_ur: title_ur !== undefined ? title_ur : existing.title_ur,
      title_hi: title_hi !== undefined ? title_hi : existing.title_hi,
      lead_en: lead_en !== undefined ? lead_en : existing.lead_en,
      lead_ar: lead_ar !== undefined ? lead_ar : existing.lead_ar,
      lead_ur: lead_ur !== undefined ? lead_ur : existing.lead_ur,
      lead_hi: lead_hi !== undefined ? lead_hi : existing.lead_hi,
      status: status !== undefined ? status : existing.status,
      funding: funding !== undefined ? funding : existing.funding,
      year: year !== undefined ? Number(year) : existing.year,
      citations: citations !== undefined ? Number(citations) : existing.citations,
      abstract_en: abstract_en !== undefined ? abstract_en : existing.abstract_en,
      abstract_ar: abstract_ar !== undefined ? abstract_ar : existing.abstract_ar,
      abstract_ur: abstract_ur !== undefined ? abstract_ur : existing.abstract_ur,
      abstract_hi: abstract_hi !== undefined ? abstract_hi : existing.abstract_hi,
    };

    const updatedResearch = [...research];
    updatedResearch[index] = updatedProject;
    saveResearch(updatedResearch);
    res.json(updatedProject);
  });

  app.delete("/api/research/:id", (req, res) => {
    const { id } = req.params;
    const index = research.findIndex(r => r.id === id);
    if (index === -1) {
      return res.status(404).json({ message: "Research project not found" });
    }

    const updated = research.filter(r => r.id !== id);
    saveResearch(updated);
    res.json({ success: true, message: "Deleted successfully" });
  });

  // --- MEDIA ENDPOINTS ---
  app.get("/api/media", (req, res) => {
    res.json(mediaList);
  });

  app.post("/api/media", (req, res) => {
    const { file, name, type, size } = req.body;
    if (!file || !name) {
      return res.status(400).json({ message: "File data and name required" });
    }

    let fileUrl = file;
    // Decode base64 and save to actual uploads directory if it is a data URI
    const matches = file.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      const buffer = Buffer.from(matches[2], "base64");
      const cleanName = name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const filename = `${Date.now()}-${cleanName}`;
      const filePath = path.join(uploadsDir, filename);
      fs.writeFileSync(filePath, buffer);
      fileUrl = `/uploads/${filename}`;
    }

    const newMedia = {
      id: `med-${Date.now()}`,
      name: name,
      url: fileUrl,
      type: type || "image/png",
      size: size || "Unknown",
      uploaded_date: new Date().toISOString().split("T")[0]
    };

    const updated = [newMedia, ...mediaList];
    saveMediaList(updated);
    res.status(201).json(newMedia);
  });

  app.put("/api/media/:id", (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const index = mediaList.findIndex((m) => m.id === id);
    if (index === -1) {
      return res.status(404).json({ message: "Media not found" });
    }
    const updated = [...mediaList];
    updated[index] = { ...updated[index], name };
    saveMediaList(updated);
    res.json(updated[index]);
  });

  app.delete("/api/media/:id", (req, res) => {
    const { id } = req.params;
    const index = mediaList.findIndex((m) => m.id === id);
    if (index === -1) {
      return res.status(404).json({ message: "Media not found" });
    }
    const item = mediaList[index];
    // Optionally delete from disk if it was a local upload
    if (item.url.startsWith("/uploads/")) {
      const filename = item.url.replace("/uploads/", "");
      const filepath = path.join(uploadsDir, filename);
      if (fs.existsSync(filepath)) {
        try {
          fs.unlinkSync(filepath);
        } catch (e) {
          console.error("Could not delete physical file", e);
        }
      }
    }
    const updated = mediaList.filter((m) => m.id !== id);
    saveMediaList(updated);
    res.json({ success: true, message: "Media deleted successfully" });
  });

  // Image base64 uploader proxy
  app.post("/api/upload", (req, res) => {
    const { file, name } = req.body;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    
    let fileUrl = file;
    // Decode base64 and save to actual uploads directory if it is a data URI
    const matches = file.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      const buffer = Buffer.from(matches[2], "base64");
      const cleanName = (name || "upload.png").replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const filename = `${Date.now()}-${cleanName}`;
      const filePath = path.join(uploadsDir, filename);
      fs.writeFileSync(filePath, buffer);
      fileUrl = `/uploads/${filename}`;

      // Automatically register in mediaList so it shows up in Media page too!
      const newMedia = {
        id: `med-${Date.now()}`,
        name: name || filename,
        url: fileUrl,
        type: matches[1] || "image/png",
        size: `${Math.round(buffer.length / 1024)} KB`,
        uploaded_date: new Date().toISOString().split("T")[0]
      };
      const updated = [newMedia, ...mediaList];
      saveMediaList(updated);
    }
    
    res.json({ url: fileUrl });
  });

  // Increment view count
  app.post("/api/articles/:id/view", (req, res) => {
    const { id } = req.params;
    const index = articles.findIndex((a) => a.id === id);
    if (index !== -1) {
      const updated = [...articles];
      updated[index] = { ...updated[index], views: updated[index].views + 1 };
      saveArticles(updated);
      res.json({ views: updated[index].views });
    } else {
      res.status(404).json({ message: "Article not found" });
    }
  });

  // --- VITE MIDDLEWARE ---

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Running at http://localhost:${PORT}`);
  });
}

startServer();
