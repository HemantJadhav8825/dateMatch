import React, { useContext } from 'react';
import { View, Text, FlatList } from 'react-native';
import createStyles from './styles';
import { avatars, roomTypes } from "../../constants/homeScreenConstants";
import { ThemeContext } from '../../theme/ThemeContext';

import RenderAvatar from './homeComponents/RenderAvatar';
import RenderRoom from './homeComponents/RenderRoom';

const HomeScreen = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Private Training</Text>
      <FlatList
        data={avatars}
        renderItem={({ item }) => <RenderAvatar item={item} styles={styles} />}
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
