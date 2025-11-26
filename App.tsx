/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import {
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const STRINGS = [
  {name: 'E (low)', freq: 82.41},
  {name: 'A', freq: 110.0},
  {name: 'D', freq: 146.83},
  {name: 'G', freq: 196.0},
  {name: 'B', freq: 246.94},
  {name: 'E (high)', freq: 329.63},
];

function App(): JSX.Element {
  const [permissionStatus, setPermissionStatus] = useState<string>('unknown');

  async function requestMicrophonePermission() {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message:
              '需要麥克風權限來聆聽你的吉他並顯示音高（僅用於調音）。',
            buttonNeutral: '稍後',
            buttonNegative: '取消',
            buttonPositive: '允許',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setPermissionStatus('granted');
        } else {
          setPermissionStatus('denied');
        }
      } else {
        // iOS: Info.plist entry will cause system prompt when native recording starts.
        // Provide guidance to the user.
        Alert.alert(
          '麥克風權限',
          '此應用需要使用麥克風來偵測音高。若要開啟，請在第一次開始調音時允許系統提示，或前往設定手動啟用。',
          [
            {text: '取消', style: 'cancel'},
            {
              text: '開啟設定',
              onPress: () => Linking.openSettings(),
            },
          ],
        );
        setPermissionStatus('prompt');
      }
    } catch (err) {
      console.warn('Permission error', err);
      setPermissionStatus('error');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>結他調音器</Text>
        <Text style={styles.subtitle}>快速檢查開放式琴弦音高並獲得調音建議</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.sectionTitle}>開放弦標準音</Text>
        {STRINGS.map(s => (
          <View key={s.name} style={styles.stringRow}>
            <Text style={styles.stringName}>{s.name}</Text>
            <Text style={styles.stringFreq}>{s.freq} Hz</Text>
          </View>
        ))}

        <View style={styles.controls}>
          <TouchableOpacity style={styles.button} onPress={requestMicrophonePermission}>
            <Text style={styles.buttonText}>請求麥克風權限</Text>
          </TouchableOpacity>

          <Text style={styles.permissionStatus}>權限狀態：{permissionStatus}</Text>

          <Text style={styles.note}>
            注意：這是一個簡易原型。要完整偵測音高，後續可加入音訊錄製與頻率分析套件（例如 AudioRecord + pitchfinder）。
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  header: {padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee'},
  title: {fontSize: 24, fontWeight: '700'},
  subtitle: {marginTop: 6, color: '#666'},
  body: {padding: 20, flex: 1},
  sectionTitle: {fontSize: 18, fontWeight: '600', marginBottom: 10},
  stringRow: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6},
  stringName: {fontSize: 16},
  stringFreq: {fontSize: 16, color: '#333'},
  controls: {marginTop: 20},
  button: {backgroundColor: '#1e90ff', padding: 12, borderRadius: 8, alignItems: 'center'},
  buttonText: {color: '#fff', fontWeight: '600'},
  permissionStatus: {marginTop: 10, color: '#444'},
  note: {marginTop: 12, color: '#666'},
});

export default App;
