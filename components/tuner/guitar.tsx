import { processAudioBuffer } from '@/utils/tunerUtils';
import * as Linking from 'expo-linking';
import React, { useEffect, useState } from 'react';
import { Alert, Animated, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// @ts-ignore - Buffer polyfill for React Native
import { Buffer } from 'buffer';

// 在全局注入 Buffer (React Native 需要)
if (typeof global.Buffer === 'undefined') {
  global.Buffer = Buffer;
}

// 動態導入 react-native-live-audio-stream (僅在原生平台使用)
let LiveAudioStream: any = null;
if (Platform.OS !== 'web') {
  try {
    LiveAudioStream = require('react-native-live-audio-stream').default;
  } catch (e) {
    console.warn('LiveAudioStream not available on this platform');
  }
}

interface TunerData {
  detectedFreq: number;
  note: string;
  targetFreq: number;
  stringNum: number;
  cents: number;
  isPerfect: boolean;
}

export default function Guitar() {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [tunerData, setTunerData] = useState<TunerData | null>(null);
  const needleRotation = new Animated.Value(0);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      // expo-audio 在新版本中使用不同的權限 API
      // 對於錄音權限，我們直接嘗試啟動音頻流，如果失敗則提示
      setPermissionGranted(true);
      
      // 如果使用 expo-av，可以這樣：
      // const { status } = await Audio.requestPermissionsAsync();
      // if (status === 'granted') {
      //   setPermissionGranted(true);
      // }
    } catch (error) {
      console.error('Error checking permissions:', error);
      Alert.alert(
        'Microphone Permission Required',
        'This app needs microphone access to tune your guitar. Please grant permission in settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Go to Settings', onPress: () => Linking.openSettings() },
        ]
      );
    }
  };

  const startListening = async () => {
    if (!permissionGranted) {
      checkPermissions();
      return;
    }

    if (!LiveAudioStream) {
      Alert.alert('Error', 'Audio stream not available on this platform');
      return;
    }

    try {
      // 初始化麥克風設定
      const options = {
        sampleRate: 44100,  // 與 YIN 算法保持一致
        channels: 1,        // 單聲道
        bitsPerSample: 16,  // 16-bit 采樣
        audioSource: 6,     // 6 = VOICE_RECOGNITION (Android)
        bufferSize: 4096    // Buffer 大小，平衡延遲與準確度
      };

      LiveAudioStream.init(options);

      // 監聽音頻流
      LiveAudioStream.on('data', (data: string) => {
        try {
          // 將 base64 數據轉為 Float32Array
          const buffer = Buffer.from(data, 'base64');
          
          // 將 16-bit PCM 轉為 Float32Array
          const int16Array = new Int16Array(buffer.buffer);
          const float32Array = new Float32Array(int16Array.length);
          
          for (let i = 0; i < int16Array.length; i++) {
            float32Array[i] = int16Array[i] / 32768.0; // 正規化到 [-1, 1]
          }

          // 呼叫核心算法處理音頻
          const result = processAudioBuffer(float32Array);

          if (result) {
            setTunerData(result);
            
            // 更新指針動畫 (cents 範圍約 -50 到 +50)
            const rotation = Math.max(-45, Math.min(45, result.cents * 0.9));
            Animated.spring(needleRotation, {
              toValue: rotation,
              useNativeDriver: true,
              tension: 40,
              friction: 8,
            }).start();
          }
        } catch (error) {
          console.error('Error processing audio data:', error);
        }
      });

      LiveAudioStream.start();
      setIsListening(true);
    } catch (error) {
      console.error('Error starting audio stream:', error);
      Alert.alert('Error', 'Failed to start audio stream');
    }
  };

  const stopListening = () => {
    if (LiveAudioStream) {
      LiveAudioStream.stop();
      setIsListening(false);
      setTunerData(null);
      Animated.spring(needleRotation, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  };

  useEffect(() => {
    return () => {
      if (isListening) {
        stopListening();
      }
    };
  }, [isListening]);

  useEffect(() => {
    return () => {
      if (isListening) {
        stopListening();
      }
    };
  }, [isListening]);

  // 根據 cents 計算顏色 (準了變綠色，不準變紅色)
  const getTuningColor = () => {
    if (!tunerData) return '#666666';
    if (tunerData.isPerfect) return '#2F5233'; // Deep Vintage Green
    if (Math.abs(tunerData.cents) < 10) return '#8B4513'; // Saddle Brown (警告)
    return '#8B0000'; // Deep Red (偏差大)
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Guitar Tuner</Text>

      {permissionGranted ? (
        <>
          {/* Meter Container - Analog VU Meter Style */}
          <View style={styles.meterContainer}>
            {/* Note Display - 大字顯示當前音符 */}
            <View style={styles.noteDisplay}>
              <Text style={styles.noteText}>
                {tunerData ? tunerData.note : '--'}
              </Text>
              {tunerData && (
                <Text style={styles.stringLabel}>
                  String {tunerData.stringNum}
                </Text>
              )}
            </View>

            {/* Meter Arc with Needle - 簡化版指針顯示 */}
            <View style={styles.meterArc}>
              {/* Scale Labels */}
              <View style={styles.scaleContainer}>
                <Text style={styles.scaleLabel}>FLAT</Text>
                <Text style={[styles.scaleLabel, styles.centerLabel]}>IN TUNE</Text>
                <Text style={styles.scaleLabel}>SHARP</Text>
              </View>

              {/* Needle - 旋轉指針 */}
              <Animated.View
                style={[
                  styles.needle,
                  {
                    transform: [{ rotate: needleRotation.interpolate({
                      inputRange: [-45, 45],
                      outputRange: ['-45deg', '45deg'],
                    })}]
                  }
                ]}
              />

              {/* Center Pivot */}
              <View style={styles.pivot} />
            </View>

            {/* Frequency & Cents Display */}
            <View style={styles.infoDisplay}>
              <Text style={styles.freqText}>
                {tunerData ? `${tunerData.detectedFreq.toFixed(2)} Hz` : 'Listening...'}
              </Text>
              <Text style={[styles.centsText, { color: getTuningColor() }]}>
                {tunerData ? `${tunerData.cents > 0 ? '+' : ''}${tunerData.cents.toFixed(1)} cents` : '--'}
              </Text>
            </View>

            {/* Tuning Indicator Light */}
            <View style={[styles.indicator, { backgroundColor: getTuningColor() }]} />
          </View>

          {/* Control Button */}
          <TouchableOpacity
            style={[styles.button, isListening && styles.buttonActive]}
            onPress={isListening ? stopListening : startListening}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>
              {isListening ? 'STOP' : 'START TUNING'}
            </Text>
          </TouchableOpacity>

          {/* Status Message */}
          {tunerData?.isPerfect && (
            <Text style={styles.perfectMessage}>✓ Perfect Tuning!</Text>
          )}
        </>
      ) : (
        <Text style={styles.permissionText}>Checking microphone permission...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5DC', // Cream background
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333333',
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
    marginBottom: 40,
    letterSpacing: 2,
  },
  
  // ===== Meter Container =====
  meterContainer: {
    width: 340,
    backgroundColor: '#1A1410',
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#D4AF37',
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    marginBottom: 40,
  },

  // ===== Note Display =====
  noteDisplay: {
    alignItems: 'center',
    backgroundColor: '#E8E3D3',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D4AF37',
    marginBottom: 20,
    width: '100%',
  },
  noteText: {
    fontSize: 64,
    fontFamily: Platform.select({ ios: 'Courier New', default: 'monospace' }),
    color: '#333333',
    fontWeight: 'bold',
  },
  stringLabel: {
    fontSize: 14,
    color: '#666666',
    fontFamily: Platform.select({ ios: 'Courier New', default: 'monospace' }),
    marginTop: 5,
  },

  // ===== Meter Arc (Needle Display) =====
  meterArc: {
    width: '100%',
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  scaleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    position: 'absolute',
    top: 10,
  },
  scaleLabel: {
    fontSize: 12,
    color: '#D4AF37',
    fontFamily: Platform.select({ ios: 'Courier New', default: 'monospace' }),
    fontWeight: 'bold',
  },
  centerLabel: {
    color: '#2F5233',
  },

  // ===== Needle =====
  needle: {
    width: 4,
    height: 80,
    backgroundColor: '#8B0000',
    position: 'absolute',
    bottom: 20,
    borderRadius: 2,
    shadowColor: '#8B0000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
  },
  pivot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#D4AF37',
    position: 'absolute',
    bottom: 20,
    borderWidth: 2,
    borderColor: '#B8941F',
  },

  // ===== Info Display =====
  infoDisplay: {
    alignItems: 'center',
    marginBottom: 15,
  },
  freqText: {
    fontSize: 16,
    color: '#F5F5DC',
    fontFamily: Platform.select({ ios: 'Courier New', default: 'monospace' }),
    marginBottom: 8,
  },
  centsText: {
    fontSize: 20,
    fontFamily: Platform.select({ ios: 'Courier New', default: 'monospace' }),
    fontWeight: 'bold',
  },

  // ===== Tuning Indicator =====
  indicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D4AF37',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },

  // ===== Button =====
  button: {
    backgroundColor: '#8B7355',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#6B5335',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 20,
  },
  buttonActive: {
    backgroundColor: '#D4AF37',
    borderColor: '#B8941F',
  },
  buttonText: {
    color: '#F5F5DC',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    fontFamily: Platform.select({ ios: 'Courier New', default: 'monospace' }),
  },

  // ===== Messages =====
  perfectMessage: {
    fontSize: 18,
    color: '#2F5233',
    fontWeight: 'bold',
    fontFamily: Platform.select({ ios: 'Georgia', default: 'serif' }),
  },
  permissionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontFamily: Platform.select({ ios: 'Georgia', default: 'serif' }),
  },
});