import { useState, useCallback } from 'react';
import translationService from '../utils/translationService.js';

export function useTranslation() {
    const [isTranslating, setIsTranslating] = useState(false);

    const translateWithTransliteration = useCallback(async (text, sourceLang, targetLang) => {
        if (!text || !targetLang) {
            return { original: '', transliterated: '', translated: '' };
        }

        setIsTranslating(true);

        try {
            const result = await translationService.transliterateAndTranslate(text, sourceLang, targetLang);
            return result;
        } catch (error) {
            console.error('Translation with transliteration error:', error);
            return {
                original: text,
                transliterated: text,
                translated: text
            };
        } finally {
            setIsTranslating(false);
        }
    }, []);

    const clearCaches = useCallback(() => {
        translationService.clearCaches();
    }, []);

    const getCacheStats = useCallback(() => {
        return translationService.getCacheStats();
    }, []);

    return {
        translateWithTransliteration,
        clearCaches,
        getCacheStats,
        isTranslating
    };
} 