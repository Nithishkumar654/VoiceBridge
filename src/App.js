import React, { useState, useEffect, useRef, useCallback } from "react";
import { MicOff, Sparkles } from "lucide-react";
import ControlPanel from "./components/ControlPanel";
import TranscriptDisplay from "./components/TranscriptDisplay";
import SettingsModal from "./components/SettingsModal";
import { useTranslation } from "./hooks/useTranslation";

function enhanceTranscription(text) {
    if (!text) return "";
    let enhanced = text.trim();
    enhanced = enhanced.charAt(0).toUpperCase() + enhanced.slice(1);
    const lastChar = enhanced.charAt(enhanced.length - 1);
    if (![".", "!", "?"].includes(lastChar)) {
        enhanced += ".";
    }
    enhanced = enhanced.replace(/\buh\b/gi, "").replace(/\bum\b/gi, "");
    enhanced = enhanced.replace(/,([^ ])/g, ", $1");
    return enhanced;
}

function App() {
    const storedSourceLang = localStorage.getItem('sourceLanguage') || 'en';
    const storedTargetLang = localStorage.getItem('targetLanguage') || 'hi';

    const [sourceLanguage, setSourceLanguage] = useState(storedSourceLang);
    const [targetLanguage, setTargetLanguage] = useState(storedTargetLang);

    const [transcript, setTranscript] = useState("");
    const [interim, setInterim] = useState("");
    const [transliteratedText, setTransliteratedText] = useState("");
    const [translatedText, setTranslatedText] = useState("");
    const [detectedLanguage, setDetectedLanguage] = useState("");
    const [showSettings, setShowSettings] = useState(false);

    const [settings, setSettings] = useState({
        autoStart: false,
        continuous: true,
        interimResults: true,
        confidence: 0.7,
        translationService: "mymemory",
        enableTransliteration: true,
    });

    const recognitionRef = useRef(null);
    const shouldKeepListeningRef = useRef(false);

    const { translateWithTransliteration, isTranslating } = useTranslation();
    const [isListening, setIsListening] = useState(false);

    const interimTimeoutRef = useRef(null);

    // --- Recognition Setup ---
    const createRecognitionInstance = useCallback(() => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.error("SpeechRecognition is not supported on this browser.");
            return null;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = settings.continuous;
        recognition.interimResults = settings.interimResults;
        recognition.lang = sourceLanguage;

        recognition.onstart = () => {
            setIsListening(true);
        };


        recognition.onresult = async (event) => {
            let interimTranscript = "";
            let finalTranscript = "";
            console.log(event);
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    finalTranscript += result[0].transcript + " ";
                } else {
                    interimTranscript += result[0].transcript + " ";
                }
            }
            setInterim(interimTranscript);

            if (finalTranscript.trim()) {
                const enhancedFinal = enhanceTranscription(finalTranscript);
                setTranscript((prev) => prev + enhancedFinal + " ");
                try {
                    const finalResult = await translateWithTransliteration(
                        enhancedFinal,
                        sourceLanguage,
                        targetLanguage
                    );
                    setTranslatedText(
                        (prev) => (prev + finalResult.translated + " ").trim()
                    );
                    if (settings.enableTransliteration) {
                        setTransliteratedText(
                            (prev) => prev + finalResult.transliterated + " "
                        );
                    } else {
                        setTransliteratedText("");
                    }
                } catch (error) {
                    console.error("Translation error on final:", error);
                }
            }

            if (interimTranscript.trim()) {
                if (interimTimeoutRef.current) clearTimeout(interimTimeoutRef.current);
                interimTimeoutRef.current = setTimeout(async () => {
                    try {
                        const interimResult = await translateWithTransliteration(
                            interimTranscript,
                            sourceLanguage,
                            targetLanguage
                        );
                        setTranslatedText(interimResult.translated);
                    } catch {
                        // ignore
                    }
                }, 1000); // 1 second debounce
            }
        };

        recognition.onerror = (event) => {
            console.error("Recognition error:", event.error);
        };

        recognition.onend = () => {
            setIsListening(false);
            if (shouldKeepListeningRef.current) {
                setTimeout(() => {
                    try {
                        recognition.start();
                    } catch { }
                }, 100);
            }
        };

        return recognition;
    }, [
        settings.continuous,
        settings.interimResults,
        settings.enableTransliteration,
        sourceLanguage,
        targetLanguage,
        translateWithTransliteration,
    ]);

    function startListening() {
        if (!recognitionRef.current) recognitionRef.current = createRecognitionInstance();
        if (isListening) return;
        shouldKeepListeningRef.current = true;
        try {
            recognitionRef.current.start();
        } catch (error) {
            console.error("Failed to start recognition:", error);
        }
    }

    function stopListening() {
        shouldKeepListeningRef.current = false;
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    }

    function toggleListening() {
        if (isListening) stopListening();
        else startListening();
    }

    function clearTranscript() {
        setTranscript("");
        setInterim("");
        setTransliteratedText("");
        setTranslatedText("");
        setDetectedLanguage("");
    }

    useEffect(() => {
        if (settings.autoStart) startListening();
        return () => stopListening();
        // Don't add createRecognitionInstance to deps, it will cause unwanted resets
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settings.autoStart]);

    function handleSourceLanguageChange(lang) {
        localStorage.setItem('sourceLanguage', lang);
        window.location.reload();
    }

    function handleTargetLanguageChange(lang) {
        localStorage.setItem('targetLanguage', lang);
        window.location.reload();
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
                        Your browser doesn't support speech recognition. Please use Chrome,
                        Edge, or Safari.
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
                        Real-time transliteration and translation for seamless meetings
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
                            interim={interim}
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
