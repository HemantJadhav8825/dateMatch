import { View, Text, TouchableOpacity, Image } from 'react-native';
import { startCall } from '../../../components/CallNotifier';

const RenderAvatar = ({ item, styles }) => {
  return (
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
      <TouchableOpacity onPress={() => startCall('user123')} style={styles.joinButton}>
        <Text style={styles.joinButtonText}>
          {item.callType === 'video' ? '📹 Join' : '📞 Join'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default RenderAvatar;
