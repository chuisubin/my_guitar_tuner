// TunerUtils.ts
import Pitchfinder from 'pitchfinder';

// 1. 定義吉他標準調音的頻率表 (Standard Tuning)
export const GUITAR_STRINGS = [
  { note: 'E2', frequency: 82.41, stringNum: 6 },
  { note: 'A2', frequency: 110.00, stringNum: 5 },
  { note: 'D3', frequency: 146.83, stringNum: 4 },
  { note: 'G3', frequency: 196.00, stringNum: 3 },
  { note: 'B3', frequency: 246.94, stringNum: 2 },
  { note: 'E4', frequency: 329.63, stringNum: 1 },
];

// 初始化 Pitchfinder 的 YIN 算法
// YIN 算法對於吉他這種弦樂器的基頻檢測效果最好，抗噪能力比自相關(Autocorrelation)強
const detectPitch = Pitchfinder.YIN({ sampleRate: 44100 }); 

/**
 * 核心函數：輸入音頻 buffer，返回調音數據
 * @param bufferFloat32 從麥克風獲取的 Float32Array 數據
 */
export const processAudioBuffer = (bufferFloat32: Float32Array) => {
  // A. 檢測頻率
  const frequency = detectPitch(bufferFloat32);

  // 如果檢測不到頻率（比如那是噪音或靜音），pitchfinder 會返回 null
  if (!frequency) return null;

  // 過濾雜訊：吉他最低音 E2 約 82Hz，最高音 E4 約 330Hz
  // 放寬一點範圍 (60Hz - 400Hz) 避免檢測到環境低頻或高頻底噪
  if (frequency < 60 || frequency > 450) return null;

  // B. 找到最接近的弦
  const closestString = findClosestString(frequency);

  // C. 計算誤差 (Cents) - 這就是你指針要移動的數值
  const cents = calculateCents(frequency, closestString.frequency);

  return {
    detectedFreq: frequency,
    note: closestString.note,
    targetFreq: closestString.frequency,
    stringNum: closestString.stringNum,
    cents: cents, // 負數代表偏低 (Flat)，正數代表偏高 (Sharp)，0 代表準了
    isPerfect: Math.abs(cents) < 3, // 如果誤差小於 3 音分，視為準確（亮綠燈）
  };
};

// 輔助函數：找到最接近的吉他弦
const findClosestString = (freq: number) => {
  return GUITAR_STRINGS.reduce((prev, curr) => {
    return Math.abs(curr.frequency - freq) < Math.abs(prev.frequency - freq)
      ? curr
      : prev;
  });
};

// 輔助函數：計算音分 (Cents)
// 這是調音器的核心數學公式： 1200 * log2(f1 / f2)
const calculateCents = (currentFreq: number, targetFreq: number) => {
  return 1200 * Math.log2(currentFreq / targetFreq);
};