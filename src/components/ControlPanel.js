import React from 'react';
import {
    Mic,
    MicOff,
    Settings,
    Globe,
    Volume2,
    VolumeX,
    RotateCcw,
    Languages,
    Zap,
    Wifi,
    WifiOff,
    Activity,
    CheckCircle,
    AlertCircle,
    Sparkles,
    ArrowRight,
    Type
} from 'lucide-react';
import { supportedLanguages, transliterationLanguages } from '../utils/languages';

function ControlPanel({
    isListening,
    onToggleListening,
    sourceLanguage,
    targetLanguage,
    onSourceLanguageChange,
    onTargetLanguageChange,
    // isMuted,
    // onToggleMute,
    onClear,
    onSettings,
    detectedLanguage,
    isTranslating,
    enableTransliteration
}) {
    return (
        <div className="glass rounded-2xl p-6 space-y-6">
            {/* Header with App Icon */}
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-xl mb-3">
                    <Sparkles size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">VoiceBridge</h3>
                <p className="text-sm text-gray-400">Real-time Translation</p>
            </div>

            {/* Main Control Button */}
            <div className="text-center">
                <button
                    onClick={onToggleListening}
                    disabled={isTranslating}
                    className={`relative m-auto w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 ${isListening
                        ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/50'
                        : 'bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/50'
                        } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                >
                    {isListening ? (
                        <>
                            <MicOff size={36} className="text-white" />
                            {isListening && (
                                <div className="absolute inset-0 rounded-full pulse-ring bg-red-400 opacity-75"></div>
                            )}
                        </>
                    ) : (
                        <Mic size={36} className="text-white" />
                    )}
                </button>

                <p className="text-white mt-4 font-medium text-lg">
                    {isListening ? 'Stop Listening' : 'Start Listening'}
                </p>

                {isTranslating && (
                    <div className="mt-3 flex items-center justify-center text-sm text-yellow-300 animate-pulse">
                        <Activity size={16} className="mr-2 animate-spin" />
                        Translating...
                    </div>
                )}
            </div>

            {/* Language Selection */}
            <div className="space-y-4">
                {/* Source Language */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-white flex items-center">
                        <Languages size={16} className="mr-2 text-blue-400" />
                        Source Language
                    </label>
                    <div className="relative">
                        <Globe size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <select
                            value={sourceLanguage}
                            onChange={(e) => onSourceLanguageChange(e.target.value)}
                            className="w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                        >
                            <option value="auto" className="bg-gray-800 text-white">Auto Detect</option>
                            {Object.entries(supportedLanguages).map(([code, name]) => (
                                <option key={code} value={code} className="bg-gray-800 text-white">
                                    {name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Arrow */}
                <div className="flex justify-center">
                    <ArrowRight size={20} className="text-gray-400" />
                </div>

                {/* Target Language */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-white flex items-center">
                        <Languages size={16} className="mr-2 text-green-400" />
                        Target Language
                    </label>
                    <div className="relative">
                        <Globe size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <select
                            value={targetLanguage}
                            onChange={(e) => onTargetLanguageChange(e.target.value)}
                            className="w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
                        >
                            {Object.entries(supportedLanguages).map(([code, name]) => (
                                <option key={code} value={code} className="bg-gray-800 text-white">
                                    {name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Transliteration Status */}
                {enableTransliteration && sourceLanguage !== 'auto' && transliterationLanguages[sourceLanguage] && (
                    <div className="text-center p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
                        <div className="flex items-center justify-center mb-1">
                            <Type size={14} className="text-purple-400 mr-2" />
                            <p className="text-xs text-gray-300">Transliteration Enabled</p>
                        </div>
                        <p className="text-white text-sm font-medium">
                            {transliterationLanguages[sourceLanguage]} → Devanagari
                        </p>
                    </div>
                )}
            </div>

            {/* Detected Language Display */}
            {detectedLanguage && sourceLanguage === 'auto' && (
                <div className="text-center p-4 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-lg border border-primary-500/30">
                    <div className="flex items-center justify-center mb-2">
                        <CheckCircle size={16} className="text-green-400 mr-2" />
                        <p className="text-sm text-gray-300">Detected Language</p>
                    </div>
                    <p className="text-white font-semibold">
                        {supportedLanguages[detectedLanguage] || detectedLanguage}
                    </p>
                </div>
            )}

            {/* Control Buttons */}
            <div className="space-y-3">
                {/* <button
                    onClick={onToggleMute}
                    className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 rounded-lg text-white transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                    {isMuted ? (
                        <>
                            <VolumeX size={18} className="mr-2 text-red-400" />
                            Unmute Audio
                        </>
                    ) : (
                        <>
                            <Volume2 size={18} className="mr-2 text-green-400" />
                            Mute Audio
                        </>
                    )}
                </button> */}

                <button
                    onClick={onClear}
                    className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 rounded-lg text-white transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                    <RotateCcw size={18} className="mr-2 text-blue-400" />
                    Clear Transcript
                </button>

                <button
                    onClick={onSettings}
                    className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 rounded-lg text-white transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                    <Settings size={18} className="mr-2 text-purple-400" />
                    Settings
                </button>
            </div>

            {/* Status Indicators */}
            <div className="space-y-3 p-4 bg-white/5 rounded-lg">
                <h4 className="text-sm font-medium text-white mb-3 flex items-center">
                    <Activity size={14} className="mr-2 text-primary-400" />
                    System Status
                </h4>

                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-300 flex items-center">
                            {isListening ? <Wifi size={14} className="mr-2 text-green-400" /> : <WifiOff size={14} className="mr-2 text-gray-400" />}
                            Connection:
                        </span>
                        <span className={`font-medium flex items-center ${isListening ? 'text-green-400' : 'text-gray-400'}`}>
                            {isListening ? <CheckCircle size={14} className="mr-1" /> : <AlertCircle size={14} className="mr-1" />}
                            {isListening ? 'Active' : 'Idle'}
                        </span>
                    </div>

                    {/* <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-300 flex items-center">
                            {isMuted ? <VolumeX size={14} className="mr-2 text-red-400" /> : <Volume2 size={14} className="mr-2 text-green-400" />}
                            Audio:
                        </span>
                        <span className={`font-medium ${isMuted ? 'text-red-400' : 'text-green-400'}`}>
                            {isMuted ? 'Muted' : 'Active'}
                        </span>
                    </div> */}

                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-300 flex items-center">
                            <Zap size={14} className="mr-2 text-yellow-400" />
                            Translation:
                        </span>
                        <span className={`font-medium ${isTranslating ? 'text-yellow-400' : 'text-green-400'}`}>
                            {isTranslating ? 'Processing' : 'Ready'}
                        </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-300 flex items-center">
                            <Type size={14} className="mr-2 text-purple-400" />
                            Transliteration:
                        </span>
                        <span className={`font-medium ${enableTransliteration ? 'text-purple-400' : 'text-gray-400'}`}>
                            {enableTransliteration ? 'Enabled' : 'Disabled'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ControlPanel; 