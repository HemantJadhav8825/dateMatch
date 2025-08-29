import { View, Text, TouchableOpacity, Image } from 'react-native';
import { startCall } from '../../../components/CallNotifier';

const RenderAvatar = ({ user, styles }) => {
  return (
    <View style={styles.avatarCard}>
      <View style={styles.avatarImageWrapper}>
        <Image
          source={require('../../../assets/bg.png')}
          style={styles.avatarImage}
        />
        {user.flags?.banned && (
          <View style={styles.bannedOverlay}>
            <Text style={styles.badgeText}>BANNED</Text>
          </View>
        )}
        {user.subscription?.tier === 'premium' && (
          <View style={styles.starBadge}>
            <Text style={styles.badgeText}>⭐</Text>
          </View>
        )}
      </View>

      <Text style={styles.avatarName}>{user.nickname || 'Unknown'}</Text>

      {user.languages?.length > 0 && (
        <View style={styles.languageBadge}>
          <Text style={styles.languageText}>{user.languages[0]}</Text>
        </View>
      )}

      <TouchableOpacity
        onPress={() => startCall(user._id)}
        style={styles.joinButton}
      >
        <Text style={styles.joinButtonText}>
          {user.callType === 'video' ? '📹 Join' : '📞 Join'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default RenderAvatar;
