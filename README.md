# VoiceBridge 🌐

**Real-time speech transliteration and translation for seamless online meetings**

VoiceBridge is a powerful React application that provides real-time speech recognition, transliteration to Devanagari script, and translation capabilities. Perfect for online meetings, language learning, and cross-cultural communication.

## 🌐 Live Demo

Try VoiceBridge instantly without any setup:

👉 **[https://voicebridge-omega.vercel.app/](https://voicebridge-omega.vercel.app/)**

🎥 **Watch the Demo Video**

<video src="Screen%20Recording%202025-08-05%20193408.mp4" controls width="100%" style="max-width: 720px;">
  Your browser does not support the video tag. [Click here to download the demo video](Screen%20Recording%202025-08-05%20193408.mp4).
</video>

## ✨ Features

### 🎤 **Speech Recognition**
- Real-time speech-to-text conversion
- Automatic language detection
- Support for 100+ languages
- Continuous listening mode
- Interim results display

### 🔤 **Transliteration**
- **Google Input Tools Integration**: Convert text to Devanagari script
- **35+ Supported Languages**: Hindi, Bengali, Gujarati, Kannada, Malayalam, Marathi, Nepali, Odia, Punjabi, Sanskrit, Sinhala, Tamil, Telugu, Urdu, Arabic, Persian, Hebrew, Thai, Chinese, Japanese, Korean, Greek, Russian, Bulgarian, Ukrainian, Serbian, Macedonian, Mongolian, Georgian, Armenian, Amharic, Tigrinya, Dhivehi, Tibetan, Uyghur
- **Smart Caching**: Optimized performance with result caching
- **Toggle Control**: Enable/disable transliteration as needed

### 🌍 **Translation**
- **MyMemory Translation API**: Free, reliable translation service
- **100+ Target Languages**: Comprehensive language support
- **Fallback System**: Automatic fallback to English if translation fails
- **Real-time Processing**: Low-latency translation pipeline

### 🎨 **Modern UI/UX**
- **Glass Morphism Design**: Beautiful, modern interface
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Live Captions**: Real-time subtitle display
- **Status Indicators**: Clear system status feedback
- **Dark Theme**: Easy on the eyes for extended use

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Modern browser with speech recognition support (Chrome, Edge, Safari)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/voicebridge.git
   cd voicebridge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📖 Usage

### Basic Workflow

1. **Select Languages**
   - Choose your source language (or use auto-detect)
   - Select your target language

2. **Enable Features**
   - Toggle transliteration on/off in settings
   - Configure speech recognition preferences

3. **Start Speaking**
   - Click the microphone button
   - Speak clearly in your chosen language
   - Watch real-time transliteration and translation

### Advanced Features

#### **Transliteration Pipeline**
```
Original Speech → Devanagari Script → Translation
     "Hello"    →     "नमस्ते"     → "नमस्कार"
```

#### **Language Detection**
- Automatic detection of 100+ languages
- Manual language selection for better accuracy
- Support for regional variants

#### **Performance Optimization**
- Smart caching for transliteration and translation
- Debounced API calls to reduce latency
- Local speech processing for privacy

## 🛠️ Technical Architecture

### **Frontend Stack**
- **React 18**: Modern React with hooks and functional components
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful, customizable icons
- **Web Speech API**: Browser-native speech recognition

### **API Integration**
- **Google Input Tools**: Transliteration service
  - Endpoint: `https://inputtools.google.com/request`
  - Supports 35+ languages with Devanagari conversion
- **MyMemory Translation**: Translation service
  - Endpoint: `https://api.mymemory.translated.net/get`
  - Free tier with 100+ language pairs

### **Key Components**
```
src/
├── components/
│   ├── ControlPanel.js      # Language selection & controls
│   ├── TranscriptDisplay.js # Multi-stage text display
│   └── SettingsModal.js     # Configuration options
├── hooks/
│   ├── useSpeechRecognition.js # Speech API integration
│   └── useTranslation.js       # Translation pipeline
├── utils/
│   ├── languages.js           # Language definitions
│   └── translationService.js  # API service layer
└── App.js                     # Main application
```

## 🎯 Supported Languages

### **Transliteration Support (35 languages)**
- **Indian Languages**: Hindi, Bengali, Gujarati, Kannada, Malayalam, Marathi, Nepali, Odia, Punjabi, Sanskrit, Sinhala, Tamil, Telugu, Urdu
- **Asian Languages**: Arabic, Persian, Hebrew, Thai, Chinese, Japanese, Korean
- **European Languages**: Greek, Russian, Bulgarian, Ukrainian, Serbian, Macedonian
- **Other Scripts**: Mongolian, Georgian, Armenian, Amharic, Tigrinya, Dhivehi, Tibetan, Uyghur

### **Translation Support (100+ languages)**
All major world languages including English, Spanish, French, German, Italian, Portuguese, Russian, Japanese, Korean, Chinese, Arabic, Hindi, and many more.

## ⚙️ Configuration

### **Settings Options**
- **Speech Recognition**: Auto-start, continuous mode, interim results
- **Transliteration**: Enable/disable, language-specific settings
- **Translation**: Service selection, confidence threshold
- **Performance**: Low latency mode, auto-clear settings

### **Browser Compatibility**
- ✅ Chrome 88+
- ✅ Edge 88+
- ✅ Safari 14.1+
- ✅ Firefox 75+ (limited speech recognition)

## 🔧 Development

### **Project Structure**
```
voicebridge/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   ├── styles/            # CSS files
│   ├── App.js             # Main app component
│   └── index.js           # Entry point
├── package.json           # Dependencies & scripts
├── tailwind.config.js     # Tailwind configuration
└── README.md              # This file
```

### **Available Scripts**
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App
```

## 🌟 Key Features

### **Real-time Processing**
- **Low Latency**: Optimized for live meetings
- **Streaming**: Continuous text updates
- **Caching**: Smart result caching for performance

### **Privacy & Security**
- **Local Processing**: Speech recognition runs in browser
- **No Data Storage**: Conversations not logged or stored
- **Secure APIs**: HTTPS-only API calls

### **Accessibility**
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: ARIA labels and semantic HTML
- **High Contrast**: Clear visual hierarchy

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### **Development Setup**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Input Tools**: For transliteration services
- **MyMemory Translation**: For translation API
- **Lucide**: For beautiful icons
- **Tailwind CSS**: For the styling framework

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/voicebridge/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/voicebridge/discussions)
- **Email**: support@voicebridge.com

---

**Made with ❤️ for seamless cross-cultural communication** 
