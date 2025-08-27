// src/components/home/RenderRoom.js
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

const RenderRoom = ({ item, styles }) => {
  return (
    <TouchableOpacity style={styles.roomCard}>
      {item.badge && (
        <View style={styles.newBadge}>
          <Text style={styles.newBadgeText}>{item.badge}</Text>
        </View>
      )}
      <Image source={item.img} style={styles.roomImage} resizeMode="contain" />
      <Text style={styles.roomTitle}>{item.title}</Text>
      {item.subtitle && <Text style={styles.roomSubtitle}>{item.subtitle}</Text>}
    </TouchableOpacity>
  );
};

export default RenderRoom;
