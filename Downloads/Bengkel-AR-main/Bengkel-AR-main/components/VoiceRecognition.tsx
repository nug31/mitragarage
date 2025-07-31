import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react-native';
import RealSpeechRecognition from './RealSpeechRecognition';

interface VoiceRecognitionProps {
  onVoiceResult: (text: string) => void;
  isEnabled?: boolean;
  language?: string;
}

export default function VoiceRecognition({ 
  onVoiceResult, 
  isEnabled = true,
  language = 'id-ID'
}: VoiceRecognitionProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const handleVoiceResult = (text: string) => {
    setTranscript(text);
    onVoiceResult(text);
  };

  const handleListeningChange = (listening: boolean) => {
    setIsListening(listening);
  };

  return (
    <View style={styles.container}>
      <RealSpeechRecognition
        onVoiceResult={handleVoiceResult}
        onListeningChange={handleListeningChange}
        isEnabled={isEnabled}
        language={language}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});