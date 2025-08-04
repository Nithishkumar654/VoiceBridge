import React from 'react';
import {
    X,
    Settings,
    Mic,
    Globe,
    Zap,
    Shield,
    CheckCircle,
    Volume2,
    Languages,
    Clock,
    Lock,
    Eye,
    Wifi,
    Activity,
    Star,
    Type
} from 'lucide-react';

function SettingsModal({ settings, onSettingsChange, onClose }) {
    const handleSettingChange = (key, value) => {
        onSettingsChange({
            ...settings,
            [key]: value
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="glass rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl mr-3">
                            <Settings size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white">Settings</h2>
                            <p className="text-sm text-gray-400">Configure VoiceBridge</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 transform hover:scale-110"
                    >
                        <X size={20} className="text-white" />
                    </button>
                </div>

                {/* Settings Content */}
                <div className="space-y-6">
                    {/* Speech Recognition Settings */}
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <div className="flex items-center justify-center w-8 h-8 bg-blue-500/20 rounded-lg mr-3">
                                <Mic size={16} className="text-blue-400" />
                            </div>
                            <h3 className="text-lg font-medium text-white">Speech Recognition</h3>
                        </div>

                        <div className="space-y-3 pl-11">
                            <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-200">
                                <div className="flex items-center">
                                    <Volume2 size={14} className="mr-2 text-blue-400" />
                                    <span className="text-gray-300">Auto-start listening</span>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.autoStart}
                                    onChange={(e) => handleSettingChange('autoStart', e.target.checked)}
                                    className="w-4 h-4 text-primary-500 bg-white/10 border-white/20 rounded focus:ring-primary-400 focus:ring-2"
                                />
                            </label>

                            <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-200">
                                <div className="flex items-center">
                                    <Activity size={14} className="mr-2 text-blue-400" />
                                    <span className="text-gray-300">Continuous recognition</span>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.continuous}
                                    onChange={(e) => handleSettingChange('continuous', e.target.checked)}
                                    className="w-4 h-4 text-primary-500 bg-white/10 border-white/20 rounded focus:ring-primary-400 focus:ring-2"
                                />
                            </label>

                            <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-200">
                                <div className="flex items-center">
                                    <Eye size={14} className="mr-2 text-blue-400" />
                                    <span className="text-gray-300">Show interim results</span>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.interimResults}
                                    onChange={(e) => handleSettingChange('interimResults', e.target.checked)}
                                    className="w-4 h-4 text-primary-500 bg-white/10 border-white/20 rounded focus:ring-primary-400 focus:ring-2"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Transliteration Settings */}
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <div className="flex items-center justify-center w-8 h-8 bg-purple-500/20 rounded-lg mr-3">
                                <Type size={16} className="text-purple-400" />
                            </div>
                            <h3 className="text-lg font-medium text-white">Transliteration</h3>
                        </div>

                        <div className="space-y-3 pl-11">
                            <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-200">
                                <div className="flex items-center">
                                    <Type size={14} className="mr-2 text-purple-400" />
                                    <span className="text-gray-300">Enable transliteration</span>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.enableTransliteration}
                                    onChange={(e) => handleSettingChange('enableTransliteration', e.target.checked)}
                                    className="w-4 h-4 text-purple-500 bg-white/10 border-white/20 rounded focus:ring-purple-400 focus:ring-2"
                                />
                            </label>

                            <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                                <div className="flex items-center mb-2">
                                    <Type size={14} className="mr-2 text-purple-400" />
                                    <div className="text-sm text-gray-300 font-medium">Devanagari Conversion</div>
                                </div>
                                <div className="text-xs text-gray-400">
                                    Convert text to Devanagari script before translation for better accuracy
                                </div>
                            </div>

                            <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20">
                                <div className="flex items-center mb-2">
                                    <Globe size={14} className="mr-2 text-blue-400" />
                                    <div className="text-sm text-gray-300 font-medium">Supported Languages</div>
                                </div>
                                <div className="text-xs text-gray-400">
                                    Hindi, Bengali, Gujarati, Kannada, Malayalam, Marathi, Nepali, Odia, Punjabi, Sanskrit, Sinhala, Tamil, Telugu, Urdu, Arabic, Persian, Hebrew, Thai, Chinese, Japanese, Korean, Greek, Russian, Bulgarian, Ukrainian, Serbian, Macedonian, Mongolian, Georgian, Armenian, Amharic, Tigrinya, Dhivehi, Tibetan, Uyghur
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Translation Settings */}
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <div className="flex items-center justify-center w-8 h-8 bg-green-500/20 rounded-lg mr-3">
                                <Languages size={16} className="text-green-400" />
                            </div>
                            <h3 className="text-lg font-medium text-white">Translation</h3>
                        </div>

                        <div className="space-y-3 pl-11">
                            <div>
                                <label className="text-sm text-gray-300 mb-2 flex items-center">
                                    <Globe size={14} className="mr-2 text-green-400" />
                                    Translation Service
                                </label>
                                <select
                                    value={settings.translationService}
                                    onChange={(e) => handleSettingChange('translationService', e.target.value)}
                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all duration-200"
                                >
                                    <option value="mymemory" className="bg-gray-800">MyMemory (Free)</option>
                                    <option value="google" className="bg-gray-800">Google Translate</option>
                                    <option value="deepl" className="bg-gray-800">DeepL (Premium)</option>
                                    <option value="microsoft" className="bg-gray-800">Microsoft Translator</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm text-gray-300 mb-2 flex items-center">
                                    <Star size={14} className="mr-2 text-green-400" />
                                    Confidence Threshold: {Math.round(settings.confidence * 100)}%
                                </label>
                                <input
                                    type="range"
                                    min="0.1"
                                    max="1"
                                    step="0.1"
                                    value={settings.confidence}
                                    onChange={(e) => handleSettingChange('confidence', parseFloat(e.target.value))}
                                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Performance Settings */}
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <div className="flex items-center justify-center w-8 h-8 bg-yellow-500/20 rounded-lg mr-3">
                                <Zap size={16} className="text-yellow-400" />
                            </div>
                            <h3 className="text-lg font-medium text-white">Performance</h3>
                        </div>

                        <div className="space-y-3 pl-11">
                            <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
                                <div className="flex items-center mb-2">
                                    <Zap size={14} className="mr-2 text-yellow-400" />
                                    <div className="text-sm text-gray-300 font-medium">Low Latency Mode</div>
                                </div>
                                <div className="text-xs text-gray-400">
                                    Optimize for real-time translation with minimal delay
                                </div>
                            </div>

                            <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
                                <div className="flex items-center mb-2">
                                    <Clock size={14} className="mr-2 text-blue-400" />
                                    <div className="text-sm text-gray-300 font-medium">Auto-clear old text</div>
                                </div>
                                <div className="text-xs text-gray-400">
                                    Automatically remove text older than 5 minutes
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Privacy Settings */}
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <div className="flex items-center justify-center w-8 h-8 bg-purple-500/20 rounded-lg mr-3">
                                <Shield size={16} className="text-purple-400" />
                            </div>
                            <h3 className="text-lg font-medium text-white">Privacy & Security</h3>
                        </div>

                        <div className="space-y-3 pl-11">
                            <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
                                <div className="flex items-center mb-2">
                                    <CheckCircle size={14} className="mr-2 text-green-400" />
                                    <div className="text-sm text-gray-300 font-medium">Local Processing</div>
                                </div>
                                <div className="text-xs text-gray-400">
                                    Speech recognition runs locally in your browser
                                </div>
                            </div>

                            <div className="p-4 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-lg border border-red-500/20">
                                <div className="flex items-center mb-2">
                                    <Lock size={14} className="mr-2 text-red-400" />
                                    <div className="text-sm text-gray-300 font-medium">No Data Storage</div>
                                </div>
                                <div className="text-xs text-gray-400">
                                    Your conversations are not stored or logged
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status Indicators */}
                    <div className="p-4 bg-white/5 rounded-lg">
                        <h4 className="text-sm font-medium text-white mb-3 flex items-center">
                            <Activity size={14} className="mr-2 text-primary-400" />
                            System Status
                        </h4>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="flex items-center text-green-400">
                                <CheckCircle size={12} className="mr-1" />
                                <span>Speech API: Ready</span>
                            </div>
                            <div className="flex items-center text-green-400">
                                <CheckCircle size={12} className="mr-1" />
                                <span>Translation: Active</span>
                            </div>
                            <div className="flex items-center text-purple-400">
                                <Type size={12} className="mr-1" />
                                <span>Transliteration: {settings.enableTransliteration ? 'Enabled' : 'Disabled'}</span>
                            </div>
                            <div className="flex items-center text-blue-400">
                                <Wifi size={12} className="mr-1" />
                                <span>Connection: Stable</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-white/10">
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-300 hover:text-white transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
                        >
                            Save Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SettingsModal; 