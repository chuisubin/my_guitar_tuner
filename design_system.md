# Guitar Tuner App - Design System

## Project Overview
I am building a Guitar Tuner app in React Native. The UI has a **Vintage/Analog** aesthetic, inspired by classic analog VU meters and vintage audio equipment from the mid-20th century.

## Design Philosophy
The app embraces **skeuomorphism** - creating digital interfaces that mimic physical objects. Every element should feel tactile, physical, and reminiscent of analog audio equipment from the 1950s-1970s era.

---

## Color Palette

### Primary Colors
- **Background (Light Mode)**: `#F5F5DC` - Cream/Off-white (resembles aged paper)
- **Background (Dark Mode)**: `#2C1E18` - Dark Leather Texture (warm brown-black)
- **Accent Primary**: `#D4AF37` - Brass/Gold (for borders, highlights, metallic accents)
- **Accent Secondary**: `#8B0000` - Deep Red (for the tuner needle and active indicators)
- **Text Primary**: `#333333` - Faded Black (vintage typewriter style)
- **Text Secondary**: `#666666` - Medium Gray (for less prominent text)

### Supporting Colors
- **Meter Background**: `#1A1410` - Very Dark Brown (meter housing)
- **Tick Marks**: `#D4AF37` - Brass/Gold (meter graduations)
- **Shadow/Depth**: `rgba(0, 0, 0, 0.4)` - Semi-transparent black for depth
- **Button Inactive**: `#8B7355` - Muted Brown
- **Button Active**: `#D4AF37` - Brass/Gold
- **Success Indicator**: `#2F5233` - Deep Vintage Green
- **Warning Indicator**: `#8B4513` - Saddle Brown

---

## Typography

### Font Families
- **Primary Font**: `'Courier New'` or `monospace` - For technical readings and numbers
- **Secondary Font**: `'Playfair Display'` or `serif` - For titles and labels
- **Alternative**: `'Georgia'` or system serif fonts as fallback

### Font Sizes (React Native)
```javascript
fontSize: {
  title: 32,        // Main screen title
  heading: 24,      // Section headings
  body: 16,         // Standard text
  note: 48,         // Large note display (e.g., "E2")
  label: 14,        // Small labels
  caption: 12,      // Fine print, helper text
}
```

### Font Weights
- **Regular**: `'400'` - Body text
- **Medium**: `'500'` - Emphasized text
- **Bold**: `'700'` - Headings and important labels

---

## UI Components

### 1. Tuner Meter (Main Component)
**Description**: The centerpiece - an analog VU meter showing pitch accuracy.

