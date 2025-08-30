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

const user = {
  name: 'Hemant Sharma',
  phone: '+919503760623',
  email: 'hemant@example.com',
  bio: 'Love to meet new people and chat!',
  photoUrl: 'https://cdn.pixabay.com/photo/2021/04/01/21/25/alone-boy-6143295_1280.jpg',
};

const ProfileScreen = () => {
  const { theme } = useContext(ThemeContext);
  const { logout } = useContext(AuthContext);
  const styles = createStyles(theme);

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
      <View style={styles.avatarContainer}>
        <Image
          source={
            user.photoUrl
              ? { uri: user.photoUrl }
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

      <View style={styles.infoSection}>
        <Text style={styles.label}>Name</Text>
        <View style={styles.row}>
          <Text style={styles.infoText}>{user.name || 'Not set'}</Text>
          <TouchableOpacity onPress={() => onEditProfile('name')}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.label}>Phone</Text>
        <Text style={styles.infoText}>{user.phone || 'Not set'}</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.label}>Email</Text>
        <View style={styles.row}>
          <Text style={styles.infoText}>{user.email || 'Not set'}</Text>
          <TouchableOpacity onPress={() => onEditProfile('email')}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.label}>Bio</Text>
        <Text style={[styles.infoText, styles.bioText]}>
          {user.bio || 'No bio added'}
        </Text>
        <TouchableOpacity onPress={() => onEditProfile('bio')}>
          <Text style={styles.editText}>Edit Bio</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen;
