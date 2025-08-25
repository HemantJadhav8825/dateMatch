import React, { useContext } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemeContext } from '../../theme/ThemeContext';
import { createStyles } from './styles';

const VoiceCallScreen = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.text, { color: theme.colors.text }]}>
          Voice Call in Progress
        </Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.buttonText, { color: theme.colors.text }]}>
            End Call
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default VoiceCallScreen;
