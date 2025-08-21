const { StyleSheet } = require("react-native");

const styles = StyleSheet.create({
  container: {
    padding: 25,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 25,
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ccc',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 120 / 2 - 30,
    backgroundColor: '#4a00e0',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  editAvatarText: {
    color: '#fff',
    fontWeight: '600',
  },
  infoSection: {
    marginBottom: 20,
  },
  label: {
    fontWeight: '700',
    color: '#444',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    color: '#222',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editText: {
    color: '#4a00e0',
    fontWeight: '600',
  },
  bioText: {
    marginBottom: 8,
    fontStyle: 'italic',
  },
  logoutBtn: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 30,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default styles;