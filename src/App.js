import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MicOff, Sparkles } from 'lucide-react';
import ControlPanel from './components/ControlPanel';
import TranscriptDisplay from './components/TranscriptDisplay';
import SettingsModal from './components/SettingsModal';
import { useTranslation } from './hooks/useTranslation';

function enhanceTranscription(text) {
    if (!text) return '';

    let enhanced = text.trim();
    enhanced = enhanced.charAt(0).toUpperCase() + enhanced.slice(1);
    const lastChar = enhanced.charAt(enhanced.length - 1);
    if (!['.', '!', '?'].includes(lastChar)) {
        enhanced += '.';
    }
    enhanced = enhanced.replace(/\buh\b/gi, '').replace(/\bum\b/gi, '');
    enhanced = enhanced.replace(/,([^ ])/g, ', $1');
    return enhanced;
}

function App() {
    const [sourceLanguage, setSourceLanguage] = useState('en');
    const [targetLanguage, setTargetLanguage] = useState('hi');
    const [transcript, setTranscript] = useState('');
    const [transliteratedText, setTransliteratedText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [detectedLanguage, setDetectedLanguage] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState({
        autoStart: false,
        continuous: true,
        interimResults: true,
        confidence: 0.7,
        translationService: 'mymemory',
        enableTransliteration: true
    });

    const recognitionRef = useRef(null);
    const lastResultTimeRef = useRef(Date.now());
    const silenceWatchdogTimeout = useRef(null);
    const shouldKeepListeningRef = useRef(false);

    const { translateWithTransliteration, isTranslating } = useTranslation();

    const [isListening, setIsListening] = useState(false);

    const createRecognitionInstance = useCallback(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.error('SpeechRecognition not supported');
            return null;
        }
        const recognition = new SpeechRecognition();
        recognition.continuous = settings.continuous;
        recognition.interimResults = settings.interimResults;
        recognition.lang = sourceLanguage;

        recognition.onstart = () => {
            console.log('Speech recognition started');
            setIsListening(true);
        };

        recognition.onresult = async (event) => {
            lastResultTimeRef.current = Date.now();
            resetSilenceWatchdog();

            let interim = '';
            let final = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    final += result[0].transcript + ' ';
                } else {
                    interim += result[0].transcript + ' ';
                }
            }

            if (final) {
                const enhancedFinal = enhanceTranscription(final);
                setTranscript(prev => prev + ' ' + enhancedFinal);
                try {
                    const finalResult = await translateWithTransliteration(enhancedFinal, sourceLanguage, targetLanguage);
                    if (settings.enableTransliteration) {
                        setTransliteratedText(prev => prev + ' ' + finalResult.transliterated);
                    } else {
                        setTransliteratedText('');
                    }
                    setTranslatedText(prev => (prev + ' ' + finalResult.translated).trim());
                } catch (e) {
                    console.error('Translation error on final result:', e);
                }
            }

            if (interim) {
                const enhancedInterim = enhanceTranscription(interim);
                setTranslatedText('');
                try {
                    const interimResult = await translateWithTransliteration(enhancedInterim, sourceLanguage, targetLanguage);
                    setTranslatedText(interimResult.translated);
                } catch (e) {
                    console.error('Translation error on interim result:', e);
                }
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
        };

        recognition.onend = () => {
            setIsListening(false);
            console.log('Speech recognition ended');
            if (shouldKeepListeningRef.current && !isListening) {
                setTimeout(() => {
                    try {
                        recognition.start();
                    } catch (err) {
                        console.error('Error restarting recognition:', err);
                    }
                }, 100);
            }
        };

        return recognition;
    }, [sourceLanguage, targetLanguage, settings.continuous, settings.interimResults, settings.enableTransliteration, translateWithTransliteration, isListening]);

    function resetSilenceWatchdog() {
        if (silenceWatchdogTimeout.current) clearTimeout(silenceWatchdogTimeout.current);
        silenceWatchdogTimeout.current = setTimeout(() => {
            const elapsed = Date.now() - lastResultTimeRef.current;
            if (recognitionRef.current && elapsed > 3000 && shouldKeepListeningRef.current && !isListening) {
                console.log('Silence detected, restarting recognition');
                recognitionRef.current.stop();
                setTimeout(() => recognitionRef.current.start(), 200);
            }
        }, 3500);
    }

    function startListening() {
        if (!recognitionRef.current) {
            recognitionRef.current = createRecognitionInstance();
        }
        if (isListening) return; // Prevent double start
        shouldKeepListeningRef.current = true;
        try {
            recognitionRef.current.start();
            // Recognition events update isListening state
        } catch (error) {
            console.error('Failed to start recognition:', error);
        }
    }

    function stopListening() {
        shouldKeepListeningRef.current = false;
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            // Recognition events update isListening state
        }
        if (silenceWatchdogTimeout.current) clearTimeout(silenceWatchdogTimeout.current);
    }

    function toggleListening() {
        if (shouldKeepListeningRef.current) {
            stopListening();
        } else {
            startListening();
        }
    }

    function clearTranscript() {
        setTranscript('');
        setTransliteratedText('');
        setTranslatedText('');
        setDetectedLanguage('');
    }

    useEffect(() => {
        if (settings.autoStart) {
            startListening();
        }
        return () => {
            stopListening();
        };
    }, [settings.autoStart, createRecognitionInstance]);

    function handleSourceLanguageChange(lang) {
        setSourceLanguage(lang);
        clearTranscript();
        if (recognitionRef.current) {
            recognitionRef.current.lang = lang;
        }
    }

    function handleTargetLanguageChange(lang) {
        setTargetLanguage(lang);
        if (transcript.trim()) {
            translateWithTransliteration(transcript, sourceLanguage, lang)
                .then(result => {
                    if (settings.enableTransliteration) {
                        setTransliteratedText(result.transliterated);
                    }
                    setTranslatedText(result.translated);
                })
                .catch(console.error);
        }
    }

    if (!(window.SpeechRecognition || window.webkitSpeechRecognition)) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="glass rounded-2xl p-8 max-w-md text-center">
                    <div className="text-red-400 mb-4">
                        <MicOff size={48} />
                    </div>
                    <h2 className="text-xl font-semibold text-white mb-2">Speech Recognition Not Supported</h2>
                    <p className="text-gray-300">
                        Your browser doesn't support speech recognition. Please use Chrome, Edge, or Safari.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4">
            <div className="max-w-6xl mx-auto">
                <header className="text-center mb-8">
                    <div className="text-4xl md:text-5xl font-bold text-white mb-2 mt-5 flex items-center justify-center gap-3">
                        <div className="inline-flex items-center justify-center w-12 h-12 mt-3 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-xl mb-3">
                            <Sparkles size={24} className="text-white" />
                        </div>
                        <h1 className="text-white">VoiceBridge</h1>
                    </div>
                    <p className="text-gray-300 text-lg">
                        Real-time transliteration and translation for seamless online meetings
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <ControlPanel
                            isListening={isListening}
                            onToggleListening={toggleListening}
                            sourceLanguage={sourceLanguage}
                            targetLanguage={targetLanguage}
                            onSourceLanguageChange={handleSourceLanguageChange}
                            onTargetLanguageChange={handleTargetLanguageChange}
                            onClear={clearTranscript}
                            onSettings={() => setShowSettings(true)}
                            detectedLanguage={detectedLanguage}
                            isTranslating={isTranslating}
                            enableTransliteration={settings.enableTransliteration}
                        />
                    </div>

                    <div className="lg:col-span-2">
                        <TranscriptDisplay
                            transcript={transcript}
                            transliteratedText={transliteratedText}
                            translatedText={translatedText}
                            detectedLanguage={detectedLanguage}
                            sourceLanguage={sourceLanguage}
                            targetLanguage={targetLanguage}
                            isListening={isListening}
                            enableTransliteration={settings.enableTransliteration}
                        />
                    </div>
                </div>
            </div>

            {showSettings && (
                <SettingsModal
                    settings={settings}
                    onSettingsChange={setSettings}
                    onClose={() => setShowSettings(false)}
                />
            )}
        </div>
    );
}

export default App;
