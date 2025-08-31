import React, { useContext } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import createStyles from './styles';
import { ThemeContext } from '../../theme/ThemeContext';
import { AuthContext } from '../../providers/AuthProvider';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';

const ProfileScreen = () => {
  const { theme } = useContext(ThemeContext);
  const { logout } = useContext(AuthContext);
  const styles = createStyles(theme);
  const { me } = useSelector((state) => state.user); // Get user data from Redux

  const onEditProfile = (field) => {
    console.log('Edit', field);
  };

  const onLogout = () => {
    logout().then(() => {
      Toast.show({
        position: 'bottom',
        type: 'success',
        text1: 'Logged out',
      });
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image
          source={
            me?.photoUrl
              ? { uri: me.photoUrl }
              : require('../../assets/bg.png')
          }
          style={styles.avatar}
        />
        <TouchableOpacity
          style={styles.editAvatarBtn}
          onPress={() => onEditProfile('photo')}
        >
          <Text style={styles.editAvatarText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Name */}
      <View style={styles.infoSection}>
        <Text style={styles.label}>Name</Text>
        <View style={styles.row}>
          <Text style={styles.infoText}>{me?.nickname || 'Not set'}</Text>
          <TouchableOpacity onPress={() => onEditProfile('name')}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Phone */}
      <View style={styles.infoSection}>
        <Text style={styles.label}>Phone</Text>
        <Text style={styles.infoText}>{me?.phone || 'Not set'}</Text>
      </View>

      {/* Gender */}
      <View style={styles.infoSection}>
        <Text style={styles.label}>Gender</Text>
        <View style={styles.row}>
          <Text style={styles.infoText}>{me?.gender || 'Not set'}</Text>
          <TouchableOpacity onPress={() => onEditProfile('gender')}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Subscription */}
      <View style={styles.infoSection}>
        <Text style={styles.label}>Subscription</Text>
        <Text style={styles.infoText}>
          {me?.subscription?.tier || 'Unknown'}{' '}
          {me?.subscription?.expiresAt
            ? `(expires: ${new Date(me.subscription.expiresAt).toLocaleDateString()})`
            : '(no expiry)'}
        </Text>
      </View>

      {/* Daily Calls */}
      <View style={styles.infoSection}>
        <Text style={styles.label}>Daily Calls</Text>
        <Text style={styles.infoText}>{me?.limits?.dailyCalls ?? 0}</Text>
      </View>

      {/* Created At */}
      <View style={styles.infoSection}>
        <Text style={styles.label}>Member Since</Text>
        <Text style={styles.infoText}>
          {me?.createdAt ? new Date(me.createdAt).toLocaleDateString() : 'N/A'}
        </Text>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen;
