import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../../theme/ThemeContext';
import { createStyles } from './styles';
import Icon from 'react-native-vector-icons/Ionicons';
import InCallManager from 'react-native-incall-manager'; // for audio control

const VoiceCallScreen = () => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  const navigation = useNavigation();

  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);

  // Start call audio session when screen mounts
  useEffect(() => {
    InCallManager.start({ media: 'audio' });
    InCallManager.setForceSpeakerphoneOn(false);

    return () => {
      InCallManager.stop();
    };
  }, []);

  const toggleMute = () => {
    setIsMuted(prev => !prev);
    InCallManager.setMicrophoneMute(!isMuted);
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(prev => !prev);
    InCallManager.setForceSpeakerphoneOn(!isSpeakerOn);
  };

  const endCall = () => {
    InCallManager.stop();
    navigation.navigate('Home'); // Navigate back to home or previous screen
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg' }}
      style={styles.background}
      blurRadius={1}
    >
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        
        {/* Caller Info */}
        <View style={styles.callerSection}>
          <Image
            source={{ uri: 'https://via.placeholder.com/150' }}
            style={styles.avatar}
          />
          <Text style={styles.callerName}>Shreya Kadam</Text>
          <Text style={styles.callStatus}>
            {isMuted ? 'Muted' : 'Voice Call in Progress'}
          </Text>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          {/* Mute */}
          <TouchableOpacity style={styles.controlButton} onPress={toggleMute}>
            <Icon 
              name={isMuted ? "mic-off" : "mic"} 
              size={28} 
              color={theme.colors.text} 
            />
            <Text style={styles.controlLabel}>Mute</Text>
          </TouchableOpacity>

          {/* Speaker */}
          <TouchableOpacity style={styles.controlButton} onPress={toggleSpeaker}>
            <Icon 
              name={isSpeakerOn ? "volume-high" : "volume-mute"} 
              size={28} 
              color={theme.colors.text} 
            />
            <Text style={styles.controlLabel}>Speaker</Text>
          </TouchableOpacity>

          {/* End Call */}
          <TouchableOpacity
            style={[styles.endCallButton, { backgroundColor: '#E53935' }]}
            onPress={endCall}
          >
            <Icon name="call" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default VoiceCallScreen;
