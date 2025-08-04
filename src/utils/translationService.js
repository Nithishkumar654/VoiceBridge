import { 
  supportsTransliteration, 
  getTransliterationCode, 
  isTranslationSupported 
} from './languages.js';

class TranslationService {
  constructor() {
    this.transliterationCache = new Map();
    this.translationCache = new Map();
  }

  // Transliterate text to Devanagari using Google Input Tools API
  async transliterateToDevanagari(text, sourceLanguage) {
    if (!text || !sourceLanguage) {
      return text;
    }

    // Check if language supports transliteration
    if (!supportsTransliteration(sourceLanguage)) {
      return text;
    }

    // Check cache first
    const cacheKey = `${text}_${sourceLanguage}`;
    if (this.transliterationCache.has(cacheKey)) {
      return this.transliterationCache.get(cacheKey);
    }

    try {
      const transliterationCode = getTransliterationCode(sourceLanguage);
      if (!transliterationCode) {
        return text;
      }

      const url = `https://inputtools.google.com/request?text=${encodeURIComponent(text)}&itc=${transliterationCode}&num=1`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Transliteration failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data[0] === 'SUCCESS' && data[1] && data[1][0] && data[1][0][1]) {
        const transliteratedText = data[1][0][1][0];
        
        // Cache the result
        this.transliterationCache.set(cacheKey, transliteratedText);
        
        console.log(`Transliterated: "${text}" -> "${transliteratedText}" (${sourceLanguage})`);
        return transliteratedText;
      } else {
        console.warn('Transliteration returned no results, returning original text');
        return text;
      }
    } catch (error) {
      console.error('Transliteration error:', error);
      return text; // Return original text if transliteration fails
    }
  }

  // Translate text using MyMemory Translation API
  async translateText(text, sourceLanguage, targetLanguage) {
    if (!text || !targetLanguage) {
      return text;
    }

    // Don't translate if source and target are the same
    if (sourceLanguage === targetLanguage) {
      return text;
    }

    // Check if target language is supported
    if (!isTranslationSupported(targetLanguage)) {
      console.warn(`Target language ${targetLanguage} not supported for translation`);
      return text;
    }

    // Check cache first
    const cacheKey = `${text}_${sourceLanguage}_${targetLanguage}`;
    if (this.translationCache.has(cacheKey)) {
      return this.translationCache.get(cacheKey);
    }

    try {
      const langPair = sourceLanguage ? `${sourceLanguage}|${targetLanguage}` : `auto|${targetLanguage}`;
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Translation failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.responseStatus === 200) {
        const translatedText = data.responseData.translatedText;
        
        // Cache the result
        this.translationCache.set(cacheKey, translatedText);
        
        console.log(`Translated: "${text}" -> "${translatedText}" (${sourceLanguage || 'auto'} -> ${targetLanguage})`);
        return translatedText;
      } else {
        throw new Error(`Translation error: ${data.responseDetails}`);
      }
    } catch (error) {
      console.error('Translation error:', error);
      
      // Fallback: try with English as source if the original source failed
      if (sourceLanguage && sourceLanguage !== 'en') {
        try {
          const fallbackUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLanguage}`;
          const fallbackResponse = await fetch(fallbackUrl);
          
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            if (fallbackData.responseStatus === 200) {
              const fallbackText = fallbackData.responseData.translatedText;
              this.translationCache.set(cacheKey, fallbackText);
              return fallbackText;
            }
          }
        } catch (fallbackError) {
          console.error('Fallback translation failed:', fallbackError);
        }
      }
      
      return text; // Return original text if translation fails
    }
  }

  // Complete pipeline: transliterate to Devanagari then translate
  async transliterateAndTranslate(text, sourceLanguage, targetLanguage) {
    if (!text) {
      return { original: '', transliterated: '', translated: '' };
    }

    try {
      // Step 1: Transliterate to Devanagari if supported
      const transliteratedText = await this.transliterateToDevanagari(text, sourceLanguage);
      
      // Step 2: Translate the transliterated text
      const translatedText = await this.translateText(transliteratedText, sourceLanguage, targetLanguage);
      
      return {
        original: text,
        transliterated: transliteratedText,
        translated: translatedText
      };
    } catch (error) {
      console.error('Transliteration and translation pipeline error:', error);
      return {
        original: text,
        transliterated: text,
        translated: text
      };
    }
  }

  // Clear caches
  clearCaches() {
    this.transliterationCache.clear();
    this.translationCache.clear();
  }

  // Get cache statistics
  getCacheStats() {
    return {
      transliterationCacheSize: this.transliterationCache.size,
      translationCacheSize: this.translationCache.size
    };
  }
}

// Create and export a singleton instance
const translationService = new TranslationService();
export default translationService; 