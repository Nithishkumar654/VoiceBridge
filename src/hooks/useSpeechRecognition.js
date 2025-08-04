import { useState, useEffect, useCallback, useRef } from 'react';

export function useSpeechRecognition({ onResult, onError, continuous = true, interimResults = true }) {
    const [isSupported, setIsSupported] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    const createRecognitionInstance = useCallback(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (SpeechRecognition) {
            const recognitionInstance = new SpeechRecognition();

            // Configure recognition settings
            recognitionInstance.continuous = continuous;
            recognitionInstance.interimResults = interimResults;
            recognitionInstance.lang = 'en-US'; // Default language, will be auto-detected

            // Set up event handlers
            recognitionInstance.onresult = (event) => {
                const result = event.results[event.results.length - 1];
                const transcript = result[0].transcript;
                const confidence = result[0].confidence;
                const isFinal = result.isFinal;

                onResult({
                    transcript,
                    confidence,
                    isFinal
                });
            };

            recognitionInstance.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
                onError(event.error);
            };

            recognitionInstance.onend = () => {
                console.log('Speech recognition ended');
                setIsListening(false);
                // Clear the reference so a new instance can be created
                recognitionRef.current = null;
            };

            recognitionInstance.onstart = () => {
                console.log('Speech recognition started');
                setIsListening(true);
            };

            return recognitionInstance;
        }
        return null;
    }, [continuous, interimResults, onResult, onError]);

    useEffect(() => {
        // Check for browser support
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        setIsSupported(!!SpeechRecognition);
        
        if (!SpeechRecognition) {
            console.error('Speech recognition not supported in this browser');
        }
    }, []);

    const startListening = useCallback(() => {
        if (!isSupported) return;

        try {
            // Create a new instance if one doesn't exist or if the previous one ended
            if (!recognitionRef.current) {
                recognitionRef.current = createRecognitionInstance();
            }

            if (recognitionRef.current) {
                recognitionRef.current.start();
            }
        } catch (error) {
            console.error('Error starting speech recognition:', error);
            setIsListening(false);
            onError(error);
        }
    }, [isSupported, createRecognitionInstance, onError]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListening) {
            try {
                recognitionRef.current.stop();
            } catch (error) {
                console.error('Error stopping speech recognition:', error);
                onError(error);
            }
        }
    }, [isListening, onError]);

    const setLanguage = useCallback((language) => {
        if (recognitionRef.current && isSupported) {
            recognitionRef.current.lang = language;
        }
    }, [isSupported]);

    return {
        isSupported,
        isListening,
        startListening,
        stopListening,
        setLanguage
    };
} 