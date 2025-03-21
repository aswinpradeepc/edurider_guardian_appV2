import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './HomeStyles';

type UserInfoProps = {
  user: {
    first_name: string;
  } | null;
};

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
  return (
    <View style={styles.userSection}>
      <View style={styles.userInfoContainer}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={30} color="#FFA500" />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.welcomeText}>
            Welcome, {user?.first_name || 'Guardian'}
          </Text>
          <Text style={styles.userRole}>Guardian</Text>
        </View>
      </View>
    </View>
  );
};

export default UserInfo;