**Visual Design**:
- **Shape**: Arc/semicircle (180° or 270°)
- **Tick Marks**: Brass-colored graduations radiating from center
- **Needle**: Deep red (#8B0000) pointer that rotates to indicate tuning
- **Background**: Dark meter housing (#1A1410) with subtle wood grain texture
- **Labels**: Gold text showing "Flat", "In Tune", "Sharp" zones
- **Glow Effect**: Subtle shadow/glow around the needle for depth

**StyleSheet Example**:
```javascript
meterContainer: {
  width: 300,
  height: 200,
  backgroundColor: '#1A1410',
  borderRadius: 20,
  borderWidth: 3,
  borderColor: '#D4AF37',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.4,
  shadowRadius: 12,
  elevation: 10,
}
```

### 2. Buttons
**Description**: Physical, pressable buttons with vintage styling.

**Visual Design**:
- **Shape**: Rounded rectangles with heavy shadows
- **Colors**: Brass/Gold when active, muted brown when inactive
- **Texture**: Subtle gradient to simulate metallic surface
- **States**: 
  - Pressed: Inset shadow (appears pushed in)
  - Default: Raised with strong shadow
  - Disabled: Desaturated, flat appearance

**StyleSheet Example**:
```javascript
button: {
  backgroundColor: '#D4AF37',
  paddingHorizontal: 30,
  paddingVertical: 15,
  borderRadius: 10,
  borderWidth: 2,
  borderColor: '#B8941F',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 6,
  elevation: 8,
}

buttonPressed: {
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.2,
  shadowRadius: 2,
  elevation: 2,
  transform: [{ translateY: 2 }],
}
```

### 3. Note Display
**Description**: Large, clear display showing the detected note.

**Visual Design**:
- **Font**: Monospaced (Courier New), very large size (48-64)
- **Color**: Faded black (#333333) on cream background
- **Background**: Slightly recessed panel effect
- **Border**: Subtle brass border

**StyleSheet Example**:
```javascript
noteDisplay: {
  fontSize: 56,
  fontFamily: 'Courier New',
  color: '#333333',
  textAlign: 'center',
  backgroundColor: '#E8E3D3',
  paddingVertical: 20,
  paddingHorizontal: 40,
  borderRadius: 8,
  borderWidth: 2,
  borderColor: '#D4AF37',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.15,
  shadowRadius: 4,
  elevation: -2, // Inset effect
}
```

### 4. Frequency Display
**Description**: Small technical readout showing Hz value.

**Visual Design**:
- **Font**: Monospaced, small size
- **Style**: LED-style display or vintage seven-segment look
- **Color**: Amber/orange glow on dark background

---

## Layout & Spacing

### Container
```javascript
container: {
  flex: 1,
  backgroundColor: '#F5F5DC', // Cream background
  alignItems: 'center',
  justifyContent: 'center',
  padding: 20,
}
```

### Spacing Scale
- **xs**: 4
- **sm**: 8
- **md**: 16
- **lg**: 24
- **xl**: 32
- **xxl**: 48

---

## Textures & Effects

### Background Textures
- **Paper Texture**: Use `ImageBackground` with a subtle paper grain image
- **Wood Grain**: For meter housing, use subtle wood texture overlay
- **Leather**: For dark mode, optional leather texture

### Shadow Guidelines
- **Heavy Shadows**: All primary interactive elements (buttons, meter)
- **Inset Shadows**: For recessed displays (note, frequency)
- **Glow Effects**: Subtle glow around active elements (needle, LED displays)

### Implementation Example
```javascript
// Use ImageBackground for textures
<ImageBackground 
  source={require('./assets/paper-texture.png')} 
  style={styles.container}
  imageStyle={{ opacity: 0.3 }}
>
  {/* App content */}
</ImageBackground>
```

---

## Component Hierarchy

```
App
├── MainScreen (with paper texture background)
│   ├── Header (Title with serif font)
│   ├── TunerMeter (Analog VU meter)
│   │   ├── MeterArc (SVG or Canvas)
│   │   ├── TickMarks (Brass graduations)
│   │   ├── Needle (Red pointer)
│   │   └── Labels (Flat/In Tune/Sharp)
│   ├── NoteDisplay (Large monospaced note)
│   ├── FrequencyDisplay (Small Hz readout)
│   └── ControlButtons
│       ├── StartButton
│       └── SettingsButton
```

---

## Animation Guidelines

### Needle Movement
- **Duration**: 200-300ms
- **Easing**: `easeInOut` (smooth, analog feel)
- **Behavior**: Should feel weighted, like a physical pointer

### Button Press
- **Duration**: 100ms
- **Effect**: Scale down slightly + shadow reduction (pressing in)

### Note Change
- **Duration**: 150ms
- **Effect**: Subtle fade transition between notes

---

## Accessibility Considerations

While maintaining vintage aesthetic:
- **Contrast**: Ensure text meets WCAG AA standards (4.5:1 ratio)
- **Touch Targets**: Minimum 44x44 points for buttons
- **Alternative Text**: Provide screen reader support for visual elements
- **Haptic Feedback**: Use vibration when note is in tune

---

## Implementation Notes

### StyleSheet vs. NativeWind
- **Recommended**: Use React Native `StyleSheet` for precise control over shadows and elevations
- **Optional**: NativeWind/Tailwind can be used for layout, but custom styles needed for skeuomorphic effects

### Custom Fonts
To use Google Fonts like 'Playfair Display':
```bash
npx expo install expo-font @expo-google-fonts/playfair-display
```

Then load in app:
```javascript
import { useFonts, PlayfairDisplay_400Regular, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
```

### SVG for Meter
Consider using `react-native-svg` for the analog meter arc and needle:
```bash
npx expo install react-native-svg
```

---

## Design References

**Visual Inspiration**:
- Vintage VU meters (1950s-1970s audio equipment)
- Analog multimeters and gauges
- Art Deco instrument panels
- Classic radio faces
- Antique typewriters

**Color Mood**: Warm, nostalgic, tactile, physical

**Overall Feel**: Like holding a vintage piece of audio equipment, with weight and substance to every interaction.

---

## Quick Reference: Key Colors

```javascript
export const VintageColors = {
  cream: '#F5F5DC',
  darkLeather: '#2C1E18',
  brass: '#D4AF37',
  deepRed: '#8B0000',
  fadedBlack: '#333333',
  meterHousing: '#1A1410',
  vintageGreen: '#2F5233',
  saddleBrown: '#8B4513',
};
```

---

**Last Updated**: 2025-12-05
**Version**: 1.0
**Project**: My Guitar Tuner (React Native + Expo)
