import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList
} from 'react-native';
import { avatars, roomTypes } from "../../constants/homeScreenConstants"
import styles from './styles';

const HomeScreen = () => {
  const renderAvatar = ({ item }) => (
    <View style={styles.avatarCard}>
      <View style={styles.avatarImageWrapper}>
        <Image source={item.img} style={styles.avatarImage} />
        {item.status === 'online' && <View style={styles.onlineDot} />}
        {item.special === 'star' && (
          <View style={styles.starBadge}>
            <Text style={styles.badgeText}>⭐</Text>
          </View>
        )}
        {item.special === 'super' && (
          <View style={styles.superBadge}>
            <Text style={styles.badgeText}>Super</Text>
          </View>
        )}
      </View>
      <Text style={styles.avatarName}>{item.name}</Text>
      <View style={styles.languageBadge}>
        <Text style={styles.languageText}>{item.language}</Text>
      </View>
      <TouchableOpacity style={styles.joinButton}>
        <Text style={styles.joinButtonText}>
          {item.callType === 'video' ? '📹 Join' : '📞 Join'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderRoom = ({ item }) => (
    <TouchableOpacity style={[styles.roomCard, { backgroundColor: '#f0f0f0' }]}>
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

  return (
    <View style={styles.container}>
      {/* Top avatars horizontal scroll */}
      <Text style={styles.sectionTitle}>Private Training</Text>
      <FlatList
        data={avatars}
        renderItem={renderAvatar}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        style={{ marginBottom: 25 }}
      />
      {/* Room Types */}
      <Text style={styles.sectionTitle}>All Room Types</Text>
      <FlatList
        data={roomTypes}
        renderItem={renderRoom}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15 }}
      />
      {/* Room Types */}
      <Text style={styles.sectionTitle}>Other Room Types</Text>
      <FlatList
        data={roomTypes}
        renderItem={renderRoom}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15 }}
      />
    </View>
  );
};

export default HomeScreen;