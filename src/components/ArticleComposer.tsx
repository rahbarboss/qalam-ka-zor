import React, { useState, useRef } from 'react';
import { Article, SupportedLanguage, LANGUAGES } from '../types';
import { TRANSLATIONS } from '../translations';
import { 
  Save, Send, Bold, Italic, Underline, List, ListOrdered, 
  Link2, Quote, Undo2, Redo2, Image as ImageIcon, UploadCloud, X,
  FileSpreadsheet, ArrowLeft, Loader2
} from 'lucide-react';

interface ArticleComposerProps {
  currentLang: SupportedLanguage;
  articleToEdit?: Article | null;
  onSave: (articleData: Partial<Article>) => Promise<void>;
  onCancel: () => void;
  categories: string[];
  onAddCategory: (newCat: string) => Promise<boolean>;
}

export const ArticleComposer: React.FC<ArticleComposerProps> = ({
  currentLang,
  articleToEdit,
  onSave,
  onCancel,
  categories,
  onAddCategory,
}) => {
  const t = TRANSLATIONS[currentLang];
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Textarea refs
  const textareaRefEn = useRef<HTMLTextAreaElement>(null);
  const textareaRefAr = useRef<HTMLTextAreaElement>(null);
  const textareaRefUr = useRef<HTMLTextAreaElement>(null);
  const textareaRefHi = useRef<HTMLTextAreaElement>(null);

  // Schema state
  const [titleEn, setTitleEn] = useState(articleToEdit?.title_en || '');
  const [titleAr, setTitleAr] = useState(articleToEdit?.title_ar || '');
  const [titleUr, setTitleUr] = useState(articleToEdit?.title_ur || '');
  const [titleHi, setTitleHi] = useState(articleToEdit?.title_hi || '');

  const [contentEn, setContentEn] = useState(articleToEdit?.content_en || '');
  const [contentAr, setContentAr] = useState(articleToEdit?.content_ar || '');
  const [contentUr, setContentUr] = useState(articleToEdit?.content_ur || '');
  const [contentHi, setContentHi] = useState(articleToEdit?.content_hi || '');

  const [imageUrl, setImageUrl] = useState(articleToEdit?.image_url || '');
  const [category, setCategory] = useState(articleToEdit?.category || 'Science');
  const [courseId, setCourseId] = useState(articleToEdit?.course_id || '');
  const [author, setAuthor] = useState(articleToEdit?.author || 'Dr. Emily Stone');
  const [faculty, setFaculty] = useState(articleToEdit?.faculty || 'Science & Tech');
  const [isFeatured, setIsFeatured] = useState(articleToEdit?.is_featured || false);
  const [isTrending, setIsTrending] = useState(articleToEdit?.is_trending || false);

  // Interactive editing state
  const [activeComposeLang, setActiveComposeLang] = useState<SupportedLanguage>('en');
  const [dragActive, setDragActive] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Add Category fields
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [isAddingCat, setIsAddingCat] = useState(false);

  const getActiveTextareaRef = () => {
    if (activeComposeLang === 'en') return textareaRefEn;
    if (activeComposeLang === 'ar') return textareaRefAr;
    if (activeComposeLang === 'ur') return textareaRefUr;
    return textareaRefHi;
  };

  // Text editor toolbar format helpers - Wrap selection or insert markup
  const handleFormat = (command: string) => {
    const ref = getActiveTextareaRef();
    if (!ref.current) return;

    const textarea = ref.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let before = text.substring(0, start);
    let after = text.substring(end);

    let formatted = selectedText;
    if (command === 'bold') {
      formatted = `**${selectedText || 'BoldText'}**`;
    } else if (command === 'italic') {
      formatted = `*${selectedText || 'ItalicText'}*`;
    } else if (command === 'underline') {
      formatted = `<u>${selectedText || 'UnderlinedText'}</u>`;
    } else if (command === 'quote') {
      formatted = `\n> "${selectedText || 'Scholarly citation here'}"\n`;
    } else if (command === 'list') {
      formatted = `\n- ${selectedText || 'Item'}`;
    }

    const newValue = before + formatted + after;

    if (activeComposeLang === 'en') setContentEn(newValue);
    else if (activeComposeLang === 'ar') setContentAr(newValue);
    else if (activeComposeLang === 'ur') setContentUr(newValue);
    else setContentHi(newValue);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + formatted.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleAddNewCategory = async () => {
    if (!newCatName.trim()) return;
    setIsAddingCat(true);
    try {
      const success = await onAddCategory(newCatName.trim());
      if (success) {
        setCategory(newCatName.trim());
        setNewCatName('');
        setShowAddCategory(false);
      } else {
        alert("Failed to add new category.");
      }
    } catch (e) {
      console.info("Error adding category:", e);
    } finally {
      setIsAddingCat(false);
    }
  };

  // Drag and Drop files handling (Auto-thumbnail compression simulator)
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Simulates high-fidelity client-side thumbnail compression
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a PNG, JPG, or JPEG image file.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleFormSubmit = async (status: 'Published' | 'Draft') => {
    setIsSaving(true);
    try {
      const fallbackTitle = titleEn || titleUr || titleAr || titleHi || "Untitled Article";
      const fallbackContent = contentEn || contentUr || contentAr || contentHi || "";

      const payload: Partial<Article> = {
        title_en: titleEn || fallbackTitle,
        title_ar: titleAr || fallbackTitle,
        title_ur: titleUr || fallbackTitle,
        title_hi: titleHi || fallbackTitle,
        content_en: contentEn || fallbackContent,
        content_ar: contentAr || fallbackContent,
        content_ur: contentUr || fallbackContent,
        content_hi: contentHi || fallbackContent,
        image_url: imageUrl || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200",
        category,
        course_id: courseId || `CRS-${Math.floor(100 + Math.random() * 900)}`,
        author,
        faculty,
        status,
        is_featured: isFeatured,
        is_trending: isTrending,
      };

      await onSave(payload);
    } catch (err) {
      console.info("Error saving article:", err);
      alert("Failed to save article");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {articleToEdit ? 'Edit Scholarly Article' : 'Compose New Article'}
            </h1>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              {t.principalEditor} Mode
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
          >
            {t.cancel}
          </button>
        </div>
      </div>

      {/* Language editing tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50/50 p-1.5 rounded-xl gap-1">
        {(Object.keys(LANGUAGES) as SupportedLanguage[]).map((langKey) => (
          <button
            key={langKey}
            type="button"
            onClick={() => setActiveComposeLang(langKey)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${
              activeComposeLang === langKey
                ? 'bg-white text-[#008080] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {LANGUAGES[langKey].name} composing
          </button>
        ))}
      </div>

      {/* Multilingual Title & Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white p-6 border border-slate-200 rounded-2xl shadow-xs">
        {/* Localization aware title input based on active tab */}
        <div className="md:col-span-8 space-y-1.5">
          <label className="block text-xs font-bold text-slate-500 uppercase">
            {t.articleTitleLabel} ({LANGUAGES[activeComposeLang].name})
          </label>
          
          {activeComposeLang === 'en' && (
            <input
              type="text"
              required
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              placeholder="Enter English Title..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3.5 text-sm text-slate-800 font-bold focus:ring-2 focus:ring-[#008080]/10 focus:border-[#008080] outline-none transition-all"
            />
          )}

          {activeComposeLang === 'ar' && (
            <input
              type="text"
              required
              value={titleAr}
              onChange={(e) => setTitleAr(e.target.value)}
              placeholder="أدخل العنوان بالعربية..."
              dir="rtl"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3.5 text-sm text-slate-800 font-bold focus:ring-2 focus:ring-[#008080]/10 focus:border-[#008080] outline-none transition-all"
            />
          )}

          {activeComposeLang === 'ur' && (
            <input
              type="text"
              required
              value={titleUr}
              onChange={(e) => setTitleUr(e.target.value)}
              placeholder="اردو میں عنوان درج کریں..."
              dir="rtl"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3.5 text-sm text-slate-800 font-bold focus:ring-2 focus:ring-[#008080]/10 focus:border-[#008080] outline-none transition-all"
            />
          )}

          {activeComposeLang === 'hi' && (
            <input
              type="text"
              required
              value={titleHi}
              onChange={(e) => setTitleHi(e.target.value)}
              placeholder="हिंदी शीर्षक दर्ज करें..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3.5 text-sm text-slate-800 font-bold focus:ring-2 focus:ring-[#008080]/10 focus:border-[#008080] outline-none transition-all"
            />
          )}
        </div>

        {/* Category Selection */}
        <div className="md:col-span-4 space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-500 uppercase">
              {t.academicCategoryLabel}
            </label>
            <button
              type="button"
              onClick={() => setShowAddCategory(!showAddCategory)}
              className="text-[10px] font-bold text-[#008080] hover:underline"
            >
              {showAddCategory ? "Select Existing" : "+ Add Category"}
            </button>
          </div>

          {showAddCategory ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Category (e.g. Astronomy)"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#008080]"
              />
              <button
                type="button"
                onClick={handleAddNewCategory}
                disabled={isAddingCat}
                className="px-3 bg-[#008080] hover:bg-[#006666] text-white font-bold text-xs rounded-lg transition-colors"
              >
                {isAddingCat ? "Saving..." : "Add"}
              </button>
            </div>
          ) : (
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3.5 text-xs text-slate-700 font-semibold focus:ring-2 focus:ring-[#008080]/10 focus:border-[#008080] outline-none transition-all cursor-pointer"
            >
              {categories.map((catName) => (
                <option key={catName} value={catName}>
                  {catName}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Editor Main Board */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs space-y-3">
        {/* formatting commands toolbar */}
        <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 border-b border-slate-200">
          <button
            type="button"
            onClick={() => handleFormat('bold')}
            className="p-2 hover:bg-slate-200 rounded text-slate-600 transition-colors"
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleFormat('italic')}
            className="p-2 hover:bg-slate-200 rounded text-slate-600 transition-colors"
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleFormat('underline')}
            className="p-2 hover:bg-slate-200 rounded text-slate-600 transition-colors"
            title="Underline"
          >
            <Underline className="w-4 h-4" />
          </button>
          <div className="w-[1px] h-6 bg-slate-200 mx-1" />
          <button
            type="button"
            onClick={() => handleFormat('list')}
            className="p-2 hover:bg-slate-200 rounded text-slate-600 transition-colors"
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleFormat('quote')}
            className="p-2 hover:bg-slate-200 rounded text-slate-600 transition-colors"
            title="Blockquote"
          >
            <Quote className="w-4 h-4" />
          </button>
        </div>

        {/* Localized Content Textarea editor body */}
        <div className="p-4">
          <label className="block text-[10px] font-bold text-[#008080] uppercase tracking-wider mb-2">
            Active Editor Language Body ({LANGUAGES[activeComposeLang].name})
          </label>
          
          {activeComposeLang === 'en' && (
            <textarea
              ref={textareaRefEn}
              value={contentEn}
              onChange={(e) => setContentEn(e.target.value)}
              placeholder="Start composing your English academic article here..."
              className="w-full min-h-[250px] p-4 bg-slate-50/50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#008080]/10 focus:border-[#008080] text-sm text-slate-800 leading-relaxed transition-all"
            />
          )}

          {activeComposeLang === 'ar' && (
            <textarea
              ref={textareaRefAr}
              value={contentAr}
              onChange={(e) => setContentAr(e.target.value)}
              placeholder="ابدأ كتابة مقالك الأكاديمي باللغة العربية هنا..."
              dir="rtl"
              className="w-full min-h-[250px] p-4 bg-slate-50/50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#008080]/10 focus:border-[#008080] text-sm text-slate-800 leading-relaxed transition-all"
            />
          )}

          {activeComposeLang === 'ur' && (
            <textarea
              ref={textareaRefUr}
              value={contentUr}
              onChange={(e) => setContentUr(e.target.value)}
              placeholder="اپنا علمی مضمون یہاں اردو زبان میں تحریر کریں..."
              dir="rtl"
              className="w-full min-h-[250px] p-4 bg-slate-50/50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#008080]/10 focus:border-[#008080] text-sm text-slate-800 leading-relaxed transition-all"
            />
          )}

          {activeComposeLang === 'hi' && (
            <textarea
              ref={textareaRefHi}
              value={contentHi}
              onChange={(e) => setContentHi(e.target.value)}
              placeholder="अपनी शैक्षणिक सामग्री यहाँ हिंदी में लिखना शुरू करें..."
              className="w-full min-h-[250px] p-4 bg-slate-50/50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#008080]/10 focus:border-[#008080] text-sm text-slate-800 leading-relaxed transition-all"
            />
          )}
        </div>
      </div>

      {/* Meta credentials (Author, Course Code, Faculty) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 border border-slate-200 rounded-2xl shadow-xs">
        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-400 uppercase">Author Name</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#008080]"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-400 uppercase">Faculty / Department</label>
          <input
            type="text"
            value={faculty}
            onChange={(e) => setFaculty(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#008080]"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-400 uppercase">Course ID / Code</label>
          <input
            type="text"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            placeholder="e.g. CS-402"
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#008080]"
          />
        </div>
      </div>

      {/* Special Promotion Settings */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Placement & Promotions</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50/50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="mt-0.5 rounded text-[#008080] focus:ring-[#008080] h-4 w-4 border-slate-300"
            />
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-800">Featured Article</span>
              <p className="text-[10px] text-slate-400">Mark this article as the main featured banner on the home screen.</p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50/50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={isTrending}
              onChange={(e) => setIsTrending(e.target.checked)}
              className="mt-0.5 rounded text-[#008080] focus:ring-[#008080] h-4 w-4 border-slate-300"
            />
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-800">Trending Now</span>
              <p className="text-[10px] text-slate-400">Pin this article to the "Trending Now" sidebar list.</p>
            </div>
          </label>
        </div>
      </div>

      {/* Drag & Drop Hero Image Field with live Compression thumbnail preview */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-500 uppercase">
          {t.heroImageLabel}
        </label>
        
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
            dragActive 
              ? 'border-[#008080] bg-[#008080]/5' 
              : 'border-slate-200 bg-white hover:border-[#008080] group'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <UploadCloud className="w-12 h-12 text-[#008080] group-hover:scale-110 transition-transform mb-3" />
          <p className="text-sm font-bold text-slate-800 mb-1">{t.dropzoneTitle}</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            {t.dropzoneSub}
          </p>
          <button
            type="button"
            className="mt-4 px-4 py-2 border border-[#008080] text-[#008080] font-semibold text-xs rounded-lg hover:bg-[#008080]/5 transition-colors"
          >
            {t.selectFiles}
          </button>
        </div>

        {/* Live Compression Thumbnail Preview Panel */}
        {imageUrl && (
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-12 rounded-lg overflow-hidden border border-slate-300 shadow-sm flex-shrink-0">
                <img src={imageUrl} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">compressed_scholarly_thumbnail.webp</p>
                <p className="text-[10px] text-green-600 font-bold flex items-center gap-1">
                  <span>Auto-optimized 1200x630 (95% ratio)</span>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setImageUrl('')}
              className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Editor Action buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-slate-200">
        <button
          type="button"
          onClick={() => handleFormSubmit('Draft')}
          disabled={isSaving}
          className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4.5 h-4.5" />}
          <span>{t.saveAsDraft}</span>
        </button>

        <button
          type="button"
          onClick={() => handleFormSubmit('Published')}
          disabled={isSaving}
          className="w-full sm:w-auto px-10 py-3 bg-[#008080] hover:bg-[#006666] text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4.5 h-4.5" />}
          <span>{t.publishNow}</span>
        </button>
      </div>
    </div>
  );
};
