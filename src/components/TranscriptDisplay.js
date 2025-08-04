import React, { useEffect, useRef } from 'react';
import {
    MessageSquare,
    Languages,
    Mic,
    Sparkles,
    Globe,
    Play,
    Volume2,
    Zap,
    CheckCircle,
    Type,
    ArrowRight
} from 'lucide-react';
import { supportedLanguages, transliterationLanguages } from '../utils/languages';

function TranscriptDisplay({
    transcript,
    transliteratedText,
    translatedText,
    detectedLanguage,
    sourceLanguage,
    targetLanguage,
    isListening,
    enableTransliteration
}) {
    const transcriptRef = useRef(null);
    const transliteratedRef = useRef(null);
    const translatedRef = useRef(null);

    // Auto-scroll to bottom when new content is added
    useEffect(() => {
        if (transcriptRef.current) {
            transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
        }
    }, [transcript]);

    useEffect(() => {
        if (transliteratedRef.current) {
            transliteratedRef.current.scrollTop = transliteratedRef.current.scrollHeight;
        }
    }, [transliteratedText]);

    useEffect(() => {
        if (translatedRef.current) {
            translatedRef.current.scrollTop = translatedRef.current.scrollHeight;
        }
    }, [translatedText]);

    return (
        <div className="space-y-6">
            {/* Original Transcript */}
            <div className="glass rounded-2xl p-6">
                <div className="flex items-center mb-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg mr-3">
                        <MessageSquare size={18} className="text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Original Speech</h3>
                    {detectedLanguage && sourceLanguage === 'auto' && (
                        <div className="ml-auto flex items-center px-3 py-1 bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                            <Globe size={12} className="mr-1" />
                            {supportedLanguages[detectedLanguage] || detectedLanguage}
                        </div>
                    )}
                    {sourceLanguage !== 'auto' && (
                        <div className="ml-auto flex items-center px-3 py-1 bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                            <Globe size={12} className="mr-1" />
                            {supportedLanguages[sourceLanguage] || sourceLanguage}
                        </div>
                    )}
                </div>

                <div
                    ref={transcriptRef}
                    className="h-48 overflow-y-auto p-4 bg-gradient-to-br from-black/20 to-black/10 rounded-lg border border-white/10 backdrop-blur-sm"
                >
                    {transcript ? (
                        <div className="space-y-2">
                            <p className="text-white leading-relaxed whitespace-pre-wrap">
                                {transcript}
                                {isListening && (
                                    <span className="inline-block w-2 h-4 bg-blue-400 ml-1 animate-pulse rounded"></span>
                                )}
                            </p>
                            {isListening && (
                                <div className="flex items-center text-xs text-blue-300">
                                    <Mic size={12} className="mr-1 animate-pulse" />
                                    Listening...
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <MessageSquare size={32} className="text-gray-500 mx-auto mb-2" />
                            <p className="text-gray-400 italic">
                                Start speaking to see your transcript here...
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Transliterated Text (only show if transliteration is enabled and text exists) */}
            {/*enableTransliteration && transliteratedText && (
                <>
                    <div className="flex justify-center">
                        <div className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30">
                            <Type size={16} className="text-purple-400 mr-2" />
                            <span className="text-purple-300 text-sm font-medium">Transliteration</span>
                            <ArrowRight size={16} className="text-purple-400 ml-2" />
                        </div>
                    </div>

                    <div className="glass rounded-2xl p-6">
                        <div className="flex items-center mb-4">
                            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg mr-3">
                                <Type size={18} className="text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-white">Devanagari Script</h3>
                            {sourceLanguage !== 'auto' && transliterationLanguages[sourceLanguage] && (
                                <div className="ml-auto flex items-center px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30">
                                    <Type size={12} className="mr-1" />
                                    {transliterationLanguages[sourceLanguage]}
                                </div>
                            )}
                        </div>

                        <div
                            ref={transliteratedRef}
                            className="h-48 overflow-y-auto p-4 bg-gradient-to-br from-black/20 to-black/10 rounded-lg border border-white/10 backdrop-blur-sm"
                        >
                            <div className="space-y-2">
                                <p className="text-purple-300 leading-relaxed whitespace-pre-wrap font-medium">
                                    {transliteratedText}
                                    {isListening && (
                                        <span className="inline-block w-2 h-4 bg-purple-400 ml-1 animate-pulse rounded"></span>
                                    )}
                                </p>
                                {isListening && (
                                    <div className="flex items-center text-xs text-purple-300">
                                        <Type size={12} className="mr-1 animate-pulse" />
                                        Transliterating...
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )*/}

            {/* Translation Arrow */}
            {(transliteratedText || transcript) && (
                <div className="flex justify-center">
                    <div className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full border border-green-500/30">
                        <Languages size={16} className="text-green-400 mr-2" />
                        <span className="text-green-300 text-sm font-medium">Translation</span>
                        <ArrowRight size={16} className="text-green-400 ml-2" />
                    </div>
                </div>
            )}

            {/* Translated Text */}
            <div className="glass rounded-2xl p-6">
                <div className="flex items-center mb-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg mr-3">
                        <Languages size={18} className="text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Translation</h3>
                    {targetLanguage && (
                        <div className="ml-auto flex items-center px-3 py-1 bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-300 text-xs rounded-full border border-green-500/30">
                            <Sparkles size={12} className="mr-1" />
                            {supportedLanguages[targetLanguage] || targetLanguage}
                        </div>
                    )}
                </div>

                <div
                    ref={translatedRef}
                    className="h-48 overflow-y-auto p-4 bg-gradient-to-br from-black/20 to-black/10 rounded-lg border border-white/10 backdrop-blur-sm"
                >
                    {translatedText ? (
                        <div className="space-y-2">
                            <p className="text-green-300 leading-relaxed whitespace-pre-wrap">
                                {translatedText}
                                {isListening && (
                                    <span className="inline-block w-2 h-4 bg-green-400 ml-1 animate-pulse rounded"></span>
                                )}
                            </p>
                            {isListening && (
                                <div className="flex items-center text-xs text-green-300">
                                    <Zap size={12} className="mr-1 animate-pulse" />
                                    Translating...
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <Languages size={32} className="text-gray-500 mx-auto mb-2" />
                            <p className="text-gray-400 italic">
                                Translation will appear here...
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Live Caption Mode */}
            {isListening && (transcript || translatedText) && (
                <div className="glass rounded-2xl p-6 border-2 border-gradient-to-r bg-gradient-to-r from-primary-500/10 to-secondary-500/10">
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-4">
                            <div className="flex items-center justify-center w-6 h-6 bg-red-500 rounded-full mr-3">
                                <Play size={12} className="text-white" />
                            </div>
                            <span className="text-sm text-white font-semibold tracking-wider">LIVE CAPTIONS</span>
                            <div className="flex items-center ml-3">
                                <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></div>
                                <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {transcript && (
                                <div className="text-white text-sm bg-black/40 px-4 py-3 rounded-lg border border-white/10 backdrop-blur-sm">
                                    <div className="flex items-center mb-1">
                                        <Volume2 size={12} className="mr-2 text-blue-400" />
                                        <span className="text-xs text-gray-400">Original</span>
                                    </div>
                                    {transcript.split(' ').slice(-8).join(' ')}
                                </div>
                            )}

                            {transliteratedText && enableTransliteration && (
                                <div className="text-purple-300 text-sm bg-black/40 px-4 py-3 rounded-lg border border-white/10 backdrop-blur-sm">
                                    <div className="flex items-center mb-1">
                                        <Type size={12} className="mr-2 text-purple-400" />
                                        <span className="text-xs text-gray-400">Devanagari</span>
                                    </div>
                                    {transliteratedText.split(' ').slice(-8).join(' ')}
                                </div>
                            )}

                            {translatedText && (
                                <div className="text-green-300 text-sm bg-black/40 px-4 py-3 rounded-lg border border-white/10 backdrop-blur-sm">
                                    <div className="flex items-center mb-1">
                                        <Sparkles size={12} className="mr-2 text-green-400" />
                                        <span className="text-xs text-gray-400">Translated</span>
                                    </div>
                                    {translatedText.split(' ').slice(-8).join(' ')}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Instructions */}
            {!transcript && !translatedText && (
                <div className="glass rounded-2xl p-8 text-center">
                    <div className="text-gray-300 mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-2xl mb-4">
                            <Sparkles size={32} className="text-primary-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-3">Ready to Translate</h3>
                        <p className="text-sm text-gray-400 max-w-md mx-auto">
                            Click the microphone button to start listening. Your speech will be automatically detected, transliterated to Devanagari, and translated in real-time.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div className="p-4 bg-gradient-to-br from-white/5 to-white/2 rounded-xl border border-white/10">
                            <div className="flex items-center justify-center w-8 h-8 bg-primary-500/20 rounded-lg mb-3 mx-auto">
                                <Mic size={16} className="text-primary-400" />
                            </div>
                            <div className="text-primary-300 font-medium mb-1">1. Start Listening</div>
                            <div className="text-gray-400 text-xs">Click the microphone button</div>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-white/5 to-white/2 rounded-xl border border-white/10">
                            <div className="flex items-center justify-center w-8 h-8 bg-secondary-500/20 rounded-lg mb-3 mx-auto">
                                <Volume2 size={16} className="text-secondary-400" />
                            </div>
                            <div className="text-secondary-300 font-medium mb-1">2. Speak Clearly</div>
                            <div className="text-gray-400 text-xs">Talk in your preferred language</div>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-white/5 to-white/2 rounded-xl border border-white/10">
                            <div className="flex items-center justify-center w-8 h-8 bg-purple-500/20 rounded-lg mb-3 mx-auto">
                                <Type size={16} className="text-purple-400" />
                            </div>
                            <div className="text-purple-300 font-medium mb-1">3. Transliterate</div>
                            <div className="text-gray-400 text-xs">Convert to Devanagari script</div>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-white/5 to-white/2 rounded-xl border border-white/10">
                            <div className="flex items-center justify-center w-8 h-8 bg-green-500/20 rounded-lg mb-3 mx-auto">
                                <Languages size={16} className="text-green-400" />
                            </div>
                            <div className="text-green-300 font-medium mb-1">4. View Translation</div>
                            <div className="text-gray-400 text-xs">See real-time captions</div>
                        </div>
                    </div>

                    {/* Status Indicators */}
                    <div className="mt-6 p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center justify-center space-x-6 text-xs">
                            <div className="flex items-center text-green-400">
                                <CheckCircle size={12} className="mr-1" />
                                <span>Ready</span>
                            </div>
                            <div className="flex items-center text-blue-400">
                                <Globe size={12} className="mr-1" />
                                <span>Auto-detect</span>
                            </div>
                            <div className="flex items-center text-purple-400">
                                <Type size={12} className="mr-1" />
                                <span>Transliteration</span>
                            </div>
                            <div className="flex items-center text-yellow-400">
                                <Zap size={12} className="mr-1" />
                                <span>Real-time</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TranscriptDisplay; 