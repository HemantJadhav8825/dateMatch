import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../../theme/ThemeContext';
import { createStyles } from './styles';
import Icon from 'react-native-vector-icons/Ionicons';

const VoiceCallScreen = () => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={{ uri: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg' }}
      style={styles.background}
      blurRadius={1} // adds a nice blur for better contrast
    >
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.callerSection}>
          <Image
            source={{ uri: 'https://via.placeholder.com/150' }}
            style={styles.avatar}
          />
          <Text style={styles.callerName}>Shreya kadam</Text>
          <Text style={styles.callStatus}>Voice Call in Progress</Text>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton}>
            <Icon name="mic-off" size={28} color={theme.colors.text} />
            <Text style={styles.controlLabel}>Mute</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton}>
            <Icon name="volume-high" size={28} color={theme.colors.text} />
            <Text style={styles.controlLabel}>Speaker</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.endCallButton, { backgroundColor: '#E53935' }]}
            onPress={() => navigation.goBack()}
          >
            <Icon name="call" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default VoiceCallScreen;
