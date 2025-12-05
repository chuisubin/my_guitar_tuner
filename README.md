# My Guitar Tuner 🎸

A React Native Guitar Tuner app with a **Vintage/Analog** aesthetic, built with Expo.

## 🎸 Features

- Real-time pitch detection using device microphone
- Analog VU meter-style interface
- Vintage/retro design inspired by classic audio equipment
- Support for all standard guitar tunings
- Visual and haptic feedback when in tune

## 🎨 Design

This app embraces a **vintage/analog aesthetic** with:
- Cream and dark leather color schemes
- Brass/gold accents and borders
- Skeuomorphic design elements (physical-looking buttons, shadows, textures)
- Serif and monospaced typography
- Classic VU meter-style tuning display

See [`design_system.md`](./design_system.md) for complete design guidelines.

## 📁 Project Structure

```
my_guitar_tuner/
├── app/                      # Expo Router screens
│   ├── _layout.tsx          # Root layout
│   ├── index.tsx            # Main screen
│   └── modal.tsx            # Modal screen
├── assets/                   # Images, fonts, textures
│   └── images/
├── components/              # React components
│   ├── tuner/
│   │   └── guitar.tsx       # Main tuner component
│   ├── ui/                  # UI components
│   └── themed-*.tsx         # Themed components
├── constants/               # App constants
│   └── theme.ts            # Theme configuration
├── hooks/                   # Custom React hooks
├── scripts/                 # Build/utility scripts
├── design_system.md        # Design system documentation
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS) or Android Emulator (for Android)

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

### Running the App

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 📦 Key Dependencies

- **expo** - React Native framework
- **expo-audio** - Audio recording and processing
- **expo-router** - File-based routing
- **fft-js** - Fast Fourier Transform for pitch detection
- **react-native-reanimated** - Smooth animations

## 🎯 Audio Processing

The app uses:
1. **expo-audio** to access device microphone
2. **FFT (Fast Fourier Transform)** to analyze audio frequencies
3. Real-time pitch detection algorithm to identify musical notes
4. Frequency-to-note conversion based on A4 = 440Hz standard

## 🎨 Customization

### Changing Colors

Edit `constants/theme.ts` or refer to the vintage color palette in `design_system.md`:

```javascript
export const VintageColors = {
  cream: '#F5F5DC',
  darkLeather: '#2C1E18',
  brass: '#D4AF37',
  deepRed: '#8B0000',
  fadedBlack: '#333333',
};
```

### Changing Fonts

Install Google Fonts via Expo:

```bash
npx expo install expo-font @expo-google-fonts/playfair-display
```

## 📱 Platform Support

- ✅ iOS
- ✅ Android
- ⚠️ Web (limited audio support)

## 🔒 Permissions

The app requires microphone access:
- **iOS**: Microphone permission handled automatically
- **Android**: Microphone permission in `app.json`

## 🛠️ Development

### Linting

```bash
npm run lint
```

### Reset Project

```bash
npm run reset-project
```

## 📚 Learn More

- [Expo documentation](https://docs.expo.dev/)
- [React Native documentation](https://reactnative.dev/)
- [Design System](./design_system.md)

## 📄 License

MIT

---

**Built with ❤️ using React Native and Expo**
