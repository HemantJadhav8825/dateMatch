import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import createStyles from './styles';
import { avatars, roomTypes } from "../../constants/homeScreenConstants";
import { ThemeContext } from '../../theme/ThemeContext';

import RenderAvatar from './homeComponents/RenderAvatar';
import RenderRoom from './homeComponents/RenderRoom';
import axiosClient from '../../api/axiosClient';
import { GET_ALL_USERS } from '../../api/endpoints';

const HomeScreen = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosClient.get(GET_ALL_USERS);
        setAllUsers(data?.users);
      } catch (error) {
        console.error("Error in Home Screen useEffect:GET_ALL_USERS", error);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Private Training</Text>
      <FlatList
        data={allUsers}
        renderItem={({ item }) => <RenderAvatar user={item} styles={styles} />}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        style={{ marginBottom: 25 }}
      />
      <Text style={styles.sectionTitle}>All Room Types</Text>
      <FlatList
        data={roomTypes}
        renderItem={({ item }) => <RenderRoom item={item} styles={styles} />}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15 }}
      />
      <Text style={styles.sectionTitle}>Other Room Types</Text>
      <FlatList
        data={roomTypes}
        renderItem={({ item }) => <RenderRoom item={item} styles={styles} />}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15 }}
      />
    </View>
  );
};

export default HomeScreen;
