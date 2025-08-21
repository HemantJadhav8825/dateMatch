const { StyleSheet, Dimensions } = require("react-native");
const { height: height100vh, width: windowWidth } = Dimensions.get('window');


const avatarSize = height100vh * 0.1; // 10% of screen height
const avatarCardWidth = avatarSize + 20;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginLeft: 15,
    marginBottom: 15,
    color: '#222',
  },
  avatarCard: {
    width: avatarCardWidth, // Dynamically set the card width based on avatar size
    backgroundColor: '#f9f9f9',
    borderRadius: 15,
    padding: 10,
    marginRight: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarImage: {
    width: avatarSize,
    height: avatarSize,
    borderRadius: avatarSize / 2, // Makes the avatar circular
  },
  avatarImageWrapper: {
    position: 'relative',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4ade80', // green
    borderWidth: 2,
    borderColor: '#fff',
  },
  starBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#facc15', // yellow
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  superBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#ef4444', // red
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  avatarName: {
    marginTop: 8,
    fontWeight: '600',
    fontSize: 14,
    color: '#333',
  },
  languageBadge: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: '#e0e7ff',
    borderRadius: 12,
  },
  languageText: {
    fontSize: 10,
    color: '#4338ca',
  },
  joinButton: {
    marginTop: 8,
    backgroundColor: '#14b8a6',
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  joinButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  roomCard: {
    width: windowWidth * 0.4,
    borderRadius: 20,
    padding: 15,
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  newBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#1d4ed8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 10,
  },
  newBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 10,
  },
  roomImage: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  roomTitle: {
    fontWeight: '700',
    fontSize: 14,
    textAlign: 'center',
  },
  roomSubtitle: {
    fontSize: 12,
    color: '#444',
    marginTop: 4,
  },
});

export default styles;