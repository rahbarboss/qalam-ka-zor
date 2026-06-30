import { Article } from '../types';
import { INITIAL_ARTICLES } from '../initialArticles';

export const FALLBACK_ARTICLES: Article[] = INITIAL_ARTICLES;

export const FALLBACK_QUOTES = [
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

export const FALLBACK_HADITHS = [
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

export const FALLBACK_BOOKS = [
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
    abstract_ur: "تاریخ، عمرانیات اور معاشیات کا ایک شاہکار۔ جامع اور اچھوتے انداز میں اس کتاب میں تہذیبوں کے عروج و زوال کا تجزیہ کیا گیا ہے۔",
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
    abstract_ur: "اعلیٰ تعلیم کے طلبہ کے لیے تالیف کردہ ایک جدید ترین کتاب جس میں تفریقی جیومیٹری، گروپ تھیوری، اور فنکشنل انیلیسس جیسے اہم ریاضیاتی موضوعات کی تفصیل دی گئی ہے جو جدید کوانٹم فیلڈ تھیوری کے لیے ناگزیر ہے۔",
    abstract_hi: "वर्तमान क्वांटम क्षेत्र सिद्धांतों के लिए आवश्यक विभेदक ज्यामिति, समूह सिद्धांत और कार्यात्मक विश्लेषण का विवरण देने वाला एक व्यापक आधुनिक स्नातक-स्तरीय पाठ।",
    cover_image_url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=600"
  }
];

export const FALLBACK_RESEARCH = [
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

export const FALLBACK_CATEGORIES = ["Science", "History", "Culture"];

export const FALLBACK_MEDIA = [
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
