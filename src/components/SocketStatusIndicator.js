// src/components/SocketStatusIndicator.js
import React from 'react';
import { View, StyleSheet } from 'react-native';

const SocketStatusIndicator = ({ status }) => {
  const color = status === 'connected' ? '#22c55e' : // green
                status === 'reconnecting' ? '#f97316' : // orange
                '#ef4444'; // red

  return <View style={[styles.dot, { backgroundColor: color }]} />;
};

const styles = StyleSheet.create({
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 10,
    marginTop: 10,
    alignSelf: 'flex-end'
  }
});

export default SocketStatusIndicator;
