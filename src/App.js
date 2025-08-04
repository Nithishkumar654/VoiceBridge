import React, { useState, useEffect } from 'react';
import { MicOff, Sparkles } from 'lucide-react';
import ControlPanel from './components/ControlPanel';
import TranscriptDisplay from './components/TranscriptDisplay';
import SettingsModal from './components/SettingsModal';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useTranslation } from './hooks/useTranslation';

function App() {
    const [sourceLanguage, setSourceLanguage] = useState('auto');
    const [targetLanguage, setTargetLanguage] = useState('en');
    const [transcript, setTranscript] = useState('');
    const [transliteratedText, setTransliteratedText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [detectedLanguage, setDetectedLanguage] = useState('');
    // const [isMuted, setIsMuted] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState({
        autoStart: false,
        continuous: true,
        interimResults: true,
        confidence: 0.7,
        translationService: 'mymemory',
        enableTransliteration: true
    });

    const { startListening, stopListening, isListening, isSupported } = useSpeechRecognition({
        onResult: handleSpeechResult,
        onError: handleSpeechError,
        continuous: settings.continuous,
        interimResults: settings.interimResults
    });

    const { translateWithTransliteration, isTranslating } = useTranslation();

    function handleSpeechResult(result) {
        console.log(result);
        if (result.isFinal) {
            const newTranscript = result.transcript;
            setTranscript(prev => prev + ' ' + newTranscript);
            processSpeechWithTransliteration(newTranscript);
        }
    }

    function handleSpeechError(error) {
        console.error('Speech recognition error:', error);
    }

    async function processSpeechWithTransliteration(text) {
        try {
            let actualSourceLanguage = sourceLanguage;

            if (sourceLanguage === 'auto') {
                const detected = detectLanguage(text);
                actualSourceLanguage = detected;
                setDetectedLanguage(detected);
            } else {
                setDetectedLanguage(sourceLanguage);
            }

            const result = await translateWithTransliteration(
                text,
                actualSourceLanguage,
                targetLanguage
            );

            if (settings.enableTransliteration) {
                setTransliteratedText(prev => prev + ' ' + result.transliterated);
            }

            setTranslatedText(prev => prev + ' ' + result.translated);
        } catch (error) {
            console.error('Translation error:', error);
        }
    }

    function detectLanguage(text) {
        const lowerText = text.toLowerCase();

        if (/[а-я]/.test(lowerText)) return 'ru';
        if (/[ñáéíóúü]/.test(lowerText)) return 'es';
        if (/[àâäéèêëïîôöùûüÿç]/.test(lowerText)) return 'fr';
        if (/[äöüß]/.test(lowerText)) return 'de';
        if (/[àèéìíîòóù]/.test(lowerText)) return 'it';
        if (/[ãâáàçéêíóôõú]/.test(lowerText)) return 'pt';
        if (/[ąćęłńóśźż]/.test(lowerText)) return 'pl';
        if (/[åäö]/.test(lowerText)) return 'sv';
        if (/[æøå]/.test(lowerText)) return 'da';
        if (/[åæø]/.test(lowerText)) return 'no';
        if (/[áéíóúýðþæö]/.test(lowerText)) return 'is';
        if (/[áéíóöőúüű]/.test(lowerText)) return 'hu';
        if (/[áčďéěíňóřšťúůýž]/.test(lowerText)) return 'cs';
        if (/[क-ह]/.test(lowerText)) return 'hi';
        if (/[క-హ]/.test(lowerText)) return 'te';
        if (/[அ-ஹ]/.test(lowerText)) return 'ta';
        if (/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(lowerText)) return 'ko';
        if (/[一-龯]/.test(lowerText)) return 'zh';
        if (/[ぁ-んァ-ン]/.test(lowerText)) return 'ja';
        if (/[א-ת]/.test(lowerText)) return 'he';
        if (/[ก-๙]/.test(lowerText)) return 'th';
        if (/[ا-ي]/.test(lowerText)) return 'ar';

        return 'en';
    }

    function toggleListening() {
        isListening ? stopListening() : startListening();
    }

    function clearTranscript() {
        setTranscript('');
        setTransliteratedText('');
        setTranslatedText('');
        setDetectedLanguage('');
    }

    // function toggleMute() {
    //     setIsMuted(prev => !prev);
    // }

    function handleSourceLanguageChange(lang) {
        setSourceLanguage(lang);
        clearTranscript();
    }

    function handleTargetLanguageChange(lang) {
        setTargetLanguage(lang);
        if (transcript.trim()) {
            processSpeechWithTransliteration(transcript);
        }
    }

    useEffect(() => {
        if (settings.autoStart && isSupported) {
            toggleListening();
        }
    }, []);

    if (!isSupported) {
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
                            // isMuted={isMuted}
                            // onToggleMute={toggleMute}
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
